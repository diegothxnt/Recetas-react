import React from 'react';
import './Header.css';

const Header = ({ onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo">
          <h1> Recetario Digital</h1>
          <p>Crea, organiza y comparte tus recetas favoritas</p>
        </div>
        
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;