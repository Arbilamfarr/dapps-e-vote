const VotingSystem = artifacts.require("VotingSystem");

module.exports = async function(deployer) {
  // Deploy the contract
  await deployer.deploy(VotingSystem);
};