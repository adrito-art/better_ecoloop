// src/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import cuteIllustration from './assets/cute-illustration.png'; // Your homepage image
import trainImage from './assets/train.png'; // Train image you want to use
import './HomePage.css'; // Custom CSS file for train animation

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const train = document.createElement('img');
    train.src = trainImage;
    train.className = 'train-animation';
    document.body.appendChild(train);

    setTimeout(() => {
      train.remove();
      navigate('/register');
    }, 3000); // 3 seconds for the train to move and switch to registration page
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Spiral Wave Animation Background */}
      <div className="absolute top-0 left-0 w-full h-full spiral-wave-animation" style={{ background: '#9CA986' }}></div>

      {/* Circular Image */}
      <img
        src={cuteIllustration}
        alt="Cute illustration"
        className="w-48 h-48 rounded-full mb-8 shadow-lg border-4 border-white z-10"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 z-10" style={{ color: '#FFEEAD' }}>
        Welcome to EcoLoop!
      </h1>

      {/* Get Started Button */}
      <button
        onClick={handleGetStarted}
        className="bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:bg-primary hover:scale-110 transform transition-all duration-300 ease-in-out z-10"
      >
        Get Started
      </button>
    </div>
  );
}

export default HomePage;
