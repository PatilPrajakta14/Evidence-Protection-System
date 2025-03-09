const Web3 = require("web3").default;
const CaseManagement = require("./build/contracts/CaseManagement.json");
require("dotenv").config();
const axios = require("axios");



const init = async () => {
  const web3 = new Web3("http://127.0.0.1:7545");
  const id = await web3.eth.net.getId();
  const deployedNetwork = CaseManagement.networks[id];
  const contract = new web3.eth.Contract(
    CaseManagement.abi,
    deployedNetwork.address
  );

  const senderAddress = process.env.senderAddress;
  const policeAddress = process.env.policeAddress;
  const hospitalAddress = process.env.hospitalAddress;
  const labAddress = process.env.labAddress;
  const courtAddress = process.env.courtAddress;

  async function addPolice(policeAddress) {
    const owner = senderAddress;
    try {
      const result = await contract.methods
        .addPolice(policeAddress)
        .send({ from: owner });
      console.log("Police added successfully:", result);
    } catch (error) {
      console.error("Error adding police:", error);
    }
  }

  addPolice(policeAddress);

  async function registerCase(ipfsHash,senderAddress) {
    const accounts = await web3.eth.getAccounts();
    try {
      const result = await contract.methods
        .registerCase(ipfsHash,senderAddress)
        .send({ from: senderAddress, gas: 5000000 });
      console.log("Case registered successfully:", result);
      return result;
    } catch (error) {
      console.error("Error registering case:", error);
      return error;
    }
  }
  // const result=await registerCase('avinashvireshjadhav')
  // console.log(result)

  async function addHospital() {
    try {
      const result = await contract.methods
        .addHospital(hospitalAddress)
        .send({ from: senderAddress });
      console.log("Hospital added successfully:", result);
    } catch (error) {
      console.error("Error adding hospital:", error);
    }
  }

  addHospital(hospitalAddress)

  async function addLab() {
    try {
      const result = await contract.methods
        .addLab(labAddress)
        .send({ from: senderAddress });
      console.log("Laboratory added successfully:", result);
    } catch (error) {
      console.error("Error adding laboratory:", error);
    }
  }

  addLab(labAddress)

  async function addCourt() {
    try {
      const result = await contract.methods
        .addCourt(courtAddress)
        .send({ from: senderAddress });
      console.log("Court added successfully:", result);
    } catch (error) {
      console.error("Error adding court:", error);
    }
  }
  addCourt(courtAddress)

  async function addEvidence(caseID, ipfsHash) {
    try {
      const result = await contract.methods
        .mapEvidence(caseID, ipfsHash)
        .send({ from: policeAddress, gas: 5000000 });
      console.log("Evidence added successfully:", result);
    } catch (error) {
      console.error("Error adding evidence:", error);
    }
  }

  async function retrieveIpfsHashes(caseID) {
    try {
      const ipfsHashes = await contract.methods
        .getIpfsHashes(caseID)
        .call({ from: policeAddress });
      console.log("IPFS hashes for case " + caseID + ":", ipfsHashes);
      return ipfsHashes;
    } catch (error) {
      console.error("Error retrieving IPFS hashes:", error);
    }
  }
  

  async function uploadReport(caseID, ipfsHash) {
    const accounts = await web3.eth.getAccounts();

    try {
      const result = await contract.methods
        .uploadLabReport(caseID, ipfsHash)
        .send({ from: labAddress });
      console.log("Lab report uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading lab report:", error);
    }
  }
};

init();
