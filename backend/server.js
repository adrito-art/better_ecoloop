// server.js

require('dotenv').config(); // Load environment variables
console.log('Cohere API Key:', process.env.COHERE_API_KEY);
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const axios = require('axios');

const app = express();
const PORT = 5001;

// Use CORS to allow cross-origin requests
app.use(cors());

// Middleware to parse incoming JSON
app.use(express.json());

// Set up Multer for file uploads (if needed for other functionalities)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Resolve the database file path
const dbPath = path.resolve(__dirname, 'users.db');

// Set up SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to the database:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);

    // Enable foreign key constraints
    db.run('PRAGMA foreign_keys = ON', (err) => {
      if (err) {
        console.error('Failed to enable foreign keys:', err.message);
      } else {
        console.log('Foreign keys enabled.');
        createTables();
      }
    });
  }
});

// Create tables
function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    habit TEXT NOT NULL,
    date TEXT NOT NULL,
    points INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamName TEXT NOT NULL UNIQUE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teamId INTEGER,
    userId INTEGER,
    FOREIGN KEY(teamId) REFERENCES teams(id),
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    goalName TEXT NOT NULL,
    targetDate TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS questionnaire_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    date TEXT NOT NULL,
    q1 INTEGER,
    q2 INTEGER,
    q3 INTEGER,
    q4 TEXT,
    q5 INTEGER,
    q6 TEXT,
    q7 INTEGER,
    q8 TEXT,
    q9 INTEGER,
    q10 TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);
}

// ===================== Routes =====================

// Register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Missing required fields: username, password');
  }

  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(query, [username, password], function (err) {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).send('Error registering user');
    }
    res.status(201).send({ id: this.lastID, message: 'User registered successfully' });
  });
});

// Serve Habit Tracker page
app.get('/habit-tracker', (req, res) => {
  // Assuming you have a habit tracker HTML or index page to serve for this route
  res.sendFile(path.join(__dirname, 'public', 'habit-tracker.html')); 
});


// Track habit
app.post('/track-habit', (req, res) => {
  const { userId, habit, date, points } = req.body;
  if (!userId || !habit || !date) {
    return res.status(400).send('Missing required fields: userId, habit, or date');
  }

  const query = `INSERT INTO habits (userId, habit, date, points) VALUES (?, ?, ?, ?)`;
  db.run(query, [userId, habit, date, points], function (err) {
    if (err) {
      console.error('Error tracking habit:', err);
      return res.status(500).send('Error tracking habit');
    }
    res.status(201).send({ id: this.lastID, message: 'Habit tracked successfully' });
  });
});

