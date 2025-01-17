const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");
const path = require("path");

const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://eth-sepolia.g.alchemy.com/v2/7hqzwWyiVckZHXyOsZEdf6A0YebGkZw7`
        ),
      network_id: 11155111,
      gas: 4000000,
      confirmations: 2,
      timeoutBlocks: 500,
      networkCheckTimeout: 100000,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.8.14",
    },
  },
};
