// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyERC20UpgradebleV1 is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    /*constructor(uint256 initialSupply) ERC20("NikolayToken1", "NTK1") {
            _mint(msg.sender, initialSupply*10**decimals());
    }*/

    function initialize(uint256 initialSupply) external initializer {
        __ERC20_init("NikolayToken1", "NTK1");
        __Ownable_init();
        _mint(msg.sender, initialSupply*10**decimals());
    }
}