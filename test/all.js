const { expect } = require("chai");
const factoryAbi = require('../artifacts/contracts/FactoryV1.sol/FactoryV1.json');
const factoryAbi2 = require("../artifacts/contracts/FactoryV2.sol/FactoryV2.json");
const { ethers } = require("hardhat");


describe("Titan Token", function () {

    let Token, token, Proxy, proxy, Factory, factory, Factory2, factory2, owner, addr1, addr2, Ifactory, Ifactoryv2;

    before(async () => {

        Token = await ethers.getContractFactory("TitanToken");
        token = await Token.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
    });
    describe("Tokencontract", function () {

        describe("Deployment", () => {
            it("right owner", async () => {
                expect(await token.owner()).to.equal(owner.address);
                expect(await token.owner()).to.not.equal(addr1);
            });
        });

        describe("Minting", () => {
            it("Owner shouldnt mint", async () => {
                await token.setFactory(addr1.address);
                await expect(token.mint(owner.address)).to.be.revertedWith('Only Factory can call the method');
            })

            it("Factory should mint", async () => {
                await token.setFactory(addr1.address);
                await expect(token.connect(addr1).mint(addr1.address)).not.to.be.reverted;
            })

            it("should mint only 1", async () => {
                await token.setFactory(addr1.address);
                await token.connect(addr1).mint(addr2.address);
                expect(await token.balanceOf(addr2.address)).to.equal(1);
            })
        })

    });

    describe("Proxy and Factories", function () {
        before(async () => {

            Factory = await ethers.getContractFactory("FactoryV1");
            factory = await Factory.deploy(token.address);

            Factory2 = await ethers.getContractFactory("FactoryV2");
            factory2 = await Factory2.deploy();

            Proxy = await ethers.getContractFactory("Proxy");
            proxy = await Proxy.deploy(factory.address, token.address);

            Ifactory = new ethers.utils.Interface(factoryAbi.abi);
            Ifactoryv2 = new ethers.utils.Interface(factoryAbi2.abi);


        });

        it("Token contract should setFactory", async function () {
            await token.setFactory(proxy.address);
            expect(await token.factory()).to.equal(proxy.address);
        });


        it("TokenID should increase when a new token minted", async function () {
            await proxy.setOtherAddress(factory.address);
            let calldata = Ifactory.encodeFunctionData("createNewTitans", [50, 50]);
            let tokenCount = parseInt(await token.getCurrentId());

            await addr2.sendTransaction(
                {
                    data: calldata,
                    value: ethers.utils.parseEther("1.0"),
                    to: proxy.address
                }
            );

            expect(await token.getCurrentId()).to.equal(tokenCount + 1);

        });

        it("Power should be between 20 & 500", async function () {
            let calldata = Ifactory.encodeFunctionData("createNewTitans", [10, 50]);

            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    value: ethers.utils.parseEther("1.0"),
                    to: proxy.address
                }
            )).to.be.revertedWith('power level is not between 20 and 500');

        });

        it("Height should be between 5 & 200", async function () {
            let calldata = Ifactory.encodeFunctionData("createNewTitans", [50, 1]);

            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    value: ethers.utils.parseEther("1.0"),
                    to: proxy.address
                }
            )).to.be.revertedWith('height is not between 5 and 200');

        });

        it("Should not be creatable for eth < 1", async function () {
            let calldata = Ifactory.encodeFunctionData("createNewTitans", [50, 50]);

            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    value: ethers.utils.parseEther("0.9"),
                    to: proxy.address
                }
            )).to.be.revertedWith('not enough ETH to mint token');

        });

        it("Proxy can change factory", async function () {
            await proxy.setOtherAddress(factory2.address);
            await expect(await proxy.otherContractAddress()).to.equal(factory2.address);

        });

        it("Factoryv2 should add new features & new feature must be between 5 and 50", async function () {
            var calldata = Ifactoryv2.encodeFunctionData("addNewPower", [4, 3]);
            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    to: proxy.address
                }
            )).to.be.revertedWith('power must be between 5 and 50');

            var calldata = Ifactoryv2.encodeFunctionData("addNewPower", [444, 3]);
            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    to: proxy.address
                }
            )).to.be.revertedWith('power must be between 5 and 50');

            var calldata = Ifactoryv2.encodeFunctionData("addNewPower", [44, 3]);
            await expect(addr2.sendTransaction(
                {
                    data: calldata,
                    to: proxy.address
                }
            )).not.to.be.reverted;

        });



    });

});