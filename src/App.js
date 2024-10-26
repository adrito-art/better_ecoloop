// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import Register from './Register';
import SelectMode from './SelectMode';
import CreateTeam from './CreateTeam';
import JoinTeam from './JoinTeam';
import Dashboard from './Dashboard';
import HabitTracker from './HabitTracker';
import CarbonFootprint from './CarbonFootprint';
import SetGoal from './SetGoal';
import TeamList from './TeamList';
import TeamSelection from './TeamSelection'; // Import TeamSelection
import SpeechInput from './SpeechInput';
import Navbar from './Navbar'; // Import Navbar
import DailyQuestionnaire from './DailyQuestionnaire';
import AIMode from './AIMode'; // Import AIMode

import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Render Navbar above Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-mode" element={<SelectMode />} />
        <Route path="/manual" element={<TeamSelection />} /> {/* Updated Manual Mode Route */}
        <Route path="/ai-mode" element={<AIMode />} /> {/* Use the imported AIMode component */}
        <Route path="/calculate-footprint" element={<CarbonFootprint />} />
        <Route path="/habit-tracker" element={<HabitTracker />} />
        <Route path="/track-habit" element={<HabitTracker />} />
        <Route path="/create-team" element={<CreateTeam />} />
        <Route path="/join-team" element={<JoinTeam />} />
        <Route path="/daily-questionnaire" element={<DailyQuestionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/set-goal" element={<SetGoal />} />
        <Route path="/team-list" element={<TeamList />} />
      </Routes>
    </Router>
  );
}

export default App;
