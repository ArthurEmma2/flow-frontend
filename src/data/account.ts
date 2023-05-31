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

  getIncomingStreams(recipientAddress: string, pagination?: Pagination): Promise<{streams: StreamInfo[], totalCount: number}>;

  getOutgoingStreams(senderAddress: string, pagination?: Pagination): Promise<{streams: StreamInfo[], totalCount: number}>;

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
    await fetch(`https://api.moveflow.xyz/api/streams/${1}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: "follow",
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('1d89a', result);
        totalCount = result.count;
        for (let i = 0; i < result.data.length; i++) {
          const currStream = result.data[i];
          streams.push(this.buildStream(currStream, currTime));
        }
      });
    console.debug("AptAdapter getIncomingStreams streams", streams);
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
    await fetch(`https://api.moveflow.xyz/api/streams/${1}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: "follow",
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        console.log('1d89a', result);
        totalCount = result.count
        for (let i = 0; i < result.data.length; i++) {
          const currStream = result.data[i];
          streams.push(this.buildStream(currStream, currTime));
        }
      });
    console.info("AptAdapter getOutStreamHandle streams", streams);
    return {
      streams: streams,
      totalCount: totalCount
    };
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

  buildStream(stream: any, currTime: bigint): StreamInfo {
    const status = this.getStatus(stream, currTime)
    console.log('interval78178', stream.interval);
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
      Number(this.displayAmount(new BigNumber(stream.withdrawn_amount))),
      Number(stream.start_time) * 1000,
      Number(stream.stop_time) * 1000,
      Number(currTime),
      Number(stream.pauseInfo.pause_at) * 1000,
      Number(stream.last_withdraw_time) * 1000,
      Number(stream.pauseInfo.acc_paused_time) * 1000,
      Number(stream.interval) * 1000,
      Number(stream.rate_per_interval),
      status,
    );
    return {
      name: stream.name,
      status: status,
      createTime: (Number(stream.create_at) * 1000).toString(),
      depositAmount: this.displayAmount(new BigNumber(stream.deposit_amount)),
      streamId: stream.id,
      interval: (Number(stream.interval) * 1000).toString(),
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
      streamedAmount: streamedAmount.toString(),
      withdrawableAmount: this.displayAmount(new BigNumber(withdrawableAmount)).toString(),
      escrowAddress: stream.escrow_address,
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
