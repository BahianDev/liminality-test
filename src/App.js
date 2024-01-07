import React, { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "./App.css";
import Page from "./Page";
require("@solana/wallet-adapter-react-ui/styles.css");

function App() {
  // you can use Mainnet, Devnet or Testnet here
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(
    () =>
      "https://fabled-magical-panorama.solana-mainnet.discover.quiknode.pro/2af224eaab7cf91c93d2aa1a62b0d8cea5b3d33e/" ||
      clusterApiUrl(network),
    [network]
  ); // initialise all the wallets you want to use
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Page/>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
