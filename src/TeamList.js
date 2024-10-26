import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeamList() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await axios.get('http://localhost:5001/teams');
        setTeams(response.data.teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    }

    fetchTeams();
  }, []);

  return (
    <div>
      <h1>Team List</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.teamName} - Team ID: {team.id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamList;
