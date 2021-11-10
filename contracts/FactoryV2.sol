// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ProxyLayout.sol";
import "./TitanToken.sol";

/// @title ex Factory upgrade
/// @author hu-yuu
contract FactoryV2 is  ProxyLayout {
    
    /// @dev FactoryV2 must inherit storage variables from FactoryV1
    // --------------------------------------------
    uint256 public constant  FEE = 1 ether;
    struct Titans {
        
        uint32 power;
        uint32 height;
    }
    mapping(uint256 => Titans) public idToTitan;
    // --------------------------------------------

    mapping(uint256 => uint256) public idToTitanPower;

    function addNewPower(uint256 power, uint256 tokenid) external {
        require(power<=50 && power >5, "power must be between 5 and 50");
        idToTitanPower[tokenid]=power;
    }
    
}
    