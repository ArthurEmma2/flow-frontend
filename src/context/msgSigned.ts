import { createContext } from "react";

export const MsgSigned = createContext<{
  msgSigned: string,
  setMsgSigned: React.Dispatch<React.SetStateAction<string>>
}>({msgSigned: "", setMsgSigned: ()=> {}});