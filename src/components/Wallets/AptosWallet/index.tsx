import React, { useContext, useEffect, useState } from "react";
import { MaybeHexString } from "aptos";
import { NetworkInfo } from "@aptos-labs/wallet-adapter-core";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// import {AccountKeys, useWallet as useAptosWallet, Wallet} from '@manahippo/aptos-wallet-adapter';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Item from "../../Item";
import { copyAddress, stringWithEllipsis } from "../../../utils/string";
import { WalletAdapter } from "../../../context/WalletAdapter";
import { createNetworkAdapter } from "../../../data/account";
import { ChainName } from "../../../context/chainName";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { SignMessagePayload } from "@manahippo/aptos-wallet-adapter/dist/WalletAdapters/BaseAdapter";
import { msgToSign } from "../../../config";
import { MsgSigned } from "../../../context/msgSigned";
import { AccountInfo, Wallet } from "@aptos-labs/wallet-adapter-core";

interface ConnectedInfoProps {
  connected: boolean;
  address?: MaybeHexString;
}

export default function AptosWalletButton() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  // const {
  //   wallets,
  //   wallet,
  //   connect,
  //   disconnect,
  //   connected,
  //   account,
  //   disconnecting,
  // } = useAptosWallet();
  const { wallets, wallet, connect, disconnect, network, connected, account } =
    useWallet();
  const { setWalletAdapter } = useContext(WalletAdapter);
  const { msgSigned, setMsgSigned } = useContext(MsgSigned);
  const { chainName } = useContext(ChainName);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const address = account?.address as string;
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // console.log('wallet', wallet);
  // console.log('account', account);
  const handleUserClose = () => {
    setAnchorEl(null);
  };

  const ConnectedButton = ({ connected, address }: ConnectedInfoProps) => {
    return (
      <div className="flex flex-row items-center justify-center gap-x-1">
        {connected ? (
          <React.Fragment>
            {stringWithEllipsis(address as string, 4)}
            {/*<IconButton onClick={() => {*/}
            {/*  copyAddress(address as string);*/}
            {/*}}>*/}
            {/*  <ContentCopyIcon htmlColor="white" fontSize="small"/>*/}
            {/*</IconButton>*/}
          </React.Fragment>
        ) : (
          <React.Fragment>Connect Wallet</React.Fragment>
        )}
      </div>
    );
  };

  useEffect(() => {
    let isMounted = true;

    if (connected) {
      let adapter = createNetworkAdapter(
        chainName,
        account as AccountInfo,
        wallet as Wallet,
        network as NetworkInfo
      );

      setWalletAdapter(adapter);

      adapter.getBalance("APT").then((balance) => {
        if (isMounted) {
          setWalletBalance(balance);
        }
      });

      console.log("msgSigned", msgSigned);
      console.log("chainName", chainName);
    }

    return () => {
      // Cleanup function
      isMounted = false;
    };
  }, [connected, account]);

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
          width: "150px",
        }}
      >
        <div className="flex flex-row items-center justify-center gap-x-1 whitespace-nowrap">
          <ConnectedButton
            connected={connected}
            address={account?.address!}
          ></ConnectedButton>
          {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </div>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleUserClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          marginTop: 1,
          borderRadius: "8px",
          p: 4,
        }}
      >
        {connected ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // alignItems: "center",
              // justifyContent: "center",
              paddingLeft: 2,
              paddingRight: 2,
              paddingTop: 1,
              paddingBottom: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "justify-between",
              }}
            >
              <Box
                sx={{
                  paddingLeft: 0,
                  paddingRight: 1,
                  paddingTop: 1,
                  paddingBottom: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                  }}
                >
                  <Hashicon value={address} size={20} />
                </Avatar>
              </Box>
              <Typography
                sx={{
                  paddingLeft: 1,
                  paddingTop: 1,
                  paddingBottom: 1,
                  paddingRight: 0,
                  color: "#D5D5D5",
                }}
              >
                {stringWithEllipsis(address, 7)}
              </Typography>
            </Box>
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}
              >{`${walletBalance} APT`}</Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                disconnect();
                setAnchorEl(null);
              }}
            >
              Disconnect
            </Button>
          </Box>
        ) : (
          <Stack>
            {wallets.map((val) => {
              return (
                <Item key={val.name}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      await connect(val.name);
                      setAnchorEl(null);
                    }}
                    sx={{
                      borderRadius: "8px",
                      height: "2.5rem",
                      width: "10rem",
                      fontSize: "1rem",
                    }}
                  >
                    <div className="flex flex-row justify-between items-center gap-x-9">
                      <img
                        alt="icon"
                        src={val.icon}
                        width={30}
                        height={30}
                        className="block rounded-full"
                      />
                      {val.name}
                    </div>
                  </Button>
                </Item>
              );
            })}
          </Stack>
        )}
      </Popover>
    </>
  );
}
