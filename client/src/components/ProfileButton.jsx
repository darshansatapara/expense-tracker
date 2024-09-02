import React from 'react';
// import Link from 'antd/es/typography/Link';/
import { Link } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-icons/font/bootstrap-icons';
import '../css/ProfileButton.css'; // Import your CSS file for additional styling
function ProfileButton() {
  return (
    <div className="profile-icon">
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <i className="bi bi-person"></i> {/* Profile icon */}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item><Link to="/signin">Login</Link></Dropdown.Item>
          <Dropdown.Item><Link to="/signout">Logout</Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default ProfileButton;
