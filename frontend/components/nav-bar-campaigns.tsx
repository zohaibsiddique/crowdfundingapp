"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { connectWallet } from "../app/contract-utils/connect-wallet";
import { useEffect } from "react";
import { useWallet } from "./wallet-provider";

export default function NavBarCompaigns() {
  const { wallet, setWallet } = useWallet();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => handleDisconnect());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    handleConnect();
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleDisconnect);
        window.ethereum.removeListener("chainChanged", () => window.location.reload());
      }
    };
  }, []);

  const handleConnect = async () => {
   connectWallet().then((wallet) => {
        if (wallet) setWallet(wallet);
      });
  };

  const handleDisconnect = async () => {
    setWallet(null);
    if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleDisconnect);
        window.ethereum.removeListener("chainChanged", () => window.location.reload());
      }
  };

  return (
    <header className="border-b py-4 px-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto" aria-label="Campaign Navigation">
        <Link href="/" aria-label="Go to homepage">
          <div className="flex items-center space-x-2">
            <Image
              src="/baig.webp"
              alt="FundBase Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-lg text-green-700">FundBase</span>
          </div>
        </Link>

        <div className="flex flex-row items-center space-x-4">
          <Link href="/campaigns" className="font-semibold hover:bg-gray-100 px-2 py-1 rounded">
            All Campaigns
          </Link>
          {wallet ? (
            <>
              <span>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button className="bg-blue-500 text-white ml-4" onClick={handleConnect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
