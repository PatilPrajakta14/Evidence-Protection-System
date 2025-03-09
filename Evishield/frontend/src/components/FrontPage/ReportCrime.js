import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReportCrime.css";
import { LoginContext } from "../../context/loginContext";
const useMyVariable = () => useContext(LoginContext);

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwYzJmOTU3Mi1hMmZjLTQ3NzQtYThmMS1kNzQ1YmJjODE1MzMiLCJlbWFpbCI6ImF2aW5hc2h2aTI3NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDkzOGY3NDVlZGExNjgyNmRhYjUiLCJzY29wZWRLZXlTZWNyZXQiOiI2NTBhMjM4Y2U1YjBkOGY1NDRmNjQ4MThkY2I0YWI4YmU0MTU3MTJmYjU1MzUxOWJjOWU2Yjg4M2E2MjE4YWNkIiwiaWF0IjoxNzA4MzE3ODEyfQ.On6oUAvkDbZAnwM6SI-tWUoearXM4BiR-YgsNl8qcEU";

export default function ReportCrime() {
  const [isConnected, setIsConnected] = useState(false);
  const {login ,setLogin}=useMyVariable();
  const [evidences, setEvidences] = useState([]);
  const navigate = useNavigate();
  const [location, setLocation] = useState(""); // New state for location
  const [name, setName] = useState(""); // New state for name
  const [additionalInfo, setAdditionalInfo] = useState(""); // New state for additional information
  const [policeStation, setPoliceStation] = useState(""); // New state for police station
  const [dateTime, setDateTime] = useState(""); // New state for date & time
  const [ipfsHash, setIpfsHash] = useState("");
  const [loading, setLoading] = useState(false);

  // Create a new Date object
var currentDate = new Date();

// Get the current date and time
var dat = currentDate.getDate(); // Day of the month (1-31)
var month = currentDate.getMonth() + 1; // Month (0-11, so we add 1)
var year = currentDate.getFullYear(); // Full year (e.g., 2024)
var hours = currentDate.getHours(); // Hours (0-23)
var minutes = currentDate.getMinutes(); // Minutes (0-59)
var seconds = currentDate.getSeconds(); // Seconds (0-59)

// Format the date and time nicely
var date = dat + "-" + month + "-" + year;
var time = hours + ":" + minutes + ":" + seconds;



  const notifyA = (msg) => {
    toast.error(msg);
  };

  const notifyB = (msg) => {
    toast.success(msg);
  };

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      console.log("Non-ethereum browser detected. You should install Metamask");
    }
    return provider;
  };

  useEffect(() => {
    if (ipfsHash) {
      fetch("http://localhost:8080/registerCase", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipfsHash: ipfsHash,
        }),
      }).then(async (res) => {
        const data = await res.json();
        console.log("data is:", data);
        if (data.result) {
          notifyB("successfully posted your Case ID is ", data.result);
          navigate("/complainant");
        }
      });
    }
  }, [ipfsHash]);

  const handleLogin = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        notifyB("Metamask connected!!");
        setLogin(true)
        await axios.post("http://localhost:8080/login", { address });

        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      notifyA("Error connecting to MetaMask");
    }
  };

  const handleFileUpload = async () => {
    try {
      if (!location || !name || evidences.length === 0) {
        notifyA("Please select at least one file");
        return;
      }

      setLoading(true);
      const promises = evidences.map(async (file) => {
        const pinataOptions = JSON.stringify({
          cidVersion: 0,
          customName: file.name,
        });
        const pinataMetadata = JSON.stringify({ name: file.name });
        const formData = new FormData();
        formData.append("file", file);
        formData.append("pinataMetadata", pinataMetadata);
        formData.append("pinataOptions", pinataOptions);

        const res = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            maxBodyLength: "Infinity",
            headers: {
              "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
              Authorization: `Bearer ${JWT}`,
            },
          }
        );

        return { name: file.name, ipfsHash: res.data.IpfsHash }; // Return name and IPFS hash
      });

      // Wait for all uploads to finish
      const uploadedFiles = await Promise.all(promises);

      // Create JSON object with all details
      const crimeDetails = {
        location,
        name,
        evidences: uploadedFiles, // Array of objects containing name and IPFS hash
        date:date,
        time:time,
      };

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        crimeDetails,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      setIpfsHash(response.data.IpfsHash);
      console.log("IPFS Hash of JSON file:", response.data.IpfsHash); // Print IPFS hash on console
      notifyB("Files uploaded successfully to IPFS");

      setLoading(false);
    } catch (error) {
      console.error(error);
      notifyA("Error uploading files to IPFS");
      setLoading(false);
    }
  };


  const removeEvidence = (index) => {
    const newEvidences = [...evidences];
    newEvidences.splice(index, 1);
    setEvidences(newEvidences);
  };

  const renderEvidenceList = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {evidences.map((file, index) => (
          <div key={index} style={{ marginRight: '10px' }}>
            <span>{file.name}</span>{" "}
            <button onClick={() => removeEvidence(index)} className="close-button">&#10006;</button>
          </div>
        ))}
      </div>
    );
  };

  const handleLogout = () => {
    setIsConnected(false);
  };

  return (
    <div className="reportCrime">
        <div className="input">
          {!isConnected ? (
            <div className="style">
            <p style={{color: '#5c48ee', fontSize: '25px'}}><strong>Steps for reporting a crime</strong></p>
            <br></br>
            <ol className="olprop">
              <li>Log in with your Metamask account.</li>
              <li>Enter the details of the crime.</li>
              <li>Upload any evidence related to the incident.</li>
              <li>Once the details are entered, the case is registered with the authorities.</li>
              <li>You can log in to track the progress of your case.</li>
            </ol>
            <br></br>
            <br></br>
            <button onClick={handleLogin} className="link button">Login with MetaMask</button>
          </div>
          ) : (
            <>
              <div className="details"> 
                <label>Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <br></br>
                <label>Location of Incident</label>
                <input
                  type="text"
                  placeholder="Location of Incident"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                <br></br>
                <br></br>
                <label>Select Evidences</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    setEvidences([...evidences, ...e.target.files])
                  }
                  required
                />
                {renderEvidenceList()}
              </div>
              <div>
              </div>
              <button onClick={handleFileUpload} className="link button" disabled={loading}>
                  {loading ? "Uploading..." : "Upload Evidence"}
                </button>
                {/* <br></br> */}
              {/* <button onClick={handleLogout} className="link button">Logout</button> */}
            </>
          )}
        </div>
    </div>
  );
}
