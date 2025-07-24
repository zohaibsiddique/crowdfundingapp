import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_TESTNET_RPC_URL = vars.get("ALCHEMY_TESTNET_RPC_URL");
const TESTNET_PRIVATE_KEY = vars.get("TESTNET_PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  sourcify: {
    enabled: true
  },
  networks: {
    sepolia: {
      url: ALCHEMY_TESTNET_RPC_URL,
      accounts: [TESTNET_PRIVATE_KEY],
    }
  }
};

export default config;
