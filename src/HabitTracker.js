// src/HabitTracker.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HabitTracker = () => {
  const [habit, setHabit] = useState('');
  const [points, setPoints] = useState(0);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [userId] = useState(1); // Temporary userId

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  // Define the list of habits and their point values
  const habitOptions = [
    { label: 'Recycled Today', value: 'recycled', points: 5 },
    { label: 'Reduced Plastic Use', value: 'reduced_plastic', points: 10 },
    { label: 'Conserved Water', value: 'conserved_water', points: 8 },
    { label: 'Used Public Transportation', value: 'public_transport', points: 7 },
    { label: 'Walked or Biked Instead of Driving', value: 'walk_or_bike', points: 12 },
    { label: 'Ate a Plant-Based Meal', value: 'plant_based_meal', points: 6 },
    { label: 'Avoided Single-Use Plastic', value: 'avoided_single_use', points: 9 },
    { label: 'Participated in a Community Clean-Up', value: 'community_clean_up', points: 15 },
    { label: 'Unplugged Devices When Not in Use', value: 'unplugged_devices', points: 4 },
    { label: 'Used a Reusable Bag', value: 'reusable_bag', points: 3 },
    { label: 'Composted Food Waste', value: 'composted', points: 10 },
    { label: 'Reduced Shower Time', value: 'reduced_shower_time', points: 5 },
    { label: 'Used Energy-Efficient Appliances', value: 'energy_efficient', points: 8 },
    { label: 'Planted a Tree', value: 'planted_tree', points: 20 },
    { label: 'Used Renewable Energy', value: 'renewable_energy', points: 18 },
  ];

  const handleHabitChange = (e) => {
    const selectedHabit = e.target.value;
    setHabit(selectedHabit);

    // Find the habit from the habitOptions list and update points accordingly
    const habitData = habitOptions.find((habit) => habit.value === selectedHabit);
    if (habitData) {
      setPoints(habitData.points);
    } else {
      setPoints(0);
    }
  };

  const handleTrackHabit = async (e) => {
    e.preventDefault();
    const date = new Date().toISOString().split('T')[0];

    try {
      const response = await axios.post(`${backendUrl}/track-habit`, {
        userId,
        habit,
        date,
        points: points || 0,
      });
      setMessage('Habit tracked successfully!');
      navigate('/dashboard'); // Navigate to Dashboard page
    } catch (error) {
      console.error('Error tracking habit:', error);
      if (error.response && error.response.data) {
        setMessage(`Error tracking habit: ${error.response.data}`);
      } else {
        setMessage('Error tracking habit, please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-primary">Daily Eco Habits Tracker</h2>
        <form onSubmit={handleTrackHabit}>
          <div className="mb-4">
            <label className="block text-gray-700">Habit:</label>
            <select
              value={habit}
              onChange={handleHabitChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              required
            >
              <option value="">Select a habit</option>
              {habitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Points:</label>
            <input
              type="number"
              value={points}
              readOnly
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-800 shadow-lg transition w-full"
          >
            Track Habit
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default HabitTracker;
