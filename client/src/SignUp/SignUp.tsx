import React, { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./signup.css";
import axios from 'axios';
function SignUp() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    name: '',
    job: '',
    birthDate: '',
    phoneNumber: '',
    position: '',
    hireDate: '',
  });

  const handleChange = (e:FormEvent<HTMLInputElement>) => {
    // Update the form values on each keystroke
    const { name, value } = e.currentTarget;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  async function handleSubmit(e:FormEvent){
    e.preventDefault();
    try{
      await axios.post("http://localhost:5000/register", userData, {withCredentials: true,})
      .then(res =>{
        if (res.data.code === 201) {
          alert("new user created successfully")
          navigate('/login', { state: userData.email });
        } else if (res.data.code === 409) {
          alert('User already exists');
        } else if(res.data.code === 400) {
          alert(res.data.msg);
        } else {
          alert("error");
        }
      })
  }
  catch(e){
    alert("error");
    console.log(e);
  }
  };

  return (
    <>
    <div className='SignUpForm'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" maxLength={50} name="email" onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input type="password" maxLength={30} name="password" onChange={handleChange} required />
        </label>
        <label>
          Name:
          <input type="text" maxLength={20} name="name" onChange={handleChange} required />
        </label>
        <label>
          Job:
          <input type="text" maxLength={20} name="job" onChange={handleChange} required />
        </label>
        <label>
          Birth Date:
          <input type="date" maxLength={10} name="birthDate" onChange={handleChange} required />
        </label>
        <label>
          Phone Number:
          <input type="text" maxLength={15} name="phoneNumber" onChange={handleChange} required />
        </label>
        <label>
          Position:
          <input type="text" maxLength={15} name="position" onChange={handleChange} required />
        </label>
        <label>
          Hire Date:
          <input type="date" maxLength={10} name="hireDate" onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </>
  );
};

export default SignUp;