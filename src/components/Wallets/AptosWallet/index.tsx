import React, {useContext, useEffect} from "react";
import { MaybeHexString } from 'aptos';
import {AccountKeys, useWallet as useAptosWallet, Wallet} from '@manahippo/aptos-wallet-adapter';
import {Box, Button, Popover, Stack} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Item from "../../Item";
import {stringWithEllipsis} from "../../../utils/string";
import {WalletAdapter} from "../../../context/WalletAdapter";
import {createNetworkAdapter} from "../../../data/account";
import {ChainName} from "../../../context/chainName";

interface ConnectedInfoProps {
  connected: boolean
  address?: MaybeHexString
}

export default function AptosWalletButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const {
    wallets,
    wallet,
    connect,
    disconnect,
    connected,
    account,
  } = useAptosWallet();
  const {setWalletAdapter} = useContext(WalletAdapter);
  const {chainName} = useContext(ChainName);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
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

  useEffect(() => {
    if (connected) {
      setWalletAdapter(createNetworkAdapter(chainName, account as AccountKeys, wallet as Wallet));
    }
  }, [wallet, connected, account])

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        aria-describedby={id}
        onClick={handleUserClick}
        sx={{
          border: "1px solid rgba(255, 255, 255, 0.6)",
          color: "rgba(255, 255, 255, 0.6)",
          borderRadius: "6px",
          height: "35px",
        }}
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
          marginTop: 1,
          borderRadius: "8px"
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
          <Stack>
            {wallets.map((val) => {
              return (
                <Item key={val.adapter.name}>
                  <Button
                    variant="outlined" size="small"
                    onClick={() => {
                      connect(val.adapter.name).then(() => {
                        setAnchorEl(null);
                      });


                    }}
                    sx={{
                      borderRadius: "8px",
                      height: "2.5rem",
                      width: "10rem",
                      fontSize: "1rem"
                    }}
                  >
                    <div className="flex flex-row justify-between items-center gap-x-9">
                      <img src={val.adapter.icon} width={30} height={30} className="block rounded-full" />
                      {val.adapter.name}
                    </div>
                  </Button>
                </Item>
              )
            })}
          </Stack>
        }
      </Popover>
    </>
  )
}