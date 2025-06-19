const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const CrowdfundingFactoryModule = buildModule("CrowdfundingFactoryModule", (m) => {
  const factory = m.contract("CrowdfundingFactory");

  return { factory };
});

module.exports = CrowdfundingFactoryModule;
