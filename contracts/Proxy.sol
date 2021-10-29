// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "./ProxyLayout.sol";
import "./TitanToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/// @title Proxy contract
/// @author hu-yuu
/// @notice Proxy contract for store token data, delegatecalls to factory contracts to may be update token data (adding new features...) 
contract Proxy is ProxyLayout {

    constructor(address _logicContract, address _token) {
        setOtherAddressStorage(_logicContract);
        setTokenAddress(_token);
    }

    /// @notice lets owner externally set the factory address
    function setOtherAddress(address _otherContract) external onlyOwner {
        super.setOtherAddressStorage(_otherContract);
    }
    
    /// @notice lets owner externally set the token contract address
    function setTitanToken(address _titanTokenAdd) external onlyOwner {
        super.setTokenAddress(_titanTokenAdd);
    }

    /// @notice fallback function to delegatecall factory contracts
    fallback() payable external {
        address _impl = otherContractAddress;
    
        assembly {
          let ptr := mload(0x40)
          calldatacopy(ptr, 0, calldatasize())
          let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
          let size := returndatasize()
          returndatacopy(ptr, 0, size)
    
          switch result
          case 0 { revert(ptr, size) }
          default { return(ptr, size) }
        }
  }
  

  
  
}