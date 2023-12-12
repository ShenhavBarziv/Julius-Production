// Home.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';

function Home() {
  async function GetHi()
  {
    try {
    await axios
      .get(
        "https://julius-production-api.vercel.app/",
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
      });
  } catch (e) {
    console.log(e);
  }
  }
  return (
    <div className="home-container">
      <input type="submit" value="Submit" className="submit" onClick={GetHi} />
      <h1>Welcome to the Employee Management System</h1>
      <p>
        This web application is designed to efficiently manage employee information and provide key functionalities for both employees and administrators.
      </p>
      <h3>For getting started</h3>
      <ol className="instruction-list">
        <li>Register as a new user by providing your details. If you need to register, please <Link to="/SignUp">sign up</Link>.</li>
        <li>Contact your supervisor and inform them that you have registered</li>
        <li>Wait for your supervisor to add you to the system</li>
      </ol>
      <p>
        If you already have an account, please <Link to="/login">login</Link>.
      </p>
    </div>
  );
}

export default Home;
