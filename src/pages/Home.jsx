import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Award, Users, ShoppingBag, ArrowRight, ExternalLink, Copy } from 'lucide-react';

const Home = ({ setActiveTab }) => {
  const { user, giveaways, skins, isLive, addToast } = useApp();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    let observer = null;
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    try {
      if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const observerOptions = {
          root: null,
          rootMargin: '0px',
          threshold: 0.05, // triguje čim se vidi 5% kartice za maksimalnu sigurnost
        };

        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        }, observerOptions);

        revealElements.forEach((el) => observer.observe(el));
      } else {
        // Fallback: odmah prikaži ako IntersectionObserver nije podržan
        revealElements.forEach((el) => el.classList.add('revealed'));
      }
    } catch (err) {
      console.error('Scroll reveal observer error:', err);
      // Fallback u slučaju bilo koje greške
      revealElements.forEach((el) => el.classList.add('revealed'));
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observer) {
        revealElements.forEach((el) => {
          try {
            observer.unobserve(el);
          } catch (e) {}
        });
      }
    };
  }, []);

  const activeGwCount = giveaways.filter(g => g.status === 'active').length;
  const availableSkinsCount = skins.filter(s => s.status === 'available').length;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast(`Kod "${text}" je uspešno kopiran!`, 'success');
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* 1. Centrirana Landing Sekcija (Tekst i dugmići preko celog prvog ekrana) */}
      <div className="landing-viewport">
        <div className="hero-centered-content">
          <div style={{ 
            ...styles.liveBadge, 
            margin: '0 auto',
            backgroundColor: isLive ? 'rgba(83, 252, 24, 0.1)' : 'rgba(156, 163, 175, 0.08)',
            borderColor: isLive ? 'rgba(83, 252, 24, 0.25)' : 'rgba(156, 163, 175, 0.2)',
            color: isLive ? '#53fc18' : '#9ca3af'
          }}>
            <span style={{ 
              ...styles.liveDot, 
              backgroundColor: isLive ? '#53fc18' : '#9ca3af',
              animation: isLive ? 'pulse-stream 1.5s infinite' : 'none' 
            }}></span>
            <span>{isLive ? 'SHARKE JE UŽIVO NA KICKU' : 'SHARKE JE TRENUTNO OFFLINE'}</span>
          </div>
          
          <h1 className="landing-title">
            Gledaj Live, <span className="neon-text-blue">Skupljaj Poene</span> & Uzmi CS:GO Skinove
          </h1>
          
          <p className="landing-subtitle">
            Poveži svoj Kick i Discord nalog, skupljaj poene dok gledaš strim i zameni ih za najjače CS:GO skinove u našem shopu potpuno besplatno.
          </p>
          
          <div className="landing-btns">
            <button 
              className="glow-btn-cyan" 
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
              onClick={() => setActiveTab('shop')}
            >
              <ShoppingBag size={20} /> POSETI SHOP
            </button>
            <button 
              className="btn-secondary" 
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.95rem' }}
              onClick={() => setActiveTab('watchtime')}
            >
              POVEŽI NALOG <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Indikator za skrolovanje */}
        <div className={`scroll-indicator ${showScrollIndicator ? 'visible' : 'hidden'}`}>
          <span>SKROLUJ DO DOLE ZA STRIM & SPONZORE</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-chevron">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* 2. Prvi Red: Kick Stream i Partnerski Kodovi */}
      <section className="first-row-grid" style={styles.firstRowGrid}>
        
        {/* Kick Stream Window */}
        <div className="premium-card stream-card-premium reveal-on-scroll" style={styles.streamCard}>
          <div style={styles.streamHeader}>
            <div style={styles.streamStatusGroup}>
              <span style={{ 
                ...styles.liveDot, 
                backgroundColor: isLive ? '#53fc18' : '#6b7280',
                animation: isLive ? 'pulse-stream 1.5s infinite' : 'none' 
              }}></span>
              <span style={{ color: isLive ? '#53fc18' : 'var(--text-secondary)', fontWeight: '700', fontSize: '0.8rem' }}>
                KICK STRIM: {isLive ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <a 
              href="https://kick.com/sharke" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={styles.channelLink}
            >
              kick.com/sharke <ExternalLink size={12} />
            </a>
          </div>

          <div style={styles.playerContainer}>
            <iframe
              src="https://player.kick.com/sharke?muted=true&autoplay=true"
              frameBorder="0"
              scrolling="no"
              allowFullScreen={true}
              style={{
                ...styles.iframe,
                transform: isLive ? 'none' : 'scale(1.35)',
                transformOrigin: 'center',
              }}
              title="Sharke Kick Live Stream"
            ></iframe>
          </div>
        </div>

        {/* CSGO Skins Card */}
        <div className="premium-card sponsor-card-premium csgoskins-card reveal-on-scroll" style={{ ...styles.partnerCard, transitionDelay: '100ms' }}>
          <div style={styles.partnerHeader}>
            <img src="./img/csgoskins logo.png" alt="CSGO Skins Logo" style={styles.partnerLogoImg} />
            <span style={styles.partnerTag}>SPONZOR</span>
          </div>

          <div className="sponsor-benefits-list">
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">Besplatnih $0.50 pri reg.</span>
            </div>
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">10% Depozit Bonus</span>
            </div>
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(0, 240, 255, 0.1)', color: '#00f0ff' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">Dnevni Giveaway-evi</span>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div 
              className="premium-sponsor-code-btn"
              style={{ '--accent-color': '#00f0ff', '--accent-rgb': '0, 240, 255' }}
              onClick={() => copyToClipboard('SHARKE')}
              title="Klikni da kopiraš kod"
            >
              <span>KOD: SHARKE</span>
              <Copy size={13} color="#00f0ff" />
            </div>

            <a 
              href="https://csgo-skins.com/?ref=SHARKE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sponsor-activation-btn blue-theme" 
              style={{ margin: 0 }}
            >
              Učestvuj na CSGO-Skins <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Mozzart Card */}
        <div className="premium-card sponsor-card-premium mozzart-card reveal-on-scroll" style={{ ...styles.partnerCard, transitionDelay: '200ms' }}>
          <div style={styles.partnerHeader}>
            <img src="./img/mozzart logo.png" alt="Mozzart Logo" style={styles.partnerLogoImg} />
            <span style={styles.partnerTag}>SPONZOR</span>
          </div>

          <div className="sponsor-benefits-list">
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(229, 193, 88, 0.1)', color: '#e5c158' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">Bonusi na prva 3 depozita</span>
            </div>
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(229, 193, 88, 0.1)', color: '#e5c158' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">Besplatni spinovi i freebet</span>
            </div>
            <div className="sponsor-benefit-item">
              <span className="sponsor-benefit-check-circle" style={{ background: 'rgba(229, 193, 88, 0.1)', color: '#e5c158' }}>
                <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="sponsor-benefit-text">Najveće kvote na svetu</span>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div 
              className="premium-sponsor-code-btn"
              style={{ '--accent-color': '#e5c158', '--accent-rgb': '229, 193, 88' }}
              onClick={() => copyToClipboard('AJKULA')}
              title="Klikni da kopiraš kod"
            >
              <span>KOD: AJKULA</span>
              <Copy size={13} color="#e5c158" />
            </div>

            <a 
              href="https://www.mozzartbet.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sponsor-activation-btn gold-theme" 
              style={{ margin: 0 }}
            >
              Aktiviraj Kod <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </section>

      {/* 4. 3-Card Grid: Društvene Mreže, Kako Sakupljati Poene, Aktivni Giveaway */}
      <section className="bottom-cards-grid">
        
        {/* Card 1: Društvene Mreže */}
        <div className="premium-card bottom-info-card reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transitionDelay: '0ms' }}>
          <div>
            <div className="bottom-card-header" style={{ justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
              <h3 className="premium-card-title">DRUŠTVENE MREŽE</h3>
            </div>
          </div>

          <div className="bottom-card-btns-grid" style={{ gridTemplateRows: 'repeat(3, 1fr)', gap: '0.85rem', flex: 1, marginTop: 0 }}>
            <a href="https://discord.gg/sharke" target="_blank" rel="noopener noreferrer" className="premium-social-btn discord">
              <svg viewBox="0 0 127.14 96.36" fill="currentColor" width="22" height="22">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,73.1,0c.82.71,1.68,1.4,2.58,2a68.43,68.43,0,0,1-10.5,5A77.7,77.7,0,0,0,95.14,85.51a105.73,105.73,0,0,0,31-18.83C129,54.65,123.5,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
              </svg>
              <span>DISCORD</span>
            </a>
            <a href="https://www.instagram.com/sharke___/" target="_blank" rel="noopener noreferrer" className="premium-social-btn instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span>INSTAGRAM</span>
            </a>
            <a href="https://www.tiktok.com/@sharke99" target="_blank" rel="noopener noreferrer" className="premium-social-btn tiktok">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.15 2.27 1.94 3.73 2.23V10.4c-1.32-.15-2.6-.66-3.66-1.48-.82-.64-1.47-1.48-1.92-2.44V16.3c.02 1.34-.33 2.66-1.01 3.8a6.837 6.837 0 0 1-5.69 3.51c-1.63.1-3.26-.29-4.63-1.12-1.37-.84-2.42-2.12-3.02-3.64s-.59-3.23-.01-4.73A6.87 6.87 0 0 1 6.81 10.3c1.31-.56 2.76-.66 4.14-.3v3.74c-.79-.27-1.66-.27-2.45.02a3.175 3.175 0 0 0-2.07 2.9c-.06.84.22 1.68.78 2.31.56.63 1.35 1.01 2.21 1.06.86.05 1.7-.22 2.33-.78.63-.56,1.01-1.35,1.06-2.21.01-.19,0-.37,0-.56V.02Z"/>
              </svg>
              <span>TIKTOK</span>
            </a>
            <a href="https://www.youtube.com/@sharke123" target="_blank" rel="noopener noreferrer" className="premium-social-btn youtube">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YOUTUBE</span>
            </a>
            <a href="https://kick.com/sharke" target="_blank" rel="noopener noreferrer" className="premium-social-btn kick">
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M3 3h4v4H3V3zm0 5h4v4H3V8zm0 5h4v4H3v-4zm0 5h4v4H3v-4zm5-10h4v4H8V8zm0 5h4v4H8v-4zm5-5h4v4h-4V8zm0 10h4v4h-4v-4zm5-5h4v4h-4v-4zm0-10h4v4h-4V3z"/>
              </svg>
              <span>KICK</span>
            </a>
            <a href="https://nosestrips.rs" target="_blank" rel="noopener noreferrer" className="premium-social-btn nosestrips">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>NOSE STRIPS</span>
            </a>
          </div>
        </div>

        {/* Card 2: Kako Sakupljati Poene */}
        <div className="premium-card bottom-info-card reveal-on-scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transitionDelay: '100ms' }}>
          <div>
            <div className="bottom-card-header" style={{ justifyContent: 'center', width: '100%', marginBottom: '1.5rem' }}>
              <h3 className="premium-card-title">KAKO SAKUPLJATI POENE</h3>
            </div>
            
            <div className="premium-info-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, marginTop: '0.5rem' }}>
              <div className="premium-step-row">
                <span className="premium-step-num">01</span>
                <div className="premium-step-body">
                  <span className="premium-step-title">Poveži naloge</span>
                  <span className="premium-step-desc">Poveži svoj Kick i Discord u Watchtime sekciji</span>
                </div>
              </div>
              
              <div className="premium-step-row">
                <span className="premium-step-num">02</span>
                <div className="premium-step-body">
                  <span className="premium-step-title">Budi aktivan u chatu</span>
                  <span className="premium-step-desc">Osvoji poene slanjem poruke u chatu na svakih 10 minuta dok je strim uživo</span>
                </div>
              </div>

              <div className="premium-step-row">
                <span className="premium-step-num">03</span>
                <div className="premium-step-body">
                  <span className="premium-step-title">Rang lista</span>
                  <span className="premium-step-desc">Takmiči se sa ostalim gledaocima i osvoji nagrade</span>
                </div>
              </div>

              <div className="premium-step-row">
                <span className="premium-step-num">04</span>
                <div className="premium-step-body">
                  <span className="premium-step-title">Zameni poene</span>
                  <span className="premium-step-desc">Kupi najjače CS:GO skinove u našoj prodavnici</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Aktivni Giveaway */}
        <div className="premium-card bottom-info-card active-gw-card-premium reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
          {/* Header */}
          <div className="bottom-card-header" style={{ justifyContent: 'center', width: '100%', marginBottom: '1.25rem' }}>
            <h3 className="premium-card-title">AKTIVNI GIVEAWAY</h3>
          </div>
          
          {/* Visual Showcase */}
          <div className="gw-vibe-showcase">
            <div className="skin-glow-radial-blue" style={{ width: '180px', height: '180px', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 70%)' }}></div>
            <img 
              src="./img/karambit_doppler.png" 
              alt="★ Karambit | Doppler" 
              className="floating-skin-img-doppler" 
              style={{ width: '150px', height: 'auto', zIndex: 2 }}
            />
          </div>
          
          {/* Skin Name */}
          <h4 className="gw-vibe-skin-name">★ Karambit | Doppler (Factory New)</h4>
          
          {/* Two dark info pills */}
          <div className="gw-vibe-pills-row">
            <div className="premium-display-pill">
              <span className="gw-vibe-pill-label">VREDNOST</span>
              <span className="gw-vibe-pill-value-white">$950.00</span>
            </div>
            <div className="premium-display-pill">
              <span className="gw-vibe-pill-label">POENI ZA ULAZ</span>
              <span className="gw-vibe-pill-value-cyan">1,000</span>
            </div>
          </div>
          
          {/* Action button */}
          <button 
            className="gw-vibe-btn"
            style={{
              background: 'linear-gradient(90deg, #00f0ff 0%, #0062ff 100%)',
              color: '#000',
              fontWeight: '800',
              fontFamily: 'inherit',
              boxShadow: '0 4px 20px rgba(0, 240, 255, 0.4)',
              border: 'none',
            }}
            onClick={() => setActiveTab('giveaway')}
          >
            UČESTVUJ NA CSGO-SKINS
          </button>
        </div>

      </section>

      <style>{`
        @keyframes pulse-stream {
          0% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.5; transform: scale(1); }
        }
        
        .landing-viewport {
          min-height: calc(100vh - var(--navbar-height) - 4rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100%;
          padding: 2rem 0 6rem 0;
          box-sizing: border-box;
          text-align: center;
        }

        .hero-centered-content {
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: 1.5rem;
        }

        .landing-title {
          font-size: 3.8rem;
          font-weight: 800;
          line-height: 1.15;
          color: #fff;
          letter-spacing: -0.5px;
          text-align: center;
          margin: 0;
          text-transform: uppercase;
        }

        .landing-subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          line-height: 1.6;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .landing-btns {
          display: flex;
          gap: 1.25rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 1px;
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.6s ease-in-out, visibility 0.6s ease-in-out;
          opacity: 0;
          visibility: hidden;
        }

        .scroll-indicator.visible {
          opacity: 1;
          visibility: visible;
        }

        .scroll-indicator.hidden {
          opacity: 0;
          visibility: hidden;
        }

        .scroll-chevron {
          stroke: var(--accent-cyan);
          filter: drop-shadow(0 0 5px var(--accent-cyan-glow));
          animation: float-chevron 2s infinite ease-in-out;
        }

        @keyframes float-chevron {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(6px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.5; }
        }

        .first-row-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 991px) {
          .landing-viewport {
            min-height: auto;
            padding: 4rem 0;
          }
          .landing-title {
            font-size: 2.5rem;
          }
          .landing-subtitle {
            font-size: 1.1rem;
          }
          .first-row-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .bottom-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 991px) {
          .bottom-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        /* PREMIUM GLASS CARDS SYSTEM */
        .premium-card {
          background: rgba(10, 15, 26, 0.6) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 20px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* SCROLL REVEAL ANIMATION SYSTEM */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(45px) scale(0.96);
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease !important;
          will-change: transform, opacity;
        }

        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .premium-card.revealed {
          transition: opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), 
                      transform 0.85s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        .premium-card.revealed:hover {
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45) !important;
        }

        /* Sponsor Specific Highlights */
        .csgoskins-card {
          border-top: 2px solid rgba(0, 92, 255, 0.45) !important;
        }
        .csgoskins-card.revealed:hover {
          border-color: rgba(0, 92, 255, 0.4) !important;
          box-shadow: 0 20px 45px rgba(0, 92, 255, 0.08), 0 25px 60px rgba(0, 0, 0, 0.45) !important;
        }

        .mozzart-card {
          border-top: 2px solid rgba(229, 193, 88, 0.35) !important;
        }
        .mozzart-card.revealed:hover {
          border-color: rgba(229, 193, 88, 0.4) !important;
          box-shadow: 0 20px 45px rgba(229, 193, 88, 0.08), 0 25px 60px rgba(0, 0, 0, 0.45) !important;
        }

        .stream-card-premium {
          border-top: 2px solid rgba(0, 240, 255, 0.2) !important;
          align-self: start !important;
        }
        .stream-card-premium.revealed:hover {
          border-color: rgba(0, 240, 255, 0.3) !important;
          box-shadow: 0 20px 45px rgba(0, 240, 255, 0.05), 0 25px 60px rgba(0, 0, 0, 0.45) !important;
        }

        /* Voucher / Promo code Box */
        .premium-voucher-box {
          background: rgba(0, 0, 0, 0.35) !important;
          border: 1px dashed rgba(255, 255, 255, 0.12) !important;
          border-radius: 14px !important;
          padding: 1.1rem 1.25rem !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 0.3rem !important;
          cursor: pointer !important;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
          position: relative !important;
        }

        .csgoskins-voucher:hover {
          background: rgba(229, 193, 88, 0.03) !important;
          border-color: rgba(229, 193, 88, 0.6) !important;
          box-shadow: 0 0 20px rgba(229, 193, 88, 0.1) !important;
          transform: scale(1.02) !important;
        }

        .mozzart-voucher:hover {
          background: rgba(0, 92, 255, 0.03) !important;
          border-color: rgba(0, 92, 255, 0.6) !important;
          box-shadow: 0 0 20px rgba(0, 92, 255, 0.1) !important;
          transform: scale(1.02) !important;
        }

        /* Info Card Container */
        .bottom-info-card {
          padding: 2.25rem 2rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 440px;
          box-sizing: border-box;
        }

        .bottom-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .bottom-card-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
        }

        .green-glow {
          color: #53fc18;
          border-color: rgba(83, 252, 24, 0.25);
          box-shadow: 0 0 10px rgba(83, 252, 24, 0.1);
        }

        .cyan-glow {
          color: #00f0ff;
          border-color: rgba(0, 240, 255, 0.25);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
        }

        .premium-card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.75px;
          margin: 0;
          text-align: center;
          position: relative;
          padding-bottom: 10px;
          text-transform: uppercase;
          display: inline-block;
        }

        .premium-card-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
        }

        /* Modern Lists styling */
        .premium-info-list {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          margin-bottom: 2rem;
          flex: 1;
        }

        .premium-info-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .premium-info-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .premium-info-item:hover .premium-info-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .dc-icon-bg {
          background: rgba(88, 101, 242, 0.1) !important;
          border-color: rgba(88, 101, 242, 0.2) !important;
          color: #5865f2 !important;
        }
        .kick-icon-bg {
          background: rgba(83, 252, 24, 0.1) !important;
          border-color: rgba(83, 252, 24, 0.2) !important;
          color: #53fc18 !important;
        }
        .ig-icon-bg {
          background: rgba(255, 0, 127, 0.1) !important;
          border-color: rgba(255, 0, 127, 0.2) !important;
          color: #ff007f !important;
        }
        .ns-icon-bg {
          background: rgba(0, 240, 255, 0.1) !important;
          border-color: rgba(0, 240, 255, 0.2) !important;
          color: #00f0ff !important;
        }
        .cyan-icon-bg {
          background: rgba(0, 240, 255, 0.1) !important;
          border-color: rgba(0, 240, 255, 0.2) !important;
          color: #00f0ff !important;
        }

        .premium-info-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .premium-info-text strong {
          color: #fff;
          font-weight: 700;
        }

        /* Buttons Grid */
        .bottom-card-btns-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: auto;
        }

        .social-grid-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 0.5rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.5px;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .social-grid-btn:hover {
          transform: translateY(-2px) scale(1.02);
          color: #fff;
        }

        .social-grid-btn.discord:hover {
          background: rgba(88, 101, 242, 0.1) !important;
          border-color: rgba(88, 101, 242, 0.4) !important;
          color: #5865f2 !important;
          box-shadow: 0 4px 15px rgba(88, 101, 242, 0.15) !important;
        }

        .social-grid-btn.instagram:hover {
          background: rgba(255, 0, 127, 0.1) !important;
          border-color: rgba(255, 0, 127, 0.4) !important;
          color: #ff007f !important;
          box-shadow: 0 4px 15px rgba(255, 0, 127, 0.15) !important;
        }

        .social-grid-btn.tiktok:hover {
          background: rgba(0, 242, 254, 0.1) !important;
          border-color: rgba(0, 242, 254, 0.4) !important;
          color: #00f2fe !important;
          box-shadow: 0 4px 15px rgba(0, 242, 254, 0.15) !important;
        }

        .social-grid-btn.youtube:hover {
          background: rgba(255, 0, 0, 0.1) !important;
          border-color: rgba(255, 0, 0, 0.4) !important;
          color: #ff0000 !important;
          box-shadow: 0 4px 15px rgba(255, 0, 0, 0.15) !important;
        }

        .social-grid-btn.kick:hover {
          background: rgba(83, 252, 24, 0.1) !important;
          border-color: rgba(83, 252, 24, 0.4) !important;
          color: #53fc18 !important;
          box-shadow: 0 4px 15px rgba(83, 252, 24, 0.15) !important;
        }

        .social-grid-btn.nosestrips:hover {
          background: rgba(0, 240, 255, 0.1) !important;
          border-color: rgba(0, 240, 255, 0.4) !important;
          color: #00f0ff !important;
          box-shadow: 0 4px 15px rgba(0, 240, 255, 0.15) !important;
        }

        .social-grid-btn.active-action {
          background: rgba(0, 240, 255, 0.03);
          border-color: rgba(0, 240, 255, 0.1);
        }

        .social-grid-btn.active-action:hover {
          background: rgba(0, 240, 255, 0.08) !important;
          border-color: rgba(0, 240, 255, 0.4) !important;
          color: #00f0ff !important;
          box-shadow: 0 4px 15px rgba(0, 240, 255, 0.15) !important;
        }

        /* NEW PREMIUM SOCIAL BUTTONS */
        .premium-social-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 82px;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 14px !important;
          color: #fff !important;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .premium-social-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--bg-hover) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .premium-social-btn:hover::before {
          opacity: 1;
        }

        .premium-social-btn svg {
          z-index: 1;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .premium-social-btn span {
          z-index: 1;
          color: var(--text-secondary);
          transition: color 0.3s ease;
        }

        .premium-social-btn:hover {
          transform: translateY(-3px) scale(1.02);
          border-color: var(--brand-color) !important;
          box-shadow: 0 8px 25px var(--brand-glow) !important;
        }

        .premium-social-btn:hover span {
          color: #fff;
        }

        .premium-social-btn:hover svg {
          transform: scale(1.15);
          filter: drop-shadow(0 0 8px var(--brand-color));
        }

        /* Discord Brand */
        .premium-social-btn.discord {
          --brand-color: #5865f2;
          --brand-glow: rgba(88, 101, 242, 0.25);
          --bg-hover: rgba(88, 101, 242, 0.1);
        }
        /* Instagram Brand */
        .premium-social-btn.instagram {
          --brand-color: #ff007f;
          --brand-glow: rgba(255, 0, 127, 0.25);
          --bg-hover: rgba(255, 0, 127, 0.1);
        }
        /* TikTok Brand */
        .premium-social-btn.tiktok {
          --brand-color: #00f2fe;
          --brand-glow: rgba(0, 242, 254, 0.25);
          --bg-hover: rgba(0, 242, 254, 0.1);
        }
        /* YouTube Brand */
        .premium-social-btn.youtube {
          --brand-color: #ff0000;
          --brand-glow: rgba(255, 0, 0, 0.25);
          --bg-hover: rgba(255, 0, 0, 0.1);
        }
        /* Kick Brand */
        .premium-social-btn.kick {
          --brand-color: #53fc18;
          --brand-glow: rgba(83, 252, 24, 0.25);
          --bg-hover: rgba(83, 252, 24, 0.1);
        }
        /* NoseStrips Brand */
        .premium-social-btn.nosestrips {
          --brand-color: #00f0ff;
          --brand-glow: rgba(0, 240, 255, 0.25);
          --bg-hover: rgba(0, 240, 255, 0.1);
        }

        /* NEW SPONSOR CARDS STYLING */
        .sponsor-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          width: 100%;
          margin: 1.25rem 0;
        }

        .sponsor-benefit-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.25) !important;
          border: 1px solid rgba(255, 255, 255, 0.03) !important;
          border-radius: 10px !important;
          padding: 0.65rem 0.85rem !important;
          text-align: left;
        }

        .sponsor-benefit-check-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .sponsor-benefit-text {
          font-size: 0.8rem;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.25px;
        }

        .premium-sponsor-code-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: rgba(0, 0, 0, 0.35) !important;
          border: 1.5px dashed var(--accent-color) !important;
          border-radius: 10px !important;
          padding: 0.75rem !important;
          color: #fff !important;
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease !important;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-sizing: border-box;
        }

        /* NO HOVER ANIMATION FOR CODE BUTTON */
        .premium-sponsor-code-btn:hover {
          /* Ostaje statičan na zahtev korisnika, menjamo samo cursor koji je već definisan */
        }

        /* PREMIUM SPONSOR ACTIVATION BUTTONS */
        .sponsor-activation-btn {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.85rem !important;
          border-radius: 10px !important;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
          text-decoration: none;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          cursor: pointer;
          border: none !important;
          z-index: 1;
          box-sizing: border-box;
        }

        /* Fast shimmer/light slide effect using ::after */
        .sponsor-activation-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        .sponsor-activation-btn:hover::after {
          left: 150%;
        }

        /* Blue Button Theme (CSGO Skins) */
        .sponsor-activation-btn.blue-theme {
          background: linear-gradient(135deg, #005cff 0%, #002574 100%) !important;
          color: #fff !important;
          box-shadow: 0 4px 15px rgba(0, 92, 255, 0.3) !important;
        }

        .sponsor-activation-btn.blue-theme:hover {
          box-shadow: 0 6px 22px rgba(0, 92, 255, 0.55) !important;
          transform: translateY(-2px);
        }

        /* Gold Button Theme (Mozzart) */
        .sponsor-activation-btn.gold-theme {
          background: linear-gradient(135deg, #e5c158 0%, #b29032 100%) !important;
          color: #000 !important;
          box-shadow: 0 4px 15px rgba(229, 193, 88, 0.3) !important;
        }

        .sponsor-activation-btn.gold-theme:hover {
          box-shadow: 0 6px 22px rgba(229, 193, 88, 0.55) !important;
          transform: translateY(-2px);
        }

        /* NEW STEP ROADMAP STYLING */
        .premium-step-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.85rem 1.1rem !important;
          background: rgba(255, 255, 255, 0.015) !important;
          border: 1px solid rgba(255, 255, 255, 0.03) !important;
          border-radius: 12px !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          box-sizing: border-box;
        }

        .premium-step-row:hover {
          background: rgba(0, 240, 255, 0.02) !important;
          border-color: rgba(0, 240, 255, 0.15) !important;
          transform: translateX(5px);
        }

        .premium-step-num {
          font-family: 'Outfit', monospace;
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--accent-cyan);
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
          flex-shrink: 0;
        }

        .premium-step-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .premium-step-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .premium-step-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
          line-height: 1.35;
        }

        /* Active Giveaway Card Premium styling */
        .active-gw-card-premium {
          border: 1px solid rgba(0, 240, 255, 0.2) !important;
          box-shadow: 0 0 30px rgba(0, 240, 255, 0.05), inset 0 0 15px rgba(0, 240, 255, 0.02) !important;
          display: flex;
          flex-direction: column;
          min-height: 440px !important;
        }

        .gw-vibe-header {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-cyan);
        }

        .gw-vibe-star-icon {
          color: var(--accent-cyan);
          filter: drop-shadow(0 0 5px var(--accent-cyan-glow));
        }

        .gw-vibe-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.5px;
          margin: 0;
          text-transform: uppercase;
        }

        .gw-vibe-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0.75rem 0 1.25rem 0;
        }

        .gw-vibe-showcase {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 160px;
          margin-bottom: 0.5rem;
          margin-top: auto;
        }

        .skin-glow-radial-blue {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 98, 255, 0.2) 0%, transparent 70%);
          filter: blur(25px);
          z-index: 0;
          animation: pulse-glow 4s infinite alternate;
        }

        @keyframes pulse-glow {
          0% { transform: scale(0.9); opacity: 0.6; }
          100% { transform: scale(1.1); opacity: 1; }
        }

        .floating-skin-img-doppler {
          width: 220px;
          height: auto;
          object-fit: contain;
          z-index: 1;
          mix-blend-mode: screen;
          animation: float-skin 6s ease-in-out infinite;
        }

        @keyframes float-skin {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        .gw-vibe-skin-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
          text-align: center;
          margin: 0.5rem 0 1rem 0;
        }

        .gw-vibe-pills-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 1rem;
          margin-top: 0.5rem;
        }

        .premium-display-pill {
          background: rgba(0, 0, 0, 0.45) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 12px !important;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .premium-card:hover .premium-display-pill {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.6) !important;
        }

        .gw-vibe-pill-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .gw-vibe-pill-value-white {
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
        }

        .gw-vibe-pill-value-cyan {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--accent-cyan);
        }

        .gw-vibe-btn {
          position: relative;
          overflow: hidden;
          width: 100%;
          border: none;
          padding: 12px 16px !important;
          border-radius: 10px !important;
          font-size: 0.85rem;
          font-weight: 800;
          font-family: var(--font-sans) !important;
          cursor: pointer;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          z-index: 1;
          box-sizing: border-box;
        }

        .gw-vibe-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transform: skewX(-25deg);
          transition: left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
        }

        .gw-vibe-btn:hover::after {
          left: 150%;
        }

        .gw-vibe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 240, 255, 0.55) !important;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '1.2rem',
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(235, 75, 75, 0.1)',
    border: '1px solid rgba(235, 75, 75, 0.25)',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#eb4b4b',
    letterSpacing: '0.5px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  title: {
    fontSize: '2.8rem',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#fff',
    letterSpacing: '-0.5px',
    textAlign: 'left',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    textAlign: 'left',
    maxWidth: '540px',
  },
  ctaGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heroVisual: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '240px',
  },
  glowCircle: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)',
    opacity: 0.4,
    filter: 'blur(30px)',
    zIndex: 0,
  },
  cardPreview: {
    position: 'relative',
    zIndex: 1,
    padding: '2rem',
    width: '280px',
    textAlign: 'center',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
  },
  cardTag: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    backgroundColor: 'var(--accent-cyan-glow)',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  cardCondition: {
    fontSize: '0.85rem',
    color: '#eb4b4b',
    fontWeight: '600',
    marginTop: '0.25rem',
  },
  firstRowGrid: {
    // Definisan u <style> tagu zbog media query-ja
  },
  streamCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: 'fit-content',
  },
  streamHeader: {
    padding: '0.75rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  streamStatusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  channelLink: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'color 0.2s',
    ':hover': {
      color: '#fff',
    }
  },
  playerContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#05070a',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  offlineScreen: {
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '1rem',
    zIndex: 1,
    maxWidth: '500px',
  },
  offlineAvatar: {
    fontSize: '3rem',
    animation: 'bounce 2s infinite',
  },
  offlineTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#fff',
  },
  offlineSubtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  },
  partnerCard: {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    minHeight: '380px',
  },
  partnerHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    justifyContent: 'center',
    minHeight: '52px',
  },
  partnerLogoImg: {
    height: '42px',
    maxWidth: '100%',
    objectFit: 'contain',
  },
  partnerNameGold: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#e5c158',
    textShadow: '0 0 10px rgba(229, 193, 88, 0.25)',
  },
  partnerNameBlue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #38bdf8 0%, #005cff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 10px rgba(0, 92, 255, 0.25)',
  },
  partnerTag: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '1px',
  },
  partnerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  partnerDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  codeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    border: '1px dashed var(--border-color)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    position: 'relative',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      borderColor: 'var(--accent-cyan)',
    }
  },
  codeLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  codeValueTextGold: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#e5c158',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '1px',
  },
  codeValueTextBlue: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--accent-cyan)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '1px',
  },
  copyNotice: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  partnerBtn: {
    width: '100%',
    justifyContent: 'center',
    padding: '0.7rem',
    fontSize: '0.85rem',
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.5rem',
  },
  statVal: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderLeft: '4px solid var(--accent-cyan)',
    paddingLeft: '12px',
    textAlign: 'left',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  stepCard: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.8rem',
    textAlign: 'left',
  },
  stepNum: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'rgba(0, 240, 255, 0.1)',
    lineHeight: '1',
  },
  activityList: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    '@media (max-width: 576px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '4px',
    },
  },
  activityTime: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    minWidth: '70px',
  },
};

export default Home;
