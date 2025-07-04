// context/WalletContext.tsx or .js
"use client";
import React, { createContext, useContext, useState } from "react";

export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState<{
    provider: any;
    signer: any;
    address: string;
  } | null>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook for easier use
export const useWallet = () => useContext(WalletContext);
