import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Award, Users, ShoppingBag, ArrowRight, ExternalLink, Copy, Gift } from 'lucide-react';

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
          <span>SKROLUJ ZA SPONZORE & NAGRADNE IGRE</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="scroll-chevron">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* 2. Prvi Red: Partnerski Sponzori (CSGO-Skins, Mozzart, Alea Partners) */}
      <div className="sponsors-viewport">
        <div className="sponsors-header reveal-on-scroll">
          <h2 className="sponsors-title">EKSKLUZIVNI PARTNERI</h2>
          <p className="sponsors-subtitle">Iskoristi promo kodove i preuzmi specijalne poklone kod naših sponzora</p>
        </div>

        <section className="first-row-grid" style={styles.firstRowGrid}>
        
        {/* CSGO Skins Card */}
        <div className="premium-card sponsor-card-premium csgoskins-card reveal-on-scroll" style={{ ...styles.partnerCard, transitionDelay: '100ms' }}>
          <div style={styles.partnerHeader}>
            <img src="./img/csgoskins logo.png" alt="CSGO Skins Logo" style={{ ...styles.partnerLogoImg, filter: 'drop-shadow(0 4px 12px rgba(0, 240, 255, 0.35))' }} />
            <span className="sponsor-tag-badge cyan">SPONZOR</span>
          </div>

          <div className="sponsor-benefits-list">
            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box cyan">
                <Gift size={14} color="#00f0ff" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Besplatnih $0.50</span>
                <span className="sponsor-benefit-sub">Pri registraciji</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box cyan">
                <Award size={14} color="#00f0ff" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">10% Depozit Bonus</span>
                <span className="sponsor-benefit-sub">Na sve uplate</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box cyan">
                <Play size={14} color="#00f0ff" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Dnevni Giveaway-evi</span>
                <span className="sponsor-benefit-sub">Besplatni CS2 skinovi</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div 
              className="premium-sponsor-code-btn cyan-theme"
              onClick={() => copyToClipboard('SHARKE')}
              title="Klikni da kopiraš kod"
            >
              <span className="code-label">PROMO KOD:</span>
              <span className="code-value cyan">SHARKE</span>
              <Copy size={14} color="#00f0ff" />
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
            <img src="./img/mozzart logo.png" alt="Mozzart Logo" style={{ ...styles.partnerLogoImg, filter: 'drop-shadow(0 4px 12px rgba(229, 193, 88, 0.35))' }} />
            <span className="sponsor-tag-badge gold">SPONZOR</span>
          </div>

          <div className="sponsor-benefits-list">
            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box gold">
                <Gift size={14} color="#e5c158" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Bonusi na 3 depozita</span>
                <span className="sponsor-benefit-sub">Paket dobrodošlice</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box gold">
                <Award size={14} color="#e5c158" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Spinovi & Freebet</span>
                <span className="sponsor-benefit-sub">Besplatno igranje</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box gold">
                <Play size={14} color="#e5c158" />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Najveće kvote na svetu</span>
                <span className="sponsor-benefit-sub">Najbolji uslovi</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            <div 
              className="premium-sponsor-code-btn gold-theme"
              onClick={() => copyToClipboard('AJKULA')}
              title="Klikni da kopiraš kod"
            >
              <span className="code-label">PROMO KOD:</span>
              <span className="code-value gold">AJKULA</span>
              <Copy size={14} color="#e5c158" />
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

        {/* Alea Partners Card */}
        <div className="premium-card sponsor-card-premium aleapartners-card reveal-on-scroll" style={{ ...styles.partnerCard, transitionDelay: '300ms', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={styles.partnerHeader}>
            <img src="./img/alea.png" alt="Alea Partners Logo" style={{ ...styles.partnerLogoImg, filter: 'drop-shadow(0 4px 12px rgba(0, 210, 196, 0.35))' }} />
            <span className="sponsor-tag-badge blue">SPONZOR</span>
          </div>

          <div className="sponsor-benefits-list" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box blue">
                <Gift size={14} color="#00d2c4" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 210, 196, 0.5))' }} />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">iGaming & Betting</span>
                <span className="sponsor-benefit-sub">Najsavremenija rešenja</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box blue">
                <Award size={14} color="#00d2c4" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 210, 196, 0.5))' }} />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">16,000+ Premium Igara</span>
                <span className="sponsor-benefit-sub">Najveći svetski provajderi</span>
              </div>
            </div>

            <div className="sponsor-benefit-row">
              <div className="sponsor-benefit-icon-box blue">
                <Play size={14} color="#00d2c4" style={{ filter: 'drop-shadow(0 0 4px rgba(0, 210, 196, 0.5))' }} />
              </div>
              <div className="sponsor-benefit-content">
                <span className="sponsor-benefit-title">Inovativni Softveri</span>
                <span className="sponsor-benefit-sub">Pouzdani B2B sistemi</span>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', marginTop: '1rem' }}>
            <a 
              href="https://www.aleapartners.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sponsor-activation-btn teal-theme" 
              style={{ margin: 0 }}
            >
              Poseti Alea Partners <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </section>

      <div className="sponsors-footer reveal-on-scroll">
        <span className="sponsors-footer-text">Aktivacija kodova direktno podržava rad Sharky strima</span>
      </div>
      </div>

      {/* 4. 2-Card Grid: Kako Sakupljati Poene, Aktivni Giveaway */}
      <div className="bottom-viewport">
        <section className="bottom-cards-grid" style={{ width: '100%' }}>

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
      </div>

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

        .sponsors-viewport {
          width: 100%;
          box-sizing: border-box;
          padding: 3rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .sponsors-header {
          text-align: center;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }

        .sponsors-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 1px;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          background: linear-gradient(90deg, #fff 0%, var(--accent-cyan) 50%, var(--accent-blue) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sponsors-subtitle {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 500;
        }

        .sponsors-footer {
          margin-top: 2rem;
          text-align: center;
          padding: 0 1rem;
        }

        .sponsors-footer-text {
          font-size: 0.82rem;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          font-weight: 500;
          opacity: 0.65;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
          padding-bottom: 4px;
        }

        .bottom-viewport {
          width: 100%;
          box-sizing: border-box;
          padding: 2rem 0 4rem 0;
        }

        @media (min-width: 992px) {
          .sponsors-viewport {
            min-height: calc(100vh - var(--navbar-height));
          }
          
          .bottom-viewport {
            min-height: calc(100vh - var(--navbar-height) - 2rem);
            display: flex;
            align-items: center;
            justify-content: center;
          }
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
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 1020px;
          margin: 0 auto;
          width: 100%;
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
          grid-template-columns: repeat(2, 1fr);
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

        /* MODERN HIGH-TECH SPONSOR CARDS STYLING */
        .csgoskins-card {
          background: linear-gradient(180deg, rgba(0, 240, 255, 0.06) 0%, rgba(10, 15, 26, 0.85) 100%) !important;
          border: 1px solid rgba(0, 240, 255, 0.22) !important;
          box-shadow: 0 10px 30px rgba(0, 240, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }

        .csgoskins-card:hover {
          border-color: rgba(0, 240, 255, 0.45) !important;
          box-shadow: 0 15px 35px rgba(0, 240, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        .mozzart-card {
          background: linear-gradient(180deg, rgba(229, 193, 88, 0.06) 0%, rgba(10, 15, 26, 0.85) 100%) !important;
          border: 1px solid rgba(229, 193, 88, 0.22) !important;
          box-shadow: 0 10px 30px rgba(229, 193, 88, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }

        .mozzart-card:hover {
          border-color: rgba(229, 193, 88, 0.45) !important;
          box-shadow: 0 15px 35px rgba(229, 193, 88, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        .aleapartners-card {
          background: linear-gradient(180deg, rgba(0, 210, 196, 0.06) 0%, rgba(10, 15, 26, 0.85) 100%) !important;
          border: 1px solid rgba(0, 210, 196, 0.22) !important;
          box-shadow: 0 10px 30px rgba(0, 210, 196, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }

        .aleapartners-card:hover {
          border-color: rgba(0, 210, 196, 0.45) !important;
          box-shadow: 0 15px 35px rgba(0, 210, 196, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }

        .sponsor-tag-badge {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 1.2px;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .sponsor-tag-badge.cyan {
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.3);
          color: #00f0ff;
        }

        .sponsor-tag-badge.gold {
          background: rgba(229, 193, 88, 0.1);
          border: 1px solid rgba(229, 193, 88, 0.3);
          color: #e5c158;
        }

        .sponsor-tag-badge.blue {
          background: rgba(0, 210, 196, 0.1);
          border: 1px solid rgba(0, 210, 196, 0.3);
          color: #00d2c4;
        }

        .sponsor-benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          width: 100%;
          margin: 1.2rem 0;
        }

        .sponsor-benefit-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(5, 8, 15, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 0.6rem 0.85rem;
          text-align: left;
          transition: all 0.2s ease;
        }

        .sponsor-benefit-row:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .sponsor-benefit-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sponsor-benefit-icon-box.cyan {
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.2);
        }

        .sponsor-benefit-icon-box.gold {
          background: rgba(229, 193, 88, 0.1);
          border: 1px solid rgba(229, 193, 88, 0.2);
        }

        .sponsor-benefit-icon-box.blue {
          background: rgba(0, 210, 196, 0.1);
          border: 1px solid rgba(0, 210, 196, 0.2);
        }

        .sponsor-benefit-content {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .sponsor-benefit-title {
          font-size: 0.82rem;
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .sponsor-benefit-sub {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .premium-sponsor-code-btn {
          display: flex;
          align-items: center;
          justify-content: center !important;
          gap: 8px;
          width: 100%;
          background: rgba(0, 0, 0, 0.4) !important;
          border-radius: 10px !important;
          padding: 0.65rem 0.85rem !important;
          cursor: pointer;
          transition: all 0.2s ease !important;
          margin-bottom: 0.75rem;
          box-sizing: border-box;
        }

        .premium-sponsor-code-btn.cyan-theme {
          border: 1.5px dashed rgba(0, 240, 255, 0.5) !important;
        }

        .premium-sponsor-code-btn.gold-theme {
          border: 1.5px dashed rgba(229, 193, 88, 0.5) !important;
        }

        .premium-sponsor-code-btn:hover {
          background: rgba(0, 0, 0, 0.6) !important;
        }

        .code-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .code-value {
          font-size: 0.9rem;
          font-weight: 800;
          letter-spacing: 1px;
          font-family: var(--font-mono, monospace);
        }

        .code-value.cyan {
          color: #00f0ff;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
        }

        .code-value.gold {
          color: #e5c158;
          text-shadow: 0 0 10px rgba(229, 193, 88, 0.4);
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

        /* Teal Button Theme (Alea Partners) */
        .sponsor-activation-btn.teal-theme {
          background: linear-gradient(135deg, #00dfc6 0%, #008f84 100%) !important;
          color: #000 !important;
          box-shadow: 0 4px 15px rgba(0, 210, 196, 0.3) !important;
        }

        .sponsor-activation-btn.teal-theme:hover {
          box-shadow: 0 6px 22px rgba(0, 210, 196, 0.55) !important;
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
