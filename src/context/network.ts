import { createContext } from "react";

export const Network = createContext<{
  network: string,
  setNetwork: React.Dispatch<React.SetStateAction<string>>
}>({network: process.env.REACT_APP_CURRENT_NETWORK as string, setNetwork: ()=> {}});
// }>({network: "Testnet", setNetwork: ()=> {}});