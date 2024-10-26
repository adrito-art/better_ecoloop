// src/TeamSelection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamSelection.css';

const TeamSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="team-selection-container">
      <h2>Choose an Option</h2>
      <div className="card-container">
        <div className="card" onClick={() => navigate('/create-team')}>
          <h3>Create a Team</h3>
          <p>Start a new team and collaborate with others.</p>
        </div>
        <div className="card" onClick={() => navigate('/join-team')}>
          <h3>Join a Team</h3>
          <p>Join an existing team and start contributing.</p>
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;
 