// Serve Habit Tracker page
app.get('/habit-tracker', (req, res) => {
  // Assuming you have a habit tracker HTML or index page to serve for this route
  res.sendFile(path.join(__dirname, 'public', 'habit-tracker.html')); 
});
// Daily questionnaire
app.post('/daily-questionnaire', (req, res) => {
  const { userId, responses, date } = req.body;
  if (!userId || !responses || !date) {
    return res.status(400).send('Missing required fields: userId, responses, date');
  }

  const query = `
    INSERT INTO questionnaire_responses 
    (userId, date, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    userId,
    date,
    responses.q1,
    responses.q2,
    responses.q3,
    responses.q4,
    responses.q5,
    responses.q6,
    responses.q7,
    responses.q8,
    responses.q9,
    responses.q10,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error saving questionnaire responses:', err);
      return res.status(500).send('Error saving questionnaire responses');
    }
    res.status(201).send({ id: this.lastID, message: 'Questionnaire responses saved successfully' });
  });
});

 // Add this route to handle transcription evaluation
// Daily questionnaire AI evaluation
app.post('/ai-evaluate', async (req, res) => {
  const { transcriptionText, userId } = req.body;

  if (!transcriptionText || !userId) {
    return res.status(400).send('Missing required fields: transcriptionText or userId');
  }

  try {
    const prompt = `The user has provided the following speech transcription about their daily eco habits: "${transcriptionText}"

    Based on this input, provide 4-5 personalized, practical, and easy-to-implement recommendations to reduce the user's carbon footprint. 
    For each recommendation, also assign a score between 5 and 15 points based on the user's efforts. Provide your response in the following format:
    
    Recommendation 1: <recommendation text> (Points: <points>)
    Recommendation 2: <recommendation text> (Points: <points>)
    Recommendation 3: <recommendation text> (Points: <points>)
    Recommendation 4: <recommendation text> (Points: <points>)
    Summary: <summary within 50 words>.
    Make the output concise and easy to read.`;

    const response = await axios.post('https://api.cohere.ai/generate', {
      model: 'command-xlarge-nightly',
      prompt: prompt,
      max_tokens: 350,
      temperature: 0.7,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
    });

    if (!response || !response.data || !response.data.text) {
      throw new Error('Invalid response from Cohere API');
    }

    const generatedText = response.data.text.trim() || 'No recommendations available.';
    const recommendationData = extractRecommendationsAndPoints(generatedText);

    res.status(200).send({
      recommendations: recommendationData.recommendations,
      points: recommendationData.totalPoints,
    });
  } catch (error) {
    console.error('Error communicating with Cohere API:', error.message);
    res.status(500).send('Error generating recommendations');
  }
});


function calculatePoints(transcription) {
  // Normalize transcription text to lowercase to allow easier matching
  const normalizedText = transcription.toLowerCase();
  
  // Simple scoring system based on keywords
  let points = 0;
  const positiveActions = [
    { regex: /saved water/, points: 5 },
    { regex: /used public transport/, points: 10 },
    { regex: /avoided plastic|avoided plastics/, points: 8 },
    { regex: /plant-based meal|plant-based meals/, points: 7 },
    { regex: /recycled/, points: 6 },
    { regex: /saved electricity/, points: 9 },
    { regex: /walked/, points: 4 },
    { regex: /biked/, points: 4 },
    { regex: /community activity|community activities/, points: 10 }
  ];

  // Check each action regex against the transcription and award points accordingly
  positiveActions.forEach(action => {
    if (action.regex.test(normalizedText)) {
      points += action.points;
    }
  });

  // Ensure the user earns a minimum of 5 points, if no points were awarded.
  if (points === 0) {
    points = 5;
  }

  console.log('Total Points:', points); // Debug statement to see total points in terminal

  return points;
}




// Function to Generate Prompt Based on Questionnaire Responses
function generatePrompt(responses) {
  return `The user has provided the following daily eco habits:

  1. Hours spent commuting: ${responses.q1} hours
  2. Water conserved: ${responses.q2} liters
  3. Plant-based meals consumed: ${responses.q3}
  4. Recycled waste today: ${responses.q4}
  5. Electricity saved: ${responses.q5} kWh
  6. Used public transportation: ${responses.q6}
  7. Plastic items avoided: ${responses.q7}
  8. Engaged in energy-efficient practices: ${responses.q8}
  9. Kilometers walked or biked: ${responses.q9} km
  10. Participated in community environmental activities: ${responses.q10}

  Based on the user's daily eco habits provided above, please prvide small explanation within 50 words:

  Provide 4-5 personalized, practical, and easy-to-implement recommendations to reduce a person's carbon footprint. Include a brief summary at the end.And concise it and easy to read `;
}

// Function to Extract Recommendation from Generated Text
function extractRecommendationsAndPoints(generatedText) {
  if (!generatedText) {
    return {
      recommendations: 'No meaningful recommendations were generated. Please try again with updated inputs.',
      totalPoints: 0
    };
  }

  const lines = generatedText.split('\n').filter(line => line.trim());
  const recommendations = [];
  let totalPoints = 0;

  // Extract lines that contain recommendations and points.
  lines.forEach(line => {
    const match = line.match(/(.*) \(Points: (\d+)\)$/);
    if (match) {
      const recommendationText = match[1].trim();
      const points = parseInt(match[2], 10);
      recommendations.push(recommendationText);
      totalPoints += points;
    }
  });

  // Ensure the user earns a minimum of 5 points, if no points were awarded.
  if (totalPoints === 0) {
    totalPoints = 5;
  }

  return {
    recommendations: recommendations.join('\n'),
    totalPoints: totalPoints
  };
}


// Get weekly habits summary for a user
app.get('/weekly-summary/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('Missing required parameter: userId');
  }

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const todayStr = today.toISOString().split('T')[0];
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const query = `
    SELECT * FROM habits 
    WHERE userId = ? AND date BETWEEN ? AND ?
    ORDER BY date ASC
  `;

  db.all(query, [userId, sevenDaysAgoStr, todayStr], (err, rows) => {
    if (err) {
      console.error('Error fetching weekly habits data:', err);
      return res.status(500).send('Error fetching weekly habits data');
    }
    res.status(200).send({ habits: rows });
  });
});

