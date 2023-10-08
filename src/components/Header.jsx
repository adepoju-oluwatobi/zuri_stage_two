import React, { useState } from "react";
import Logo from "../assets/logo.svg";
import Menu from "../assets/menu.svg";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

function Header() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  return (
    <div>
      {/*mobile header */}
      <div className="md:hidden">
        <div className="header">
          <Link to="/">
            <div className="one cursor-pointer">
              <img src={Logo} alt="logo" />
              <p>JUST THRILLER</p>
            </div>
          </Link>
          <div className="three cursor-pointer">
            <p className="">Sign In</p>
            <img
              id="menu-icon"
              src={Menu}
              alt="menu"
              onClick={toggleSearch} // Toggle search bar visibility when clicking the menu icon
            />
          </div>
        </div>
        {isSearchVisible && (
          <div id="search" className="two w-fit mt-4 m-auto">
            <SearchBar />
          </div>
        )}
      </div>

          {/*Desktop Header */}
      <div className="header hidden md:flex">
        <div className="one">
          <img src={Logo} alt="logo" />
          <p>JUST THRILLER</p>
        </div>
        <div className="two">
          <SearchBar />
        </div>
        <div className="three">
          <p className="">signin</p>
          <img src={Menu} alt="menu" />
        </div>
      </div>
    </div>
  );
}

export default Header;
