const { ethers, upgrades } = require("hardhat");

const PROXY = "0x9bC6ED49463b77fd98C035DB6f9b4c9E3fd1a15D";

async function main() {
    const MyERC20UpgradebleV2 = await ethers.getContractFactory("MyERC20UpgradebleV2");
    console.log("Upgrading MyERC20Upgradeble...");
    await upgrades.upgradeProxy(PROXY, MyERC20UpgradebleV2);
    console.log("MyERC20Upgradeble upgraded");
}

main();