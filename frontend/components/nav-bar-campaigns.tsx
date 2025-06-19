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
        <div className="flex flex-row items-center space-x-4 lg:flex-row-reverse">
          {wallet ? (
            <>
              <Button variant="outline" className="hover:cursor-pointer" onClick={handleDisconnect}>
                Disconnect
              </Button>
                <span className="font-mono text-sm text-gray-700 ml-1">{wallet.address}</span>
              <Wallet className="w-5 h-5" />
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
