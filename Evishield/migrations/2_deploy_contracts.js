const CaseManagement = artifacts.require("CaseManagement");

module.exports = function(deployer) {
  deployer.deploy(CaseManagement);
  
};
