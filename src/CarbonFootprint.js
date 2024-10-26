// Updated CarbonFootprint.js
import React, { useState } from 'react';
import axios from 'axios';

const CarbonFootprint = () => {
  const [activity, setActivity] = useState('');
  const [value, setValue] = useState('');
  const [footprint, setFootprint] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/calculate-footprint', { // Updated port number to 5001
        activity,
        value: parseFloat(value),
      });
      setFootprint(response.data.footprint);
      setError('');
    } catch (err) {
      setError('Error calculating footprint. Please try again.');
      console.error('Error calculating footprint:', err);
    }
  };

  return (
    <div>
      <h2>Calculate Your Carbon Footprint</h2>
      <form onSubmit={handleCalculate}>
        <div>
          <label>Activity:</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} required>
            <option value="">Select an activity</option>
            <option value="transportation">Transportation (km traveled)</option>
            <option value="meals">Meals (number of meals)</option>
            <option value="electricity">Electricity (kWh used)</option>
          </select>
        </div>
        <div>
          <label>Value:</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit">Calculate Footprint</button>
      </form>
      {footprint !== null && (
        <div>
          <h3>Your Estimated Carbon Footprint: {footprint} kg CO2</h3>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CarbonFootprint;