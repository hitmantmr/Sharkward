import React from 'react';
import { useApp } from '../context/AppContext';
import { Coins, ShieldCheck, Lock, Unlock } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin, toggleAdminMode, isLive } = useApp();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const formatPoints = (pts) => {
    return new Intl.NumberFormat().format(pts);
  };

  return (
    <nav style={styles.navbar} className="glass">
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => handleTabClick('home')}>
          <span style={styles.logoText}>SHARK</span>
          <span style={styles.logoSubtext}>WARD</span>
          <div style={{
            ...styles.liveIndicator,
            backgroundColor: isLive ? 'rgba(83, 252, 24, 0.1)' : 'rgba(156, 163, 175, 0.1)',
            borderColor: isLive ? 'rgba(83, 252, 24, 0.2)' : 'rgba(156, 163, 175, 0.2)',
            color: isLive ? '#53fc18' : '#9ca3af'
          }}>
            <span style={{
              ...styles.liveDot,
              backgroundColor: isLive ? '#53fc18' : '#9ca3af',
              animation: isLive ? 'pulse 1.5s infinite' : 'none'
            }}></span>
            <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
          </div>
        </div>

        {/* Navigation Shortcuts (Always Visible Links) */}
        <div style={styles.navLinks}>
          <button
            className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            Početna
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => handleTabClick('shop')}
          >
            Shop
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'watchtime' ? 'active' : ''}`}
            onClick={() => handleTabClick('watchtime')}
          >
            Watchtime
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'giveaway' ? 'active' : ''}`}
            onClick={() => handleTabClick('giveaway')}
          >
            Giveaway
          </button>
          <button
            className={`nav-link-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => handleTabClick('leaderboard')}
          >
            Leaderboard
          </button>

          {/* Admin sekcija - vidljiva samo ako je admin mod uključen */}
          {isAdmin && (
            <button
              className={`nav-link-btn admin-link-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => handleTabClick('admin')}
            >
              <ShieldCheck size={16} /> Admin Panel
            </button>
          )}
        </div>

        {/* User Stats & Admin Toggle */}
        <div style={styles.rightSection}>
          {user.isLoggedIn ? (
            <div style={styles.pointsDisplay} onClick={() => handleTabClick('watchtime')}>
              <Coins size={16} color="#00f0ff" />
              <span style={styles.pointsValue}>{formatPoints(user.points)} poena</span>
            </div>
          ) : (
            <button style={styles.connectBtn} onClick={() => handleTabClick('watchtime')}>
              Poveži Nalog
            </button>
          )}

          {/* Admin Lock Toggle */}
          <button
            style={{
              ...styles.lockBtn,
              backgroundColor: isAdmin ? 'rgba(0, 98, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: isAdmin ? '#0062ff' : 'rgba(255, 255, 255, 0.08)'
            }}
            onClick={toggleAdminMode}
            title={isAdmin ? "Ugasni Admin mod" : "Uključi Admin mod (Sharke)"}
          >
            {isAdmin ? <Unlock size={18} color="#00f0ff" /> : <Lock size={18} color="#9ca3af" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 'var(--navbar-height)',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderRadius: '0',
    borderBottom: '1px solid var(--border-color)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(10, 13, 20, 0.75)',
  },
  container: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    flexShrink: 0,
  },
  logoText: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '1px',
  },
  logoSubtext: {
    fontSize: '1.4rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginLeft: '4px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: 'rgba(235, 75, 75, 0.1)',
    border: '1px solid rgba(235, 75, 75, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#eb4b4b',
    marginLeft: '12px',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#eb4b4b',
    animation: 'pulse 1.5s infinite',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    height: '100%',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  pointsDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  pointsValue: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff',
  },
  connectBtn: {
    background: 'linear-gradient(135deg, var(--accent-blue) 0%, #0050d0 100%)',
    border: 'none',
    color: '#fff',
    padding: '0.5rem 1.1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  lockBtn: {
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// Add responsive hacks for CSS in JS
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 991px) {
      .nav-link-btn {
        padding: 0.4rem 0.5rem !important;
        font-size: 0.85rem !important;
      }
    }
    @media (max-width: 767px) {
      .liveIndicator { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}

export default Navbar;
