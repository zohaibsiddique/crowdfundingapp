/*
| **Feature**                                              | **What It Tests / Verifies**                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 🏗️ **Contract Deployment**                              | Checks if the contract is deployed with correct initial values (name, description, owner, etc.) |
| 🧱 **Add Tier**                                          | Only the owner can add funding tiers with a specific name and amount                            |
| 💸 **Fund a Tier**                                       | Users can fund valid tiers with the exact amount, and contributions are tracked correctly       |
| ❌ **Invalid Funding Rejected**                           | Rejects transactions with the wrong amount for a tier                                           |
| 🔁 **Refund After Campaign Failure**                     | Allows users to get a refund if the campaign fails after the deadline                           |
| 💰 **Withdraw Funds After Success**                      | Allows the owner to withdraw all funds if the campaign reaches its goal before the deadline     |
| 🛑 **Pause Campaign**                                    | Owner can pause the contract, and funding is blocked while paused                               |
| 📅 **Extend Deadline**                                   | Owner can extend the campaign deadline while the campaign is active                             |
| 🔍 **Check Tier Funding Status** *(via `hasFundedTier`)* | Verifies if a user has funded a specific tier                                                   |
| 📊 **Get Tier Info** *(via `getTiers`)*                  | Confirms that tier data is returned correctly after adding                                      |

*/

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding", function () {
  let Crowdfunding, crowdfunding;
  let owner, user1, user2;

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    Crowdfunding = await ethers.getContractFactory("Crowdfunding");

    crowdfunding = await Crowdfunding.deploy(
      owner.address,
      "Cool Campaign",
      "A test crowdfunding campaign",
      ethers.parseEther("2"), // Goal: 2 ETH
      5 // Duration in days
    );

    await crowdfunding.waitForDeployment();
  });

  it("should deploy correctly with initial values", async () => {
    expect(await crowdfunding.name()).to.equal("Cool Campaign");
    expect(await crowdfunding.description()).to.equal("A test crowdfunding campaign");
    expect(await crowdfunding.owner()).to.equal(owner.address);
  });

  it("should allow owner to add a tier", async () => {
    await crowdfunding.connect(owner).addTier("Bronze", ethers.parseEther("0.5"));
    const tiers = await crowdfunding.getTiers();

    expect(tiers.length).to.equal(1);
    expect(tiers[0].name).to.equal("Bronze");
    expect(tiers[0].amount).to.equal(ethers.parseEther("0.5"));
  });

  it("should allow a user to fund a tier and track contributions", async () => {
    await crowdfunding.connect(owner).addTier("Silver", ethers.parseEther("1"));

    const tierIndex = 0;
    await crowdfunding.connect(user1).fund(tierIndex, { value: ethers.parseEther("1") });

    const balance = await crowdfunding.getContractBalance();
    expect(balance).to.equal(ethers.parseEther("1"));

    const hasFunded = await crowdfunding.hasFundedTier(user1.address, tierIndex);
    expect(hasFunded).to.be.true;
  });

  it("should reject incorrect tier amount", async () => {
    await crowdfunding.connect(owner).addTier("Gold", ethers.parseEther("2"));

    await expect(
      crowdfunding.connect(user1).fund(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Incorrect amount.");
  });

  it("should allow refunds if campaign fails", async () => {
    await crowdfunding.connect(owner).addTier("Bronze", ethers.parseEther("1"));
    await crowdfunding.connect(user1).fund(0, { value: ethers.parseEther("1") });

    // Fast-forward time to simulate campaign deadline passing
    await ethers.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]); // 6 days
    await ethers.provider.send("evm_mine");

    // Campaign should be marked as failed now
    await crowdfunding.connect(user1).refund();

    const newBalance = await crowdfunding.getContractBalance();
    expect(newBalance).to.equal(0);
  });

  it("should allow withdrawal if campaign is successful", async () => {
    await crowdfunding.connect(owner).addTier("Diamond", ethers.parseEther("2"));
    await crowdfunding.connect(user1).fund(0, { value: ethers.parseEther("2") });

    // Fast-forward time
    await ethers.provider.send("evm_increaseTime", [6 * 24 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    const oldBalance = await ethers.provider.getBalance(owner.address);
    const tx = await crowdfunding.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;

    const newBalance = await ethers.provider.getBalance(owner.address);

    expect(newBalance).to.be.gt(oldBalance - gasUsed);
  });

  it("should toggle pause and block funding when paused", async () => {
    await crowdfunding.connect(owner).addTier("Silver", ethers.parseEther("1"));

    await crowdfunding.togglePause();
    expect(await crowdfunding.paused()).to.be.true;

    await expect(
      crowdfunding.connect(user1).fund(0, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Contract is paused.");
  });

  it("should extend the deadline", async () => {
    const oldDeadline = await crowdfunding.deadline();

    await crowdfunding.connect(owner).extendDeadline(2);
    const newDeadline = await crowdfunding.deadline();

    expect(newDeadline).to.equal(oldDeadline + BigInt(2 * 24 * 60 * 60));
  });
});
