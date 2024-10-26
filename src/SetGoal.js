import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetGoal = () => {
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSetGoal = async (e) => {
    e.preventDefault();
    const userId = 1; // Replace with actual logged-in user ID

    try {
      await axios.post('http://localhost:5001/set-goal', {
        userId,
        goalName,
        targetDate,
      });
      setMessage('Goal set successfully!');

      // Add delay and navigate to Dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      setMessage('Error setting goal, please try again.');
      console.error('Error setting goal:', error);
    }
  };

  return (
    <div>
      <h2>Set Your Sustainability Goals</h2>
      <form onSubmit={handleSetGoal}>
        <div>
          <label>Goal Name:</label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Target Date:</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Set Goal</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SetGoal;
