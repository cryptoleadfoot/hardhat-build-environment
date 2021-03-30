import fs from 'fs';
import hre from 'hardhat';

const {ethers, artifacts, upgrades, provider} = hre;

const getContractFactory = ethers.getContractFactory;
const getContractAt = ethers.getContractAt;
const readArtifact = artifacts.readArtifact;

const tokens = (n) => ethers.utils.parseEther(n);
const inflate = (n) => ethers.utils.parseEther(n);
const deflate = (n) => ethers.utils.parseEther(n);

module.exports = {
  tokens,
  inflate,
  deflate,
  readArtifact,
  readConfig: () => {
    try {
      return JSON.parse(fs.readFileSync('./radius.json', 'utf8'));
    } catch (err) {
      return {libs: {}};
    }
  },

  writeConfig: (c, v) => {
    try {
      const jsout = JSON.stringify(c, null, 4);
      fs.writeFileSync('./radius.json', jsout);
      if (v) console.log(jsout);
    } catch (err) {
      console.err(err);
    }
  },

  linkDeploy: async (contractName, initParams, libs, user) => {
    const factory = await getContractFactory(contractName, libs, user);
    const instance = initParams
      ? await factory.deploy(...initParams)
      : await factory.deploy();
    await instance.deployed();
    return {
      factory,
      instance,
    };
  },

  attach: async (contractName, address, user) => {
    const instance = await getContractAt(contractName, address, user);
    return {instance};
  },

  deploy: async (contractName, initParams, user) => {
    const factory = await getContractFactory(contractName, user);
    const instance = initParams
      ? await factory.deploy(...initParams)
      : await factory.deploy();
    await instance.deployed();
    return {factory, instance};
  },

  deployProxy: async (contractName, initParams, user) => {
    const factory = await getContractFactory(contractName, user);
    const instance = await upgrades.deployProxy(
      factory,
      initParams,
      {
        unsafeAllowLinkedLibraries: true,
        unsafeAllowCustomTypes: true,
      },
      user
    );
    await instance.deployed();
    return {factory, instance};
  },

  linkDeployProxy: async (contractName, initParams, libs, user) => {
    const factory = await getContractFactory(contractName, libs, user);
    const instance = await upgrades.deployProxy(factory, initParams, {
      unsafeAllowLinkedLibraries: true,
      unsafeAllowCustomTypes: true,
    });
    await instance.deployed();
    return {
      factory,
      instance,
    };
  },

  upgradeProxy: async (contractAddress, contractName, initParams, user) => {
    const factory = await getContractFactory(contractName, user);
    const instance = await upgrades.upgradeProxy(contractAddress, factory, {
      unsafeAllowLinkedLibraries: true,
      unsafeAllowCustomTypes: true,
    });
    await instance.deployed();
    return {factory, instance};
  },

  linkUpgradeProxy: async (
    contractAddress,
    contractName,
    initParams,
    libs,
    user
  ) => {
    const factory = await getContractFactory(contractName, libs, user);
    const instance = await upgrades.upgradeProxy(contractAddress, factory, {
      unsafeAllowLinkedLibraries: true,
      unsafeAllowCustomTypes: true,
    });
    await instance.deployed();
    return {
      factory,
      instance,
    };
  },

  increaseTime: async (time) => {
    var provider = new ethers.providers.JsonRpcProvider();

    var currentTime = new Date().getTime();
    var bn = await provider.getBlockNumber();
    var lb = await provider.getBlock(bn);
    await provider.send('evm_mine', [currentTime + time]);
    currentTime = new Date().getTime();
    bn = await provider.getBlockNumber();
    lb = await provider.getBlock(bn);

    return lb.timestamp;
  },

  depositToken: async (mine, owner, token, amount) => {
    await token.approve(mine.address, tokens(amount), {
      from: owner,
    });
    await mine.deposit(token.address, tokens(amount), {
      from: owner,
    });
  },

  withdrawToken: async (mine, owner, token, amount) => {
    await mine.withdraw(token.address, tokens(amount), {
      from: owner,
    });
  },

  getLatestBlock: async () => {
    const bn = await provider.getBlockNumber();
    return await provider.getBlock(bn);
  },
};
