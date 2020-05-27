import React from "react";
import logo from "../toplogo.jpg";

const Navbar = (props) => {
  return (
    <nav>
      <ul className="inline-list">
        {/* https://twitter.com/TheOdinProject/photo */}
        <li className="left-nav-item">
          <img src={logo} alt="The Odin Project Logo" className="logo" />
          Topify
        </li>

        <li>
          <a href={props.profile} className="profile-link">
            <i className="fas fa-user-circle fa-2x"></i>
            Profile
          </a>
        </li>
        <li>|</li>
        <li>
          <a href="https://www.spotify.com/uk/download">Download</a>
        </li>
        <li>
          <a href="https://support.spotify.com/">Help</a>
        </li>
        <li>
          <a href="https://www.spotify.com/uk/premium/?checkout=false">
            Premium
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
