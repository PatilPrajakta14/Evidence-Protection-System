import { React, useState,useContext } from "react";

import Web3 from "web3";
import axios from "axios";
import "./Officials.css";

import { LoginContext } from "../../context/loginContext";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const useMyVariable = () => useContext(LoginContext);
export default function Officials() {
  const { login, setLogin } = useMyVariable();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const notifyA = (msg) => {
    toast.error(msg);
  };
  const notifyB = (msg) => {
    toast.success(msg);
  };

  const handleLogout = () => {
    setLogin(false)
    setIsConnected(false);
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
  const handleLogin = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(currentProvider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        axios
          .post("http://localhost:8080/login", { address })
          .then((response) => {
            const result = response.data.result; // Assuming your response contains a field 'role'
            console.log("result:", result);

            switch (result) {
              case "Court":
                navigate("/court");
                break;
              case "Police":
                navigate("/police");
                break;
              case "Lab":
                navigate("/laboratory");
                break;
              case "Hospital":
                navigate("/hospital");
                break;
              case "Complainant":
                navigate("/complainantPage");
                break;
              default:
                window.location.reload();
                break;
            }
            setLogin(true);
            notifyB("Metamask connected")
            setIsConnected(true);
          })
          .catch((error) => {
            console.error("Error connecting to MetaMask:", error);
            notifyA("Error connecting to MetaMask");
          });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      notifyA("Error connecting to MetaMask");
    }
  };

  return (
    <div className="officials">
      <div className="reportCrime">
        <div className="input">
          <div className="style">
            <p style={{ fontSize: "25px" }}>To login</p>
            {!isConnected ? (
              <button onClick={handleLogin} className="button">
                Connect MetaMask
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
