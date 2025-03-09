import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwYzJmOTU3Mi1hMmZjLTQ3NzQtYThmMS1kNzQ1YmJjODE1MzMiLCJlbWFpbCI6ImF2aW5hc2h2aTI3NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDkzOGY3NDVlZGExNjgyNmRhYjUiLCJzY29wZWRLZXlTZWNyZXQiOiI2NTBhMjM4Y2U1YjBkOGY1NDRmNjQ4MThkY2I0YWI4YmU0MTU3MTJmYjU1MzUxOWJjOWU2Yjg4M2E2MjE4YWNkIiwiaWF0IjoxNzA4MzE3ODEyfQ.On6oUAvkDbZAnwM6SI-tWUoearXM4BiR-YgsNl8qcEU";

const notifyA = (msg) => {
  toast.error(msg);
};

const notifyB = (msg) => {
  toast.success(msg);
};

async function getComplaintDetails(caseID) {
  try {
    const res = await fetch("http://localhost:8080/retrieveJSON", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseID: caseID,
      }),
    });
    const data = await res.json();
    console.log("data here is:", data);
    return data;
  } catch (error) {
    console.log("error occurred in getComplaintDetails");
    throw error;
  }
}

async function getUploadedEvidences(caseID) {
  try {
    const res = await fetch(
      "http://localhost:8080/getComplainantUploadedEvidences",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseID: caseID,
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error occurred in getUploadedEvidences:", error);
    throw error;
  }
}

export default function Complainant() {
  const [caseIDs, setCaseIDs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [uploadedEvidences, setUploadedEvidences] = useState([]);
  const [Document, setDocument] = useState();
  const Navigate = useNavigate();
  const [caseid, setcaseid] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [resultantEvidences, setResultantEvidences] = useState([]);

  useEffect(() => {
    if (ipfsHash) {
      fetch("http://localhost:8080/uploadComplainantEvidence", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseID: caseid,
          ipfsHash: ipfsHash,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.error) {
            console.log("error occured");
          } else {
            console.log("data is:", data);

            notifyB("successfully posted", data);
            window.location.reload();
          }
        })
        .catch((error) => {
          notifyA("error occured", error);
        });
    }
  }, [ipfsHash]);
  const postDetails = async (index) => {
    try {
      const formData = new FormData();
      formData.append("file", Document);

      const pinataMetadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      });
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
      if (res.data.IpfsHash) {
        notifyB("successfully ipfsHash generated ", ipfsHash);
        setcaseid(index);
        setIpfsHash(res.data.IpfsHash);
      }
    } catch (error) {
      console.log("error occurred", error);
      throw error;
    }
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:8080/getComplainantCaseIds",
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCaseIDs(data.result);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchComplaintDetails() {
      const details = await Promise.all(
        caseIDs.map(async (caseID) => {
          try {
            const complaintDetail = await getComplaintDetails(caseID);
            console.log("complaint details", complaintDetail);
            return complaintDetail; // Make sure to return the detail
          } catch (error) {
            console.error(
              "Error fetching complaint details for case ID:",
              caseID,
              error
            );
            return null;
          }
        })
      );
      setComplaints(details.filter(Boolean));
    }
    if (caseIDs.length > 0) {
      fetchComplaintDetails();
    }
  }, [caseIDs]);
  let resultant = [];
  useEffect(() => {
    async function fetchUploadedEvidences() {
      const evidences = [];
      if (caseIDs && caseIDs.length > 0) {
       
        for (let i = 0; i < caseIDs.length; i++) {
          try {
            const uploadedEvidence = await getUploadedEvidences(caseIDs[i]); // Fix the index
            // console.log("uploaded evidence:", uploadedEvidence);
            evidences.push(uploadedEvidence);
          } catch (error) {
            console.error(
              "Error retrieving uploaded evidence for case ID:",
              caseIDs[i],
              error
            );
          }
        }
        setUploadedEvidences(evidences);
        console.log(evidences);
        // console.log(uploadedEvidences[0].result)
        resultant = evidences;
        console.log(resultant.length);
      }
    }
    fetchUploadedEvidences();
  }, [caseIDs]);

  return (
    <div className="viewComplaints">
      {complaints.length > 0 && (
        <>
          <h1>Registered Cases</h1>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-secondary">
                <tr>
                  <th scope="col">CaseId</th>
                  <th scope="col">Location</th>
                  <th scope="col">Complainant Name</th>
                  <th scope="col">Evidences</th>
                  <th scope="col">Date</th>
                  <th scope="col">Time</th>
                  <th scope="col">Upload New Evidences</th>
                  <th scope="col">Uploaded Evidences</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((result, index) => (
                  <tr key={index}>
                    <td>{caseIDs[index]}</td>
                    <td>{result && result.res && result.res.location}</td>
                    <td>{result && result.res && result.res.name}</td>
                    <td>
                      {result &&
                        result.res &&
                        result.res.evidences &&
                        result.res.evidences.map((data, idx) => (
                          <Link
                            key={idx}
                            to={`https://gateway.pinata.cloud/ipfs/${data.ipfsHash}`}
                          >
                            <button className="view-document-button">
                              Evidence {idx + 1}
                              <span role="img" aria-label="View Document">
                                {" "}
                              </span>
                            </button>
                            <br />
                          </Link>
                        ))}
                    </td>

                    <td>{result && result.res && result.res.date}</td>
                    <td>{result && result.res && result.res.time}</td>
                    <td>
                      <div
                        className="uploadDocuments"
                        style={{ alignItem: "center" }}
                      >
                        <div className="fieldForUpload">
                          <input
                            type="file"
                            onChange={(event) => {
                              setDocument(event.target.files[0]);
                            }}
                          />
                          <button
                            className="button"
                            onClick={() => {
                              if (Document) {
                                postDetails(caseIDs[index]);
                              } else {
                                notifyA("No file selected");
                              }
                            }}
                          >
                            {Document ? "upload" : "select"}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      {uploadedEvidences.length > 0 ? (
                        <>
                          {uploadedEvidences[index].result.map((evidence, idx) => (
                            evidence && evidence.trim() !== "" &&
                            (<Link
                              key={idx}
                              to={`https://gateway.pinata.cloud/ipfs/${evidence}`}
                            >
                              <button className="view-document-button">
                                New Evidence {idx }
                                <span role="img" aria-label="View Document">
                                  {" "}
                                </span>
                              </button>
                              <br />
                            </Link>)
                          ))}
                        </>
                      ) : (
                        <>{uploadedEvidences.length}</>
                      )}

                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <button
        onClick={() => {
          Navigate("/complainantPage");
        }}
      >
        Back
      </button>
    </div>
  );
}
