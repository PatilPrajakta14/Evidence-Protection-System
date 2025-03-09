// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract CaseManagement {
    uint public nextCaseID = 1;

    mapping(uint => string) public caseToIpfsHash;
    mapping(uint => mapping(uint => string)) public caseToEvidenceIpfsHash;
    mapping(uint => uint) public caseEvidenceCounter;
    mapping(address => uint[]) public complainantToCases;

    mapping(address => bool) public isPolice;
    mapping(address => bool) public isCourt;
    mapping(address => bool) public isLab;
    mapping(address => bool) public isHospital;

    mapping(uint => bool) public policeBool;
    mapping(uint => bool) public labBool;
    mapping(uint => bool) public hospitalBool;
    
    mapping(uint => mapping(uint => bool)) public labUploadedEvidence; // Mapping to track which evidence was uploaded by the lab
    mapping(uint => mapping(uint => bool)) public policeUploadedReports; // Mapping to track which reports were uploaded by the police
    mapping(uint => mapping(uint => bool)) public hospitalUploadedFeedback; // Mapping to track hospital feedback
    mapping(uint => mapping(uint => bool)) public policeUploadedEvidence; // Mapping to track which evidence was uploaded by the police
    mapping(uint => mapping(uint => string)) public complainantUploadedEvidence;


    event CaseRegistered(uint indexed caseID, string ipfsHash, address complainant);
    event EvidenceMapped(uint indexed caseID, uint indexed evidenceID, string ipfsHash, address uploader);
    event LabReportUploaded(uint indexed caseID, uint indexed evidenceID, string ipfsHash);
    event PoliceReportUploaded(uint indexed caseID, uint indexed reportID, string ipfsHash);
    event HospitalFeedbackProvided(uint indexed caseID, uint indexed evidenceID, string feedback);
    event ComplainantEvidenceUploaded(uint indexed caseID, uint indexed evidenceID, string ipfsHash);



    address public owner;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyPolice() {
        require(isPolice[msg.sender], "Not authorized");
        _;
    }

    modifier onlyComplainant(uint _caseID) {
        bool isComplainantOfCase = false;
        uint[] memory complainantCases = complainantToCases[msg.sender];
        for (uint i = 0; i < complainantCases.length; i++) {
            if (complainantCases[i] == _caseID) {
                isComplainantOfCase = true;
                break;
            }
        }
        require(isComplainantOfCase, "Not authorized");
        _;
    }

    modifier onlyPoliceOrCourt() {
        require(isPolice[msg.sender] || isCourt[msg.sender], "Not authorized");
        _;
    }

    modifier onlyPoliceOrCourtOrHospital() {
        require(isPolice[msg.sender] || isCourt[msg.sender] || isHospital[msg.sender], "Not authorized");
        _;
    }
    modifier onlyPoliceOrCourtOrHospitalOrLab() {
        require(isPolice[msg.sender] || isCourt[msg.sender] || isHospital[msg.sender] || isLab[msg.sender], "Not authorized");
        _;
    }

    modifier onlyLab() {
        require(isLab[msg.sender], "Only labs can upload reports");
        _;
    }

    modifier onlyHospital() {
        require(isHospital[msg.sender], "Only hospitals can view reports and provide feedback");
        _;
    }

    function addPolice(address _police) external onlyOwner {
        isPolice[_police] = true;
    }

    function addCourt(address _court) external onlyOwner {
        isCourt[_court] = true;
    }

    function addLab(address _lab) external onlyOwner {
        isLab[_lab] = true;
    }

    function addHospital(address _hospital) external onlyOwner {
        isHospital[_hospital] = true;
    }

    function removePolice(address _police) external onlyOwner {
        isPolice[_police] = false;
    }

    function removeCourt(address _court) external onlyOwner {
        isCourt[_court] = false;
    }

    function removeLab(address _lab) external onlyOwner {
        isLab[_lab] = false;
    }

    function removeHospital(address _hospital) external onlyOwner {
        isHospital[_hospital] = false;
    }

    function registerCase(string memory _ipfsHash, address _complainant) public returns (uint) {
        uint caseID = nextCaseID;
        caseToIpfsHash[caseID] = _ipfsHash;
        caseToEvidenceIpfsHash[caseID][1] = _ipfsHash; // First evidence ID set to 1
        caseEvidenceCounter[caseID]++;

        complainantToCases[_complainant].push(caseID); // Map complainant to case ID

        emit CaseRegistered(caseID, _ipfsHash, _complainant);
        emit EvidenceMapped(caseID, 1, _ipfsHash, _complainant);
        nextCaseID++;
        return caseID;
    }

    function mapEvidence(uint _caseID, string memory _ipfsHash) public onlyPolice returns (uint, uint) {
        require(isPolice[msg.sender], "Only police can upload evidence");

        uint evidenceID = caseEvidenceCounter[_caseID] + 1;
        caseToEvidenceIpfsHash[_caseID][evidenceID] = _ipfsHash;
        caseEvidenceCounter[_caseID]++;

        emit EvidenceMapped(_caseID, evidenceID, _ipfsHash, msg.sender);
        // Set policeBool to true for this case
        policeBool[_caseID] = true;
        // Mark this evidence as uploaded by the police
        policeUploadedEvidence[_caseID][evidenceID] = true;
        return (_caseID, evidenceID);
    }

    function uploadLabReport(uint _caseID, string memory _ipfsHash) public onlyLab returns (uint, uint) {
        uint evidenceID = caseEvidenceCounter[_caseID] + 1;
        caseToEvidenceIpfsHash[_caseID][evidenceID] = _ipfsHash;
        caseEvidenceCounter[_caseID]++;

        emit EvidenceMapped(_caseID, evidenceID, _ipfsHash, msg.sender);
        // Set labBool to true for this case
        labBool[_caseID] = true;
        // Mark this evidence as uploaded by the lab
        labUploadedEvidence[_caseID][evidenceID] = true;
        return (_caseID, evidenceID);
    }

    function uploadPoliceReport(uint _caseID, string memory _ipfsHash) public onlyPolice returns (uint, uint) {
        uint reportID = caseEvidenceCounter[_caseID] + 1;
        caseToEvidenceIpfsHash[_caseID][reportID] = _ipfsHash;
        caseEvidenceCounter[_caseID]++;

        emit PoliceReportUploaded(_caseID, reportID, _ipfsHash);
        // Set policeBool to true for this case
        policeBool[_caseID] = true;
        // Mark this report as uploaded by the police
        policeUploadedReports[_caseID][reportID] = true;
        return (_caseID, reportID);
    }

    function provideHospitalFeedback(uint _caseID, string memory _feedback) public onlyHospital returns (uint, uint) {
        require(labBool[_caseID], "Lab reports not available for this case yet");
        uint feedbackID = caseEvidenceCounter[_caseID] + 1;
        caseToEvidenceIpfsHash[_caseID][feedbackID] = _feedback;
        caseEvidenceCounter[_caseID]++;

        emit HospitalFeedbackProvided(_caseID, feedbackID, _feedback);
        // Set hospitalBool to true for this case
        hospitalBool[_caseID] = true;
        // Mark this feedback as uploaded by the hospital
        hospitalUploadedFeedback[_caseID][feedbackID] = true;
        return (_caseID, feedbackID);
    }


    function uploadComplainantEvidence(uint _caseID, string memory _ipfsHash) public onlyComplainant(_caseID) {
        uint evidenceID = caseEvidenceCounter[_caseID] + 1;
        complainantUploadedEvidence[_caseID][evidenceID] = _ipfsHash;
        caseEvidenceCounter[_caseID]++;

        emit ComplainantEvidenceUploaded(_caseID, evidenceID, _ipfsHash);
    }

    function getLabReports(uint _caseID) public view onlyPoliceOrCourtOrHospitalOrLab returns (string[] memory) {
        uint evidenceCount = caseEvidenceCounter[_caseID];
        uint labReportCount = 0;
        for (uint i = 1; i <= evidenceCount; i++) {
            if (labUploadedEvidence[_caseID][i]) {
                labReportCount++;
            }
        }
        if (labReportCount == 0) {
            string[] memory noReports = new string[](1);
            noReports[0] = "No lab reports available for this case.";
            return noReports;
        } else {
            string[] memory labReports = new string[](labReportCount);
            uint index = 0;
            for (uint i = 1; i <= evidenceCount; i++) {
                if (labUploadedEvidence[_caseID][i]) {
                    labReports[index] = caseToEvidenceIpfsHash[_caseID][i];
                    index++;
                }
            }
            return labReports;
        }
    }

    function getJsonHash(uint _caseID) public view returns (string memory){
        return caseToEvidenceIpfsHash[_caseID][1];
    }

    function getIpfsHashes(uint _caseID) public view onlyPoliceOrCourt returns (string[] memory) {
        uint evidenceCount = caseEvidenceCounter[_caseID];
        string[] memory ipfsHashes = new string[](evidenceCount);

        for (uint i = 1; i <= evidenceCount; i++) {
            ipfsHashes[i - 1] = caseToEvidenceIpfsHash[_caseID][i];
        }

        return ipfsHashes;
    }

    function getPoliceUploadedEvidences(uint _caseID) public view returns (string[] memory) {
        uint evidenceCount = caseEvidenceCounter[_caseID];
        uint policeEvidenceCount = 0;
        for (uint i = 1; i <= evidenceCount; i++) {
            if (policeUploadedEvidence[_caseID][i]) {
                policeEvidenceCount++;
            }
        }
        if (policeEvidenceCount == 0) {
            string[] memory noEvidences = new string[](1);
            noEvidences[0] = "No evidences uploaded by police for this case.";
            return noEvidences;
        } else {
            string[] memory policeEvidences = new string[](policeEvidenceCount);
            uint index = 0;
            for (uint i = 1; i <= evidenceCount; i++) {
                if (policeUploadedEvidence[_caseID][i]) {
                    policeEvidences[index] = caseToEvidenceIpfsHash[_caseID][i];
                    index++;
                }
            }
            return policeEvidences;
        }
    }


    function getCaseBooleans(uint _caseID) public view returns (bool police, bool lab, bool hospital) {
        return (policeBool[_caseID], labBool[_caseID], hospitalBool[_caseID]);
    }

    function getCasesForComplainant(address _complainant) public view returns (uint[] memory) {
        return complainantToCases[_complainant];
    }

    function getPoliceReport(uint _caseID) public view onlyPoliceOrCourt returns (string memory) {
        require(policeBool[_caseID], "Police report not available for this case yet");
        uint evidenceCount = caseEvidenceCounter[_caseID];
        for (uint i = 1; i <= evidenceCount; i++) {
            if (policeUploadedReports[_caseID][i]) {
                return caseToEvidenceIpfsHash[_caseID][i];
            }
        }
        revert("Police report not found");
    }

    function getHospitalFeedback(uint _caseID) public view onlyPoliceOrCourtOrHospital returns (string memory) {
        require(hospitalBool[_caseID], "Hospital feedback not available for this case yet");
        uint evidenceCount = caseEvidenceCounter[_caseID];
        for (uint i = 1; i <= evidenceCount; i++) {
            if (hospitalUploadedFeedback[_caseID][i]) {
                return caseToEvidenceIpfsHash[_caseID][i];
            }
        }
        revert("Hospital feedback not found");
    }

    function getUserRole(address _user) public view returns (string memory) {
        if (isPolice[_user]) {
            return "Police";
        } else if (isCourt[_user]) {
            return "Court";
        } else if (isLab[_user]) {
            return "Lab";
        } else if (isHospital[_user]) {
            return "Hospital";
        } else if (complainantToCases[_user].length > 0) {
            return "Complainant";
        } else {
            return "Unknown";
        }
    }

    function getAllCaseIDs() public view returns (uint[] memory) {
        uint[] memory allCaseIDs = new uint[](nextCaseID - 1); // Initialize array with appropriate size
        for (uint i = 1; i < nextCaseID; i++) {
            allCaseIDs[i - 1] = i;
        }
        return allCaseIDs;
    }

    function getComplainantUploadedEvidences(uint _caseID) public view returns (string[] memory) {
        uint evidenceCount = caseEvidenceCounter[_caseID];
        string[] memory uploadedEvidences = new string[](evidenceCount);

        for (uint i = 1; i <= evidenceCount; i++) {
            uploadedEvidences[i - 1] = complainantUploadedEvidence[_caseID][i];
        }

        return uploadedEvidences;
    }

}
