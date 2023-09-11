import {JsonRpcProvider} from "@mysten/sui.js";
import {AptosClient, HexString} from "aptos";
import {AccountKeys, Wallet, WalletAdapter} from '@manahippo/aptos-wallet-adapter';
import netConfApt from "../config/configuration.aptos";
import StreamInfo from "../types/streamInfo";
import {NetworkConfiguration} from "../config";
import BigNumber from 'bignumber.js';
import {StreamStatus} from "../types/streamStatus";
import Pagination from "../types/pagination";
import coinConfig from "../config/coinConfig";
import getNetworkCoinConfig from "../config/coinConfig";


export interface NetworkAdapter {

  getProvider(): JsonRpcProvider | AptosClient;

  getWallet(): WalletAdapter;

  getAddress(): string;

  getBalance(coinName: string): Promise<string>;

  getIncomingStreams(recipientAddress: string, pagination?: Pagination): Promise<{streams: StreamInfo[], totalCount: number}>;

  getOutgoingStreams(senderAddress: string, pagination?: Pagination): Promise<{streams: StreamInfo[], totalCount: number}>;

  sendTransaction(from: string, to: string, amount: number): string;

  getTransactionStatus(hash: string): string;

  displayAmount(amount: BigNumber, unit: number): string;

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
    unit: number,
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

  private backend: string;

  // The constructor takes a web3 provider as an argument
  constructor(connection: NetworkConfiguration, account: AccountKeys, wallet: Wallet) {
    console.debug("AptAdapter constructor connection:", connection)
    this.client = new AptosClient(connection.fullNodeUrl);
    this.account = account;
    this.wallet = wallet;
    this.backend = connection.backend
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

  async getBalance(coinName: string) {
    const network = this.wallet.adapter.network.name!;

    const coinConfigs = getNetworkCoinConfig(network);
    const coinInfo = coinConfigs[coinName as keyof typeof coinConfigs];

    const resources = await this.client.getAccountResources(this.account.address as HexString);
    const coin = resources.find((r) => r.type.includes(coinInfo.coinType));
    if (typeof coin == "undefined") {
      return "0";
    }
    // @ts-ignore
    return this.displayAmount(new BigNumber(coin.data.coin.value), coinInfo.unit);
  }

  async getIncomingStreams(recvAddress: string, pagination?: Pagination): Promise<{streams: StreamInfo[], totalCount: number}> {
    let streams: StreamInfo[] = [];
    let totalCount: number = 0;
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const body = {
      where: {
        recipient: recvAddress,
      },
      orderBy: {
        create_at: 'desc',
      },
      pageNumber: 0,
      pageSize: 100,
    };
    if (pagination !== undefined) {
      body.pageSize = pagination!.pageSize
      body.pageNumber = pagination!.page
    }
    await fetch(`${this.backend}/streams/${1}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: "follow",
    })
      .then((response) => {
        // console.log('response', response.json())
        return response.json();
      })
      .then((result) => {
        totalCount = result.count;
        for (let i = 0; i < result.data.length; i++) {
          const currStream = result.data[i];
          streams.push(this.buildStream(currStream, currTime));
        }
      });

    return {
      streams: streams,
      totalCount: totalCount,
    };
  }

  async getOutgoingStreams(sendAddress: string, pagination?: Pagination) {
    let streams: StreamInfo[] = [];
    let totalCount: number = 0;
    const currTime = BigInt(Date.parse(new Date().toISOString().valueOf()))
    const body = {
      where: {
        sender: sendAddress,
      },
      orderBy: {
        create_at: 'desc',
      },
      pageSize: 100,
      pageNumber: 0,
    };
    if (pagination !== undefined) {
      body.pageSize = pagination!.pageSize
      body.pageNumber = pagination!.page
    }
    await fetch(`${this.backend}/streams/${1}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: "follow",
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        totalCount = result.count
        for (let i = 0; i < result.data.length; i++) {
          const currStream = result.data[i];
          streams.push(this.buildStream(currStream, currTime));
        }
      });
    // console.info("AptAdapter getOutStreamHandle streams", streams);
    return {
      streams: streams,
      totalCount: totalCount
    };
  }

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

