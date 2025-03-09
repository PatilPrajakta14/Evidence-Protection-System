// eslint-disable-next-line no-undef
var EPB = artifacts.require("CaseManagement");

module.exports = async function deployed(deployer) {
  // deployment steps
  await deployer.deploy(EPB);
  const myContractInstance = await EPB.deployed();
  // store the contract address in a file or print it to the console
  console.log("MyContract deployed at address:", myContractInstance.address);
  return myContractInstance.address;
};