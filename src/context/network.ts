import { createContext } from "react";

export const Network = createContext<{
  network: string,
  setNetwork: React.Dispatch<React.SetStateAction<string>>
}>({network: "testnet", setNetwork: ()=> {}});