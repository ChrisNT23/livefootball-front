import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MatchesList from "./Components/MatchesList";
import MatchDetails from "./Components/MatchDetails";
import Header from "./Components/Header"; // Importamos el Header

function App() {
  return (
    <Router>
      <Header /> {/* Agregamos el Header aquí para que esté en todas las páginas */}
      <Routes>
        <Route path="/" element={<MatchesList />} />
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
