import React from 'react';
import "./Navbar.css";
import { useCookies } from "react-cookie";
import { useLocation, useNavigate, Link } from 'react-router-dom';

function Navbar({admin=false}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, removeCookie] = useCookies(["token"]);

  async function disconnect() {
    alert("Disconnecting...");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";//from some reason this is the best way I found that I can remove a cookie
    navigate("/login");
  }

  return (
    <>
      <nav>
        <Link to="/profile">Profile</Link>
        <Link to="/employee-list">Employee List</Link>
        {admin && <Link to="/admin">Admin</Link>} {/* Conditional rendering based on admin prop */}
        <a onClick={disconnect} className='disconnect'>Disconnect</a>
      </nav>
    </>
  );
}

export default Navbar;
