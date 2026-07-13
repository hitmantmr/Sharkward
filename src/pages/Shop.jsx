import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Filter, Search, ShieldAlert, ArrowRight, Sparkles, Truck, CreditCard, LayoutGrid, Sword, Info } from 'lucide-react';

const Shop = ({ setActiveTab }) => {
  const { user, skins, buySkin, saveTradeUrl } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('price-desc');
  const [selectedSkin, setSelectedSkin] = useState(null); // Za modal potvrde
  const [tradeUrlInput, setTradeUrlInput] = useState(user.tradeUrl || '');

  // Mapiranje stilizovanih gradijenata za skinove
  const getSkinGradient = (imageName) => {
    if (imageName.startsWith('gift_card')) {
      return 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';
    }
    switch (imageName) {
      case 'flip_doppler':
        return 'radial-gradient(circle at center, #1e1b4b 0%, #030712 100%)';
      case 'gut_marble':
        return 'radial-gradient(circle at center, #2e1065 0%, #030712 100%)';
      case 'shadow_ultraviolet':
        return 'radial-gradient(circle at center, #1c1917 0%, #030712 100%)';
      case 'awp_asiimov':
        return 'radial-gradient(circle at center, #3f3f46 0%, #030712 100%)';
      case 'ak_redline':
        return 'radial-gradient(circle at center, #450a0a 0%, #030712 100%)';
      case 'deagle_conspiracy':
        return 'radial-gradient(circle at center, #172554 0%, #030712 100%)';
      case 'mecha_deagle':
        return 'radial-gradient(circle at center, #1e293b 0%, #030712 100%)';
      case 'glock_shinobu':
        return 'radial-gradient(circle at center, #311042 0%, #030712 100%)';
      case 'm4_stratosphere':
        return 'radial-gradient(circle at center, #064e3b 0%, #030712 100%)';
      case 'usp_jawbreaker':
        return 'radial-gradient(circle at center, #581c87 0%, #030712 100%)';
      default:
        return 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)';
    }
  };

  const getAutoRarityColor = (skin) => {
    if (!skin) return '#8b5cf6';
    const name = (skin.name || '').toLowerCase();
    const type = skin.type || '';

    if (type === 'GiftCard' || name.includes('gift card')) {
      return '#00f0ff';
    }
    if (type === 'Knife' || name.startsWith('★') || name.includes('knife') || name.includes('karambit') || name.includes('butterfly') || name.includes('bayonet') || name.includes('doppler')) {
      return '#ffd700';
    }
    if (
      name.includes('dragon lore') || name.includes('fire serpent') || name.includes('howl') ||
      name.includes('asiimov') || name.includes('code red') || name.includes('case hardened') ||
      name.includes('kill confirmed') || name.includes('printstream')
    ) {
      return '#eb4b4b';
    }
    if (
      name.includes('decimator') || name.includes('mecha') || name.includes('jawbreaker') ||
      name.includes('disco tech') || name.includes('neo-noir') || name.includes('hyper beast')
    ) {
      return '#d32ce6';
    }
    if (
      name.includes('atheris') || name.includes('slate') || name.includes('black lotus') ||
      name.includes('umbral rabbit') || name.includes('tooth fairy') || name.includes('conspiracy')
    ) {
      return '#8b5cf6';
    }
    return '#3b82f6';
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'covert': return '#eb4b4b';
      case 'classified': return '#d946ef';
      case 'restricted': return '#8b5cf6';
      case 'milspec': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  // Filtriranje i sortiranje
  const filteredSkins = skins
    .filter(skin => {
      // Potpuno izbacujemo stikere iz ponude
      const isSticker = skin.type === 'Sticker' || 
                        skin.name.toLowerCase().includes('sticker') || 
                        skin.name.toLowerCase().includes('stiker');
      if (isSticker) return false;

      const matchesSearch = skin.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
        (categoryFilter === 'giftcard' && skin.type === 'GiftCard') ||
        (categoryFilter === 'knives' && skin.type === 'Knife') ||
        (categoryFilter === 'skins' && skin.type !== 'Knife' && skin.type !== 'GiftCard');
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // 1. Primarno grupisati po tipu: GiftCard (1), Knife (2), Skins (3)
      const priorityA = a.type === 'GiftCard' ? 1 : (a.type === 'Knife' ? 2 : 3);
      const priorityB = b.type === 'GiftCard' ? 1 : (b.type === 'Knife' ? 2 : 3);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // 2. Sekundarno sortirati unutar grupe po ceni (podrazumevano od najskuplje ka najjeftinijoj)
      if (sortOrder === 'price-asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price; // price-desc
      }
    });

  const handlePurchaseClick = (skin) => {
    setSelectedSkin(skin);
  };

  const confirmPurchase = () => {
    if (selectedSkin) {
      const success = buySkin(selectedSkin.id);
      if (success) {
        setSelectedSkin(null);
      }
    }
  };

  const handleSaveTradeUrl = (e) => {
    e.preventDefault();
    saveTradeUrl(tradeUrlInput.trim());
  };

  const formatPoints = (pts) => {
    return new Intl.NumberFormat().format(pts);
  };

  // Pomoćna komponenta za prikaz slike/vizuelnog dela skina
  const RenderSkinImage = ({ skin, glowColor = '#8b5cf6' }) => {
    const isGiftCard = skin.type === 'GiftCard';
    
    if (isGiftCard) {
      const valueText = skin.estPrice || '$10';
      return (
        <div style={styles.giftCardVisual}>
          <div style={styles.giftCardLineHorizontal} />
          <div style={styles.giftCardLineVertical} />
          <div style={styles.giftCardTextWrapper}>
            <span style={styles.giftCardBrand}>CSGO SKINS</span>
            <span style={styles.giftCardValue}>{valueText}</span>
            <span style={styles.giftCardTypeTag}>GIFT CARD</span>
          </div>
        </div>
      );
    }

    const circleGlow = (
      <div style={{
        position: 'absolute',
        width: '95px',
        height: '95px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${glowColor}66 0%, ${glowColor}22 55%, transparent 80%)`,
        filter: 'blur(10px)',
        pointerEvents: 'none',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
      }} />
    );

    const imgUrl = skin.imageUrl || skin.image;
    // Ako slika počinje sa http/https, renderujemo je direktno sa CDN-a (ByMykel API)
    if (imgUrl && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://'))) {
      const fixedUrl = imgUrl.replace('community.akamai.steamstatic.com', 'community.steamstatic.com');
      return (
        <div style={{ ...styles.imgWrapper, position: 'relative' }}>
          {circleGlow}
          <img src={fixedUrl} alt={skin.name} style={{ ...styles.skinImg, position: 'relative', zIndex: 2 }} />
        </div>
      );
    }

    const localImages = {
      'fade_butterfly': './img/butterfly_fade.png',
      'butterfly_fade': './img/butterfly_fade.png',
      'doppler_karambit': './img/karambit_doppler.png',
      'karambit_doppler': './img/karambit_doppler.png',
      'flip_doppler': './img/karambit_doppler.png',
      'gut_marble': './img/butterfly_fade.png',
      'shadow_ultraviolet': './img/karambit_doppler.png',
      'awp_asiimov': './img/karambit_doppler.png',
      'ak_redline': './img/butterfly_fade.png',
      'pandora_gloves': './img/butterfly_fade.png',
      'dragon_lore': './img/karambit_doppler.png',
      'printstream_m4': './img/karambit_doppler.png',
      'neon_rider': './img/butterfly_fade.png',
      'neo_noir_usp': './img/karambit_doppler.png',
      'water_glock': './img/butterfly_fade.png',
      'mecha_deagle': './img/karambit_doppler.png'
    };

    const imageUrl = localImages[skin.image];

    if (imageUrl) {
      return (
        <div style={{ ...styles.imgWrapper, position: 'relative' }}>
          {circleGlow}
          <img src={imageUrl} alt={skin.name} style={{ ...styles.skinImg, position: 'relative', zIndex: 2 }} />
        </div>
      );
    }

    // Default CSS fallback
    return (
      <div style={{ ...styles.fallbackVisual, position: 'relative' }}>
        {circleGlow}
        <span style={{ ...styles.fallbackEmoji, position: 'relative', zIndex: 2 }}>
          {skin.type === 'Knife' ? '🔪' : skin.type === 'Gloves' ? '🧤' : '🔫'}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.container} className="fade-in">
      
      {/* Obaveštenje ako Discord nije povezan */}
      {!user.discordLinked && (
        <div className="discord-lock-banner">
          <ShieldAlert size={22} color="#00f0ff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', color: '#00f0ff', marginBottom: '2px', fontSize: '0.95rem' }}>
              🔒 PRODAVNICA SKINOVA JE ZAKLJUČANA
            </div>
            <span>
              Moraš prvo povezati svoj <strong>Discord nalog</strong> da bi kupovao skinove i sačuvao Trade URL. Ako još uvek nisi član Sharke Discord servera, obavezno se pridruži OVDE: {' '}
              <a href="https://discord.gg/n2t8ZBDfH3" target="_blank" rel="noopener noreferrer">
                discord.gg/n2t8ZBDfH3
              </a>
            </span>
          </div>
        </div>
      )}

      {/* Sadržaj prodavnice sa blur efektom dok nije povezan Discord */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
        filter: user.discordLinked ? 'none' : 'blur(5px)',
        opacity: user.discordLinked ? 1 : 0.45,
        pointerEvents: user.discordLinked ? 'auto' : 'none',
        userSelect: user.discordLinked ? 'auto' : 'none',
      }}>
        {/* 1. Podešavanje isporuke (Steam Trade URL) */}
        <div style={styles.deliveryCard} className="glass">
          <div style={styles.deliveryHeader}>
            <div style={styles.deliveryIconCircle}>
              <Truck size={18} color="var(--accent-cyan)" />
            </div>
            <span style={styles.deliveryTitle}>PODEŠAVANJE ISPORUKE</span>
          </div>
          
          <p style={styles.deliveryDesc}>
            Da bi ti administratori mogli poslati skin, moraš uneti ispravan Steam Trade URL.
          </p>

          <form onSubmit={handleSaveTradeUrl} style={styles.deliveryForm}>
            <input 
              type="text" 
              placeholder="Unesi svoj Steam Trade URL (npr. https://steamcommunity.com/tradeoffer/new/...)" 
              value={tradeUrlInput}
              onChange={(e) => setTradeUrlInput(e.target.value)}
              style={styles.deliveryInput}
            />
            <button type="submit" style={styles.deliverySubmitBtn}>
              SAČUVAJ LINK
            </button>
          </form>
        </div>

      {/* 2. Zaglavlje sa Balansom poena */}
      <div style={styles.shopSubHeader}>
        <div>
          <h2 style={styles.shopTitle}>Skin Shop</h2>
          <p style={styles.shopSubtitle}>Zameni sakupljene poene za vaučere i premium CS:GO skinove</p>
        </div>
        <div style={styles.balanceDisplay} className="glass">
          <span style={styles.balanceLabel}>Tvoj Balans:</span>
          <div style={styles.balanceVal}>
            <Coins size={18} color="var(--accent-cyan)" />
            <span>{formatPoints(user.points)} poena</span>
          </div>
          {(!user.kickLinked || !user.discordLinked) && (
            <div style={styles.warningLink} onClick={() => setActiveTab('watchtime')}>
              Poveži naloge za kupovinu <ArrowRight size={12} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Bar sa Filterima i Pretragom */}
      <div style={styles.filtersBar} className="glass">
        {/* Levo skroz: Pretraga */}
        <div style={styles.searchWrapper}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Pretraži..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* U sredini: Kategorije */}
        <div style={styles.filterTabs}>
          <button 
            style={{ ...styles.filterTab, ...(categoryFilter === 'all' ? styles.activeFilterTab : {}) }}
            onClick={() => setCategoryFilter('all')}
          >
            <LayoutGrid size={14} /> SVE
          </button>
          <button 
            style={{ ...styles.filterTab, ...(categoryFilter === 'giftcard' ? styles.activeFilterTab : {}) }}
            onClick={() => setCategoryFilter('giftcard')}
          >
            <CreditCard size={14} /> GIFT CARD
          </button>
          <button 
            style={{ ...styles.filterTab, ...(categoryFilter === 'skins' ? styles.activeFilterTab : {}) }}
            onClick={() => setCategoryFilter('skins')}
          >
            <Sparkles size={14} /> SKINS
          </button>
          <button 
            style={{ ...styles.filterTab, ...(categoryFilter === 'knives' ? styles.activeFilterTab : {}) }}
            onClick={() => setCategoryFilter('knives')}
          >
            <Sword size={14} /> KNIFES
          </button>
        </div>

        {/* Desno skroz: Odabir cene */}
        <div style={styles.sortWrapper}>
          <Filter size={14} color="var(--text-muted)" />
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.selectInput}
          >
            <option value="price-desc">Cena: Najviša</option>
            <option value="price-asc">Cena: Najniža</option>
          </select>
        </div>
      </div>

      {/* 4. Grid sa Skinovima */}
      {filteredSkins.length > 0 ? (
        <div style={styles.skinsGrid}>
          {filteredSkins.map((skin) => {
            const glowColor = getAutoRarityColor(skin);
            const hasEnoughPoints = user.points >= skin.price;
            const isSold = skin.status === 'sold' || skin.stock <= 0;

            return (
              <div 
                key={skin.id} 
                style={{ 
                  ...styles.skinCard,
                  borderColor: isSold ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.07)',
                  borderTop: `3px solid ${glowColor}`,
                  boxShadow: isSold ? 'none' : `0 8px 30px rgba(0, 0, 0, 0.4)`
                }} 
                className="glass-interactive"
              >
                {/* Rarity & Wear Tag */}
                <div style={styles.cardHeaderTags}>
                  <span style={styles.wearTag}>
                    {skin.condition}
                  </span>
                </div>

                {/* Skin vizuelni prikaz */}
                <div style={{ ...styles.skinVisual, background: getSkinGradient(skin.image) }}>
                  <div style={styles.radialGlow} />
                  <RenderSkinImage skin={skin} glowColor={glowColor} />
                </div>

                {/* Skin Info */}
                <div style={styles.skinInfo}>
                  <h3 style={styles.skinName} title={skin.name}>{skin.name}</h3>
                  
                  {/* Stock & Est Value */}
                  <div style={styles.stockRow}>
                    <span style={styles.stockText}>Na lageru: <strong>{isSold ? 0 : skin.stock || 1} kom</strong></span>
                    {skin.estPrice && (
                      <span style={styles.estPriceBadge}>Est. {skin.estPrice}</span>
                    )}
                  </div>
                  
                  {/* Divider */}
                  <div style={styles.cardDivider} />

                  {/* Price and CTA Button */}
                  <div style={styles.cardBottom}>
                    <div style={styles.priceContainer}>
                      <span style={styles.priceLabel}>CENA:</span>
                      <div style={styles.pricePoints}>
                        <Coins size={14} color="var(--accent-cyan)" />
                        <span>{formatPoints(skin.price)} PTS</span>
                      </div>
                    </div>

                    {isSold ? (
                      <button style={styles.actionBtnSold} disabled>
                        RASPRODATO
                      </button>
                    ) : hasEnoughPoints ? (
                      <button 
                        style={styles.actionBtnBuy}
                        onClick={() => handlePurchaseClick(skin)}
                      >
                        {skin.type === 'GiftCard' ? 'KUPI KARTICU' : 'KUPI SKIN'}
                      </button>
                    ) : (
                      <button style={styles.actionBtnInsufficient} disabled>
                        NEDOVOLJNO POENA
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.noSkinsCard} className="glass">
          <Info size={36} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <p>Trenutno nema skinova koji odgovaraju pretrazi.</p>
        </div>
      )}
      </div>

      {/* 5. Modal za potvrdu kupovine */}
      {selectedSkin && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal} className="glass">
            <h3 style={styles.modalTitle}>Potvrda Kupovine</h3>
            
            <div style={styles.modalBody}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Da li želiš da zameniš svoje poene za ovaj predmet? Artikal će ti biti poslat u najkraćem roku.
              </p>
              
              {/* Prikaz skina u modalu */}
              <div style={styles.modalSkinPreview}>
                <div style={{ ...styles.modalSkinVisual, background: getSkinGradient(selectedSkin.image) }}>
                  <RenderSkinImage skin={selectedSkin} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{selectedSkin.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
                    Kvalitet: <span style={{ color: '#53fc18', fontWeight: 600 }}>{selectedSkin.condition}</span>
                  </p>
                </div>
              </div>

              {/* Provera Steam Trade URL-a */}
              {!selectedSkin.name.includes('Gift Card') && !user.tradeUrl && (
                <div style={styles.modalUrlWarning}>
                  ⚠️ Moraš uneti Steam Trade URL na vrhu stranice pre nego što kupiš ovaj skin kako bismo ti ga poslali!
                </div>
              )}

              <div style={styles.modalPriceContainer}>
                <span style={{ fontSize: '0.9rem' }}>Ukupno za naplatu:</span>
                <div style={styles.modalPrice}>
                  <Coins size={16} color="var(--accent-cyan)" />
                  <span style={{ color: '#fff', fontWeight: '800' }}>{formatPoints(selectedSkin.price)} PTS</span>
                </div>
              </div>

              {(!user.kickLinked || !user.discordLinked) && (
                <div style={styles.modalWarning}>
                  ⚠️ Moraš povezati i Kick i Discord nalog pre kupovine!
                </div>
              )}
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setSelectedSkin(null)}>
                Odustani
              </button>
              <button 
                style={{
                  ...styles.deliverySubmitBtn,
                  opacity: (!user.kickLinked || !user.discordLinked || user.points < selectedSkin.price) ? 0.5 : 1,
                  cursor: (!user.kickLinked || !user.discordLinked || user.points < selectedSkin.price) ? 'not-allowed' : 'pointer'
                }} 
                onClick={confirmPurchase}
                disabled={!user.kickLinked || !user.discordLinked || user.points < selectedSkin.price}
              >
                Potvrdi Kupovinu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  
  // Podešavanje isporuke (Steam Trade URL)
  deliveryCard: {
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    textAlign: 'left',
  },
  deliveryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  deliveryIconCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryTitle: {
    fontSize: '0.9rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.5px',
  },
  deliveryDesc: {
    fontSize: '0.825rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
    margin: 0,
  },
  deliveryForm: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    flexWrap: 'wrap',
  },
  deliveryInput: {
    flex: 1,
    minWidth: '260px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#fff',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.2s',
    ':focus': {
      borderColor: 'var(--accent-cyan)',
    }
  },
  deliverySubmitBtn: {
    backgroundColor: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '0.825rem',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 14px rgba(0, 240, 255, 0.25)',
    ':hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 20px rgba(0, 240, 255, 0.4)',
    }
  },

  // Shop sub header
  shopSubHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.5rem',
    textAlign: 'left',
  },
  shopTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
  },
  shopSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    marginTop: '2px',
  },
  balanceDisplay: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '0.85rem 1.25rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    '@media (max-width: 576px)': {
      alignItems: 'flex-start',
      width: '100%',
    },
  },
  balanceLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  balanceVal: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#fff',
    marginTop: '2px',
  },
  warningLink: {
    fontSize: '0.75rem',
    color: '#eb4b4b',
    marginTop: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // Filters Bar
  filtersBar: {
    padding: '0.75rem 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  filterTabs: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-secondary)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '800',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  activeFilterTab: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    borderColor: 'var(--accent-cyan)',
    color: 'var(--accent-cyan)',
  },
  searchSortGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    minWidth: '180px',
  },
  searchInput: {
    background: 'none',
    border: 'none',
    color: '#fff',
    outline: 'none',
    fontSize: '0.85rem',
    width: '100%',
    fontFamily: 'var(--font-sans)',
  },
  sortWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  selectInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#fff',
    padding: '0.45rem 0.85rem',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '0.825rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },

  // Skins Grid
  skinsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.25rem',
  },
  skinCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    height: '100%',
  },
  cardHeaderTags: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    zIndex: 5,
    display: 'flex',
    gap: '6px',
  },
  wearTag: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: '#9ca3af',
    backgroundColor: 'rgba(10, 15, 26, 0.75)',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    letterSpacing: '0.5px',
  },
  skinVisual: {
    height: '170px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  radialGlow: {
    position: 'absolute',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  imgWrapper: {
    width: '130px',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  skinImg: {
    maxWidth: '100%',
    height: 'auto',
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
  },
  fallbackVisual: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3.5rem',
    zIndex: 2,
  },

  // Gift Card Visual (Pure CSS, Premium)
  giftCardVisual: {
    width: '135px',
    height: '85px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 2,
  },
  giftCardLineHorizontal: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '100%',
    height: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  giftCardLineVertical: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '12px',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.03)',
    borderRight: '1px solid rgba(255, 255, 255, 0.03)',
  },
  giftCardTextWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: '8px 10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 3,
  },
  giftCardBrand: {
    fontSize: '0.45rem',
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.3)',
    letterSpacing: '0.5px',
  },
  giftCardValue: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#fff',
    alignSelf: 'flex-end',
    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    marginRight: '4px',
  },
  giftCardTypeTag: {
    fontSize: '0.45rem',
    fontWeight: '700',
    color: 'var(--accent-cyan)',
    letterSpacing: '0.5px',
  },

  // Skin Info Section
  skinInfo: {
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'rgba(10, 13, 20, 0.4)',
  },
  skinName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0 0 0.5rem 0',
    textAlign: 'left',
    lineHeight: '1.35',
    minHeight: '2.4rem',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  stockRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
  },
  stockText: {
    fontWeight: '500',
  },
  estPriceBadge: {
    color: '#a3e635',
    fontWeight: '700',
    backgroundColor: 'rgba(163, 230, 53, 0.08)',
    border: '1px solid rgba(163, 230, 53, 0.15)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  cardDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    width: '100%',
    marginBottom: '1rem',
  },

  // Price & Buy bottom layout
  cardBottom: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    marginTop: 'auto',
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  pricePoints: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#fff',
  },
  actionBtnBuy: {
    backgroundColor: 'var(--accent-cyan)',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    padding: '0.65rem',
    fontSize: '0.8rem',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    width: '100%',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0, 240, 255, 0.2)',
    ':hover': {
      boxShadow: '0 6px 18px rgba(0, 240, 255, 0.4)',
    }
  },
  actionBtnInsufficient: {
    backgroundColor: 'rgba(0, 240, 255, 0.05)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    color: 'rgba(0, 240, 255, 0.5)',
    borderRadius: '8px',
    padding: '0.65rem',
    fontSize: '0.8rem',
    fontWeight: '800',
    width: '100%',
    cursor: 'not-allowed',
    fontFamily: 'var(--font-sans)',
  },
  actionBtnSold: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    color: 'var(--text-muted)',
    borderRadius: '8px',
    padding: '0.65rem',
    fontSize: '0.8rem',
    fontWeight: '800',
    width: '100%',
    cursor: 'not-allowed',
    fontFamily: 'var(--font-sans)',
  },

  noSkinsCard: {
    padding: '4rem 2rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
  },

  // Modal confirm purchase overlay and details
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(3, 4, 7, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modal: {
    maxWidth: '450px',
    width: '100%',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#fff',
    textAlign: 'left',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    color: 'var(--text-secondary)',
    textAlign: 'left',
  },
  modalSkinPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: '0.85rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  modalSkinVisual: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalPriceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '1rem',
  },
  modalPrice: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '1.1rem',
    fontWeight: '800',
    color: 'var(--accent-cyan)',
  },
  modalWarning: {
    backgroundColor: 'rgba(235, 75, 75, 0.08)',
    border: '1px solid rgba(235, 75, 75, 0.15)',
    padding: '0.75rem',
    borderRadius: '8px',
    color: '#eb4b4b',
    fontSize: '0.775rem',
    fontWeight: '700',
    lineHeight: '1.35',
  },
  modalUrlWarning: {
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    border: '1px solid rgba(249, 115, 22, 0.15)',
    padding: '0.75rem',
    borderRadius: '8px',
    color: '#f97316',
    fontSize: '0.775rem',
    fontWeight: '700',
    lineHeight: '1.35',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelBtn: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-secondary)',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.825rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
    ':hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    }
  }
};

export default Shop;
