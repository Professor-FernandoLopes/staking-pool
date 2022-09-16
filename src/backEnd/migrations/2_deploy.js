const EthStakingPool = artifacts.require("EthStakingPool");

module.exports = async function(deployer) {
  await deployer.deploy(EthStakingPool)
};