import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-blue-800 p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">EcoLoop</h2>
      <nav className="space-y-4">
        <Link to="/register" className="block text-white hover:bg-blue-600 p-2 rounded">
          Register
        </Link>
        <Link to="/create-team" className="block text-white hover:bg-blue-600 p-2 rounded">
          Create Team
        </Link>
        <Link to="/join-team" className="block text-white hover:bg-blue-600 p-2 rounded">
          Join Team
        </Link>
        <Link to="/dashboard" className="block text-white hover:bg-blue-600 p-2 rounded">
          Dashboard
        </Link>
        <Link to="/track-habit" className="block text-white hover:bg-blue-600 p-2 rounded">
          Track Habit
        </Link>
        <Link to="/set-goal" className="block text-white hover:bg-blue-600 p-2 rounded">
          Set Goal
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
