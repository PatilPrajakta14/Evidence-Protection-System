import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";
import { toast } from "react-toastify";
import Signup from "./About";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const notifyA = (msg) => {
    toast.error(msg);
  };
  const notifyB = (msg) => {
    toast.success(msg);
  };

  const postData = () => {
    //SENDING DATA TO SERVER

    fetch("http://localhost:3000/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        role:role
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("SignIn successfully");
          console.log(data);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          if(role==='police')
            navigate("/police");
          else if(role==='hospital')
            navigate("/hospital")
          else if(role==='lab')
            navigate("/laboratory")
          else if(role==='court')
            navigate("/court")
          else if(role==='complainant')
            navigate("/complainant")
        }
        console.log(data);
      });
  };
  const handleRadioChange = (event) => {
    setRole(event.target.value);
  };
  return (
    <div className="signin">
      <div className="signinContainer">
        <div className="loginheader">
          <div className="loginLogo">LOGIN</div>
          <div className="innerBox" style={{ display: "flex" }}>
            <div style={{ padding: "10px", margin: "10px" }}>
              <input
                type="radio"
                name="field"
                id="police"
                value="police"
                checked={role === "police"}
                onChange={handleRadioChange}
              />
              Police Officials
            </div>
            <div style={{ padding: "10px", margin: "10px" }}>
              <input
                type="radio"
                name="field"
                id="lab"
                value="lab"
                checked={role === "lab"}
                onChange={handleRadioChange}
              />
              Lab
            </div>
            <div style={{ padding: "10px", margin: "10px" }}>
              <input
                type="radio"
                name="field"
                id="hospital"
                value="hospital"
                checked={role === "hospital"}
                onChange={handleRadioChange}
              />
              Hospital
            </div>
            <div style={{ padding: "10px", margin: "10px" }}>
              <input
                type="radio"
                name="field"
                id="complainant"
                value="complainant"
                checked={role === "complainant"}
                onChange={handleRadioChange}
              />
              Complainant
            </div>
            <div style={{ padding: "10px", margin: "10px" }}>
              <input
                type="radio"
                name="field"
                id="court"
                checked={role === "court"}
                onChange={handleRadioChange}
              />
              Court
            </div>
          </div>
        </div>
        <div className="loginBody">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <label htmlFor="" style={{ padding: "5px" }}>
              Email:
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter Email Id"
              style={{ border: "1.5px solid #0b5996", borderRadius: "5px" }}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            <label htmlFor="" style={{ padding: "5px" }}>
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={(e)=>{setPassword(e.target.value)}}
              style={{ border: "1.5px solid #0b5996", borderRadius: "5px" }}
            />
          </div>
          <div style={{ display: "flex", margin: "13px" }}>
            <button className="btn btn-primary" onClick={postData}>Login</button>
            <Link style={{ margin: "10px" }}>forget password?</Link>
          </div>
          <div style={{ display: "flex", margin: "10px", marginLeft: "35px" }}>
            <Link style={{ margin: "10px" }} to="/signup">
              New User? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
