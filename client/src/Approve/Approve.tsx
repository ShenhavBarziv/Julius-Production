import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Approve.css';
import axios from 'axios';
import type { ResponeType, UserData } from './types';
import { useNavigate } from 'react-router-dom';

function Approve() {
  const [data, setData] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);

  async function fetchData() {
    try {
      const response = await axios.get<ResponeType>('http://localhost:5000/approve',{ withCredentials: true });
      console.log(response.data);
      if(response.data.status === true)
      {
        setData(response.data.data);
        setAdmin(true);
      }
      else if(response.data.status == "notAdmin")
      {
        alert("access denied");
        navigate("/profile")
      }
      else
      {
        navigate("/login");
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.status) {
          setStatus(error.response.data.status);
        } else {
          alert("Error");
          navigate("/login")
        }
      }
      setLoading(false);
    }
  }
  useEffect(() => {fetchData();}, []);
  async function handleApprove(id: string) {
    try {
      console.log('Approving user with id: ', id);
      const response = await axios.post('http://localhost:5000/approve', { id },{ withCredentials: true });
      if(response.data.status !== 200)
      {
        if(typeof response.data.status === 'string')
        {
          alert(response.data.status);
        }
        else
        {
          alert("User not found");
        }
      }
    } catch (error) {
      console.error('Error approving user: ', error);
      alert("Error");
    } finally {
      fetchData();
    }
  }
  
  async function handleDelete(id: string) {
    try {
      console.log('Deleting user with id: ', id);
      const response = await axios.delete('http://localhost:5000/approve', {
        data: { id },
        withCredentials: true
      });
      console.log(response.data);
      if (response.data.status !== 200) {
        if (typeof response.data.status === 'string') {
          alert(response.data.status);
        } else {
          alert("User not found");
        }
      }
    } catch (error) {
      console.error('Error deleting user: ', error);
      alert("Error");
    } finally {
      fetchData();
    }
  }
  
  
  

  return (
    <>
      <Navbar admin={admin}/>
      {loading ? (
        <p className='loading'>Loading data...</p>
      ) : status === 'notAdmin' ? (
        <p className='error-message'>Access Denied: You are not an admin.</p>
      ) : status === 'notLoggedIn' ? (
        <p className='error-message'>Access Denied: Please log in to view this page.</p>
      ) : (
        <table className='user-table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Job</th>
              <th>Email</th>
              <th>Position</th>
              <th>Phone Number</th>
              <th>Hire Date</th>
              <th>Birth Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.job}</td>
                <td>{item.email}</td>
                <td>{item.position}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.hireDate}</td>
                <td>{item.birthDate}</td>
                <td>
                  <button
                    className='approve'
                    onClick={() => handleApprove(item._id)}
                  >
                    Approve
                  </button>
                  <button
                    className='delete'
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Approve;
