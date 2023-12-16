import React, {useState} from "react";
import Box from "@mui/material/Box";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import {useContext} from "react";
import {ChainName} from "../../../context/chainName";
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Container,
  IconButton,
  Popover, ToggleButton, ToggleButtonGroup,
  Typography,
  useTheme
} from "@mui/material";
import {AptosLogoAlt} from "../../../resources";
import AptosWalletButton from "../../Wallets/AptosWallet";
import {gradientButtonStyle} from "../../../style/button";
import { useNavigate } from 'react-router-dom';
import {ReactComponent as MoveFlowLogo} from "../../../resources/MFlogo.svg";
import {WalletAdapter} from "../../../context/WalletAdapter";

export default function Header(props: any) {
  const {chainName, setChainName} = useContext(ChainName);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  // const [currentPageName, setCurrentPage] = useCurrentPage();
  const {walletAdapter} = useContext(WalletAdapter);
  // const [network, setNetwork] = useState<string>("Testnet");

  const [network, setNetwork] = useState<string>(process.env.REACT_APP_CURRENT_NETWORK as string);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const navigate = useNavigate();
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    props.setCurrentPage(newValue as string);
  };

  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleUserClose = () => {
    setAnchorEl(null);
  }

  const darkMode = useTheme().palette.mode === 'dark';

  console.log("network", network  )
  console.log("selectedNetwork", selectedNetwork)

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
          ml: 0,
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
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              margin: 2,
              marginTop: 1,
              marginBottom: 1,
              backgroundColor: '#252629',
            }}>
              <div className="
                inline-flex
                rounded
                shadow-sm
                bg-[#3F4043]
                p-0.5
              " role="group">
                <button
                  type="button"
                  onClick={() => {
                    window.location.replace("https://app.moveflow.xyz")
                    setSelectedNetwork("Mainnet")
                  }}
                  className={`
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-[#FFFFFF]
                    rounded
                    ${(network === "Mainnet" && selectedNetwork === "")  ? "bg-gradient-to-r from-[#F143E2] to-[#40187F]": "bg-transparent rounded hover:hover:bg-black  hover:text-white focus:z-10 focus:text-white focus:bg-gradient-to-r focus:from-[#F143E2] focus:to-[#40187F]"}`}>
                  Mainnet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.replace("https://testnet.app.moveflow.xyz")
                    setSelectedNetwork("Testnet")
                  }}
                  className={`
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-[#FFFFFF]
                    rounded
                    ${network === "Testnet" && selectedNetwork === "" ? "bg-gradient-to-r from-[#F143E2] to-[#40187F]" : "bg-transparent hover:bg-black hover:text-white focus:z-10 focus:text-white focus:bg-gradient-to-r focus:from-[#F143E2] focus:to-[#40187F]"}`}>
                  Testnet
                </button>
              </div>
            </Box>
          </Popover>
        </Box>
      </Box>
    </Container>
  )
}
