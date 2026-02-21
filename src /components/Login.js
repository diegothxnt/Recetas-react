import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar cualquier sesión previa al cargar el login
  useEffect(() => {
    localStorage.removeItem('isLoggedIn');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const username = credentials.username.trim().toLowerCase();
    const password = credentials.password.trim();
    
    if (!username || !password) {
      setError(' Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      if (username === 'admin' && password === '1234') {
        onLogin({ 
          username: credentials.username,
          password: credentials.password 
        });
      } else {
        setError(' Usuario o contraseña incorrectos');
        setCredentials({ username: '', password: '' });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon"></div>
          <h2>Recetario Digital</h2>
          <p className="login-subtitle">Acceso al sistema de gestión de recetas</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              <span className="label-icon"></span> Usuario:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              className={error ? 'input-error' : ''}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon"></span> Contraseña:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={error ? 'input-error' : ''}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {/*  ELIMINADO: Bloque de autocompletado de credenciales */}
          
          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Desarrollado para Frameworks - React</p>
        </div>
      </div>
    </div>
  );
};

export default Login;