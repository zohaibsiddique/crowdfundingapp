/*
| Feature                | What It Verifies                                      |
| ---------------------- | ----------------------------------------------------- |
| Deployment             | Contract is deployed and owned correctly              |
| Campaign Creation      | Campaigns can be created and tracked                  |
| User Campaign Tracking | Only campaigns by a specific user are fetched         |
| Pause Functionality    | Contract can be paused/unpaused and behaves correctly |
| Reversion on Pause     | Campaign creation fails if contract is paused         |
*/

import { expect } from "chai";
import { ethers } from "hardhat";


describe("CrowdfundingFactory", function () {
  let CrowdfundingFactory;
  let crowdfundingFactory;
  let owner: any, user1: any, user2: any;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the CrowdfundingFactory contract
    CrowdfundingFactory = await ethers.getContractFactory("CrowdfundingFactory");
    crowdfundingFactory = await CrowdfundingFactory.deploy();
    await crowdfundingFactory.waitForDeployment();
  });

  it("should deploy the CrowdfundingFactory contract", async function () {
    expect(await crowdfundingFactory.owner()).to.equal(owner.address);
  });

  it("should create a new crowdfunding campaign", async function () {
    const tx = await crowdfundingFactory.connect(user1).createCampaign(
      "Test Campaign",
      "Description of the campaign",
      ethers.parseEther("10"),
      30 // Duration in days
    );

    await tx.wait();

    const campaigns = await crowdfundingFactory.getAllCampaigns();
    expect(campaigns.length).to.equal(1);
    expect(campaigns[0].name).to.equal("Test Campaign");
    expect(campaigns[0].owner).to.equal(user1.address);
  });

  it("should fetch campaigns created by a user", async function () {
    await crowdfundingFactory.connect(user1).createCampaign(
      "User1 Campaign",
      "Campaign by user1",
      ethers.parseEther("5"),
      20
    );

    await crowdfundingFactory.connect(user2).createCampaign(
      "User2 Campaign",
      "Campaign by user2",
      ethers.parseEther("8"),
      25
    );

    const user1Campaigns = await crowdfundingFactory.getUserCampaigns(user1.address);
    expect(user1Campaigns.length).to.equal(1);
    expect(user1Campaigns[0].name).to.equal("User1 Campaign");

    const user2Campaigns = await crowdfundingFactory.getUserCampaigns(user2.address);
    expect(user2Campaigns.length).to.equal(1);
    expect(user2Campaigns[0].name).to.equal("User2 Campaign");
  });

  it("should toggle pause state", async function () {
    expect(await crowdfundingFactory.paused()).to.equal(false);
    
    await crowdfundingFactory.togglePause();
    expect(await crowdfundingFactory.paused()).to.equal(true);
    
    await crowdfundingFactory.togglePause();
    expect(await crowdfundingFactory.paused()).to.equal(false);
  });

  it("should prevent campaign creation if paused", async function () {
    await crowdfundingFactory.togglePause();
    
    await expect(
      crowdfundingFactory.connect(user1).createCampaign(
        "Blocked Campaign",
        "Should not be created",
        ethers.parseEther("6"),
        15
      )
    ).to.be.revertedWith("Factory is paused");
  });
});
