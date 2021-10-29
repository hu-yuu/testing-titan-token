const { expect } = require("chai");


describe("Token contract", function () {


  let Token, token, owner, addr1, addr2;
  
  beforeEach(async() => {
    Token = await ethers.getContractFactory("TitanToken");
    token = await Token.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", ()=> {
    it("right owner", async() => {
      expect(await token.owner()).to.equal(owner.address);
      expect(await token.owner()).to.not.equal(addr1);
    });
  });

  describe("Minting", ()=> {
    it("Owner shouldnt mint", async() => {
      await token.setFactory(addr1.address);
      await expect( token.mint(owner.address)).to.be.revertedWith('Only Factory can call the method');
    })

    it("Factory should mint", async() => {
      await token.setFactory(addr1.address);
      await expect( token.connect(addr1).mint(addr2.address)).not.to.be.reverted;
    })

    it("should mint only 1", async() => {
      await token.setFactory(addr1.address);
      await token.connect(addr1).mint(addr2.address);
      expect(await token.balanceOf(addr2.address)).to.equal(1);
    })
  })

  });