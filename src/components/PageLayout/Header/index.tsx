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
// import Home from "../../../pages/Home";
// import {BrowserRouter, Route } from "react-router-dom";
// import NewStream from "../../../pages/NewStream";

export default function Header() {
  const [tabName, setTabName] = useState<string>("home");
  const {chainName, setChainName} = useContext(ChainName);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('newTab', newValue);
    setTabName(newValue);
  };

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

      <Button size="small" className="min-w-[156px] h-10 font-bold">New Stream</Button>
      { chainName === "sui" ? <ConnectButton>Connect Wallet</ConnectButton> : <></>}
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={chainName}
        label="Chain"
        onChange={handleChange}
        sx={{
          height: "2rem",
        }}
      >
        <MenuItem value={"aptos"}>Aptos</MenuItem>
        <MenuItem value={"sui"}>Sui</MenuItem>
      </Select>
    </Box>
  )
}