import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import FloatingCircles from './components/FloatingCircles';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';

// Uvoz stranica
import Home from './pages/Home';
import Shop from './pages/Shop';
import Watchtime from './pages/Watchtime';
import Giveaway from './pages/Giveaway';
import Leaderboard from './pages/Leaderboard';
import Admin from './pages/Admin';

import { MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

const AppContent = () => {
  const getSubpathBase = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const validTabs = ['home', 'shop', 'watchtime', 'giveaway', 'leaderboard', 'admin'];
    if (parts.length > 0 && !validTabs.includes(parts[0].toLowerCase())) {
      return `/${parts[0]}`;
    }
    return '';
  };

  const getInitialTab = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const lastPart = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : '';
    const validTabs = ['home', 'shop', 'watchtime', 'giveaway', 'leaderboard', 'admin'];
    if (validTabs.includes(lastPart)) {
      return lastPart;
    }
    return localStorage.getItem('activeTab') || 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);
  const { isAdmin, toggleAdminMode } = useApp();

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('activeTab', tab);
    const base = getSubpathBase();
    const newPath = tab === 'home' ? (base ? `${base}/` : '/') : `${base}/${tab}`;
    window.history.pushState({}, '', newPath);
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const lastPart = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : '';
      const validTabs = ['home', 'shop', 'watchtime', 'giveaway', 'leaderboard', 'admin'];
      if (validTabs.includes(lastPart)) {
        setActiveTabState(lastPart);
      } else {
        setActiveTabState('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'shop':
        return <Shop setActiveTab={setActiveTab} />;
      case 'watchtime':
        return <Watchtime />;
      case 'giveaway':
        return <Giveaway />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'admin':
        return isAdmin ? <Admin /> : <Home setActiveTab={setActiveTab} />;
      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* Krugovi koji lete po stranici u pozadini */}
      <FloatingCircles />

      {/* Navigacioni meni */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Glavni sadržaj */}
      <main className="main-content">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={styles.footer} className="glass">
        <div style={styles.footerContainer}>
          <div style={styles.footerLeft}>
            <div style={styles.footerLogo}>
              <span>SHARKE</span>
              <span style={styles.logoBlue}>SHOP</span>
            </div>
            <p style={styles.footerDesc}>
              Najbolje mesto za verne gledaoce Sharke strima. Gledaj live na KICK-u, skupljaj sate i uzmi najjače CS:GO skinove potpuno besplatno.
            </p>
          </div>

          <div style={styles.footerRight}>
            <div style={styles.socialTitle}>Prati Sharke-a</div>
            <div style={styles.socialIcons}>
              <a href="https://kick.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Kick Kanal">
                <span style={{ fontWeight: '900', color: '#53fc18' }}>K</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="YouTube Kanal">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ff0000" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#ff0000"></polygon>
                </svg>
              </a>
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Discord Server">
                <MessageSquare size={18} color="#5865f2" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Twitter Profil">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="#1da1f2" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p>© 2026 SHARKE SHOP. Sva prava zadržana. Sajt je napravljen u promotivne svrhe.</p>
          <div style={styles.footerAdminToggle} onClick={toggleAdminMode}>
            <ShieldCheck size={14} color={isAdmin ? '#e5c158' : 'var(--text-muted)'} />
            <span>Admin status: {isAdmin ? 'Aktivan' : 'Neaktivan'}</span>
          </div>
        </div>
      </footer>

      {/* Kontejner za obaveštenja */}
      <ToastContainer />
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const styles = {
  footer: {
    borderBottom: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: '0',
    borderTop: '1px solid var(--border-color)',
    padding: '3rem 1.5rem 1.5rem',
    marginTop: '5rem',
    background: 'rgba(10, 13, 20, 0.9)',
  },
  footerContainer: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2.5rem',
    textAlign: 'left',
    paddingBottom: '2.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  footerLeft: {
    flex: '1 1 350px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  footerLogo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.5px',
  },
  logoBlue: {
    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginLeft: '4px',
  },
  footerDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '480px',
  },
  footerRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  socialTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  socialIcons: {
    display: 'flex',
    gap: '12px',
  },
  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'var(--accent-cyan)',
      transform: 'translateY(-2px)',
    }
  },
  footerBottom: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    margin: '0 auto',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    textAlign: 'left',
  },
  footerAdminToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.03)',
      color: '#fff',
    }
  }
};

export default App;
