import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PontemWallet } from "@pontem/wallet-adapter-plugin";
import { RiseWallet } from "@rise-wallet/wallet-adapter";
const MSafeWallet = new MSafeWalletAdapter();

export const Aptoswallets = [
  MSafeWallet,
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet(),
];
