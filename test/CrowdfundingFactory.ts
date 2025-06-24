
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('CrowdfundingFactory', function() {
  var CrowdfundingFactory, factory;
  var deployer, user, user2;

  beforeEach(async function() {
    var signers = await ethers.getSigners();
    deployer = signers[0];
    user = signers[1];
    user2 = signers[2];

    CrowdfundingFactory = await ethers.getContractFactory('CrowdfundingFactory');
    factory = await CrowdfundingFactory.connect(deployer).deploy();
  });

  describe('Deployment', function() {
    it('should set the deployer as the owner', async function() {
      expect(await factory.owner()).to.equal(deployer.address);
    });

    it('should have paused as false initially', async function() {
      expect(await factory.paused()).to.equal(false);
    });
  });

  describe('Create Campaign', function() {
    it('should allow creating a new campaign', async function() {
      await factory.connect(user).createCampaign(
        'Test Campaign',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('10'),
        30
      );

      var allCampaigns = await factory.getAllCampaigns();
      expect(allCampaigns.length).to.equal(1);

      var firstCampaign = allCampaigns[0];
      expect(firstCampaign.name).to.equal('Test Campaign');
      expect(firstCampaign.owner).to.equal(user.address);

      var userCampaigns = await factory.getUserCampaigns(user.address);
      expect(userCampaigns.length).to.equal(1);
      expect(userCampaigns[0].name).to.equal('Test Campaign');
    });

    it('should revert if minGoal is 0', async function() {
      await expect(
        factory.connect(user).createCampaign(
          'Test Campaign',
          'Description',
          0,
          ethers.parseEther('1'),
          30
        )
      ).to.be.revertedWith('Minimum goal must be > 0');
    });

    it('should revert if maxGoal < minGoal', async function() {
      await expect(
        factory.connect(user).createCampaign(
          'Test Campaign',
          'Description',
          ethers.parseEther('10'),
          ethers.parseEther('1'),
          30
        )
      ).to.be.revertedWith('Max goal must be >= min goal');
    });

    it('should revert if paused is true', async function() {
      await factory.togglePause();

      await expect(
        factory.connect(user).createCampaign(
          'Test Campaign',
          'Description',
          ethers.parseEther('1'),
          ethers.parseEther('10'),
          30
        )
      ).to.be.revertedWith('Factory is paused');
    });
  });

  describe('Toggle Pause', function() {
    it('should allow owner to pause and unpause', async function() {
      await factory.togglePause();
      expect(await factory.paused()).to.equal(true);

      await factory.togglePause();
      expect(await factory.paused()).to.equal(false);
    });

    it('should revert if non-owner tries to pause', async function() {
      await expect(factory.connect(user).togglePause()).to.be.revertedWith(
        'Not owner.'
      );
    });
  });

  describe('Get User Campaigns', function() {
    beforeEach(async function() {
      await factory.connect(user).createCampaign(
        'User1 Campaign',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('2'),
        30
      );

      await factory.connect(user2).createCampaign(
        'User2 Campaign',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('2'),
        30
      );

      await factory.connect(user).createCampaign(
        'User1 Campaign2',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('2'),
        30
      );
    });

    it('should return all campaigns for a user', async function() {
      var userCampaigns = await factory.getUserCampaigns(user.address);
      expect(userCampaigns.length).to.equal(2);
      expect(userCampaigns[0].name).to.equal('User1 Campaign');
      expect(userCampaigns[1].name).to.equal('User1 Campaign2');
    });

    it('should return empty if user has no campaigns', async function() {
      var empty = await factory.getUserCampaigns(
        ethers.Wallet.createRandom().address
      );
      expect(empty.length).to.equal(0);
    });
  });

  describe('Get All Campaigns', function() {
    it('should return all created campaigns', async function() {
      await factory.connect(user).createCampaign(
        'Campaign1',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('2'),
        30
      );

      await factory.connect(user2).createCampaign(
        'Campaign2',
        'Description',
        ethers.parseEther('1'),
        ethers.parseEther('2'),
        30
      );

      var all = await factory.getAllCampaigns();
      expect(all.length).to.equal(2);
      expect(all[0].name).to.equal('Campaign1');
      expect(all[1].name).to.equal('Campaign2');
    });
  });
});
