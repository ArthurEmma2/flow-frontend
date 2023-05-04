import {JsonRpcProvider} from "@mysten/sui.js";
import {AptosClient, HexString} from "aptos";
import {AccountKeys, Wallet, WalletAdapter} from '@manahippo/aptos-wallet-adapter';
import netConfApt, {aptosConfigType, aptosStreamType} from "../config/configuration.aptos";
import StreamInfo from "../types/streamInfo";
import {NetworkConfiguration} from "../config";
import BigNumber from 'bignumber.js';
import {StreamStatus} from "../types/streamStatus";


export interface NetworkAdapter {

  getProvider(): JsonRpcProvider | AptosClient;

  getWallet(): WalletAdapter;

  getAddress(): string;

  getBalance(): Promise<string>;

  getIncomingStreams(recipientAddress: string): Promise<StreamInfo[]>;

  getOutgoingStreams(senderAddress: string): Promise<StreamInfo[]>;

  sendTransaction(from: string, to: string, amount: number): string;

  getTransactionStatus(hash: string): string;

  displayAmount(amount: BigNumber): string;

  // getAddressBook(pagesize: number, page: number, creator: string): Address[];
}

class AptAdapter implements NetworkAdapter {
  private client: AptosClient;

  private account: AccountKeys;

  private wallet: Wallet;

  // The constructor takes a web3 provider as an argument
  constructor(connection: NetworkConfiguration, account: AccountKeys, wallet: Wallet) {
    console.debug("AptAdapter constructor connection:", connection)
    this.client = new AptosClient(connection.fullNodeUrl);
    this.account = account;
    this.wallet = wallet;
  }

  getWallet(): WalletAdapter {
    return this.wallet.adapter;
  }

  getAddress(): string {
    return this.account.address as string;
  }

  getProvider(): AptosClient {
    return this.client;
  }

  async getBalance() {
    const resources = await this.client.getAccountResources(this.account.address as HexString);
    const coin = resources.find((r) => r.type.includes('0x1::aptos_coin::AptosCoin'));
    console.debug("AptAdapter coin:", coin);
    if (typeof coin == "undefined") {
      return "0";
    }
    // @ts-ignore
    return this.displayAmount(new BigNumber(coin.data.coin.value));
  }

  async getIncomingStreams(recvAddress: string): Promise<StreamInfo[]> {
    // const address = this.account.address;
    // const event_handle = '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';
    // const eventField = 'withdraw_events';
    console.log('recevAddr', recvAddress);
    const address = netConfApt.contract;
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "stream_events";
    const eventsAll = await this.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: BigInt(0),
        limit: 300,
      }
    );
    // console.debug("AptAdapter getIncomingStreams events", eventsAll);

    const eventsRecv = eventsAll.filter(event => event.data.recipient! === recvAddress);
    if (eventsRecv.length === 0) return [];

    const streamIds = eventsRecv.map(event => event.data.id!);
    // console.debug("AptAdapter getIncomingStreams streamIds", streamIds);

    const resources = await this.client.getAccountResources(address);
    // console.debug("AptAdapter getIncomingStreams resources:", resources);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const inStreamHandle = resGlConf.data.streams_store.inner.handle!;
    let streams: StreamInfo[] = [];
    for ( const streamId of streamIds ) {
      const tbReqStreamInd = {
        key_type: "u64",
        value_type: `${address}::${aptosStreamType}`,
        key: streamId,
      };
      // console.debug("AptAdapter getIncomingStreams inStreamHandle, tbReqStreamInd", streamId, inStreamHandle, tbReqStreamInd);
      const stream = await this.client.getTableItem(inStreamHandle, tbReqStreamInd);
      console.log('stream___', stream);
      streams.push(stream);
    }
    // console.debug("AptAdapter getIncomingStreams streams", streams);
    return streams;
  }

  async getOutgoingStreams(sendAddress: string): Promise<StreamInfo[]> {
    const address = netConfApt.contract;
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "stream_events";
    const eventsAll = await this.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: BigInt(0),
        limit: 300,
      }
    );
    // console.info("AptAdapter getOutgoingStreams events", eventsAll[0]);
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const eventsSend = eventsAll.filter(event => event.data.sender! === sendAddress);
    if (eventsSend.length === 0) return [];
    // console.info("AptAdapter getOutgoingStreams eventsSend", eventsSend);

    const streamIds = eventsSend.map(event => event.data.id!);
    const resources = await this.client.getAccountResources(address);
    // console.info("AptAdapter getOutgoingStreams resources:", resources);
    const resGlConf = resources.find((r) => r.type.includes(aptosConfigType))!;
    // @ts-ignore
    const outStreamHandle = resGlConf.data.streams_store.inner.handle!;
    let streams: StreamInfo[] = [];
    for ( const streamId of streamIds ) {
      const tbReqStreamInd = {
        key_type: "u64",
        value_type: `${address}::${aptosStreamType}`,
        key: streamId,
      };
      console.info("AptAdapter getIncomingStreams outStreamHandle, tbReqStreamInd", streamId, outStreamHandle, tbReqStreamInd);
      const stream = await this.client.getTableItem(outStreamHandle, tbReqStreamInd);
      console.log('stream', stream)

      streams.push({
        status: this.getStatus(stream, currTime),
        createTime: stream.create_time,
        depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
        streamId: stream.id,
        interval: stream.interval,
        lastWithdrawTime: stream.last_withdraw_time,
        ratePerInterval: stream.rate_per_interval,
        recipientId: stream.recipient,
        remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
        senderId: stream.sender,
        startTime: stream.start_time,
        stopTime: stream.stop_time,
        withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
      });
    }
    console.info("AptAdapter getOutStreamHandle streams", streams);
    return streams;

  }

  sendTransaction(from: string, to: string, amount: number): string {
    return "hash";
  }

  getTransactionStatus(hash: string): string {
    return "Success";
  }

  getStatus(stream: any, currTime: bigint): StreamStatus {
    if (Boolean(stream.closed)) {
      return StreamStatus.Canceled
    }
    if (Boolean(stream.pauseInfo.paused)) {
      return StreamStatus.Paused
    }
    if (currTime < BigInt(stream.start_time)) {
      return StreamStatus.Scheduled
    }
    if (currTime < BigInt(stream.stop_time)) {
      return StreamStatus.Streaming
    }
    return StreamStatus.Unknown;
  }

  displayAmount(amount: BigNumber): string {
    return amount.dividedBy(10 ** 8).toFixed(6).toString();
  }
}

export function createNetworkAdapter(blockchain: string, account: AccountKeys, wallet: Wallet): NetworkAdapter {
  switch (blockchain) {
    // case "sui":
    //   return new SuiAdapter(connectionSui);
    case "aptos":
      return new AptAdapter(netConfApt, account, wallet);
    default:
      throw new Error("Invalid blockchain name");
  }
}