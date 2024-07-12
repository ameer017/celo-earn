// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//     solidity: "0.8.17",
//     networks: {
//         alfajores: {
//             url: "https://alfajores-forno.celo-testnet.org",
//             accounts: [process.env.PRIVATE_KEY],
//         },
//         celo: {
//             url: "https://forno.celo.org",
//             accounts: [process.env.PRIVATE_KEY],
//         },
//     },
//     etherscan: {
//         apiKey: {
//             alfajores: process.env.CELOSCAN_API_KEY,
//             celo: process.env.CELOSCAN_API_KEY,
//         },
//         customChains: [
//             {
//                 network: "alfajores",
//                 chainId: 44787,
//                 urls: {
//                     apiURL: "https://api-alfajores.celoscan.io/api",
//                     browserURL: "https://alfajores.celoscan.io",
//                 },
//             },
//             {
//                 network: "celo",
//                 chainId: 42220,
//                 urls: {
//                     apiURL: "https://api.celoscan.io/api",
//                     browserURL: "https://celoscan.io/",
//                 },
//             },
//         ],
//     },
// };


("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require("fs");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gasPrice: 20000000000,
      chainId: 44787,
    },
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
