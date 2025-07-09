import { BrowserProvider, JsonRpcSigner } from "ethers";

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  if (!window.ethereum) {
    alert("MetaMask not found");
    return null;
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    // ✅ Explicitly request accounts before `getSigner()`
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    localStorage.setItem("walletConnected", "true");

    return { provider, signer, address };

    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    // Helpful log for debugging
    console.error("Error connecting wallet:", error);

    if (error.code === -32002) {
      alert(
        "MetaMask is already waiting for you to connect. Please check the MetaMask popup."
      );
    } else {
      alert(error.message || "Error connecting wallet");
    }

    return null;
  }
};
