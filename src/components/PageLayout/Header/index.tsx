import React from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LogoIcon from "../../LogoIcon";
import {ConnectButton} from "@suiet/wallet-kit";
import {useContext, useState} from "react";
import {ChainName} from "../../../context/chainName";
import SuiWalletButton from "../../Wallets/SuiWallet";
import {Popover, Typography} from "@mui/material";
import {AptosLogoAlt} from "../../../resources";
// import Home from "../../../pages/Home";
// import {BrowserRouter, Route } from "react-router-dom";
// import NewStream from "../../../pages/NewStream";

export default function Header() {
  const [tabName, setTabName] = useState<string>("home");
  const {chainName, setChainName} = useContext(ChainName);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('newTab', newValue);
    setTabName(newValue);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleUserClose = () => {
    setAnchorEl(null);
  }

  const handleChange = (event: SelectChangeEvent) => {
    setChainName(event.target.value as string);
  };

  return (
    <Box sx={{
      position:"relative",
      top: "1rem",
      // width: "100%",
      height: "2rem",
      padding: "1rem 0 1rem 0",
      marginBottom: "0.5rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.25rem",
      '& > :not(style) + :not(style)': {
        ml: 15,
      },
    }}>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}>
        <LogoIcon
          className="w-auto h-[48px] mobile:h-full hidden tablet:block mobile:hidden"
          hasLabel={false}
        />

        <Tabs aria-label="basic tabs example" value={tabName} onChange={handleTabChange}>
          <Tab label="Home" value="home"/>
          <Tab label="Dashboard" value="dashboard"/>
          <Tab label="Stream" value="stream"/>
          <Tab label="Address Book" value="address_book"/>
        </Tabs>
      </Box>
      <Button size="small" className="min-w-[156px] h-10 font-bold">New Stream</Button>
      { chainName === "sui" ? <SuiWalletButton /> : <></>}
      <Button aria-describedby={id} onClick={handleUserClick}>
        <AptosLogoAlt/>
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
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>

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
  )
}