import { createContext } from "react";

export const ChainName = createContext<{
  chainName: string,
  setChainName: React.Dispatch<React.SetStateAction<string>>
}>({chainName: "", setChainName: ()=> {}});