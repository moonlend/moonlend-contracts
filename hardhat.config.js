require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require('dotenv').config();
require('hardhat-deploy');

module.exports = {
  solidity: {
    version: "0.8.7",
    ...(process.env.DEPLOY === "true" &&
    {
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999,
        },
      },
    }
    )
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MOONBASE_ALPHA_RPC
      }
    },
    mainnet: {
      url: process.env.MOONRIVER_RPC,
      accounts: [process.env.PRIVATEKEY],
      gasMultiplier: 1.5,
    },
    moonbase: {
      url: process.env.MOONBASE_ALPHA_RPC,
      accounts: [process.env.PRIVATEKEY],
      gasMultiplier: 1.5,
    },
  },
  etherscan: {
    apiKey: process.env.MOONSCAN_MOONRIVER
  },
};