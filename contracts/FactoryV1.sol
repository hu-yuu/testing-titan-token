// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ProxyLayout.sol";
import "./TitanToken.sol";

/// @title Factory for minting Titan Token
/// @author hu-yuu
contract FactoryV1 is  ProxyLayout {
    
    uint256 public constant  FEE = 1 ether;
    
    struct Titans {
        
        uint32 power;
        uint32 height;
    }
    /// @notice added for testing purpose
    constructor(address titanTokenadd)
    {
        super.setTokenAddress(titanTokenadd);
    }
    
    mapping(uint256 => Titans) public idToTitan;

    event TitanCreated(address _to, uint256 tokenId, uint32 power, uint32 height);
    
    /// @notice for now i wont be using RNG, but if needed Chainlik VRFConsumerBase can be use
    function randomlyHeight() internal {
        
    }
    
    function calculatePower() internal {
        
    }
    
    /// @param power power of the titan, must be between 500 and 20
    /// @param height height of the titan, must be between 5 and 200
    function createNewTitans(uint32 power, uint32 height) external payable {

        require(power <=500 && power >=20, "power level is not between 20 and 500");
        require(height >=5 && height <= 200, "height is not between 5 and 200");
        require(msg.value >= 1 ether, "not enough ETH to mint token");
        
        uint256 currId = token.getCurrentId();
        idToTitan[currId] = Titans(power, height);
        token.mint(msg.sender);
        
        emit TitanCreated(msg.sender, currId, power, height);
        
    }
    
}