import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Award, ExternalLink, Gift } from 'lucide-react';

const Giveaway = () => {
  const { giveaways } = useApp();
  const [activeTab, setActiveTab] = useState('active'); // 'active' ili 'completed'

  // Učitavanje partnerskog koda iz .env okruženja (Vite specifično)
  const refCode = import.meta.env.VITE_CSGOSKINS_REF_CODE || 'SHARKE';

  // Filtriramo aktivne i završene giveaway-e na osnovu specifikacije (ACTIVE i COMPLETED)
  const activeGw = giveaways.filter(g => g.status === 'ACTIVE' || g.status === 'active');
  const completedGw = giveaways.filter(g => g.status === 'COMPLETED' || g.status === 'completed');

  return (
    <div style={styles.container} className="fade-in">
      {/* Header usklađen sa standardnim stilom SharkeShop-a */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Gift size={28} color="var(--accent-cyan)" style={{ marginRight: '10px' }} />
          <h2 style={styles.title}>
            Partnerski <span style={{ color: 'var(--accent-cyan)' }}>Giveaway-ovi</span>
          </h2>
        </div>
        <p style={styles.subtitle}>
          Učestvuj u aktivnim partnerskim nagradnim igrama na <strong style={{ color: '#fff' }}>CSGO-Skins.com</strong>! Unesi kod <strong style={{ color: 'var(--accent-cyan)' }}>{refCode}</strong> i depozituj da bi automatski učestvovao.
        </p>
      </div>

      {/* Navigacioni Tabovi na sredini */}
      <div className="gw-tabs-container">
        <button 
          className={`gw-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <span className="gw-status-dot" style={{ display: activeTab === 'active' ? 'inline-block' : 'none' }}></span>
          Aktivno ({activeGw.length})
        </button>
        <button 
          className={`gw-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <Award size={15} style={{ marginRight: '2px' }} />
          Završeno ({completedGw.length})
        </button>
      </div>

      {/* Telo / Tabela na osnovu izabranog taba */}
      {activeTab === 'active' ? (
        <section style={styles.section} className="fade-in">
          {activeGw.length > 0 ? (
            <div className="gw-active-grid">
              {activeGw.map((gw) => {
                // Razdvajamo ime na tip oružja i naziv skina
                const prizeParts = gw.prize.split(' | ');
                const weaponType = prizeParts.length > 1 
                  ? prizeParts[0].replace('★', '').trim().toUpperCase() 
                  : 'CS2 SKIN';
                const skinName = prizeParts.length > 1 
                  ? prizeParts[1].trim() 
                  : gw.prize;

                return (
                  <div key={gw.id} className="gw-card">
                    {/* Aktivno Badge */}
                    <div className="gw-badge-container">
                      <span className="gw-active-badge">
                        <span className="gw-status-dot"></span> AKTIVNO
                      </span>
                    </div>

                    {/* Slika skina sa radijalnim sjajem u pozadini */}
                    <div className="gw-visual-box">
                      <img src={gw.imageUrl} alt={gw.prize} className="gw-skin-image" />
                    </div>

                    {/* Detalji o nagradi */}
                    <div className="gw-details-box">
                      {/* Naziv i tip - CENTRIRANI */}
                      <div className="gw-name-section">
                        <span className="gw-weapon-type">{weaponType}</span>
                        <h4 className="gw-skin-name">{skinName}</h4>
                      </div>

                      {/* Vrednost i Minimalni Depozit - CENTRIRANI BOKSOVI */}
                      <div className="gw-values-row">
                        <div className="gw-val-box">
                          <span className="gw-val-label">VREDNOST</span>
                          <span className="gw-val-amount">{gw.value}</span>
                        </div>
                        <div className="gw-val-box">
                          <span className="gw-val-label">MIN. DEPOZIT</span>
                          <span className="gw-val-amount-dep">{gw.minDeposit}</span>
                        </div>
                      </div>

                      {/* Dugme za učestvovanje u plavo-cijan stilu našeg sajta */}
                      <a 
                        href={`https://csgo-skins.com/?ref=${refCode}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="glow-btn-cyan gw-action-btn"
                      >
                        UČESTVUJ NA CSGO-SKINS <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyCard} className="glass">
              <p>Trenutno nema aktivnih giveaway-ova. Skripta će uskoro sinhronizovati nove!</p>
            </div>
          )}
        </section>
      ) : (
        <section style={styles.section} className="fade-in">
          <div style={styles.completedList} className="glass">
            {completedGw.length > 0 ? (
              completedGw.map((gw) => (
                <div key={gw.id} style={styles.completedItem}>
                  <div style={styles.completedLeft}>
                    <img src={gw.imageUrl} alt={gw.prize} style={styles.completedSkinImg} />
                    <div>
                      <h4 style={styles.completedPrize}>{gw.prize}</h4>
                      <p style={styles.completedMeta}>Vrednost: {gw.value} | Min. Depozit: {gw.minDeposit}</p>
                    </div>
                  </div>
                  
                  <div style={styles.completedRight}>
                    <div style={styles.winnerCard}>
                      {gw.winnerAvatar ? (
                        <img src={gw.winnerAvatar} alt={gw.winnerName} style={styles.winnerAvatarImg} />
                      ) : (
                        <Award size={18} color="#e5c158" />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={styles.winnerLabel}>Pobednik:</span>
                        <strong style={styles.winnerName}>@{gw.winnerName || 'Neko'}</strong>
                      </div>
                    </div>
                    <span style={styles.endedTime}>{gw.wonAt}</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Nema završenih nagradnih igara.
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    textAlign: 'left',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '1.25rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '4px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  emptyCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  completedList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem',
    borderRadius: '12px',
  },
  completedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1rem',
    borderBottom: '1px solid var(--border-color)',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  completedLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  completedSkinImg: {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '4px',
  },
  completedPrize: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#fff',
  },
  completedMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  completedRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    '@media (max-width: 576px)': {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  winnerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    padding: '6px 12px',
    borderRadius: '6px',
  },
  winnerAvatarImg: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1px solid #e5c158',
    objectFit: 'cover',
  },
  winnerLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  winnerName: {
    fontSize: '0.85rem',
    color: '#e5c158',
  },
  endedTime: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    minWidth: '70px',
    textAlign: 'right',
  }
};

export default Giveaway;
