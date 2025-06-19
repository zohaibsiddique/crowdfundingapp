const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const factoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with actual address
  const CrowdfundingFactory = await hre.ethers.getContractFactory("CrowdfundingFactory");
  const factory = await CrowdfundingFactory.attach(factoryAddress);

  const campaigns = await factory.getAllCampaigns();
  console.log("📢 All Campaigns:");
  campaigns.forEach((campaign, index) => {
    console.log(`\n#${index + 1}`);
    console.log(`Address: ${campaign.campaignAddress}`);
    console.log(`Owner:   ${campaign.owner}`);
    console.log(`Name:    ${campaign.name}`);
    console.log(`Created: ${new Date(Number(campaign.creationTime) * 1000).toLocaleString()}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
