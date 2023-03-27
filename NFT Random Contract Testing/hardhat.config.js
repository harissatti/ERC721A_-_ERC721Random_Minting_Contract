require("hardhat-gas-reporter");
require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
const BINANCE__TESTNET_RPC_URL= process.env.BINANCE__TESTNET_RPC_URL;
const COINMARKETCAP_API_KEY=process.env.COINMARKETCAP_API_KEY;
const BINANCE_MAINNET_API=process.env.BINANCE_MAINNET_API;
const BINANCE_TESTNET_PRIVATE_KEY= process.env.BINANCE_TESTNET_PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    binanceTestnet: {
      url: BINANCE__TESTNET_RPC_URL,
      accounts: [BINANCE_TESTNET_PRIVATE_KEY],
      chainId:97,
    },
  },
  gasReporter: {
      // enabled: (process.env.REPORT_GAS) ? false:true, // to turn on the gass reporter
     enabled: (process.env.REPORT_GAS) ? true:false, //to turn off the gass reporter
    // outputFile:'gas-report.txt',
    currency: 'USD',
    coinmarketcap:COINMARKETCAP_API_KEY,
    token:'BNB',
  },
  etherscan: {
    apiKey: {
      bscTestnet: BINANCE_MAINNET_API,
    }
  },

};
