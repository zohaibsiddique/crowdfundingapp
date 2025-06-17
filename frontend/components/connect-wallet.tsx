import { BrowserProvider, JsonRpcSigner } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type WalletConnection = {
  provider: BrowserProvider;
  signer: JsonRpcSigner;
  address: string;
} | null;

export const connectWallet = async (): Promise<WalletConnection> => {
  if (window.ethereum) {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    localStorage.setItem("walletConnected", "true");

    return { provider, signer, address };
  } else {
    alert("MetaMask not found");
    return null;
  }
};


