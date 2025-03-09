import React, { useState,useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import './Navbar.css'
import { LoginContext } from "../../context/loginContext";
const useMyVariable = () => useContext(LoginContext);

export default function Navbar() {
  const { login, setLogin } = useMyVariable();

    const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 0;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [scrolled]);

  const handleLogout = () => {
    setLogin(false)
  };
  return (
    <div className={`nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav__logo">
              Evidence Shield
            </div>
            <div className="nav__links">
            <Link to="/" className="link" >
              Home
            </Link>
            <Link to="/reportCrime" className="link" >
              Report Crime
            </Link>
          
            {/* <Link to="/trackYourComplaint" className="link">Track Your Complaint</Link> */}
            
            {login ?(<Link to="/" className="link button mx-3" onClick={handleLogout}>
              Log Out
            </Link>) :(<Link to="/officials" className="link button">
              Login
            </Link>) }
          </div>
        </div>  
  );
  
}