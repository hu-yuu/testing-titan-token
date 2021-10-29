const { deployMockContract } = require("@ethereum-waffle/mock-contract");
const { expect } = require("chai");


describe("Factory contract", function () {


  let Factory, factory, addr1, addr2


  beforeEach(async () => {


    Factory = await ethers.getContractFactory("FactoryV1");
    factory = await Factory.deploy();

    [addr1, addr2] = await ethers.getSigners();


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


    it("Should creatable for eth >= 1", async () => {
      const truepwr = 50;
      const truehght = 50;


      await expect(factory.createNewTitans(truepwr, truehght, {
        value: ethers.utils.parseEther("0.9")
      })).to.be.revertedWith('not enough ETH to mint token');
    });


  });

});