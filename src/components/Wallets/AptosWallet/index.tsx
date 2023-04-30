import React from "react";
import { MaybeHexString } from 'aptos';
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import {Box, Button, Popover, Stack} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WalletSelector from "../WalletSelector";
import Item from "../../Item";
import {stringWithEllipsis} from "../../../utils/string";

interface ConnectedInfoProps {
  address: MaybeHexString
}

const ConnectedButton = ({address}: ConnectedInfoProps) => {
  return (
    <div className="flex flex-row gap-x-1">
      <span>{stringWithEllipsis(address as string)}</span>
      <ContentCopyIcon htmlColor="white" fontSize="small"/>
    </div>
  )
}


export default function AptosWalletButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { wallets, connect, disconnect, connected, account } = useAptosWallet();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  console.log('account', account);
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleUserClose = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        aria-describedby={id}
        onClick={handleUserClick}
      >
        {connected ? <ConnectedButton address={account?.address!}></ConnectedButton> : 'Connect Wallet'}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          marginTop: 1
        }}
      >
        {connected ?
          <Box>
            <Stack>
              <Item>
                <Button variant="outlined" size="small" onClick={() => {
                  disconnect();
                }}>Disconnect</Button>
              </Item>
            </Stack>
          </Box>

          :
          <Stack spacing={2}>
            <WalletSelector wallets={wallets}/>
          </Stack>
        }
      </Popover>
    </>
  )
}