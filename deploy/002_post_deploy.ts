import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

import {HelloWorld} from '../types/HelloWorld';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [sender] = await hre.ethers.getSigners();

  const {deployments} = hre;
  const getContractAt = hre.ethers.getContractAt;
  const {get} = deployments;

  const helloWorld: HelloWorld = ((await getContractAt(
    'HelloWorld',
    (await get('HelloWorld')).address,
    sender
  )) as unknown) as HelloWorld;

  const m = await helloWorld.getMessage();
  if (m !== 'hello world') {
    console.log('setting message');
    await helloWorld.setMessage('hello world');
  }
  console.log('hello, world');
};
func.tags = ['PostDeploy'];
func.dependencies = ['Deploy'];
export default func;
