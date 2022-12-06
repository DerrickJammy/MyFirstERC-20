require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.16",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/df1d9b8f8b094f0789064833e50e59db',
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};