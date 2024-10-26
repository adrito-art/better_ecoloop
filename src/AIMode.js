// src/AIMode.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIMode = () => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [points, setPoints] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  const guidingQuestions = [
    "How did you save water today?",
    "Did you use public transportation today?",
    "How much plastic did you avoid using today?",
    "How many plant-based meals did you eat today?",
    "What energy-saving activities did you perform today?",
    "Did you recycle any items today?",
    "How much electricity did you conserve?",
    "How many kilometers did you walk or bike?",
    "Did you participate in any community environmental activities?"
  ];

  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      setRecording(false);
      analyzeTranscription(transcript);
    };

    recognition.onerror = (event) => {
      setError('Error during speech recognition. Please try again.');
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  };

  const analyzeTranscription = async (text) => {
    setLoading(true);
    setError('');
    setRecommendations('');
    setPoints(0);

    try {
      const response = await axios.post(`${backendUrl}/ai-evaluate-transcription`, {
        transcriptionText: text,
        userId: 1,
      });

      setRecommendations(response.data.recommendations);
      setPoints(response.data.points);
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError('Error fetching AI recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6 text-primary">AI Mode - Speak Your Habits</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Here are some questions to guide your response:</label>
          <ul className="list-disc list-inside text-gray-700">
            {guidingQuestions.map((question, index) => (
              <li key={index} className="mb-2">{question}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <button
            onClick={startRecognition}
            className={`${
              recording ? 'bg-gray-500' : 'bg-blue-500'
            } text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all w-full`}
            disabled={recording}
          >
            {recording ? 'Listening...' : 'Start Speaking'}
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Transcription:</label>
          <textarea
            value={transcription}
            readOnly
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary resize-none h-24"
          />
        </div>

        {loading && <p className="text-blue-500 mb-4">Analyzing your responses...</p>}
        
        {recommendations && (
          <div className="mt-6 p-4 bg-green-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Your Personalized Recommendations:</h3>
            <ul className="list-disc list-inside">
              {recommendations.split('\n').map((rec, index) => (
                <li key={index} className="mb-2 text-gray-700">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {points > 0 && (
          <div className="mt-4 text-center text-green-700 font-bold">
            You've earned {points} points for your efforts today!
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMode;
