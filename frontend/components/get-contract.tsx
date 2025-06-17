// src/utils/getContract.js
import { ethers } from "ethers";
import contractABI from "../app/artifacts/contracts/CrowdfundingFactory.sol/CrowdfundingFactory.json"; // paste your ABI here

const CONTRACT_ADDRESS = "0xYourSmartContractAddress";

export const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signerOrProvider);
};
