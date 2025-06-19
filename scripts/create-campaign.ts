const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Replace with your actual deployed factory contract address
  const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const CrowdfundingFactory = await hre.ethers.getContractFactory("CrowdfundingFactory");
  const factory = await CrowdfundingFactory.attach(factoryAddress);

  const tx = await factory.createCampaign(
    "Save The Rainforest",         // name
    "Protect and restore rainforests globally", // description
    hre.ethers.utils.parseEther("1.0"), // goal: 1 ETH
    30 // duration in days
  );

  await tx.wait();
  console.log("✅ Campaign created successfully!");
}
