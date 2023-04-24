import { useState } from "react";
import './App.css';
import Home from "./pages/Home";
// import Notification from './components/Notification';
import Footer from "./components/PageLayout/Footer";
import Header from "./components/PageLayout/Header";
import { ChainName } from "./context/chainName";
import { WalletProvider as SuiWalletProvider} from "@suiet/wallet-kit";
import { WalletProvider as AptosWalletProvider} from "@manahippo/aptos-wallet-adapter";
import { AptosWallets } from "./utils/aptosConfigs";
import { SupportChains, DefaultWallets } from "./utils/suiConfigs";
import {Paper, Stack} from "@mui/material";
import Box from "@mui/material/Box";

function App() {
  // const msg: string = `Error: [WALLET.SIGN_TX_ERROR] User rejection`
  // const chainName = useContext(ChainName);
  const [chainName, setChainName] = useState<string>('aptos')
  console.log('chainName', chainName);
  return (
    <ChainName.Provider value={{chainName, setChainName}}>
      <Box sx={{width: '100%', height: '100%'}}>

      {/*    {*/}
      {/*      chainName === "sui" ?*/}
      {/*        <SuiWalletProvider chains={SupportChains} defaultWallets={DefaultWallets}>*/}
      {/*          <Stack spacing={2}>*/}
      {/*            <Paper>*/}
      {/*              <Header></Header>*/}
      {/*            </Paper>*/}
      {/*            /!*<Paper>*!/*/}
      {/*            /!*  <Home />*!/*/}
      {/*            /!*</Paper>*!/*/}
      {/*            <Paper>*/}
      {/*              <Footer></Footer>*/}
      {/*            </Paper>*/}
      {/*          </Stack>*/}
      {/*        </SuiWalletProvider> :*/}
      {/*        <AptosWalletProvider wallets={AptosWallets} onError={(err: Error) => {*/}
      {/*          console.log('Handle Error Message', err)*/}
      {/*        }}>*/}
      {/*          <Stack spacing={2} direction="column">*/}
      {/*            <Paper>*/}
      {/*              <Header></Header>*/}
      {/*            </Paper>*/}

      {/*              */}

      {/*            <Paper>*/}
      {/*              <Footer></Footer>*/}
      {/*            </Paper>*/}
      {/*          </Stack>*/}
      {/*        </AptosWalletProvider>*/}
      {/*    }*/}

        <Home />
      </Box>

    </ChainName.Provider>
  );
}

export default App;