  displayAmount(amount: BigNumber, unit: number): string {
    return amount.dividedBy(unit).toFixed(4).toString();
  }

  buildStream(stream: any, currTime: bigint): StreamInfo {
    const network = this.wallet.adapter.network.name!;
    let coinName = stream.coin_type;
    const coinConfigs = getNetworkCoinConfig(network);
    coinName = coinName.indexOf("AptosCoin") > -1 ? "APT" : "MOON";
    const coinInfo = coinConfigs[coinName as keyof typeof coinConfigs];
    console.log('coinInfo', coinInfo);
    const status = this.getStatus(stream, currTime)
    const withdrawableAmount = this.calculateWithdrawableAmount(
      Number(stream.start_time) * 1000,
      Number(stream.stop_time) * 1000,
      Number(currTime),
      Number(stream.pauseInfo.pause_at) * 1000,
      Number(stream.last_withdraw_time) * 1000,
      Number(stream.pauseInfo.acc_paused_time) * 1000,
      Number(stream.interval) * 1000,
      Number(stream.rate_per_interval),
      status,
    )
    const streamedAmount = this.calculateStreamedAmount(
      Number(this.displayAmount(new BigNumber(stream.withdrawn_amount), coinInfo.unit)),
      Number(stream.start_time) * 1000,
      Number(stream.stop_time) * 1000,
      Number(currTime),
      Number(stream.pauseInfo.pause_at) * 1000,
      Number(stream.last_withdraw_time) * 1000,
      Number(stream.pauseInfo.acc_paused_time) * 1000,
      Number(stream.interval) * 1000,
      Number(stream.rate_per_interval),
      status,
      coinInfo.unit,
    );
    return {
      name: stream.name,
      status: status,
      createTime: (Number(stream.create_at) * 1000).toString(),
      depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount), coinInfo.unit),
      streamId: stream.id,
      interval: (Number(stream.interval) * 1000).toString(),
      lastWithdrawTime: (Number(stream.last_withdraw_time) * 1000).toString(),
      ratePerInterval: stream.rate_per_interval,
      recipientId: stream.recipient,
      remainingAmount: this.displayAmount(new BigNumber(stream.remaining_amount), coinInfo.unit),
      senderId: stream.sender,
      startTime: (Number(stream.start_time) * 1000).toString(),
      stopTime: (Number(stream.stop_time) * 1000).toString(),
      withdrawnAmount: this.displayAmount(new BigNumber(stream.withdrawn_amount), coinInfo.unit),
      pauseInfo: {
        accPausedTime: (Number(stream.pauseInfo.acc_paused_time) * 1000).toString(),
        pauseAt: (Number(stream.pauseInfo.pause_at) * 1000).toString(),
        paused: stream.pauseInfo.paused,
      },
      streamedAmount: streamedAmount.toString(),
      withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount), coinInfo.unit).toString(),
      escrowAddress: stream.escrow_address,
      coinType: stream.coin_type,
    }
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
    if (status === StreamStatus.Canceled) {
      return 0;
    }
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
        timeSpan = BigInt(pausedAt) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      } else {
        timeSpan = BigInt(currTime) - BigInt(lastWithdrawTime) - BigInt(accPausedTime);
      }
    }
    let intervalNum = Math.ceil(Number(timeSpan / BigInt(interval)));
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
    unit: number,
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
    return withdrawnAmount + Number(this.displayAmount(new BigNumber(Number(withdrawable)), unit));
  }
}

export function createNetworkAdapter(
  blockchain: string, account: AccountKeys, wallet: Wallet): NetworkAdapter {
  switch (blockchain) {
    case "aptos":
      return new AptAdapter(netConfApt, account, wallet);
    default:
      throw new Error("Invalid blockchain name");
  }
}
