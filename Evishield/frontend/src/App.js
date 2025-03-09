import "./App.css";

import { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/FrontPage/Home";
import Navbar from "./components/FrontPage/Navbar";
import About from "./components/FrontPage/About";
import Signin from "./components/FrontPage/Signin";
import ReportCrime from "./components/FrontPage/ReportCrime";
import TrackYourComplaint from "./components/Complainant/TrackYourComplaint";
import Officials from "./components/FrontPage/Officials";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Complainant from "./components/Complainant/Complainant";
import Police from "./components/Police/Police";
import Court from "./components/Court/Court";
import Hospital from "./components/Hospital/Hospital";
import Laboratory from "./components/Laboratory/Laboratory";
import CheckUpdates from "./components/Police/checkUpdates";
import RegisterCase from "./components/Police/RegisterCase";
import ViewComplaints from "./components/Police/ViewComplaints";
import HistoryOfComplaints from "./components/Police/HistoryOfComplaints";
import CheckHistoryOfCases from "./components/Court/CheckHistoryOfCases";
import CheckCases from "./components/Court/CheckCases";
import CheckHistory from "./components/Hospital/CheckHistory";
import CheckNewUpdates from "./components/Hospital/CheckNewUpdates";
import UploadReport from "./components/Hospital/UploadReport";
import CheckHistoryLab from "./components/Laboratory/CheckHistoryLab";
import CheckNewUpdatesLab from "./components/Laboratory/CheckNewUpdatesLab";
import UploadReportLab from "./components/Laboratory/UploadReportLab";

import { LoginContext } from "./context/loginContext";
import ComplainantPage from "./components/Complainant/ComplainantPage";

// Create a provider component
const MyVariableProvider = ({ children }) => {
  const [caseID, setcaseID] = useState("");
  const [login, setLogin] = useState(false);

  return (
    <LoginContext.Provider value={({ caseID, setcaseID }, { login, setLogin })}>
      {children}
    </LoginContext.Provider>
  );
};

function App() {
  return (
    <MyVariableProvider>
      <div className="App">
        <Router>
          <div className="top">
            <Navbar />
          </div>
          <div className="routes">  
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/About" element={<About />}></Route>
              <Route path="/signin" element={<Signin />}></Route>
              <Route path="/reportCrime" element={<ReportCrime />}></Route>
              <Route path="/officials" element={<Officials />}></Route>
              <Route path="/complainant" element={<Complainant />}></Route>
              <Route path="/complainantPage" element={<ComplainantPage />}></Route>
              <Route
                path="/trackYourComplaint"
                element={<TrackYourComplaint />}
              ></Route>
              <Route path="/court" element={<Court />}></Route>
              <Route
                path="/checkHistoryOfCase"
                element={<CheckHistoryOfCases />}
              ></Route>
              <Route path="/checkCases" element={<CheckCases />}></Route>
              <Route path="/hospital" element={<Hospital />}></Route>
              <Route path="/checkHistory" element={<CheckHistory />}></Route>
              <Route
                path="/checkNewUpdates"
                element={<CheckNewUpdates />}
              ></Route>
              <Route path="/uploadReport" element={<UploadReport />}></Route>
              <Route path="/laboratory" element={<Laboratory />}></Route>
              <Route
                path="/checkHistoryLab"
                element={<CheckHistoryLab />}
              ></Route>
              <Route
                path="/checkNewUpdatesLab"
                element={<CheckNewUpdatesLab />}
              ></Route>
              <Route
                path="/uploadReportLab"
                element={<UploadReportLab />}
              ></Route>
              <Route path="/police" element={<Police />}></Route>
              <Route path="/checkUpdates" element={<CheckUpdates />}></Route>
              <Route path="/registerCase" element={<RegisterCase />}></Route>
              <Route
                path="/viewComplaints"
                element={<ViewComplaints />}
              ></Route>
              <Route
                path="/historyOfComplaints"
                element={<HistoryOfComplaints />}
              ></Route>
            </Routes>
          </div>
          <ToastContainer theme="dark" />
        </Router>
      </div>
    </MyVariableProvider>
  );
}

export default App;
