import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Disc, MessageSquare, ShieldAlert, CheckCircle, Wifi, Calculator, Copy, Loader2 } from 'lucide-react';

const Watchtime = () => {
  const { user, linkKick, linkDiscord, unlinkKick, unlinkDiscord, generateLinkingCode, checkLinkingStatus, addToast } = useApp();
  const [kickInput, setKickInput] = useState('');
  const [discordInput, setDiscordInput] = useState('');
  const [linkingCode, setLinkingCode] = useState('');
  const [isPolling, setIsPolling] = useState(false);
  
  // Kalkulator stanja
  const [calcHours, setCalcHours] = useState('5');
  const [calcPoints, setCalcPoints] = useState(300); 
  const [cooldownText, setCooldownText] = useState('Spremno');

  // Preračunavanje poena (10 pts na 10 min = 60 pts na sat)
  useEffect(() => {
    const hours = parseFloat(calcHours) || 0;
    const pts = Math.round(hours * 60);
    setCalcPoints(pts);
  }, [calcHours]);

  // Cooldown tajmer za sledeću poruku
  useEffect(() => {
    if (!user.lastRewardAt || !user.kickLinked) {
      setCooldownText('Spremno');
      return;
    }

    const calculateCooldown = () => {
      const lastReward = new Date(user.lastRewardAt);
      const nextRewardTime = new Date(lastReward.getTime() + 10 * 60 * 1000);
      const now = new Date();
      const diffMs = nextRewardTime - now;

      if (diffMs <= 0) {
        setCooldownText('Spremno');
      } else {
        const minutes = Math.floor(diffMs / 1000 / 60);
        const seconds = Math.floor((diffMs / 1000) % 60);
        const formattedSec = seconds < 10 ? `0${seconds}` : seconds;
        setCooldownText(`${minutes}:${formattedSec}`);
      }
    };

    calculateCooldown();
    const interval = setInterval(calculateCooldown, 1000);
    return () => clearInterval(interval);
  }, [user.lastRewardAt, user.kickLinked]);

  // Polling za status povezivanja koda
  useEffect(() => {
    let interval = null;
    if (isPolling && linkingCode) {
      interval = setInterval(async () => {
        const isLinked = await checkLinkingStatus(linkingCode);
        if (isLinked) {
          setIsPolling(false);
          setLinkingCode('');
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, linkingCode]);

  const formatWatchtime = (hoursVal) => {
    const totalMinutes = Math.round((hoursVal || 0) * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleLinkKick = (e) => {
    e.preventDefault();
    if (kickInput.trim()) {
      linkKick(kickInput.trim());
      setKickInput('');
    }
  };

  const handleStartDiscordLink = async () => {
    setIsPolling(true);
    const code = await generateLinkingCode();
    setLinkingCode(code);
  };

  const handleCancelDiscordLink = () => {
    setIsPolling(false);
    setLinkingCode('');
    addToast('Povezivanje Discord naloga otkazano.', 'info');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast(`Kod "${text}" kopiran u privremenu memoriju!`, 'success');
  };

  const formatPoints = (pts) => {
    return new Intl.NumberFormat().format(pts);
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header}>
        <h2 style={styles.title}>Watchtime & Poeni</h2>
        <p style={styles.subtitle}>Upravljaj svojim povezanim nalozi i prati sakupljanje poena u realnom vremenu</p>
      </div>

      {/* Upozorenje i Obaveštenje ako Discord nije povezan */}
      {!user.discordLinked && (
        <div className="discord-lock-banner">
          <ShieldAlert size={22} color="#00f0ff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', color: '#00f0ff', marginBottom: '2px', fontSize: '0.95rem' }}>
              🔒 SAKUPLJANJE POENA I KICK UNOS SU ZAKLJUČANI
            </div>
            <span>
              Moraš prvo povezati svoj <strong>Discord nalog</strong>. Ako još uvek nisi član Sharke Discord servera, obavezno se pridruži OVDE: {' '}
              <a href="https://discord.gg/n2t8ZBDfH3" target="_blank" rel="noopener noreferrer">
                discord.gg/n2t8ZBDfH3
              </a>
            </span>
          </div>
        </div>
      )}

      {/* Red 1: Povezivanje (Discord levo, Kick desno) */}
      <div style={styles.connectionGrid}>
        
        {/* Discord Povezivanje */}
        <div style={styles.card} className="glass">
          <div style={styles.cardHeader}>
            <div style={styles.platformIconDiscord}>
              <svg viewBox="0 0 127.14 96.36" width="20" height="20" fill="#fff">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.87-.64,1.72-1.31,2.54-2a75.48,75.48,0,0,0,73,0c.83.69,1.68,1.36,2.54,2a68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,95.14,96.36a105.73,105.73,0,0,0,31-18.83C129,54.65,122.94,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
              </svg>
            </div>
            <div>
              <h3 style={styles.cardTitle}>Discord Nalog</h3>
              <p style={styles.cardDesc}>Potrebno za isporuku skinova i giveaway učešće</p>
            </div>
          </div>

          {user.discordLinked ? (
            <div style={styles.linkedWrapper}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.discordAvatar ? (
                  <img src={user.discordAvatar} alt="Avatar" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    <svg viewBox="0 0 127.14 96.36" width="18" height="18" fill="#fff">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.87-.64,1.72-1.31,2.54-2a75.48,75.48,0,0,0,73,0c.83.69,1.68,1.36,2.54,2a68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,95.14,96.36a105.73,105.73,0,0,0,31-18.83C129,54.65,122.94,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                    </svg>
                  </div>
                )}
                <div>
                  <div style={styles.statusPillSuccess}>
                    <CheckCircle size={12} /> Povezan
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <div style={styles.linkedInfo}>
                  <span>Korisničko ime:</span>
                  <strong>@{user.discordUser}</strong>
                </div>
                <div style={{ ...styles.linkedInfo, marginTop: '8px' }}>
                  <span>Discord ID:</span>
                  <strong>{user.discordId}</strong>
                </div>
              </div>

              <button style={styles.unlinkBtn} onClick={unlinkDiscord}>
                Prekini vezu
              </button>
            </div>
          ) : (
            <div style={styles.linkPromptWrapper}>
              <p style={styles.linkPromptText}>
                Da bi dobio mogućnost kupovine skinova u prodavnici i učešće u našim premium giveaway-ima, moraš povezati svoj Discord nalog.
              </p>
              <button 
                onClick={linkDiscord} 
                className="glow-btn-primary" 
                style={{ ...styles.submitBtn, marginTop: '1rem', backgroundColor: '#5865f2' }}
              >
                Poveži Discord
              </button>
            </div>
          )}
        </div>

        {/* Kick Povezivanje - Blurovano dok ne poveže Discord */}
        <div 
          style={{ 
            ...styles.card, 
            filter: user.discordLinked ? 'none' : 'blur(5px)',
            opacity: user.discordLinked ? 1 : 0.45,
            pointerEvents: user.discordLinked ? 'auto' : 'none',
            userSelect: user.discordLinked ? 'auto' : 'none',
            position: 'relative' 
          }} 
          className="glass"
        >
          <div style={styles.cardHeader}>
            <div style={styles.platformIconKick}>K</div>
            <div>
              <h3 style={styles.cardTitle}>Kick Nalog</h3>
              <p style={styles.cardDesc}>Potrebno za sakupljanje poena dok gledaš strim</p>
            </div>
          </div>

          {user.kickLinked ? (
            <div style={styles.linkedWrapper}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.kickAvatar ? (
                  <img src={user.kickAvatar} alt="Avatar" style={styles.avatarImg} />
                ) : (
                  <div style={{ ...styles.avatarPlaceholder, backgroundColor: '#53fc18' }}>
                    <span style={{ fontWeight: '900', color: '#000', fontSize: '0.9rem' }}>K</span>
                  </div>
                )}
                <div>
                  <div style={styles.statusPillSuccess}>
                    <CheckCircle size={12} /> Povezan
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <div style={styles.linkedInfo}>
                  <span>Korisničko ime:</span>
                  <strong>@{user.kickUser}</strong>
                </div>
                {user.kickId && (
                  <div style={{ ...styles.linkedInfo, marginTop: '8px' }}>
                    <span>Kick ID:</span>
                    <strong>{user.kickId}</strong>
                  </div>
                )}
              </div>

              <button style={styles.unlinkBtn} onClick={unlinkKick}>
                Prekini vezu
              </button>
            </div>
          ) : (
            <div style={styles.linkPromptWrapper}>
              <p style={styles.linkPromptText}>
                Poveži svoj Kick nalog preko autorizacije da bi sistem prepoznao tvoje sate gledanja uživo na strimu.
              </p>
              <button 
                onClick={linkKick} 
                className="glow-btn-cyan" 
                style={{ ...styles.submitBtn, marginTop: '1rem', backgroundColor: '#53fc18', color: '#000' }}
              >
                Poveži Kick
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Red 2: Statistika i Kalkulator - Blurovano dok ne poveže Discord */}
      <div 
        style={{ 
          ...styles.statsGrid,
          filter: user.discordLinked ? 'none' : 'blur(5px)',
          opacity: user.discordLinked ? 1 : 0.45,
          pointerEvents: user.discordLinked ? 'auto' : 'none',
          userSelect: user.discordLinked ? 'auto' : 'none'
        }}
      >
        
        {/* Real-time Panel */}
        <div style={styles.cardPoints} className="glass">
          <div style={styles.liveHeader}>
            <div style={styles.liveIndicator}>
              <Wifi size={16} className={user.kickLinked ? 'pulse-icon' : ''} color={user.kickLinked ? '#00ff88' : '#eb4b4b'} />
              <span style={{ color: user.kickLinked ? '#00ff88' : '#eb4b4b', fontWeight: '700', fontSize: '0.8rem' }}>
                {user.kickLinked ? 'LIVE SINHRONIZACIJA AKTIVNA' : 'SINKRONIZACIJA NEAKTIVNA'}
              </span>
            </div>
            {user.kickLinked && <span style={styles.rateLabel}>+10 pts / 10 min</span>}
          </div>

          <div style={styles.pointsShowcase}>
            <span style={styles.pointsShowcaseLabel}>Ukupno Poena</span>
            <div style={styles.pointsLargeVal}>
              <Coins size={36} color="#00f0ff" />
              <span>{user.discordLinked ? formatPoints(user.points) : '0'}</span>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.subStat}>
              <span style={styles.subStatLabel}>Sati Gledanja</span>
              <span style={styles.subStatVal}>{user.discordLinked ? formatWatchtime(user.hoursWatched) : '0h 0m'}</span>
            </div>
            <div style={styles.subStat}>
              <span style={styles.subStatLabel}>Sledeći poeni za</span>
              <span style={{ ...styles.subStatVal, color: cooldownText === 'Spremno' ? '#00ff88' : '#e5c158' }}>
                {cooldownText}
              </span>
            </div>
          </div>

          {user.kickLinked ? (
            <div style={styles.syncNotice}>
              <div className="live-dot-green"></div>
              <p style={{ color: '#00ff88', fontSize: '0.85rem' }}>
                Poeni se uspešno sakupljaju! Samo piši u Kick chatu tokom strima uživo.
              </p>
            </div>
          ) : (
            <div style={styles.syncNoticeWarn}>
              <ShieldAlert size={18} color="#eb4b4b" />
              <p style={{ color: '#eb4b4b', fontSize: '0.85rem' }}>
                Poveži Kick nalog kako bi počeo sakupljanje poena pisanjem u Kick chatu tokom strima uživo.
              </p>
            </div>
          )}
        </div>

        {/* Kalkulator poena */}
        <div style={styles.card} className="glass">
          <div style={styles.cardHeader}>
            <Calculator size={22} color="var(--accent-cyan)" />
            <div>
              <h3 style={styles.cardTitle}>Kalkulator Gledanja</h3>
              <p style={styles.cardDesc}>Izračunaj koliko poena možeš sakupiti</p>
            </div>
          </div>

          <div style={styles.calcBody}>
            <div style={styles.calcInputGroup}>
              <label style={styles.calcLabel}>Sati gledanja strima:</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={calcHours}
                onChange={(e) => setCalcHours(e.target.value)}
                style={styles.calcInput}
              />
            </div>

            <div style={styles.calcResults}>
              <div style={styles.calcResultItem}>
                <span>Procenjeni poeni:</span>
                <div style={styles.calcPointsVal}>
                  <Coins size={18} color="#00f0ff" />
                  <span>{formatPoints(calcPoints)} pts</span>
                </div>
              </div>
            </div>

            <div style={styles.calcTip}>
              💡 <em>Zanimljivost:</em> Sa {calcHours} sati gledanja možeš kupiti skinove u vrednosti do {formatPoints(calcPoints)} poena!
            </div>
          </div>
        </div>

      </div>

      {/* CSS za live animaciju ikone */}
      <style>{`
        @keyframes pulse-wifi {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .pulse-icon {
          animation: pulse-wifi 1.5s infinite;
        }
        .live-dot-green {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #00ff88;
          animation: pulse-wifi 1s infinite;
          margin-top: 5px;
        }
        @keyframes spin-wt {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spin-icon-watchtime {
          animation: spin-wt 1.2s linear infinite;
          color: var(--accent-cyan);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    '@media (min-width: 992px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  connectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    alignItems: 'stretch',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1.5rem',
    height: '100%',
    boxSizing: 'border-box',
  },
  cardPoints: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    background: 'linear-gradient(135deg, rgba(16, 22, 35, 0.8) 0%, rgba(10, 15, 25, 0.9) 100%)',
    border: '1px solid rgba(0, 240, 255, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  platformIconKick: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#53fc18',
    color: '#000',
    fontSize: '1.4rem',
    fontWeight: '900',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Impact, sans-serif',
  },
  platformIconDiscord: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#5865F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#fff',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    justifyContent: 'space-between',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
  },
  inputPrefix: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
    userSelect: 'none',
  },
  input: {
    background: 'none',
    border: 'none',
    color: '#fff',
    outline: 'none',
    fontSize: '0.95rem',
    width: '100%',
    fontFamily: 'var(--font-sans)',
  },
  submitBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '0.75rem',
    marginTop: 'auto',
  },
  avatarImg: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '2px solid #5865F2',
    boxShadow: '0 0 10px rgba(88, 101, 242, 0.3)',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#5865F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '1.25rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    flex: 1,
  },
  statusPillSuccess: {
    alignSelf: 'flex-start',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    color: '#00ff88',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  linkedInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
  },
  unlinkBtn: {
    background: 'none',
    border: '1px solid rgba(235, 75, 75, 0.25)',
    color: '#eb4b4b',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
    marginTop: 'auto',
    ':hover': {
      backgroundColor: 'rgba(235, 75, 75, 0.05)',
    }
  },
  liveHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  rateLabel: {
    fontSize: '0.75rem',
    color: 'var(--accent-cyan)',
    backgroundColor: 'var(--accent-cyan-glow)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  pointsShowcase: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem 0',
    borderBottom: '1px solid var(--border-color)',
  },
  pointsShowcaseLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  pointsLargeVal: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#fff',
    marginTop: '0.5rem',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    textAlign: 'center',
  },
  subStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  subStatLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  subStatVal: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
  },
  syncNotice: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    backgroundColor: 'rgba(0, 255, 136, 0.04)',
    border: '1px solid rgba(0, 255, 136, 0.1)',
    padding: '1rem',
    borderRadius: '8px',
  },
  syncNoticeWarn: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    backgroundColor: 'rgba(235, 75, 75, 0.04)',
    border: '1px solid rgba(235, 75, 75, 0.1)',
    padding: '1rem',
    borderRadius: '8px',
  },
  calcBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  calcInputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  calcLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  calcInput: {
    backgroundColor: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    color: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-sans)',
  },
  calcResults: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  calcResultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.95rem',
  },
  calcPointsVal: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
  },
  calcTip: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  linkingCodeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem 0',
  },
  codeSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.2rem',
    textAlign: 'center',
  },
  codeBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px dashed var(--accent-cyan)',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    width: '100%',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    letterSpacing: '1px',
  },
  copyCodeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  },
  instructionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    margin: '0.5rem 0',
  },
  instructionStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
  },
  stepNum: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: 'var(--border-color)',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    lineHeight: '1.3',
    textAlign: 'left',
  },
  pollingStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    color: 'var(--accent-cyan)',
    marginTop: '0.5rem',
  },
  cancelLinkBtn: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-secondary)',
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    marginTop: 'auto',
    width: '100%',
  },
  linkPromptWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0.5rem 0',
    flex: 1,
    gap: '1rem',
  },
  linkPromptText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  }
};

export default Watchtime;
