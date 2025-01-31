import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link to="/">⚽ Live Football</Link>
        </h1>
        <nav className="nav">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/matches" className="nav-link">Partidos</Link>
          <Link to="/teams" className="nav-link">Equipos</Link>
          <Link to="/standings" className="nav-link">Clasificación</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
