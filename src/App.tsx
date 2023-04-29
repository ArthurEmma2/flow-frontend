import React, { useState } from "react";
import './App.css';
import Footer from "./components/PageLayout/Footer";
import Header from "./components/PageLayout/Header";
import { ChainName } from "./context/chainName";
import { WalletProvider as SuiWalletProvider} from "@suiet/wallet-kit";
import { WalletProvider as AptosWalletProvider} from "@manahippo/aptos-wallet-adapter";
import { AptosWallets } from "./utils/aptosConfigs";
import { SupportChains, DefaultWallets } from "./utils/suiConfigs";
import {Stack} from "@mui/material";
import Box from "@mui/material/Box";
import {ThemeProvider} from "@mui/material";
import "@suiet/wallet-kit/style.css";
import AddressBook from "./pages/AddressBook";
import {darkTheme} from "./theme";
import Dashboard from "./pages/Dashboard";
import {createBrowserRouter, Route, RouterProvider, Routes} from "react-router-dom";
import Stream from "./pages/Stream";
import Address from "./types/address";

export const router = [
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
  {
    path: "/stream",
    element: <Stream/>,
  },
  {
    path: "/address_book",
    element: <AddressBook />
  }
];

function App() {
  // const msg: string = `Error: [WALLET.SIGN_TX_ERROR] User rejection`
  // const chainName = useContext(ChainName);
  const [chainName, setChainName] = useState<string>('aptos')
  console.log('chainName', chainName);

  return (
    <ThemeProvider theme={darkTheme}>
      <ChainName.Provider value={{chainName, setChainName}}>
        <Box sx={{width: '100%', height: '100%'}}>
          {
            chainName === "sui" ?
              <SuiWalletProvider chains={SupportChains} defaultWallets={DefaultWallets}>
                <Stack spacing={2}>
                  <Box>
                    <Header />
                  </Box>

                  <Box>
                    <Footer />
                  </Box>
                </Stack>
              </SuiWalletProvider> :
              <AptosWalletProvider wallets={AptosWallets} onError={(err: Error) => {
                console.log('Handle Error Message', err)
              }}>
                <Stack spacing={2} direction="column">
                  <Box>
                    <Header></Header>
                  </Box>
                  <Box>
                  <Box>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard/>} />
                      <Route path="/stream" element={<Stream/>} />
                      <Route path="/address_book" element={<AddressBook/>} />
                    </Routes>
                  </Box>
                  </Box>
                  <Box>
                    <Footer></Footer>
                  </Box>
                </Stack>
              </AptosWalletProvider>
          }
        </Box>
      </ChainName.Provider>
    </ThemeProvider>
  );
}

export default App;
