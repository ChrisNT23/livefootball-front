import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MatchesList.css";
import LoadingSpinner from "../Components/LoadingSpinner"; // Importar el spinner


const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/football");
        setMatches(response.data.response); // Ajusta según la estructura de la API
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

/*  if (loading) return <p>Cargando...</p>;*/
if (loading) return <LoadingSpinner />

  return (
    <div className="matches-container">
      <h1 className="title">Partidos en Vivo</h1>
      <table className="matches-table">
        <thead>
          <tr>
            <th>Tiempo de Juego</th>
            <th>Equipo Local</th>
            <th>Equipo Visitante</th>
            <th>Marcador</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match, index) => (
            <tr key={index}>
              <td>{match.fixture.status.elapsed || "Not Started"} min</td>
              <td>
                <Link to={`/match/${match.fixture.id}`}>
                  {match.teams.home.name}
                </Link>
              </td>
              <td>{match.teams.away.name}</td>
              <td>
                {match.goals.home !== null && match.goals.away !== null
                  ? `${match.goals.home} - ${match.goals.away}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesList;
