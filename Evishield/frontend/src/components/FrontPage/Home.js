import React, { useState, useEffect } from "react";
import "./Home.css";
import image from "./images/1.png";
import image2 from "./images/8.avif";
import domesticViolence from "./images/domesticViolence.png";
import SlideShow from "./SlideShow";

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="content__container">
          <h1>
            <br />
            Evidence Shield
            <br />
            <span className="heading__1">
              Blockchain and IPFS-Based Evidence Protection System
            </span>
            <br />
            <span className="heading__2">for Safeguarding Women's Rights</span>
          </h1>
          <p>
            This portal is an initiative to facilitate victims/complainants to
            report cyber crime complaints online. This portal caters to
            complaints pertaining to cyber crimes only with special focus on
            cyber crimes against women. Complaints reported on this portal are
            dealt by law enforcement agencies/ police based on the information
            available in the complaints. It is imperative to provide correct and
            accurate details while filing complaint for prompt action.
          </p>
        </div>
        <div className="image__container">
          <img src={image2} alt="header" />
          <img src={image} alt="background" />
        </div>
      </div>
    </>
  );
}
