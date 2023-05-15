import {JsonRpcProvider} from "@mysten/sui.js";
import {AptosClient, HexString} from "aptos";
import {AccountKeys, Wallet, WalletAdapter} from '@manahippo/aptos-wallet-adapter';
import netConfApt, {aptosConfigType, aptosStreamType} from "../config/configuration.aptos";
import StreamInfo from "../types/streamInfo";
import {NetworkConfiguration} from "../config";
import BigNumber from 'bignumber.js';
import {StreamStatus} from "../types/streamStatus";
import Pagination from "../types/pagination";


export interface NetworkAdapter {

  getProvider(): JsonRpcProvider | AptosClient;

  getWallet(): WalletAdapter;

  getAddress(): string;

  getBalance(): Promise<string>;

  getIncomingStreams(recipientAddress: string, {page, pageSize}: Pagination): Promise<StreamInfo[]>;

  getOutgoingStreams(senderAddress: string, {page, pageSize}: Pagination): Promise<StreamInfo[]>;

  sendTransaction(from: string, to: string, amount: number): string;

  getTransactionStatus(hash: string): string;

  displayAmount(amount: BigNumber): string;

  calculateStreamedAmount(
    withdrawnAmount: number,
    startTime: number,
    stopTime: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: StreamStatus,
  ): number

  calculateWithdrawableAmount(
    startTime: number,
    stopTime: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: StreamStatus,
  ): number

