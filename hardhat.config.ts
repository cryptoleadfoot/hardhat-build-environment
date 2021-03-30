import {task} from 'hardhat/config';

import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-spdx-license-identifier';
import 'hardhat-contract-sizer';
import 'hardhat-abi-exporter';
import 'hardhat-gas-reporter';
import 'hardhat-typechain';
import 'hardhat-watcher';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-solhint';
import '@nomiclabs/hardhat-ganache';
import '@nomiclabs/hardhat-ethers';

import '@openzeppelin/hardhat-upgrades';

import {node_url, accounts} from './utils/network';

task('blockNumber', 'Prints the current block number', async (args, hre) => {
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log('Current block number: ' + blockNumber);
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.7.3',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: '0.5.3',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: {
      default: 0,
      kovan: 0,
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: accounts(),
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: accounts(),
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
      gasPrice: 'auto',
    },
    rinkeby: {
      url: node_url('rinkeby'),
      accounts: accounts('rinkeby'),
    },
    kovan: {
      url: node_url('kovan'),
      accounts: accounts('kovan'),
    },
    staging: {
      url: node_url('kovan'),
      accounts: accounts('kovan'),
    },
  },
  paths: {
    sources: 'src',
  },
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  mocha: {
    timeout: 0,
  },
  abiExporter: {
    path: './build',
    clear: true,
    flat: true,
  },
  typechain: {
    outDir: './types',
    target: 'ethers-v5',
  },
};

export default config;
