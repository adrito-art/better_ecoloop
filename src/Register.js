// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Assuming you save the new styles in 'Register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/register`, { username, password });
      console.log('User registered:', response.data);
      setMessage('Registration successful!');
      navigate('/select-mode'); // Navigate to the next page
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response && error.response.data) {
        setMessage(`Error registering user: ${error.response.data}`);
      } else {
        setMessage('Error registering user, please try again.');
      }
    }
  };

  return (
    <>
      <div className="background-animation"></div>
      <div className="register-container">
        <h2 className="register-title">Create an Account</h2>
        {message && <p className="register-message">{message}</p>}
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label htmlFor="username" className="register-label">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="register-input"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="register-label">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="register-input"
              required
            />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
