import React, { useState } from "react"; // Combine all imports from 'react'
import { Link } from "react-router-dom"; // Ensure 'react-router-dom' is installed
import "../css/Sidebar.css"; // Correct CSS file import path
import img from "../../images/new.webp"; // Correct the image file extension to '.webp'
import { menuItems } from "../../utils/Item"; // Ensure the path and import are correct

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="main">
      <div className="logo">
        <img src={img} alt="mylogo" />
      </div>
      <button className="burger-icon" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`menu-items ${isOpen ? "active" : ""}`}>
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link to={item.path}>
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
