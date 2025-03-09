import React from "react";
import { Link } from "react-router-dom";
import "./Signin.css";
import image from './images/1.png'
import image2 from './images/8.avif'
import domesticViolence from './images/domesticViolence.png'


export default function Home() {
  return (
    <section class="container">
      <div class="content__container">
        <h1>
        Evidence Shield<br />
          <span class="heading__1">Blockchain and IPFS-Based Evidence Protection System</span><br />
          <span class="heading__2">for Safeguarding women's Rights</span>
        </h1>
        <p>
        This portal is an initiative of Government of India to facilitate
          victims/complainants to report cyber crime complaints online. This
          portal caters to complaints pertaining to cyber crimes only with
          special focus on cyber crimes against women and children. Complaints
          reported on this portal are dealt by law enforcement agencies/ police
          based on the information available in the complaints. It is imperative
          to provide correct and accurate details while filing complaint for
          prompt action.
        </p>
      </div>
      <div class="image__container">
      <img src={image2} alt="header" />
      <img src={image} alt="background" />
      </div>
    </section>

)};
