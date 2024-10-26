import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [habitsData, setHabitsData] = useState([]);
  const [error, setError] = useState('');

  // Function to fetch habits data from the backend
  const fetchHabitsData = async () => {
    try {
      const response = await axios.get('http://localhost:5001/weekly-summary/1'); // Replace '1' with dynamic userId in production
      setHabitsData(response.data.habits);
    } catch (error) {
      setError('Error fetching habits data');
      console.error('Error fetching habits data:', error);
    }
  };

  useEffect(() => {
    // Fetch habits data when the component mounts
    fetchHabitsData();
  }, []);

  // Prepare data for the charts
  const chartData = {
    labels: habitsData.map((habit) => habit.date),
    datasets: [
      {
        label: 'Points Earned',
        data: habitsData.map((habit) => habit.points),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Points Earned Over the Last Week',
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold mb-6">Weekly Eco Habits Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {habitsData.length > 0 ? (
          <div style={{ width: '100%', margin: '0 auto' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <p>No habits data available for the past week.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
