// src/SelectMode.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SelectMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#DEAC80] p-8">
      <h2 className="text-3xl font-bold text-white mb-8">How would you like to proceed?</h2>
      <div className="flex space-x-8">
        <button
          onClick={() => navigate('/manual')}
          className="bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:bg-green-400 transition-all"
        >
          Manual Mode
        </button>
        <button
          onClick={() => navigate('/ai-mode')}
          className="bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:bg-green-400 transition-all"
        >
          AI/Automatic Mode
        </button>
      </div>
    </div>
  );
};

export default SelectMode;
