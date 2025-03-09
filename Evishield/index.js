const express = require("express");
const Web3 = require("web3").default;
const CaseManagement = require("./build/contracts/CaseManagement.json");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const port = 8080;
const axios = require("axios");


let user="";

let senderAddress=process.env.senderAddress;
const labAddress=process.env.labAddress;
const policeAddress = process.env.policeAddress;
const hospitalAddress=process.env.hospitalAddress;
const courtAddress=process.env.courtAddress;

const web3 = new Web3("http://127.0.0.1:7545");
const contractSchema=async()=>{
  const id = await web3.eth.net.getId();
  const deployedNetwork = CaseManagement.networks[id];
  const contract = new web3.eth.Contract(
    CaseManagement.abi,
    deployedNetwork.address
  );
  return contract;
}

function stringifyBigInts(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

async function registerCase(ipfsHash,senderAddress) {
  const contract=await contractSchema();
  try {
    const result = await contract.methods
      .registerCase(ipfsHash,senderAddress)
      .send({ from: senderAddress, gas: 5000000 });
    console.log("Case registered successfully:", result);
    return result;
  } catch (error) {
    console.error("Error registering case:", error);
    throw error;
  }
}

app.post("/registerCase", async (req, res) => {
  const { ipfsHash } = req.body;
  try {
    const result = await registerCase(ipfsHash,senderAddress);
    const resultStringified = stringifyBigInts(result);

    res
      .status(200)
      .json({
        result: resultStringified.events.EvidenceMapped.returnValues.caseID,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addEvidence(caseID, ipfsHash) {
  const contract=await contractSchema();

  try {
    const result = await contract.methods
      .mapEvidence(caseID, ipfsHash)
      .send({ from: policeAddress, gas: 5000000 });
    
    
    console.log("Evidence added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding evidence:", error);
    throw error;
  }
}

async function uploadComplainantEvidence(caseID,ipfsHash){
  const contract=await contractSchema();
  try{
    const result=await contract.methods.uploadComplainantEvidence(caseID,ipfsHash).send({from:senderAddress,gas:5000000})
    console.log("Complainant added Successfully",result)
    return result;
  }
  catch(error){
    console.error("Error adding Complainant Evidence",error);
    throw error;
  }
}

async function uploadPoliceReport(caseID,ipfsHash){
  const contract =await contractSchema();
  try{
    const result=await contract.methods.uploadPoliceReport(caseID,ipfsHash).send({from:policeAddress,gas:5000000})
    console.log("Report added Successfully",result)
    return result;
  }
  catch(error){
    console.error("Error adding Report",error);
    throw error;
  }
}

async function getComplainantUploadedEvidences(caseID){
  const contract =await contractSchema();
  try{
    const result=await contract.methods.getComplainantUploadedEvidences(caseID).call({from:senderAddress})
    console.log("Retrieved complainant evidences",result)
    return result;
  }
  catch(error){
    console.error("Error retrieving evidences",error);
    throw error;
  }
}

app.post("/getComplainantUploadedEvidences",async(req,res)=>{
  const {caseID,ipfsHash}=req.body;
  try {
    const result = await getComplainantUploadedEvidences(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);
    
    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post("/addPoliceReport",async (req,res)=>{
  const { caseID, ipfsHash } = req.body;
  try {
    const result = await uploadPoliceReport(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);
    
    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.post("/uploadComplainantEvidence",async(req,res)=>{
  const {caseID,ipfsHash}=req.body;
  try {
    const result = await uploadComplainantEvidence(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);
    
    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.post("/addEvidence", async (req, res) => {
  const { caseID, ipfsHash } = req.body;
  try {
    const result = await addEvidence(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);
    
    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function getJsonHash(caseID) {
  const contract=await contractSchema();
  try {
    const ipfsHashes = await contract.methods
      .getJsonHash(caseID)
      .call();
    console.log("IPFS hashes for case Json " + caseID + ":", ipfsHashes);
    return ipfsHashes;
  } catch (error) {
    console.error("Error retrieving IPFS hashes:", error);
    throw error;
  }
}

app.post("/retrieveJSON",async(req,res)=>{
  const { caseID } = req.body;
  try {
    await (getJsonHash(caseID)).then((result)=>{
      try{
        const ipfsHash = result; 
      
        const gatewayUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
      
        axios
          .get(gatewayUrl)
          .then((response) => {
            const data = response.data;
            return res.status(200).json({res:data});
          })
          .catch((error) => {
            return res.status(500).json({error:"error Occured : "+error});
          }); 
    }
  
  
    catch(error){
      res.status(500).json({error:error.message});
    }

    })
  } catch (error) {
    return res.status(500).json({ error: "this error is sent: "+error.message });
  }
  
  
})

app.post("/retrieveEvidences",async(req,res)=>{
  const { caseID } = req.body;
  let result;
  try {
    result = await (retrieveIpfsHashes(caseID)).then((result)=>{
      console.log("Result is:",result);
      try{
        const respond=[];
        for(let i=1;i<result.length;i++){
          const pinataHash = result[i]
          console.log("result ",i, " " ,pinataHash)
          respond.push(pinataHash);
        } 
        return res.status(200).json({res:respond});
    }
    catch(error){
      res.status(500).json({error:error.message});
    }

    })
  } catch (error) {
    return res.status(500).json({ error: "this error is sent: "+error.message });
  }
})
app.post("/retrievePoliceReport",async(req,res)=>{
  const { caseID } = req.body;
  let result;
  try {
    result = await (getPoliceReport(caseID)).then((result)=>{
      console.log("Result is:",result);
      try{
        return res.status(200).json({res:result});
    }
    catch(error){
      res.status(500).json({error:error.message});
    }

    })
  } catch (error) {
    return res.status(500).json({ error: "this error is sent: "+error.message });
  }
})




async function retrieveIpfsHashes(caseID) {
  const contract=await contractSchema();
  try {
    const ipfsHashes = await contract.methods
      .getIpfsHashes(caseID)
      .call({ from: policeAddress });
    console.log("IPFS hashes for case " + caseID + ":", ipfsHashes);
    return ipfsHashes;
  } catch (error) {
    console.error("Error retrieving IPFS hashes:", error);
    throw error;
  }
}
async function getPoliceReport(caseID) {
  const contract=await contractSchema();
  try {
    const ipfsHashes = await contract.methods
      .getPoliceReport(caseID)
      .call({ from: policeAddress });
    console.log("IPFS hashes for case " + caseID + ":", ipfsHashes);
    return ipfsHashes;
  } catch (error) {
    console.error("Error retrieving IPFS hashes:", error);
    throw error;
  }
}

async function getPoliceEvidences(caseID){
  const contract=await contractSchema();
  try{
    const ipfsHashes=await contract.methods.getPoliceUploadedEvidences(caseID).call({from:policeAddress});
    return ipfsHashes;
  } catch (error) {
    console.error("Error retrieving IPFS hashes:", error);
    throw error;
  }
}

app.post("/getPoliceEvidences",(req,res)=>{
  const {caseID}=req.body;
  try{
    getPoliceEvidences(caseID).then(result=>{
      const resultStringified=stringifyBigInts(result);
      return res.status(200).json({result:resultStringified});
    }).catch(error=>{
      console.log("Error:",error);
      return res.status(500).json({error:error});
    })
  }
  catch(error){
    return res.status(500).json({error:error})
  }
})



// for hospital feedback
async function provideHospitalFeedback(caseID,ipfsHash) {
  const contract=await contractSchema();
  try {
      const result = await contract.methods.provideHospitalFeedback(caseID, ipfsHash).send({ from: hospitalAddress, gas: 5000000});
      console.log('Hospital Feedback report uploaded successfully:', result);
      return result;
  } catch (error) {
      console.error('Error uploading Hospital Feedback report:', error);
      throw error;
  }
}


app.post("/uploadHospitalReport", async (req, res) => {
  const { caseID, ipfsHash } = req.body;
  try {
    const result = await provideHospitalFeedback(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);

    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function uploadReport(caseID,ipfsHash) {
  const contract=await contractSchema();
  try {
      const result = await contract.methods.uploadLabReport(caseID, ipfsHash).send({ from: labAddress, gas: 5000000});
      console.log('Lab report uploaded successfully:', result);
      return result;
  } catch (error) {
      console.error('Error uploading lab report:', error);
      throw error;
  }
}

app.post("/uploadReport", async (req, res) => {
  const { caseID, ipfsHash } = req.body;
  try {
    const result = await uploadReport(caseID, ipfsHash);
    const resultStringified = stringifyBigInts(result);

    res.status(200).json({ result: resultStringified });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addLab() {
  const contract=await contractSchema();
  try {
    const result = await contract.methods
      .addLab(labAddress)
      .send({ from: senderAddress });
    console.log("Laboratory added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding laboratory:", error);
    throw error;
  }
}

app.post("/addLab",async(req,res)=>{
  try{
    const result=await addLab();
    const resultStringified=stringifyBigInts(result);
    res.status(200).json({result:resultStringified});
  } catch(error){
    res.status(500).json({error:error.message});
  }
})

async function  checkUser(senderAddress) {
  const contract=await contractSchema();
  try {
    const result = await contract.methods
      .getUserRole(senderAddress).call();
      
      user=result;
    console.log("user is", user);
    return result;
  } catch (error) {
    console.error("error occured", error);
    throw error;
  }
}
app.post("/login", (req, res) => {
  const { address } = req.body;
  senderAddress=address;
  console.log("Received address:", senderAddress); // Print the received address on the console
  try{
    checkUser(address);
    return res.status(200).json({result:user});
  }
  catch(error){
    return res.status(500).json({error:error.message});
  }
});

async function getAllCaseIds(){
  const contract = await contractSchema();
  return new Promise(async (resolve, reject) => {
    try {
      const result = await contract.methods.getAllCaseIDs().call();
      console.log("Case ID's are", result);
      resolve(result);
      return result;
    } catch (error) {
      console.error("Error getting all case IDs:", error);
      reject(error);
    }
  });
}

app.get("/getAllCaseIds",(req,res)=>{
  try{
    getAllCaseIds().then(result => {
      const resultStringified=stringifyBigInts(result);
      return res.status(200).json({result:resultStringified});
    })
    .catch(error => {
      // Handle error here
      console.error("Error:", error);
      return res.status(500).json({error:error});
    });
  }
  catch(error){
    return res.status(500).json({error:error});
  } 
})

async function getComplainantCaseIds(){
  const contract= await contractSchema();
  return new Promise(async(resolve,reject)=>{
    try{
      const result=await contract.methods.getCasesForComplainant(senderAddress).call();
      resolve(result);
      return result;
    }
    catch(error){
      console.error("Error getting all case IDs:", error);
      reject(error);
    }
  })
}

app.get("/getComplainantCaseIds",(req,res)=>{
  try{
    getComplainantCaseIds().then(result=>{
      const resultStringified=stringifyBigInts(result);
      return res.status(200).json({result:resultStringified});
    }).catch(error=>{
      // Handle error here
      console.error("Error:", error);
      return res.status(500).json({error:error});
    })
  }
  catch(error){
    return res.status(500).json({error:error});
  } 
})

async function getLabReports(caseID){
  const contract=await contractSchema();
  return new Promise(async(resolve,reject)=>{
    try{
      const result=await contract.methods.getLabReports(caseID).call({from:labAddress,gas:5000000})
      resolve(result);
      return result;
    }
    catch(error){
      console.error("Error while retriving Lab Reports: ",error);
      reject(error);
    }
  })
}

app.post("/getLabReports",(req,res)=>{
  const {caseID}=req.body;
  try{
    getLabReports(caseID).then(result=>{
      const resultStringified=stringifyBigInts(result);
      return res.status(200).json({result:resultStringified});
    }).catch(error=>{
      console.log("Error:",error);
      return res.status(500).json({error:error});
    })
  }
  catch(error){
    return res.status(500).json({error:error})
  }
})

async function getHospitalFeedback(caseID){
  const contract=await contractSchema();
  return new Promise(async(resolve,reject)=>{
    try{
      const result=await contract.methods.getHospitalFeedback(caseID).call({from:hospitalAddress,gas:5000000})
      resolve(result);
      return result;
    }
    catch(error){
      console.error("Error while retriving Hospital Reports: ",error);
      reject(error);
    }
  })
}

app.post("/getHospitalReports",(req,res)=>{
  const {caseID}=req.body;
  try{
    getHospitalFeedback(caseID).then(result=>{
      const resultStringified=stringifyBigInts(result);
      return res.status(200).json({result:resultStringified});
    }).catch(error=>{
      console.log("Error:",error);
      return res.status(500).json({error:error});
    })
  }
  catch(error){
    return res.status(500).json({error:error})
  }
})

async function getCaseStatus(caseID){
  const contract=await contractSchema();
  return new Promise(async(resolve,reject)=>{
    try{
      const result=await contract.methods.getCaseBooleans(caseID).call()
      resolve(result);
      return result;
    }
    catch(error){
      console.error("Error while retriving: ",error);
      reject(error);
    }
  })
}

app.post("/getCaseStatus",(req,res)=>{
  const {caseID}=req.body;
  try{
      getCaseStatus(caseID).then((result)=>{
      const resultStringified=stringifyBigInts(result);
      let sum=0;
      if(resultStringified.police===true){
        sum+=40;
        if(resultStringified.lab===true){
          sum+=30;
        }
        if(resultStringified.court===true){
          sum=100;
        }
      }
      console.log(sum)
      return res.status(200).json({result:sum});
    }).catch(error=>{
      console.log("Error:",error);
      return res.status(500).json({error:error});
    })
  }
  catch(error){
    return res.status(500).json({error:error})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

