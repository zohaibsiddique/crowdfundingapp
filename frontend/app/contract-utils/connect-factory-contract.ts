import { BrowserProvider, ethers } from "ethers";
import { CROWDFUNDING_FACTORY_ABI, CROWDFUNDING_FACTORY_ADDRESS } from "./abi";

export const connectFactoryContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    CROWDFUNDING_FACTORY_ADDRESS,
    CROWDFUNDING_FACTORY_ABI,
    await signer
  );

  return contract;
};
