import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./CheckCases.css";



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
    console.log(data);
    return data;
  } catch (error) {
    console.log("error occurred in getComplaintDetails");
    throw error;
  }
}

async function getUploadedEvidencesComplainant(caseID) {
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

async function getUploadedReportLab(caseID) {
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
async function getUploadedReportHospital(caseID) {
  try {
    const res = await fetch("http://localhost:8080/getHospitalReports", {
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
    console.log("error occurred in get Hospital Reports:", error);
    throw error;
  }
}

export default function CheckCases() {
  const [caseIDs, setCaseIDs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  
  const [uploadedEvidences, setUploadedEvidences] = useState([]);
  const [uploadedEvidencesComplainant, setUploadedEvidencesComplainant] = useState([]);
  const [uploadedReport, setUploadedReport] = useState([]);
  
  const [uploadedReportLab, setUploadedReportLab] = useState([]);
  const [uploadedReportHospital, setUploadedReportHospital] = useState([]);
  

  useEffect(() => {
    async function fetchUploadedEvidences() {
      const evidences = [];
      for (let i = 0; i < caseIDs.length; i++) {
        try {
          const uploadedEvidence = await getUploadedReportHospital(i + 1);
          console.log("uploaded evidence:", uploadedEvidence.result);
          evidences.push(uploadedEvidence.result);
        } catch (error) {
          console.error(
            "Error fetching uploaded evidence for case ID:",
            caseIDs[i],
            error
          );
        }
      }
      setUploadedReportHospital(evidences);
      console.log("uploaded reports are :", uploadedReportHospital);
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
          const uploadedEvidence = await getUploadedReportLab(i + 1);
          console.log("uploaded evidence:", uploadedEvidence.result);
          evidences.push(uploadedEvidence.result);
        } catch (error) {
          console.error(
            "Error fetching uploaded evidence for case ID:",
            caseIDs[i],
            error
          );
        }
      }
      setUploadedReportLab(evidences);
      console.log("uploaded reports are :", uploadedReport);
    }
    if (caseIDs.length > 0) {
      fetchUploadedEvidences();
    }
  }, [caseIDs]);

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
    async function fetchUploadedEvidences() {
      const evidences = [];
      if (caseIDs && caseIDs.length > 0) {
       
        for (let i = 0; i < caseIDs.length; i++) {
          try {
            const uploadedEvidence = await getUploadedEvidencesComplainant(caseIDs[i]); // Fix the index
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
        setUploadedEvidencesComplainant(evidences);
        
      }
    }
    fetchUploadedEvidences();
  }, [caseIDs]);


  return (
    <div className="viewComplaints">
      <div className="table-responsive">
        {complaints.length > 0 && (
          <div className="table">
            <table className="table table-bordered table-hover table-align-middle">
              <thead className="table-secondary table align-top">
                <tr>
                  <th scope="col">CaseId</th>
                  <th scope="col">Location</th>
                  <th scope="col">Complainant Name</th>
                  <th scope="col">Evidences</th>
                  <th scope="col"> Police Evidences</th>
                  <th scope="col"> Investigation Reports</th>
                  <th scope="col"> Lab Reports</th>
                  <th scope="col"> Hospital Feedback</th>
                  <th scope="col"> Complainant's Later Uploaded</th>

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
                        result.res.evidences.map((data, index) => (
                          <Link
                            key={index}
                            to={`https://gateway.pinata.cloud/ipfs/${data.ipfsHash}`}
                          >
                            <button className="view-document-button">
                              Complainant Evidence {index + 1}
                              <span role="img" aria-label="View Document">
                                {" "}
                                
                              </span>
                            </button>
                            <br />
                            <br />
                          </Link>
                        ))}
                    </td>

                    <td>
                      {uploadedEvidences[index] &&
                        uploadedEvidences[index].res.map((evidence, idx) => (
                          <Link
                            key={idx}
                            to={`https://gateway.pinata.cloud/ipfs/${evidence}`}
                          >
                            <button className="view-document-button">
                              Police Evidence {idx + 1}
                              <span role="img" aria-label="View Document">
                                {" "}
                                🔍
                              </span>
                            </button>
                            <br />
                          </Link>
                        ))}
                    </td>

                    <td>
                      {uploadedReport[index] && uploadedReport[index].res && (
                        <Link
                          to={`https://gateway.pinata.cloud/ipfs/${uploadedReport[index].res}`}
                        >
                          <button className="view-document-button">
                            Police Report
                            <span role="img" aria-label="View Document">
                              {" "}
                              🔍
                            </span>
                          </button>
                          <br />
                        </Link>
                      )}
                    </td>
                    <td>
                      {uploadedReportLab[index] ==
                      "No lab reports available for this case." ? (
                        <></>
                      ) : (
                        <>
                           <Link
                          to={`https://gateway.pinata.cloud/ipfs/${uploadedReportLab[index]}`}
                        >
                          <button className="view-document-button">
                            Lab Report
                            <span role="img" aria-label="View Document">
                              {" "}
                              🔬
                            </span>
                          </button>
                          </Link>
                        </>
                      )}
                    </td>
                    <td>
                      {uploadedReportHospital[index] && (
                        <Link
                          to={`https://gateway.pinata.cloud/ipfs/${uploadedReportHospital[index]}`}
                        >
                          <button className="view-document-button">
                            Hospital Report
                            <span role="img" aria-label="View Document">
                              {" "}
                              ⚕️
                            </span>
                          </button>
                          <br />
                        </Link>
                      )}
                    </td>
                    <td>
                    {uploadedEvidencesComplainant.length > 0 ? (
                        <>
                          {uploadedEvidencesComplainant[index].result.map((evidence, idx) => (
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
                        <>{uploadedEvidencesComplainant.length}</>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
