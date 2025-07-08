'use client'

import { createContext, useContext, useState, ReactNode } from "react";

type WalletContextType = {
  wallet: {
    provider: any;
    signer: any;
    address: string;
  } | null;
  setWallet: React.Dispatch<React.SetStateAction<WalletContextType["wallet"]>>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletContextType["wallet"]>(null);

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// Hook for easier use
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};