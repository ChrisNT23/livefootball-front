import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MatchesList from "./Components/MatchesList";
import MatchDetails from "./Components/MatchDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MatchesList />} />
        <Route path="/match/:id" element={<MatchDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
