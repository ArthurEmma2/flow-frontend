import React from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import {useContext} from "react";
import {ChainName} from "../../../context/chainName";
// import SuiWalletButton from "../../Wallets/SuiWallet";
import {Avatar, Container, IconButton, Popover, Typography, useTheme} from "@mui/material";
import {AptosLogoAlt} from "../../../resources";
import AptosWalletButton from "../../Wallets/AptosWallet";
import useCurrentPage from "../../../hooks/useCurrentPage";
import {gradientButtonStyle} from "../../../style/button";
import { useNavigate } from 'react-router-dom';
import {ReactComponent as MoveFlowLogo} from "../../../resources/MFlogo.svg";
import {Hashicon} from "@emeraldpay/hashicon-react";
import {WalletAdapter} from "../../../context/WalletAdapter";


export default function Header(props: any) {
  const {chainName, setChainName} = useContext(ChainName);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  // const [currentPageName, setCurrentPage] = useCurrentPage();
  const {walletAdapter} = useContext(WalletAdapter);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const navigate = useNavigate();
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('newTab', newValue);
    props.setCurrentPage(newValue as string);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleUserClose = () => {
    setAnchorEl(null);
  }

  const darkMode = useTheme().palette.mode === 'dark';

  const address = walletAdapter?.getAddress() as string

  return (
    <Container>
      <Box sx={{
        position:"relative",
        top: "1rem",
        // width: "100%",
        height: "2rem",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "1.25rem",
        '& > :not(style) + :not(style)': {
          ml: 15,
        },
      }}>
        <Box>
          <MoveFlowLogo height="30px" width="150px" style={{left: 0}}/>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}>
          <Box>
            <Tabs aria-label="basic tabs example" value={props.currentPageName} onChange={handleTabChange}>
              <Tab label="Dashboard" value="dashboard" href="/dashboard"/>
              <Tab label="Stream" value="stream" href="/stream"/>
              <Tab label="Address Book" value="address_book" href="/address_book"/>
              {/*<Tab label="" value="new_stream" href="/new_stream" />*/}
            </Tabs>
          </Box>
          <Box>
            <Button size="medium" variant="outlined" fullWidth={true}  sx={gradientButtonStyle} onClick={(e) => {
                handleTabChange(e, "new_stream")
                navigate("new_stream")
            } }>+ New Stream</Button>
          </Box>
        </Box>
        <Box sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 2,
        }}>
          { <AptosWalletButton/>}
          <IconButton aria-describedby={id} onClick={handleUserClick}>
            <AptosLogoAlt width="2rem" height="2rem" fill={darkMode ? "white" : "black"}/>
          </IconButton>
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
            sx={{borderRadius: "8px"}}
          >
          </Popover>
        </Box>
        {/*<Select*/}
        {/*  labelId="demo-simple-select-label"*/}
        {/*  id="demo-simple-select"*/}
        {/*  value={chainName}*/}
        {/*  label="Chain"*/}
        {/*  onChange={handleChange}*/}
        {/*  sx={{*/}
        {/*    height: "2rem",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <MenuItem value={"aptos"}>Aptos</MenuItem>*/}
        {/*  <MenuItem value={"sui"}>Sui</MenuItem>*/}
        {/*</Select>*/}
      </Box>
    </Container>
  )
}