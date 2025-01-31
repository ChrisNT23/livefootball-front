import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/MatchDetails.css";
import LoadingSpinner from "../Components/LoadingSpinner"; // Importar el spinner

const MatchDetails = () => {
  const { id } = useParams(); // ID del partido
  const [matchDetails, setMatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/football/${id}`);
        setMatchDetails(response.data);
      } catch (error) {
        console.error("Error fetching match details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails(); // Llamada inicial

    // 🔄 Actualiza los datos cada 10 segundos
    const interval = setInterval(fetchMatchDetails, 10000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [id]);

  if (loading) return <LoadingSpinner />;
  
  if (!matchDetails || !matchDetails.details) {
    return <p>Error al cargar los detalles del partido. Intenta de nuevo más tarde.</p>;
  }

  const { details, lineups, statistics, h2h } = matchDetails;
  const { teams, goals, venue, fixture, referee } = details || {};

  // 🎯 Helper function: Distribuir jugadores según la formación
  const renderFormation = (formation, players) => {
    const formationArray = formation?.split("-").map((n) => parseInt(n, 10));
    let currentIndex = 0;

    return (
      <div className="formation">
        {formationArray?.map((lineCount, lineIndex) => {
          const linePlayers = players.slice(currentIndex, currentIndex + lineCount);
          currentIndex += lineCount;

          return (
            <div key={lineIndex} className="formation-line">
              {linePlayers.map((player, playerIndex) => (
                <div key={playerIndex} className="player">
                  <img src={player.player.photo} alt={player.player.name} className="player-photo" />
                  <span className="player-name">{player.player.name}</span>
                  <span className="player-score">{player.player.rating || "N/A"}</span>
                </div>
              ))}
            </div>
          );
        })}

        {/* Agregar al portero al principio si no está incluido */}
        {players[currentIndex] && (
          <div className="formation-line">
            <div className="player">
              <img src={players[currentIndex].player.photo} alt={players[currentIndex].player.name} className="player-photo" />
              <span className="player-name">{players[currentIndex].player.name}</span>
              <span className="player-score">{players[currentIndex].player.rating || "N/A"}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="match-details-container">
      <h1>
        {teams?.home?.name || "Unknown"} vs {teams?.away?.name || "Unknown"}
      </h1>
      <p><strong>⏳ Tiempo:</strong> {fixture?.status?.elapsed || 0} min</p>
      <p><strong>⚽ Marcador:</strong> {goals?.home ?? 0} - {goals?.away ?? 0}</p>
      <p><strong>🏟️ Estadio:</strong> {venue?.name || "Desconocido"}</p>
      <p><strong>👨‍⚖️ Árbitro:</strong> {referee || "No disponible"}</p>

      {/* Alineaciones */}
      <h2>🔹 Alineaciones</h2>
      <div className="field">
        <div className="team home-team">
          <h3>{teams?.home?.name || "Equipo Local"}</h3>
          {renderFormation(lineups?.[0]?.formation, lineups?.[0]?.startXI || [])}
        </div>
        <div className="team away-team">
          <h3>{teams?.away?.name || "Equipo Visitante"}</h3>
          {renderFormation(lineups?.[1]?.formation, lineups?.[1]?.startXI || [])}
        </div>
      </div>

      {/* Historial de enfrentamientos */}
      <h2>📊 Historial de enfrentamientos</h2>
      <ul>
        {h2h?.length > 0 ? (
          h2h.map((match, index) => (
            <li key={index}>
              {match.teams?.home?.name || "Home"} {match.goals?.home ?? 0} -{" "}
              {match.goals?.away ?? 0} {match.teams?.away?.name || "Away"}
            </li>
          ))
        ) : (
          <p>No hay historial disponible.</p>
        )}
      </ul>

      {/* Estadísticas */}
      <h2>📈 Estadísticas</h2>
      <div className="statistics">
        {statistics?.length > 0 ? (
          statistics.map((stat, index) => (
            <div key={index} className="stat-team">
              <h3>{stat.team?.name || "Equipo"}</h3>
              <ul>
                {stat.statistics.map((item, i) => (
                  <li key={i}>
                    {item.type}: {item.value ?? "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No hay estadísticas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
