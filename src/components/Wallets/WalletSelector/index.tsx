import {Stack, Box, Button} from "@mui/material";
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import Item from "../../Item";
import {useContext} from "react";
import {ChainName} from "../../../context/chainName";

interface WalletSelectorProps {
  wallets: any[]
}

const WalletSelector = ({wallets}: WalletSelectorProps) => {
  const {chainName} = useContext(ChainName);
  const {connect} = useAptosWallet();
  return (
    <Box>
      {
        chainName === "aptos" ? <Stack>
          {wallets.map((val) => {
            return (
              <Item key={val.adapter.name}>
                <Button variant="outlined" size="small" onClick={() => {connect(val.adapter.name)}}>{val.adapter.name}</Button>
              </Item>
            )
          })}
        </Stack>
        :
        <Stack>
          {wallets.map((val) => {
            return (
              <Item>
                <Button variant="outlined" size="small">{val.name}</Button>
              </Item>
            )
          })}
        </Stack>
      }

    </Box>
  )
}

export default WalletSelector;