// Create a new team
app.post('/create-team', (req, res) => {
  const { teamName } = req.body;
  if (!teamName) {
    return res.status(400).send('Missing required field: teamName');
  }

  const query = `INSERT INTO teams (teamName) VALUES (?)`;
  db.run(query, [teamName], function (err) {
    if (err) {
      console.error('Error creating team:', err);
      return res.status(500).send('Error creating team');
    }
    res.status(201).send({ id: this.lastID, message: 'Team created successfully' });
  });
});

// Join a team
app.post('/join-team', (req, res) => {
  const { userId, teamId } = req.body;
  if (!userId || !teamId) {
    return res.status(400).send('Missing required fields: userId, teamId');
  }

  const query = `INSERT INTO team_members (teamId, userId) VALUES (?, ?)`;
  db.run(query, [teamId, userId], function (err) {
    if (err) {
      console.error('Error joining team:', err);
      return res.status(500).send('Error joining team');
    }
    res.status(201).send({ id: this.lastID, message: 'Team joined successfully' });
  });
});

// Get all teams with their IDs
app.get('/teams', (req, res) => {
  const query = `SELECT id, teamName FROM teams`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching teams:', err);
      return res.status(500).send('Error fetching teams');
    }
    // Send back the list of teams including their IDs
    res.status(200).send({ teams: rows });
  });
});

app.post('/ai-evaluate-transcription', async (req, res) => {
  const { transcriptionText, userId } = req.body;

  if (!transcriptionText || !userId) {
    return res.status(400).send('Missing required fields: transcriptionText or userId');
  }

  try {
    console.log('Sending request to Cohere API with the following prompt:');
    const prompt = `The user has provided the following speech transcription about their daily eco habits: "${transcriptionText}"

    Based on this input, provide 4-5 personalized, practical, and easy-to-implement recommendations to reduce the user's carbon footprint. 
    For each recommendation, also assign a score between 5 and 15 points based on the user's efforts. Provide your response in the following format:
    
    Recommendation 1: <recommendation text> (Points: <points>)
    Recommendation 2: <recommendation text> (Points: <points>)
    Recommendation 3: <recommendation text> (Points: <points>)
    Recommendation 4: <recommendation text> (Points: <points>)
    Summary: <summary within 50 words>.
    Make the output concise and easy to read.`;

    // Send request to Cohere API using REST API
    const response = await axios.post('https://api.cohere.ai/generate', {
      model: 'command-xlarge-nightly',
      prompt: prompt,
      max_tokens: 350,
      temperature: 0.7,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
    });

    if (!response || !response.data || !response.data.text) {
      throw new Error('Invalid response from Cohere API');
    }

    const generatedText = response.data.text.trim() || 'No recommendations available.';
    const recommendationData = extractRecommendationsAndPoints(generatedText);

    res.status(200).send({
      recommendations: recommendationData.recommendations,
      points: recommendationData.totalPoints
    });
  } catch (error) {
    console.error('Error communicating with Cohere API:', error.message);
    console.error('Error details:', error.response ? error.response.data : 'No additional error response data');
    res.status(500).send('Error generating recommendations');
  }
});


// Function to extract recommendations from the generated text
function extractRecommendation(generatedText) {
  if (!generatedText) {
    return 'No meaningful recommendations were generated. Please try again with updated inputs.';
  }

  const lines = generatedText.split('\n').filter(line => line.trim());
  const recommendations = [];

  for (let line of lines) {
    if (line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('4.') || line.includes('5.')) {
      recommendations.push(line.trim());
    }
  }

  return recommendations.length ? recommendations.join('\n') : generatedText;
}

// Add a new route to delete all teams from the database
app.delete('/reset-teams', (req, res) => {
  const query = 'DELETE FROM teams';
  db.run(query, function (err) {
    if (err) {
      console.error('Error resetting teams:', err);
      return res.status(500).send('Error resetting teams');
    }
    res.status(200).send({ message: 'Teams reset successfully' });
  });
});



// ===================== Start the Server =====================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
