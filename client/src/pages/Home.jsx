import React from "react";
import Sidebar from "../../../src/components/Sidebar";
import Navbar from "../../../src/components/Navbar";
import "../css/Home.css"; // Ensure you have this file for custom styling
import Section from "../../../src/components/Section";
import ProfileButton from "../../../src/components/ProfileButton";

const HomePage = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row ">
          <div className="">
            <Navbar name="Home" />
            {/* <ProfileButton /> */}
          </div>
          <div className="col-md-3 col-lg-2">
            <Sidebar />
          </div>
         <div className="">
          <Section />
         </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
