import { NetworkConfiguration } from "./index";

export const aptosConfigType = "stream::GlobalConfig";
export const aptosStreamType = "stream::StreamInfo"

const LOCAL_CONFIG = new NetworkConfiguration(
  'localhost',
  'http://0.0.0.0:8080',
  'http://0.0.0.0:8000',
  'contract',
  'backend',
  'backendNet',
);

const DEVNET_CONFIG = new NetworkConfiguration(
  'devnet',
  'https://fullnode.devnet.aptoslabs.io',
  'https://faucet.devnet.aptoslabs.com',
  '0x6b65512795f4cb492e2d8713b3ce1aba624516479c3b7b51a73b91cfa3a5b16f',
  'https://api.moveflow.xyz/api',
  'apt_devnet'
);

const TESTNET_CONFIG = new NetworkConfiguration(
  'testnet',
  'https://fullnode.testnet.aptoslabs.com/v1',
  'https://faucet.testnet.aptoslabs.com',
  '0x85e0c7b86bbea605ab495df331042370b81c9abe94a0a7447c719de549545207',
  'https://api.moveflow.xyz/api',
  'apt_testnet',
);

const MAINNET_CONFIG = new NetworkConfiguration(
  'mainnet',
  'https://fullnode.mainnet.aptoslabs.com/v1',
  '',
  'contract',
  'backend',
  'apt_mainnet'
);

const getNetworkConfiguration = (env: string): NetworkConfiguration => {
  switch (env) {
    case "localhost":
      return LOCAL_CONFIG;
    case "devnet":
      return DEVNET_CONFIG;
    case "testnet":
      return TESTNET_CONFIG;
    case "mainnet":
      return MAINNET_CONFIG;
    default:
      return LOCAL_CONFIG;
  }
};

const netConfApt = getNetworkConfiguration(process.env.REACT_APP_CURRENT_NETWORK as string);

export default netConfApt;