// src/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">
          <Link to="/">EcoLoop</Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/habit-tracker"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Habit Tracker
          </Link>
          <Link
            to="/daily-questionnaire"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Daily Questionnaire
          </Link>
          <Link
            to="/create-team"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Create Team
          </Link>
          <Link
            to="/join-team"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Join Team
          </Link>
          <Link
            to="/set-goal"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Set Goal
          </Link>
          <Link
            to="/team-list"
            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Team List
          </Link>
          {/* Add more navigation links here if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
