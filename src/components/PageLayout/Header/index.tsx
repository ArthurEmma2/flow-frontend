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

export default function Header() {
  const [tabName, setTabName] = useState<number>(0);
  const {chainName, setChainName} = useContext(ChainName);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log('newTab', newValue);
    setTabName(newValue);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setChainName(event.target.value as string);
  };

  return (
    <Box sx={{
      position:"fixed",
      left: "0px",
      top: "0px",
      width: "100%",
      height: "2rem",
      padding: "1rem 0 1rem 0",
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
        <Tab label="Home"/>
        <Tab label="Dashboard" />
        <Tab label="Stream" />
        <Tab label="Address Book" />
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