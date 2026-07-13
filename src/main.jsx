import React, { Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React tree:", error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0d14',
          color: '#fff',
          fontFamily: "'Chakra Petch', sans-serif",
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#00f0ff' }}>Došlo je do neočekivane greške</h2>
          <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '500px' }}>
            Aplikacija je naišla na problem sa lokalnim podacima pretraživača. Kliknite na dugme ispod da osvežite podesavanja i nastavite.
          </p>
          <button
            onClick={this.handleReset}
            className="glow-btn-cyan"
            style={{
              padding: '0.85rem 2rem',
              borderRadius: '8px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            Resetuj i Osveži Stranicu
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
