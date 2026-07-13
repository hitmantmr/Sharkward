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
        <div style={styles.footerMainLayout}>
          
          {/* Gornja linija: Logo levo, Povećane Društvene Mreže u sredini, Navigacija desno */}
          <div style={styles.footerTopRow}>
            
            {/* 1. Levo: Ime Sajta */}
            <div style={styles.footerLeft}>
              <div style={{ ...styles.footerLogo, cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
                <span>SHARKE</span>
                <span style={styles.logoBlue}>SHOP</span>
              </div>
            </div>

            {/* 2. Sredina: Društvene mreže u tačnoj liniji sa logom i navigacijom (Povećane ikone) */}
            <div style={styles.footerCenterSocials}>
              <div style={styles.socialIcons}>
                <a href="https://discord.gg/sharke" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Discord Server" className="footer-social-link discord">
                  <svg viewBox="0 0 127.14 96.36" fill="#5865F2" width="24" height="24">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.82.71,1.68,1.4,2.58,2a68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,95.14,85.51a105.73,105.73,0,0,0,31-18.83C129,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/sharke___/" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Instagram Profil" className="footer-social-link instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@sharke99" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="TikTok Profil" className="footer-social-link tiktok">
                  <svg viewBox="0 0 24 24" fill="#fff" width="22" height="22">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.15 2.27 1.94 3.73 2.23V10.4c-1.32-.15-2.6-.66-3.66-1.48-.82-.64-1.47-1.48-1.92-2.44V16.3c.02 1.34-.33 2.66-1.01 3.8a6.837 6.837 0 0 1-5.69 3.51c-1.63.1-3.26-.29-4.63-1.12-1.37-.84-2.42-2.12-3.02-3.64s-.59-3.23-.01-4.73A6.87 6.87 0 0 1 6.81 10.3c1.31-.56 2.76-.66 4.14-.3v3.74c-.79-.27-1.66-.27-2.45.02a3.175 3.175 0 0 0-2.07 2.9c-.06.84.22 1.68.78 2.31.56.63 1.35 1.01 2.21 1.06.86.05 1.7-.22 2.33-.78.63-.56,1.01-1.35,1.06-2.21.01-.19,0-.37,0-.56V.02Z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/@sharke123" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="YouTube Kanal" className="footer-social-link youtube">
                  <svg viewBox="0 0 24 24" fill="#FF0000" width="24" height="24">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://kick.com/sharke" target="_blank" rel="noopener noreferrer" style={styles.socialIcon} title="Kick Kanal" className="footer-social-link kick">
                  <svg viewBox="0 0 24 24" fill="#53fc18" width="24" height="24">
                    <path d="M3 3h4v4H3V3zm0 5h4v4H3V8zm0 5h4v4H3v-4zm0 5h4v4H3v-4zm5-10h4v4H8V8zm0 5h4v4H8v-4zm5-5h4v4h-4V8zm0 10h4v4h-4v-4zm5-5h4v4h-4v-4zm0-10h4v4h-4V3z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* 3. Desno Skroz: Sekcije iz Navbar-a */}
            <div style={styles.footerRightNav}>
              <button 
                className={`footer-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Početna
              </button>
              <button 
                className={`footer-nav-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => setActiveTab('shop')}
              >
                Shop
              </button>
              <button 
                className={`footer-nav-btn ${activeTab === 'watchtime' ? 'active' : ''}`}
                onClick={() => setActiveTab('watchtime')}
              >
                Watchtime
              </button>
              <button 
                className={`footer-nav-btn ${activeTab === 'giveaway' ? 'active' : ''}`}
                onClick={() => setActiveTab('giveaway')}
              >
                Giveaway
              </button>
              <button 
                className={`footer-nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaderboard')}
              >
                Leaderboard
              </button>
            </div>

          </div>

          {/* Opisni tekst centriran u redu ispod */}
          <div style={styles.footerDescRow}>
            <p style={styles.footerDescCenter}>
              Najbolje mesto za verne gledaoce Sharke strima. Gledaj live na KICK-u, skupljaj sate i uzmi najjače CS:GO skinove potpuno besplatno.
            </p>
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
  footerMainLayout: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    margin: '0 auto',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  footerTopRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: '1rem',
  },
  footerLeft: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  footerLogo: {
    fontSize: '1.4rem',
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
  footerCenterSocials: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRightNav: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.6rem',
  },
  footerDescRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerDescCenter: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: 0,
    textAlign: 'center',
    maxWidth: '520px',
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
  socialIcons: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  socialIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    background: 'transparent',
    border: 'none',
    padding: '2px',
    transition: 'transform 0.2s ease, opacity 0.2s ease',
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
