import React, {createContext} from "react";
import {createNetworkAdapter, NetworkAdapter} from "../data/account";


export const WalletAdapter = createContext<{
  walletAdapter: NetworkAdapter | undefined,
  setWalletAdapter: React.Dispatch<React.SetStateAction<NetworkAdapter | undefined>>
}>({ walletAdapter: undefined , setWalletAdapter: ()=> {}})