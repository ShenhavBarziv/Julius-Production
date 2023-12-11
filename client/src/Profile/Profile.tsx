// Profile.js
import React, { useEffect, useState } from 'react';
import "./Profile.css";
import axios from 'axios';
import { UserData } from './types';
import Navbar from '../Navbar/Navbar';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';

const email = "shenhavbarziv@gmail.com";

// ... (other imports)

function Profile() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(['token']);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [msg, SetMsg] = useState("Loading user profile...");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!cookies.token) {
      navigate("/login");
    }

    axios.get("/profile",{ withCredentials: true })
      .then(response => {
        if(!response.data.status){
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate('/login');
        }
        setUserData(response.data.user);
        setAdmin(response.data.user.admin);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        SetMsg("Error");
      });
  }, [cookies.token, navigate, removeCookie]);

  return (
    <>
      <Navbar admin={admin}/>
      <div className="user-profile">
        <h1>User Profile</h1>
        {userData ? (
          <ul>
            {Object.entries(userData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value.toString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className='loading'>{msg}</p>
        )}
      </div>
    </>
  );
}

export default Profile;

