const { deployMockContract } = require("@ethereum-waffle/mock-contract");
const { expect } = require("chai");
const mockAbi = require('./mock/mockAbi.json');
const {ContractFactory} =require( 'ethers');
const {MockProvider} =require( '@ethereum-waffle/provider');
const factoryAbi = require('../artifacts/contracts/FactoryV1.sol/FactoryV1.json');

describe("Factory contract", function () {


  let Factory, factory, mockTitan;


  beforeEach(async () => {


    [addr3, rec] = new MockProvider().getWallets();
    mockTitan = await deployMockContract(addr3, mockAbi.abi);
    Factory = new ContractFactory(factoryAbi.abi, factoryAbi.bytecode, addr3);
    factory = await Factory.deploy(mockTitan.address);

    await mockTitan.mock.mint.withArgs(addr3.address).returns(1);
    await mockTitan.mock.getCurrentId.returns(1);
  });

  describe("Creating Titan", () => {
    it("Power should be between 20 & 500", async () => {

      const truehght = 50;
      const wrngpwr = 10;

      await expect(factory.createNewTitans(wrngpwr, truehght, {
        value: ethers.utils.parseEther("1.0")
      })).to.be.revertedWith('power level is not between 20 and 500');

    });

    it("Height should be between 5 & 200", async () => {
      const truepwr = 50;
      const wrnghght = 3;


      await expect(factory.createNewTitans(truepwr, wrnghght, {
        value: ethers.utils.parseEther("1.0")
      })).to.be.revertedWith('height is not between 5 and 200');
    });


    it("Should not be creatable for eth < 1", async () => {
      const truepwr = 50;
      const truehght = 50;


      await expect(factory.createNewTitans(truepwr, truehght, {
        value: ethers.utils.parseEther("0.9")
      })).to.be.revertedWith('not enough ETH to mint token');
    });


    it("Power should be between 20 & 500", async () => {

      const truehght = 50;
      const truepwr = 50;

      await expect(factory.createNewTitans(truepwr, truehght, {
        value: ethers.utils.parseEther("1.0")
      })).not.to.be.reverted;
      
    });


    it("Mint when nothing wrong", async () => {

      const truehght = 50;
      const truepwr = 50;

      await expect(factory.createNewTitans(truepwr, truehght, {
        value: ethers.utils.parseEther("1.0")
      })).not.to.be.reverted;
      
    });

    it("Should emit the event", async () => {

      const truehght = 50;
      const truepwr = 50;

      await expect(factory.createNewTitans(truepwr, truehght, {
        value: ethers.utils.parseEther("1.0")
      })).to.emit(factory, 'TitanCreated');
      
    });

  });

});