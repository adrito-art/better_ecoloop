// src/DailyQuestionnaire.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import questions from './data/questions';

const DailyQuestionnaire = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

  const handleChange = (e, questionId) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
    // Clear error and message as user types
    setError('');
    setMessage('');
  };

  const validate = () => {
    for (let q of questions) {
      const key = `q${q.id}`;
      if (!answers[key] || answers[key].trim() === '') {
        return `Please answer question ${q.id}.`;
      }

      // If "Other (Please specify)" is selected, ensure additional input is provided
      if (q.type === 'mcq' && q.options.includes('Other (Please specify)') && answers[key] === 'Other (Please specify)') {
        const otherKey = `q${q.id}_other`;
        if (!answers[otherKey] || answers[otherKey].trim() === '') {
          return `Please specify your answer for question ${q.id}.`;
        }
      }
    }
    return null;
  };

  const handleAIEvaluate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
  
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
  
    const userId = 1; // Replace with a dynamic user ID in production
    const date = new Date().toISOString().split('T')[0];
  
    const responses = {};
    questions.forEach((q) => {
      const key = `q${q.id}`;
      if (q.type === 'mcq' && q.options.includes('Other (Please specify)') && answers[key] === 'Other (Please specify)') {
        const otherKey = `q${q.id}_other`;
        responses[key] = answers[otherKey];
      } else {
        responses[key] = answers[key];
      }
    });
  
    try {
      // Submit the questionnaire
      const response = await axios.post(`${backendUrl}/daily-questionnaire`, {
        userId,
        responses,
        date,
      });
  
      if (response.status === 201) {
        localStorage.setItem('questionnaireSubmittedDate', date);
  
        // Request AI evaluation
        const aiResponse = await axios.post(`${backendUrl}/ai-evaluate`, {
          transcriptionText: responses,
          userId,
        });
  
        if (aiResponse.status === 200) {
          setRecommendations(aiResponse.data.recommendations);
        }
      }
    } catch (err) {
      console.error('Error submitting questionnaire or fetching AI evaluation:', err);
      setError('There was an error submitting your responses or getting the AI evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="daily-questionnaire-container min-h-screen bg-gray-100 p-4 flex justify-center items-center">
      <div className="questionnaire-form-wrapper overflow-auto w-full max-h-screen max-w-3xl p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Daily Habits Questionnaire</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
          <form onSubmit={handleAIEvaluate}>
            {questions.map((q) => (
              <div key={q.id} className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  {q.id}. {q.question}
                </label>
                {q.type === 'mcq' ? (
                  <div>
                    {q.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`q${q.id}_option${index}`}
                          name={`q${q.id}`}
                          value={option}
                          onChange={(e) => handleChange(e, q.id)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <label
                          htmlFor={`q${q.id}_option${index}`}
                          className="ml-2 text-gray-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                    {/* If "Other (Please specify)" is selected, show an input field */}
                    {answers[`q${q.id}`] === 'Other (Please specify)' && (
                      <input
                        type="text"
                        id={`q${q.id}_other`}
                        name={`q${q.id}_other`}
                        placeholder="Please specify"
                        onChange={(e) => handleChange(e, q.id)}
                        className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                        required
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="number"
                    min="0"
                    id={`q${q.id}`}
                    name={`q${q.id}`}
                    placeholder={q.placeholder}
                    onChange={(e) => handleChange(e, q.id)}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                      error.includes(`question ${q.id}`) ? 'border-red-500' : ''
                    }`}
                    required
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 shadow-md transition-all w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'AI Analyze'}
            </button>
          </form>
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
        </div>
      </div>
    </div>
  );
};

export default DailyQuestionnaire;
