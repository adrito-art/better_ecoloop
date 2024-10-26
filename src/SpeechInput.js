// src/SpeechInput.js
import React, { useState, useRef } from 'react';
import axios from 'axios';

const SpeechInput = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [carbonFootprint, setCarbonFootprint] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [audioURL, setAudioURL] = useState(''); // New state for audio URL
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    setMessage('');
    setTranscript('');
    setCarbonFootprint(null);
    setRecommendations([]);
    setAudioURL('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        setMessage('Processing your input...');

        // Create a URL for the audio blob
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        console.log('Audio Blob size:', audioBlob.size); // Log the size

        // Analyze the speech as before
        await analyzeSpeech(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMessage('Error accessing microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeSpeech = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
  
      const response = await axios.post('http://localhost:5001/analyze-speech', formData);
  
      setTranscript(response.data.transcript);
      setCarbonFootprint(response.data.carbonFootprint);
      setRecommendations(response.data.recommendations);
      setMessage('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing speech:', error);
      setMessage('Error analyzing speech. Please try again.');
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#DEAC80] p-8">
      <h2 className="text-3xl font-bold text-white mb-4">
        Describe Your Daily Activities
      </h2>
      <p className="text-white mb-8">
        Please talk about your day-to-day life. Consider the following questions to guide you:
      </p>
      <ul className="text-white list-disc mb-8">
        <li>How do you commute to work or school?</li>
        <li>What kind of food do you usually eat?</li>
        <li>How often do you travel by airplane?</li>
        <li>Do you use energy-efficient appliances?</li>
      </ul>
      {!isRecording ? (
        <button
          onClick={handleStartRecording}
          className="bg-[#D5ED9F] text-black px-6 py-3 rounded-full shadow-md hover:bg-green-400 transition-all mb-4"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={handleStopRecording}
          className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition-all mb-4"
        >
          Stop Recording
        </button>
      )}
      {message && <p className="text-white mb-4">{message}</p>}

      {audioURL && (
        <div className="mb-4">
          <h3 className="text-white mb-2">Your Recording:</h3>
          <audio controls src={audioURL} />
        </div>
      )}

      {transcript && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h3 className="font-bold mb-2">Your Input:</h3>
          <p>{transcript}</p>
        </div>
      )}
      {carbonFootprint !== null && (
        <div className="bg-white p-4 rounded shadow-md mb-4">
          <h3 className="font-bold mb-2">Estimated Carbon Footprint:</h3>
          <p>{carbonFootprint} kg CO₂ per year</p>
        </div>
      )}
      {recommendations.length > 0 && (
        <div className="bg-white p-4 rounded shadow-md">
          <h3 className="font-bold mb-2">Recommendations:</h3>
          <ul className="list-disc ml-5">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpeechInput;
