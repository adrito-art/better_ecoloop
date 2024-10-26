// src/CreateTeam.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css';

const CreateTeam = () => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();
  const [userId] = useState(1); // Temporary userId

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await axios.post(`${backendUrl}/create-team`, { teamName, userId });
      console.log('Team created:', response.data);
      setMessage('Team created successfully!');
      navigate('/track-habit'); // Navigate immediately after success
    } catch (error) {
      console.error('Error creating team:', error);
      if (error.response && error.response.data) {
        setMessage(`Error creating team: ${error.response.data}`);
      } else {
        setMessage('Error creating team, please try again.');
      }
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="create-team-container min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-4xl font-bold text-white mb-8">Create a Team</h2>
      <form onSubmit={handleCreateTeam} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2">Team Name:</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded shadow-md focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:scale-105 transform transition-all duration-300 ease-in-out"
        >
          {loading ? 'Creating Team...' : 'Create Team'}
        </button>
      </form>
      {message && <p className="text-white mt-4">{message}</p>}
    </div>
  );
};

export default CreateTeam;
