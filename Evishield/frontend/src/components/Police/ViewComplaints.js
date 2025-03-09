import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "./ViewComplaints.css";

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
    return data;
  } catch (error) {
    console.log("error occurred in getComplaintDetails");
    throw error;
  }
}

async function getUploadedEvidences(caseID) {
  try {
    const res = await fetch("http://localhost:8080/retrieveEvidences", {
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
    console.log("error occurred in getUploadedEvidences:", error);
    throw error;
  }
}
async function getPoliceReport(caseID) {
  try {
    const res = await fetch("http://localhost:8080/retrievePoliceReport", {
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

export default function ViewComplaints() {
  const [caseIDs, setCaseIDs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [ipfsHash, setIpfsHash] = useState("");
  const [caseid, setcaseid] = useState("");
  const [Document, setDocument] = useState("");
  const [uploadedEvidences, setUploadedEvidences] = useState([]);
  const [uploadedReport, setUploadedReport] = useState([]);
  const [reportIpfsHash, setReportIpfsHash] = useState("");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8080/getAllCaseIds", {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      });
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

  useEffect(() => {
    async function fetchUploadedEvidences() {
      const evidences = [];
      for (let i = 0; i < caseIDs.length; i++) {
        try {
          const uploadedEvidence = await getUploadedEvidences(i + 1);
          console.log("uploaded evidence:", uploadedEvidence);
          evidences.push(uploadedEvidence);
        } catch (error) {
          console.error(
            "Error fetching uploaded evidence for case ID:",
            caseIDs[i],
            error
          );
        }
      }
      setUploadedEvidences(evidences);
    }
    if (caseIDs.length > 0) {
      fetchUploadedEvidences();
    }
  }, [caseIDs]);
  useEffect(() => {
    async function fetchUploadedEvidences() {
      const evidences = [];
      for (let i = 0; i < caseIDs.length; i++) {
        try {
          const uploadedEvidence = await getPoliceReport(i + 1);
          console.log("uploaded evidence:", uploadedEvidence);
          evidences.push(uploadedEvidence);
        } catch (error) {
          console.error(
            "Error fetching uploaded evidence for case ID:",
            caseIDs[i],
            error
          );
        }
      }
      setUploadedReport(evidences);
      console.log("uploaded reports are :", uploadedReport);
    }
    if (caseIDs.length > 0) {
      fetchUploadedEvidences();
    }
  }, [caseIDs]);

  useEffect(() => {
    if (ipfsHash) {
      fetch("http://localhost:8080/addEvidence", {
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
          console.log("data is:", data);
          if (data) {
            notifyB("successfully posted", data);
            window.location.reload();
          }
        })
        .catch((error) => {
          notifyA("error occured", error);
        });
    }
  }, [ipfsHash]);

  useEffect(() => {
    if (reportIpfsHash) {
      fetch("http://localhost:8080/addPoliceReport", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseID: caseid,
          ipfsHash: reportIpfsHash,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (data.error) {
            console.log(data.error);
          }
          {
            console.log("data is:", data);
            notifyB("successfully added", data);
            window.location.reload();
          }
        })
        .catch((error) => {
          notifyA("error occured", error);
        });
    }
  }, [reportIpfsHash]);

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
  const postReportDetails = async (index) => {
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
        notifyB("successfully ipfsHash generated ", res.data.ipfsHash);
        setcaseid(index);
        setReportIpfsHash(res.data.IpfsHash);
      }
    } catch (error) {
      console.log("error occurred", error);
      throw error;
    }
  };
  return (
    <div className="viewComplaints">
      {complaints.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-align-middle">
            <thead className="table-secondary table align-top">
              <tr>
                <th scope="col" className="table-heading">
                  CaseId
                </th>
                <th scope="col" className="table-heading">
                  Location
                </th>
                <th scope="col" className="table-heading">
                  Complainant Name
                </th>
                <th scope="col" className="table-heading">
                  Evidences
                </th>
                <th scope="col" className="table-heading">
                  Add Evidences
                </th>
                <th scope="col" className="table-heading">
                  Uploaded Evidences
                </th>
                <th scope="col" className="table-heading">
                  Add Investigation Report
                </th>
                <th scope="col" className="table-heading">
                  Investigation Report
                </th>
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
                        </Link>
                      ))}
                  </td>
                  <td>
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
                          postDetails(index + 1);
                        }
                      }}
                    >
                      {Document ? "upload" : "select"}
                    </button>
                  </td>
                  <td>
                    {uploadedEvidences[index] &&
                      uploadedEvidences[index].res.map((evidence, idx) => (
                        <Link
                          key={idx}
                          to={`https://gateway.pinata.cloud/ipfs/${evidence}`}
                        >
                          <button className="view-document-button">
                            Evidence {idx + 1}
                            <span role="img" aria-label="View Document">
                              {" "}
                            </span>
                          </button>
                        </Link>
                      ))}
                  </td>
                  <td>
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
                          postReportDetails(index + 1);
                        }
                      }}
                    >
                      {Document ? "upload" : "select"}
                    </button>
                  </td>
                  <td>
                    {uploadedReport[index] && uploadedReport[index].res && (
                      <Link
                        to={`https://gateway.pinata.cloud/ipfs/${uploadedReport[index].res}`}
                      >
                        <button className="view-document-button">
                          Report
                          <span role="img" aria-label="View Document">
                            {" "}
                          </span>
                        </button>

                        <br />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  //   return (
  //     <div className="viewComplaints" >
  //       {complaints.length > 0 && (
  //         <div className="table table-bordered">
  //           <table className="table" class="table table-hover table-responsive table align-middle table-sm">
  //             <thead class="table align-middle table-dark">
  //               <tr>
  //                 <th scope="col">Case Id</th>
  //                 <th scope="col">Location of Incident</th>
  //                 <th scope="col">Complainant Name</th>
  //                 <th scope="col">Evidences</th>
  //                 <th scope="col">Add Evidence Document</th>
  //                 <th scope="col">Uploaded Evidences</th>
  //                 <th scope="col">Add Investigation Report</th>
  //                 <th scope="col">Investigation Reports</th>

  //               </tr>
  //             </thead>
  //             <tbody>
  //               {complaints.map((result, index) => (
  //                 <tr key={index}>
  //                   <td>{caseIDs[index]}</td>
  //                   <td>{result && result.res && result.res.location}</td>
  //                   <td>{result && result.res && result.res.name}</td>
  //                   <td>
  //                     {result &&
  //                       result.res &&
  //                       result.res.evidences &&
  //                       result.res.evidences.map((data, index) => (
  //                         <Link
  //                           key={index}
  //                           to={`https://gateway.pinata.cloud/ipfs/${data.ipfsHash}`}
  //                         >
  //                           Evidence {index + 1}
  //                           <br />
  //                         </Link>
  //                       ))}
  //                   </td>
  //                   <td>
  //                     {/* <div className="uploadDocuments"> */}
  //                       {/* <div className="fieldForUpload"> */}
  //                         <input
  //                           type="file"
  //                           onChange={(event) => {
  //                             setDocument(event.target.files[0]);
  //                           }}
  //                         />
  //                         <button
  //                           className="btn btn-primary"
  //                           onClick={() => {
  //                             postDetails(index + 1);
  //                           }}
  //                         >
  //                           Submit
  //                         </button>
  //                       {/* </div> */}
  //                     {/* </div> */}
  //                   </td>
  //                   <td>
  //                     {uploadedEvidences[index] &&
  //                       uploadedEvidences[index].res.map((evidence, idx) => (
  //                         <Link
  //                           key={idx}
  //                           to={`https://gateway.pinata.cloud/ipfs/${evidence}`}
  //                         >
  //                           Uploaded Evidence {idx + 1}
  //                           <br />
  //                         </Link>
  //                       ))}
  //                   </td>
  //                   <td>
  //                   <div className="uploadDocuments">
  //                       <div className="fieldForUpload">
  //                         <input
  //                           type="file"
  //                           onChange={(event) => {
  //                             setDocument(event.target.files[0]);
  //                           }}
  //                         />
  //                         <button
  //                           className="btn btn-primary"
  //                           onClick={() => {
  //                             postReportDetails(index + 1);
  //                           }}
  //                         >
  //                           Submit
  //                         </button>
  //                       </div>
  //                     </div>
  //                   </td>
  //                   <td>
  //                   {uploadedReport[index] && uploadedReport[index].res &&
  //                         (
  //                         <Link

  //                           to={`https://gateway.pinata.cloud/ipfs/${uploadedReport[index].res}`}
  //                         >
  //                           uploaded Report
  //                           <br />
  //                         </Link>
  //                         )
  //                       }
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   );
}
