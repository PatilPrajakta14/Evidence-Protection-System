import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./UploadLabReport.css";

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwYzJmOTU3Mi1hMmZjLTQ3NzQtYThmMS1kNzQ1YmJjODE1MzMiLCJlbWFpbCI6ImF2aW5hc2h2aTI3NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMDkzOGY3NDVlZGExNjgyNmRhYjUiLCJzY29wZWRLZXlTZWNyZXQiOiI2NTBhMjM4Y2U1YjBkOGY1NDRmNjQ4MThkY2I0YWI4YmU0MTU3MTJmYjU1MzUxOWJjOWU2Yjg4M2E2MjE4YWNkIiwiaWF0IjoxNzA4MzE3ODEyfQ.On6oUAvkDbZAnwM6SI-tWUoearXM4BiR-YgsNl8qcEU";

const notifyA = (msg) => {
  toast.error(msg);
};

const notifyB = (msg) => {
  toast.success(msg);
};

async function getUploadedReport(caseID) {
  try {
    const res = await fetch("http://localhost:8080/getLabReports", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseID: caseID,
      }),
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log("error occurred in getPoliceReport:", error);
    throw error;
  }
}

export default function UploadReportLab() {
  const [CaseIDs, setCaseIDs] = useState([]);
  const [Document, setDocument] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [caseid, setcaseid] = useState("");
  const [uploadedReport, setUploadedReport] = useState([]);

  useEffect(() => {
    async function fetchUploadedEvidences() {
      const evidences = [];
      for (let i = 0; i < CaseIDs.length; i++) {
        try {
          const uploadedEvidence = await getUploadedReport(i + 1);
          console.log("uploaded evidence:", uploadedEvidence.result);
          evidences.push(uploadedEvidence.result);
        } catch (error) {
          console.error(
            "Error fetching uploaded evidence for case ID:",
            CaseIDs[i],
            error
          );
        }
      }
      setUploadedReport(evidences);
      console.log("uploaded reports are :", uploadedReport);
    }
    if (CaseIDs.length > 0) {
      fetchUploadedEvidences();
    }
  }, [CaseIDs]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/getAllCaseIds", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data);
        setCaseIDs(data.result);
      } catch (error) {
        console.log(error);
        throw error;
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (ipfsHash) {
      fetch("http://localhost:8080/uploadReport", {
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

  return (
    <div className="uploadReport">
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-secondary">
            <tr>
              <th scope="col">CaseId</th>
              <th scope="col">Upload Lab Report</th>
              <th scope="col">Uploaded Lab Reports </th>
            </tr>
          </thead>
          <tbody>
            {CaseIDs.map((caseID, index) => (
              <tr key={index}>
                <td>{caseID}</td>
                <td>
                  <div className="uploadDocuments" style={{alignItem:"center"}}>
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
                            postDetails(caseID);
                          }
                          else{
                            notifyA("No file selected")
                          }
                        }}
                      >
                        {Document ? "upload" : "select"}
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  {uploadedReport && uploadedReport[index] && (
                    <Link
                      to={`https://gateway.pinata.cloud/ipfs/${uploadedReport[index]}`}
                    >
                      {uploadedReport[index] ==
                      "No lab reports available for this case." ? (
                        <></>
                      ) : (
                        <>
                          <button className="view-document-button">
                            Lab Report
                            
                          </button>
                        </>
                      )}
                      <br />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
