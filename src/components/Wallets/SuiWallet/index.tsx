import {ConnectModal, useWallet} from '@suiet/wallet-kit';
import {useState} from "react";
import Button from "@mui/material/Button";

const MySuiWalletButton = () => {
  return (
    <Button>Connected</Button>
  )
}

export default function SuiWallet() {
  const { connected } = useWallet();
  const [showModal, setShowModal] = useState<boolean>(false)

  if (connected) {
    return MySuiWalletButton
  }

  return (
    <ConnectModal open={showModal} onOpenChange={(open) => {setShowModal(open)}} >
      <Button>Connect Wallet</Button>
    </ConnectModal>
  )
}