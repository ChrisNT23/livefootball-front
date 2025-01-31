import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/MatchesList.css";
import LoadingSpinner from "../Components/LoadingSpinner";

const MatchesList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setLoading(true); // Activa el loader al cargar de nuevo
      const response = await axios.get("http://localhost:5000/api/football");
      console.log("📊 Datos recibidos del backend:", response.data);

      if (response.data.response.length === 0) {
        console.warn("⚠️ No hay partidos en vivo");
        setMatches([]);
      } else {
        setMatches(response.data.response);
      }
    } catch (error) {
      console.error("🚨 Error obteniendo partidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    
    const interval = setInterval(() => {
      console.log("🔄 Actualizando lista de partidos...");
      fetchMatches();
    }, 30000); // Refrescar cada 30 segundos

    return () => clearInterval(interval); // Limpieza al desmontar
  }, []);

  if (loading) return <LoadingSpinner />;

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
          {matches.length > 0 ? (
            matches.map((match, index) => (
              <tr key={index}>
                <td>{match.fixture?.status?.elapsed || "Not Started"} min</td>
                <td>
                  <Link to={`/match/${match.fixture.id}`}>
                    {match.teams?.home?.name}
                  </Link>
                </td>
                <td>{match.teams?.away?.name}</td>
                <td>
                  {match.goals?.home !== null && match.goals?.away !== null
                    ? `${match.goals.home} - ${match.goals.away}`
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No hay partidos en vivo
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesList;
