
import React, { useState } from "react";
import "./App.css";
import Footer from "./components/PageLayout/Footer";
import Header from "./components/PageLayout/Header";
import { ChainName } from "./context/chainName";
// import { WalletProvider as SuiWalletProvider} from "@suiet/wallet-kit";
import { WalletProvider as AptosWalletProvider } from "@manahippo/aptos-wallet-adapter";
import { Aptoswallets } from "./utils/aptosConfigs";
// import { SupportChains, DefaultWallets } from "./utils/suiConfigs";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material";
// import "@suiet/wallet-kit/style.css";
import AddressBook from "./pages/AddressBook";
import { darkTheme } from "./style/theme";
import Dashboard from "./pages/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Stream from "./pages/Stream";
import { WalletAdapter } from "./context/WalletAdapter";
import { MsgSigned } from "./context/msgSigned";
import { NetworkAdapter } from "./data/account";
import NewStream from "./pages/NewStream";
import useCurrentPage from "./hooks/useCurrentPage";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export const router = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/stream",
    element: <Stream />,
  },
  {
    path: "/address_book",
    element: <AddressBook />,
  },
  {
    path: "/new_stream",
    element: <NewStream />,
  },
];

function App() {
  const [chainName, setChainName] = useState<string>("aptos");
  const [walletAdapter, setWalletAdapter] = useState<NetworkAdapter>();
  const [currentPageName, setCurrentPage] = useCurrentPage();
  const [msgSigned, setMsgSigned] = useState<string>("");

  return (
    <ThemeProvider theme={darkTheme}>
      <ChainName.Provider value={{ chainName, setChainName }}>
        <WalletAdapter.Provider value={{ walletAdapter, setWalletAdapter }}>
          <MsgSigned.Provider value={{ msgSigned, setMsgSigned }}>
            <Box
              sx={{
                width: "100%",
                height: "100%",
                paddingLeft: 20,
                paddingRight: 20,
              }}
            >
              {
                <AptosWalletAdapterProvider
                  plugins={Aptoswallets}
                  autoConnect={true}
                  onError={(error: any) => {
                    console.log("Custom error handling", error);
                  }}
                >
                  <Stack spacing={2} direction="column">
                    <Box>
                      <Header
                        currentPageName={currentPageName}
                        setCurrentPage={setCurrentPage}
                      ></Header>
                    </Box>
                    <Box>
                      <Box>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/stream" element={<Stream />} />
                          <Route
                            path="/address_book"
                            element={
                              <AddressBook
                                currentPageName={currentPageName}
                                setCurrentPage={setCurrentPage}
                              />
                            }
                          />
                          <Route path="/new_stream" element={<NewStream />} />
                          <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                          />
                        </Routes>
                      </Box>
                    </Box>
                    <Box>
                      <Footer></Footer>
                    </Box>
                  </Stack>
                </AptosWalletAdapterProvider>
              }
            </Box>
          </MsgSigned.Provider>
        </WalletAdapter.Provider>
      </ChainName.Provider>
    </ThemeProvider>
  );
}

export default App;
