import React from "react";
import { MaybeHexString } from 'aptos';
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import {Box, Button, Popover, Stack} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Item from "../../Item";
import {stringWithEllipsis} from "../../../utils/string";

interface ConnectedInfoProps {
  connected: boolean
  address?: MaybeHexString
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

  const ConnectedButton = ({connected, address}: ConnectedInfoProps) => {
    return (
      <div className="flex flex-row items-center justify-center gap-x-1">
        {connected ?
          <React.Fragment>
            <span>{stringWithEllipsis(address as string, 4)}</span>
            <ContentCopyIcon htmlColor="white" fontSize="small"/>
          </React.Fragment>
          :
          <React.Fragment>
            <span>Connect Wallet</span>
          </React.Fragment>
        }
      </div>
    )
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        aria-describedby={id}
        onClick={handleUserClick}
      >
        <div className="flex flex-row items-center justify-center gap-x-1">
          <ConnectedButton connected={connected} address={account?.address!}></ConnectedButton>
          {open ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
        </div>

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
                  setAnchorEl(null);
                }}>Disconnect</Button>
              </Item>
            </Stack>
          </Box>

          :
          <Stack spacing={2}>
            {wallets.map((val) => {
              return (
                <Item key={val.adapter.name}>
                  <Button variant="outlined" size="small" onClick={() => {
                    connect(val.adapter.name);
                    setAnchorEl(null);
                  }}>{val.adapter.name}</Button>
                </Item>
              )
            })}
          </Stack>
        }
      </Popover>
    </>
  )
}