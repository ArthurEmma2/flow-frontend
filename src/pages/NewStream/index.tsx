import React from "react";
import {Types} from "aptos";
import netConfApt from "../../config/configuration.aptos";
import {useWallet as useAptosWallet} from "@manahippo/aptos-wallet-adapter/dist/WalletProviders/useWallet";


const NewStream: React.FC<{}> = () => {
  const { connected, signAndSubmitTransaction } = useAptosWallet();
  const createStream = (name: string, remark: string, recipientAddr: string, depositAmount: number,
                        startTime: number, stopTime: number,
                        interval: number, canPause?: boolean,
                        closeable?: boolean, recipientModifiable?: boolean) => {
    const transaction: Types.TransactionPayload_EntryFunctionPayload = {
      type: 'entry_function_payload',
      function: `${netConfApt.contract}::streampay::create`,
      arguments: [
        name,
        remark,
        recipientAddr,
        depositAmount,
        startTime,
        stopTime,
        interval,
        true,
        true,
        true,
      ],
      type_arguments: ['0x1::aptos_coin::AptosCoin'],
    };
    signAndSubmitTransaction(transaction).then((result) => {
      if (result) {
        return "success"
      }
      return "failed"
    });
  }
  return (
    <>NewStream</>
  )
}

export default NewStream;