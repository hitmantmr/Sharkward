import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Trophy, Clock, Coins, User } from 'lucide-react';

const Leaderboard = () => {
  const { user, leaderboard } = useApp();

  const formatPoints = (pts) => {
    return new Intl.NumberFormat().format(pts);
  };

  // Top 3 za postolje
  const topThree = leaderboard.slice(0, 3);
  // Ostali korisnici
  const restOfUsers = leaderboard.slice(3);

  // Provera da li je trenutni korisnik na tabeli
  const isUserOnLeaderboard = (usrObj) => {
    if (!user.isLoggedIn) return false;
    if (user.discordUser && usrObj.username === user.discordUser) return true;
    if (user.kickLinked && usrObj.kickUsername && usrObj.kickUsername.toLowerCase() === user.kickUser.toLowerCase()) return true;
    return false;
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header}>
        <h2 style={styles.title}>Rang Lista</h2>
        <p style={styles.subtitle}>Top 10 gledalaca sa najviše sati i osvojenih poena na strimu</p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Trophy size={48} color="var(--accent-cyan)" style={{ marginBottom: '1.25rem', opacity: 0.7, filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))' }} />
          <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.5px' }}>RANG LISTA JE TRENUTNO PRAZNA</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '400px', lineHeight: '1.5' }}>
            Poveži svoj Discord i Kick nalog u sekciji "Watchtime" i počni da sakupljaš sate gledanja kako bi se pojavio ovde!
          </p>
        </div>
      ) : (
        <>
          {/* Postolje za Top 3 - Modern Clean Cards */}
          <div style={styles.podiumContainer}>
            
            {/* Drugo mesto (Silver) */}
            {topThree[1] && (
              <div style={{ ...styles.podiumCard, border: '1px solid rgba(161, 161, 170, 0.3)' }} className="glass-interactive">
                <div style={styles.rankBadgeSilver}>#2 SILVER</div>
                <div style={styles.podiumAvatarCircle}>
                  <User size={20} color="#a1a1aa" />
                </div>
                <h4 style={styles.podiumUsername}>@{topThree[1].kickUsername || topThree[1].username}</h4>
                <div style={styles.podiumStatsRow}>
                  <div style={styles.podiumStatPill}>
                    <Clock size={12} color="var(--text-muted)" />
                    <span>{topThree[1].hours}h</span>
                  </div>
                  <div style={styles.podiumStatPillCyan}>
                    <Coins size={12} color="var(--accent-cyan)" />
                    <span>{formatPoints(topThree[1].points)} PTS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prvo mesto (Gold) */}
            {topThree[0] && (
              <div style={{ ...styles.podiumCard, ...styles.goldPodiumCard }} className="glass-interactive">
                <div style={styles.rankBadgeGold}>#1 GOLD</div>
                <div style={styles.podiumAvatarCircleGold}>
                  <User size={24} color="#e5c158" />
                </div>
                <h4 style={{ ...styles.podiumUsername, fontSize: '1.2rem', color: '#fff' }}>@{topThree[0].kickUsername || topThree[0].username}</h4>
                <div style={styles.podiumStatsRow}>
                  <div style={styles.podiumStatPill}>
                    <Clock size={13} color="var(--text-muted)" />
                    <span>{topThree[0].hours}h</span>
                  </div>
                  <div style={styles.podiumStatPillCyan}>
                    <Coins size={13} color="var(--accent-cyan)" />
                    <span style={{ fontWeight: '800' }}>{formatPoints(topThree[0].points)} PTS</span>
                  </div>
                </div>
              </div>
            )}

            {/* Treće mesto (Bronze) */}
            {topThree[2] && (
              <div style={{ ...styles.podiumCard, border: '1px solid rgba(180, 83, 9, 0.3)' }} className="glass-interactive">
                <div style={styles.rankBadgeBronze}>#3 BRONZE</div>
                <div style={styles.podiumAvatarCircle}>
                  <User size={20} color="#d97706" />
                </div>
                <h4 style={styles.podiumUsername}>@{topThree[2].kickUsername || topThree[2].username}</h4>
                <div style={styles.podiumStatsRow}>
                  <div style={styles.podiumStatPill}>
                    <Clock size={12} color="var(--text-muted)" />
                    <span>{topThree[2].hours}h</span>
                  </div>
                  <div style={styles.podiumStatPillCyan}>
                    <Coins size={12} color="var(--accent-cyan)" />
                    <span>{formatPoints(topThree[2].points)} PTS</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Glavna Tabela sa poravnatim kolona */}
          <div style={styles.leaderboardTableWrapper} className="glass">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '90px', textAlign: 'center' }}>Rang</th>
                  <th style={{ ...styles.th, textAlign: 'left' }}>Korisnik</th>
                  <th style={{ ...styles.th, textAlign: 'center', width: '220px' }}>Sati gledanja</th>
                  <th style={{ ...styles.th, textAlign: 'right', width: '220px' }}>Ukupno poena</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((userObj) => {
                  const isCurrentUser = isUserOnLeaderboard(userObj);
                  return (
                    <tr 
                      key={userObj.rank} 
                      style={{ 
                        ...styles.tr, 
                        backgroundColor: isCurrentUser ? 'rgba(0, 240, 255, 0.05)' : 'transparent',
                        borderColor: isCurrentUser ? 'rgba(0, 240, 255, 0.2)' : 'var(--border-color)'
                      }}
                    >
                      <td style={{ ...styles.td, textAlign: 'center', width: '90px' }}>
                        <span style={styles.rankNum}>{userObj.rank}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'left', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={15} color={isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                          <span style={{ color: isCurrentUser ? 'var(--accent-cyan)' : '#f3f4f6' }}>
                            @{userObj.kickUsername || userObj.username} {isCurrentUser && <span style={styles.youBadge}>TI</span>}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', width: '220px' }}>
                        {userObj.hours} sati
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', width: '220px', fontWeight: '700', color: isCurrentUser ? 'var(--accent-cyan)' : '#fff' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <Coins size={14} color="#00f0ff" />
                          <span>{formatPoints(userObj.points)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Ako korisnik nije u Top 10 ali je povezan, prikazujemo ga na dnu tabele */}
                {user.kickLinked && !leaderboard.some(l => 
                  (l.username && l.username.toLowerCase() === user.kickUser.toLowerCase()) || 
                  (l.kickUsername && l.kickUsername.toLowerCase() === user.kickUser.toLowerCase())
                ) && (
                  <>
                    <tr style={styles.dividerRow}>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '6px 0', color: 'var(--text-muted)' }}>•••</td>
                    </tr>
                    <tr style={{ ...styles.tr, backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                      <td style={{ ...styles.td, textAlign: 'center', width: '90px' }}>
                        <span style={styles.rankNum}>-</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'left', fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={15} color="var(--accent-cyan)" />
                          <span style={{ color: 'var(--accent-cyan)' }}>
                            @{user.kickUser} <span style={styles.youBadge}>TI</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', width: '220px' }}>
                        {(() => {
                          const totalMinutes = Math.round((user.hoursWatched || 0) * 60);
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          if (hours > 0) return `${hours}h ${minutes}m`;
                          return `${minutes}m`;
                        })()}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', width: '220px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          <Coins size={14} color="#00f0ff" />
                          <span>{formatPoints(user.points)}</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
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
  podiumContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.5rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  },
  podiumCard: {
    width: '240px',
    padding: '1.5rem 1.25rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    background: 'var(--bg-card)',
    transition: 'all 0.3s ease',
  },
  goldPodiumCard: {
    width: '260px',
    border: '1px solid rgba(229, 193, 88, 0.4)',
    boxShadow: '0 0 25px rgba(229, 193, 88, 0.12)',
    transform: 'scale(1.05)',
    background: 'radial-gradient(circle at top, rgba(229, 193, 88, 0.06) 0%, var(--bg-card) 70%)',
  },
  rankBadgeGold: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#e5c158',
    backgroundColor: 'rgba(229, 193, 88, 0.12)',
    border: '1px solid rgba(229, 193, 88, 0.3)',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '1px',
  },
  rankBadgeSilver: {
    fontSize: '0.725rem',
    fontWeight: '800',
    color: '#a1a1aa',
    backgroundColor: 'rgba(161, 161, 170, 0.12)',
    border: '1px solid rgba(161, 161, 170, 0.25)',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '1px',
  },
  rankBadgeBronze: {
    fontSize: '0.725rem',
    fontWeight: '800',
    color: '#d97706',
    backgroundColor: 'rgba(180, 83, 9, 0.12)',
    border: '1px solid rgba(180, 83, 9, 0.25)',
    padding: '4px 12px',
    borderRadius: '20px',
    letterSpacing: '1px',
  },
  podiumAvatarCircleGold: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: 'rgba(229, 193, 88, 0.08)',
    border: '1.5px solid #e5c158',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 12px rgba(229, 193, 88, 0.2)',
  },
  podiumAvatarCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumUsername: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    margin: '2px 0',
  },
  podiumStatsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    justifyContent: 'center',
  },
  podiumStatPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.775rem',
    color: 'var(--text-secondary)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  podiumStatPillCyan: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.775rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    backgroundColor: 'rgba(0, 240, 255, 0.06)',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    padding: '4px 10px',
    borderRadius: '8px',
  },
  mobileTopThreeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileTopThreeItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem',
    gap: '12px',
  },
  mobileRankBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#fff',
  },
  leaderboardTableWrapper: {
    overflowX: 'auto',
    border: '1px solid var(--border-color)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.95rem',
  },
  th: {
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontWeight: '600',
    textAlign: 'left',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '1.25rem 1.5rem',
    color: 'var(--text-secondary)',
    verticalAlign: 'middle',
  },
  rankNum: {
    display: 'inline-flex',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    color: '#fff',
  },
  youBadge: {
    fontSize: '0.65rem',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    color: 'var(--accent-cyan)',
    border: '1px solid rgba(0, 240, 255, 0.3)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: '800',
    marginLeft: '6px',
    display: 'inline-block',
  },
  dividerRow: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  }
};

export default Leaderboard;
