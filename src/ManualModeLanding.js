// src/ManualModeLanding.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManualModeLanding = () => {
  const navigate = useNavigate();

  const startJourney = () => {
    navigate('/create-team'); // Start the journey by creating or joining a team
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#DEAC80] p-8">
      <h2 className="text-4xl font-bold text-white mb-8">Welcome to Manual Mode</h2>
      <p className="text-lg text-white mb-8">
        In Manual Mode, you will be guided through the app's core features step-by-step.
      </p>
      <button
        onClick={startJourney}
        className="bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:bg-green-400 transition-all"
      >
        Start Journey
      </button>
    </div>
  );
};

export default ManualModeLanding;

