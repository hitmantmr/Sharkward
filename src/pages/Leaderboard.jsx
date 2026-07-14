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
          {/* Postolje za Top 3 */}
          <div style={styles.podiumContainer}>
            
            {/* Drugo mesto (Silver) */}
            {topThree[1] && (
              <div style={styles.podiumCardWrapper} className="desktop-only">
                <div style={{ ...styles.podiumCard, borderTopColor: '#a1a1aa' }} className="glass">
                  <div style={{ ...styles.podiumRankCircle, backgroundColor: '#71717a' }}>2</div>
                  <h4 style={styles.podiumUsername}>@{topThree[1].kickUsername || topThree[1].username}</h4>
                  <div style={styles.podiumStats}>
                    <div style={styles.podiumStat}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span>{topThree[1].hours}h</span>
                    </div>
                    <div style={styles.podiumStatPoints}>
                      <Coins size={12} color="#00f0ff" />
                      <span>{formatPoints(topThree[1].points)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...styles.podiumBase, height: '60px', backgroundColor: 'rgba(161, 161, 170, 0.1)' }}>SILVER</div>
              </div>
            )}

            {/* Prvo mesto (Gold) */}
            {topThree[0] && (
              <div style={styles.podiumCardWrapper}>
                <div style={{ ...styles.podiumCard, ...styles.goldCard, borderTopColor: '#e5c158' }} className="glass">
                  <div style={styles.crown}>👑</div>
                  <div style={{ ...styles.podiumRankCircle, backgroundColor: '#ca8a04' }}>1</div>
                  <h4 style={{ ...styles.podiumUsername, fontSize: '1.25rem', color: '#fff' }}>@{topThree[0].kickUsername || topThree[0].username}</h4>
                  <div style={styles.podiumStats}>
                    <div style={styles.podiumStat}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span>{topThree[0].hours}h</span>
                    </div>
                    <div style={styles.podiumStatPoints}>
                      <Coins size={14} color="#00f0ff" />
                      <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>{formatPoints(topThree[0].points)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...styles.podiumBase, height: '90px', backgroundColor: 'rgba(229, 193, 88, 0.15)', borderTop: '2px solid rgba(229, 193, 88, 0.3)' }}>GOLD</div>
              </div>
            )}

            {/* Treće mesto (Bronze) */}
            {topThree[2] && (
              <div style={styles.podiumCardWrapper} className="desktop-only">
                <div style={{ ...styles.podiumCard, borderTopColor: '#b45309' }} className="glass">
                  <div style={{ ...styles.podiumRankCircle, backgroundColor: '#92400e' }}>3</div>
                  <h4 style={styles.podiumUsername}>@{topThree[2].kickUsername || topThree[2].username}</h4>
                  <div style={styles.podiumStats}>
                    <div style={styles.podiumStat}>
                      <Clock size={12} color="var(--text-muted)" />
                      <span>{topThree[2].hours}h</span>
                    </div>
                    <div style={styles.podiumStatPoints}>
                      <Coins size={12} color="#00f0ff" />
                      <span>{formatPoints(topThree[2].points)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...styles.podiumBase, height: '40px', backgroundColor: 'rgba(180, 83, 9, 0.1)' }}>BRONZE</div>
              </div>
            )}

          </div>

          {/* Mobilno podnožje - prikaz top 3 za mobilne koji nemaju levo/desno postolje */}
          <div style={styles.mobileTopThreeList} className="mobile-only">
            {topThree.map((user, idx) => (
              <div key={idx} style={styles.mobileTopThreeItem} className="glass">
                <span style={{
                  ...styles.mobileRankBadge,
                  backgroundColor: idx === 0 ? '#ca8a04' : idx === 1 ? '#71717a' : '#92400e'
                }}>{idx + 1}</span>
                <span style={{ fontWeight: '700' }}>@{user.kickUsername || user.username}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{user.hours}h</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>{formatPoints(user.points)} pts</span>
                </div>
              </div>
            ))}
          </div>

          {/* Lista ostalih korisnika */}
          <div style={styles.leaderboardTableWrapper} className="glass">
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Rang</th>
                  <th style={styles.th}>Korisnik</th>
                  <th style={styles.th}>Sati gledanja</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Ukupno poena</th>
                </tr>
              </thead>
              <tbody>
                {restOfUsers.map((userObj) => {
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
                      <td style={styles.td}>
                        <span style={styles.rankNum}>{userObj.rank}</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={14} color={isCurrentUser ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                          <span style={{ color: isCurrentUser ? 'var(--accent-cyan)' : '#f3f4f6' }}>
                            @{userObj.kickUsername || userObj.username} {isCurrentUser && <span style={styles.youBadge}>TI</span>}
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>{userObj.hours} sati</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: isCurrentUser ? 'var(--accent-cyan)' : '#fff' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
                      <td colSpan="4" style={{ textAlign: 'center', padding: '4px 0', color: 'var(--text-muted)' }}>•••</td>
                    </tr>
                    <tr style={{ ...styles.tr, backgroundColor: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
                      <td style={styles.td}>
                        <span style={styles.rankNum}>-</span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: '600' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={14} color="var(--accent-cyan)" />
                          <span style={{ color: 'var(--accent-cyan)' }}>
                            @{user.kickUser} <span style={styles.youBadge}>TI</span>
                          </span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {(() => {
                          const totalMinutes = Math.round((user.hoursWatched || 0) * 60);
                          const hours = Math.floor(totalMinutes / 60);
                          const minutes = totalMinutes % 60;
                          if (hours > 0) return `${hours}h ${minutes}m`;
                          return `${minutes}m`;
                        })()}
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
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
    alignItems: 'flex-end',
    gap: '2rem',
    marginTop: '2rem',
    '@media (max-width: 767px)': {
      display: 'none', // Na mobilnom sakrij postolje, prikaži listu
    }
  },
  podiumCardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '200px',
  },
  podiumCard: {
    width: '100%',
    padding: '1.5rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    borderTop: '5px solid',
    borderRadius: '16px 16px 0 0',
    position: 'relative',
    boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.1)',
  },
  goldCard: {
    boxShadow: '0 0 25px rgba(229, 193, 88, 0.15)',
    zIndex: 2,
    transform: 'scale(1.08)',
  },
  crown: {
    position: 'absolute',
    top: '-32px',
    fontSize: '2rem',
    animation: 'pulse 1.5s infinite',
  },
  podiumRankCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '800',
  },
  podiumUsername: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  podiumStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    alignItems: 'center',
  },
  podiumStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  podiumStatPoints: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
  },
  podiumBase: {
    width: '100%',
    border: '1px solid var(--border-color)',
    borderTop: 'none',
    borderBottom: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '800',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
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
