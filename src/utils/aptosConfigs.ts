import {
  PontemWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  AptosWalletAdapter,
} from "@manahippo/aptos-wallet-adapter";

export const AptosWallets = [
  new PontemWalletAdapter(),
  new MartianWalletAdapter(),
  new FewchaWalletAdapter(),
  new AptosWalletAdapter(),
];

