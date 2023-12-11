import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Admin.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';

function Admin() {
  const [cookies, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!cookies || !cookies.token) {
      navigate('/login');
    }

    axios.get('/profile', { withCredentials: true })
      .then(response => {
        console.log(response.data);
        if (!response.data.status) {
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigate('/login');
        }

        const isAdminUser = response.data.user && response.data.user.admin;

        if (isAdminUser) {
          setIsAdmin(true);
        } else {
          alert('Access Denied');
          navigate('/profile');
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        alert('Error\nRedirecting to login');
        navigate('/login');
      });
  }, [cookies.token, navigate, removeCookie]);

  return (
    <>
      <Navbar admin={isAdmin}/>
      {isAdmin && (
        <div className="admin-page">
          <h1>Welcome to the Admin Page</h1>
          <Link to="/admin/edit" className="admin-link">
            Edit User
          </Link>
          <Link to="/admin/approve" className="admin-link">
            Approve Users
          </Link>
        </div>
      )}
    </>
  );
}

export default Admin;
