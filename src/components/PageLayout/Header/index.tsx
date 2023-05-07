import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import { SelectChangeEvent } from '@mui/material/Select';
import LogoIcon from "../../LogoIcon";
import {useContext} from "react";
import {ChainName} from "../../../context/chainName";
import SuiWalletButton from "../../Wallets/SuiWallet";
import {IconButton, Popover, Typography, useTheme} from "@mui/material";
import {AptosLogoAlt} from "../../../resources";
import AptosWalletButton from "../../Wallets/AptosWallet";
import useCurrentPage from "../../../hooks/useCurrentPage";
import {gradientButtonStyle} from "../../../style/button";


export default function Header() {
  // const [tabName, setTabName] = useState<string>("dashboard");
  const {chainName, setChainName} = useContext(ChainName);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [currentPageName, setCurrentPage] = useCurrentPage();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('newTab', newValue);
    setCurrentPage(newValue as string);
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

  const darkMode = useTheme().palette.mode === 'dark';

  // useEffect(() => {
  //   setCurrentPage(currentPageName);
  // }, [currentPageName])

  return (
    <Box sx={{
      position:"relative",
      top: "1rem",
      // width: "100%",
      height: "2rem",
      padding: "1rem 0 1rem 0",
      marginBottom: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.25rem",
      '& > :not(style) + :not(style)': {
        ml: 15,
      },
    }}>
      <Box>
        <LogoIcon
          className="w-auto h-[48px] mobile:h-full hidden tablet:block mobile:hidden"
          hasLabel={false}
        />
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}>

        <Tabs aria-label="basic tabs example" value={currentPageName} onChange={handleTabChange}>
          <Tab label="Dashboard" value="dashboard" href="/dashboard"/>
          <Tab label="Stream" value="stream" href="/stream"/>
          <Tab label="Address Book" value="address_book" href="/address_book"/>
          <Tab label="New Stream" value="new_stream" href="/new_stream"/>
        </Tabs>
        <Button size="medium" variant="outlined" sx={gradientButtonStyle} onClick={(e) => handleTabChange(e, "new_stream")}>+ New Stream</Button>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}>

        { chainName === "sui" ? <SuiWalletButton /> : <AptosWalletButton/>}
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
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
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
  )
}