"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { connectWallet } from "../app/contract-utils/connect-wallet"
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

export default function NavBarCompaigns() {

  useEffect(() => {

    // Add event listeners for MetaMask account and chain changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => handleDisconnect());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    // Check if wallet was connected in previous session
    const wasConnected = localStorage.getItem("walletConnected");
    if (wasConnected === "true") {
      connectWallet().then((wallet) => {
        if (wallet) setWallet(wallet);
      });
    }

  }, []);


  const [wallet, setWallet] = useState<{
    provider: any;
    signer: any;
    address: string;
  } | null>(null);

  const handleConnect = async () => {
    const result = await connectWallet();
    if (result) setWallet(result);
  };

  const handleDisconnect = async () => {
    setWallet(null); // clear state
    localStorage.removeItem("walletConnected"); // clear session
  };


  return (
    <header className="border-b py-4 px-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto" aria-label="Compaign Navigation">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <div className="flex items-center space-x-2">
            <Image
              src="/baig.webp"
              alt="FundBase - Community Crowdfunding Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-lg text-green-700">FundBase</span>
          </div>
        </Link>

        {/* Button */}
        <div className="flex flex-row items-center space-x-4 ">
            <Link href="/campaigns" className="font-semibold transition-colors duration-200 hover:bg-gray-100 px-2 py-1 rounded">
              Campaigns
            </Link>
          {wallet ? (
            <>
              <span>{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
              <Button variant="outline" className="hover:cursor-pointer" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </>
          ) : (
            <Button
              className="text-white ml-4 bg-blue-500 hover:cursor-pointer"
              onMouseEnter={e => (e.currentTarget.style.cursor = "pointer")}
              onClick={handleConnect}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