  // createStream(
  //   name: string, recipient: string, depositAmount: number,
  //   startTime: number, endTime: number,
  //   interval: number, canPause: boolean,
  //   closeable: boolean, recipient_modifiable: boolean, remark?: string): void

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
    if (typeof coin == "undefined") {
      return "0";
    }
    // @ts-ignore
    return this.displayAmount(new BigNumber(coin.data.coin.value));
  }

  async getIncomingStreams(recvAddress: string, {page, pageSize}: Pagination): Promise<StreamInfo[]> {
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    console.log('recevAddr', recvAddress);
    const start = (page - 1) * pageSize;
    const address = netConfApt.contract;
    const event_handle = `${address}::${aptosConfigType}`;
    const eventField = "stream_events";
    const eventsAll = await this.client.getEventsByEventHandle(
      address,
      event_handle,
      eventField,
      {
        start: start,
        limit: pageSize,
      }
    );
    // console.debug("AptAdapter getIncomingStreams events", eventsAll);

    const eventsRecv = eventsAll.filter(event => event.data.recipient! === recvAddress);
    if (eventsRecv.length === 0) return [];

    const streamIds = Array.from(new Set(eventsRecv.map(event => event.data.id!)));
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
      const status = this.getStatus(stream, currTime)
      const withdrawableAmount = this.calculateWithdrawableAmount(
        Number(stream.start_time) * 1000,
        Number(stream.stop_time) * 1000,
        Number(currTime),
        Number(stream.pauseInfo.pause_at) * 1000,
        Number(stream.last_withdraw_time) * 1000,
        Number(stream.pauseInfo.acc_paused_time) * 1000,
        Number(stream.interval),
        Number(stream.rate_per_interval),
        status,
      )
      const streamedAmount = this.calculateStreamedAmount(
        Number(stream.withdrawn_amount),
        Number(stream.start_time) * 1000,
        Number(stream.stop_time) * 1000,
        Number(currTime),
        Number(stream.pauseInfo.pause_at) * 1000,
        Number(stream.last_withdraw_time) * 1000,
        Number(stream.pauseInfo.acc_paused_time) * 1000,
        Number(stream.interval),
        Number(stream.rate_per_interval),
        status,
      );
      streams.push({
        name: stream.name,
        status: status,
        createTime: (Number(stream.create_at) * 1000).toString(),
        depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
        streamId: stream.id,
        interval: stream.interval,
        lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
        ratePerInterval: stream.rate_per_interval,
        recipientId: stream.recipient,
        remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
        senderId: stream.sender,
        startTime: (Number(stream.start_time) * 1000).toString(),
        stopTime: (Number(stream.stop_time) * 1000).toString(),
        withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
        pauseInfo: {
          accPausedTime: (Number(stream.pauseInfo.acc_paused_time)).toString(),
          pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
          paused: stream.pauseInfo.paused,
        },
        streamedAmount: this.displayAmount(new BigNumber(streamedAmount)).toString(),
        withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
        escrowAddress: stream.escrow_address,
      });
      // console.log('stream___', stream);
    }
    console.debug("AptAdapter getIncomingStreams streams", streams);
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
    console.info("AptAdapter getOutgoingStreams events", eventsAll);
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const eventsSend = eventsAll.filter(event => event.data.sender! === sendAddress);
    if (eventsSend.length === 0) return [];
    // console.info("AptAdapter getOutgoingStreams eventsSend", eventsSend);

    const streamIds = Array.from(new Set(eventsSend.map(event => event.data.id!)));
    console.log('streamId,', streamIds);
    const resources = await this.client.getAccountResources(address);
    console.info("AptAdapter getOutgoingStreams resources:", resources);
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
      // console.info("AptAdapter getIncomingStreams outStreamHandle, tbReqStreamInd", streamId, outStreamHandle, tbReqStreamInd);
      const stream = await this.client.getTableItem(outStreamHandle, tbReqStreamInd);

      if (stream.name === "test283") {
        console.log('streams8928: ', stream);
      }
      const status = this.getStatus(stream, currTime)
      const withdrawableAmount = this.calculateWithdrawableAmount(
        Number(stream.start_time) * 1000,
        Number(stream.stop_time) * 1000,
        Number(currTime),
        Number(stream.pauseInfo.pause_at) * 1000,
        Number(stream.last_withdraw_time) * 1000,
        Number(stream.pauseInfo.acc_paused_time) * 1000,
        Number(stream.interval),
        Number(stream.rate_per_interval),
        status,
      )
      // console.log('withdrawableAmount', withdrawableAmount)
      const streamedAmount = this.calculateStreamedAmount(
        Number(stream.withdrawn_amount),
        Number(stream.start_time) * 1000,
        Number(stream.stop_time) * 1000,
        Number(currTime),
        Number(stream.pauseInfo.pause_at) * 1000,
        Number(stream.last_withdraw_time) * 1000,
        Number(stream.pauseInfo.acc_paused_time) * 1000,
        Number(stream.interval),
        Number(stream.rate_per_interval),
        status,
      );
      streams.push({
        name: stream.name,
        status: status,
        createTime: (Number(stream.create_at) * 1000).toString(),
        depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
        streamId: stream.id,
        interval: stream.interval,
        lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
        ratePerInterval: stream.rate_per_interval,
        recipientId: stream.recipient,
        remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount)),
        senderId: stream.sender,
        startTime: (Number(stream.start_time) * 1000).toString(),
        stopTime: (Number(stream.stop_time) * 1000).toString(),
        withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount)),
        pauseInfo: {
          accPausedTime: (Number(stream.pauseInfo.acc_paused_time) * 1000).toString(),
          pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
          paused: stream.pauseInfo.paused,
        },
        streamedAmount: this.displayAmount(new BigNumber(streamedAmount)).toString(),
        withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
        escrowAddress: stream.escrow_address,
      });
    }
    console.info("AptAdapter getOutStreamHandle streams", streams);
    return streams;

  }

  // async createStream(
  //   name: string, remark: string, recipientAddr: string, depositAmount: number,
  //   startTime: number, stopTime: number,
  //   interval: number, canPause: boolean,
  //   closeable: boolean, recipientModifiable: boolean) {
  //   const address = netConfApt.contract;
  //   const transaction: Types.TransactionPayload_EntryFunctionPayload = {
  //     type: 'entry_function_payload',
  //     function: `${address}::streampay::create`,
  //     arguments: [
  //       name,
  //       remark,
  //       recipientAddr,
  //       depositAmount,
  //       startTime,
  //       stopTime,
  //       interval,
  //       canPause,
  //       closeable,
  //       recipientModifiable,
  //     ],
  //     type_arguments: ['0x1::aptos_coin::AptosCoin'],
  //   };
  //
  //   detectProvider()
  //     .then(provider => {
  //       console.log('provider', provider);
  //       const result = await provider.signAndSubmit(transaction);
  //     })
  //
  //   if (result) {
  //     openTxSuccessNotification(result.hash, 'Transaction Success');
  //   }
  //   if (fromSymbol && fromUiAmt) {
  //     const options: Partial<Types.SubmitTransactionRequest> = {
  //       expiration_timestamp_secs: '' + (Math.floor(Date.now() / 1000) + values.trasactionDeadline),
  //       max_gas_amount: '' + values.maxGasFee
  //     };
  //     formikHelper.setSubmitting(false);
  //   } else {
  //     openErrorNotification({ detail: 'Invalid input for Sending' });
  //   }
  // }

  sendTransaction(from: string, to: string, amount: number): string {
    return "hash";
  }

  getTransactionStatus(hash: string): string {
    return "Success";
  }

  getStatus(stream: any, currTime: bigint): StreamStatus {
    if (Boolean(stream.closed)) {
      return StreamStatus.Canceled;
    }
    if (Boolean(stream.pauseInfo.paused)) {
      return StreamStatus.Paused;
    }
    if (currTime < BigInt(stream.start_time) * BigInt(1000)) {
      return StreamStatus.Scheduled;
    }
    if (currTime < BigInt(stream.stop_time) * BigInt(1000)) {
      return StreamStatus.Streaming;
    }
    if (currTime > BigInt(stream.stop_time) * BigInt(1000)) {
      return StreamStatus.Completed;
    }
    return StreamStatus.Unknown;
  }

  displayAmount(amount: BigNumber): string {
    return amount.dividedBy(10 ** 8).toFixed(6).toString();
  }

  calculateWithdrawableAmount(
    startTime: number,
    stopTime: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: StreamStatus,
  ): number {
    let withdrawal = 0;
    let timeSpan = BigInt(0)
    if (currTime <= BigInt(startTime)) {
      return withdrawal
    }
    // console.log('currTime', currTime)
    // console.log('stopTime', stopTime)
    if (currTime > BigInt(stopTime)) {
      if (status === StreamStatus.Paused) {
        timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      } else {
        timeSpan = BigInt(stopTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      }
    } else {
      if (status === StreamStatus.Paused) {
        timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime)
      } else {
        timeSpan = BigInt(currTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      }
    }

    let intervalNum = Math.ceil(Number(timeSpan / BigInt(interval) / BigInt(1000)));
    withdrawal = Number(BigInt(intervalNum) * BigInt(ratePerInterval) / BigInt(1000));
    return withdrawal;
  }

  calculateStreamedAmount(
    withdrawnAmount: number,
    startTime: number,
    stopTime: number,
    currTime: number,
    pausedAt: number,
    lastWithdrawTime: number,
    accPausedTime: number,
    interval: number,
    ratePerInterval: number,
    status: StreamStatus,
  ): number {
    let withdrawable = this.calculateWithdrawableAmount(
      startTime,
      stopTime,
      currTime,
      pausedAt,
      lastWithdrawTime,
      accPausedTime,
      interval,
      ratePerInterval,
      status
    )
    return withdrawnAmount + Number(this.displayAmount(new BigNumber(Number(withdrawable))));
  }
}

export function createNetworkAdapter(
  blockchain: string, account: AccountKeys, wallet: Wallet): NetworkAdapter {
  switch (blockchain) {
    // case "sui":
    //   return new SuiAdapter(connectionSui);
    case "aptos":
      return new AptAdapter(netConfApt, account, wallet);
    default:
      throw new Error("Invalid blockchain name");
  }
}