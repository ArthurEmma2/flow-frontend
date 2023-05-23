import {
  PontemWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  AptosWalletAdapter,
  MSafeWalletAdapter
} from "@manahippo/aptos-wallet-adapter";

export const AptosWallets = [
  new PontemWalletAdapter(),
  new MartianWalletAdapter(),
  new FewchaWalletAdapter(),
  new AptosWalletAdapter(),
  new MSafeWalletAdapter(),
];

