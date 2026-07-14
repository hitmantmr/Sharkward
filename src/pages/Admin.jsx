import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Plus, Trash2, RotateCcw, Award, Coins, Play, Search, Loader, HelpCircle, Users, UserCheck, UserPlus, UserMinus, Gift } from 'lucide-react';

// 1. Pomoćna funkcija za čišćenje naziva od wear-a, zvezdica i StatTrak oznaka
function getCleanSkinName(fullName) {
  if (!fullName) return '';
  return fullName
    // Uklanjanje wear-a u zagradi: (Factory New), (Field-Tested), itd.
    .replace(/\s*\((Factory New|Minimal Wear|Field-Tested|Well-Worn|Battle-Scarred|Vanilla[^\)]*)\)/i, '')
    // Uklanjanje StatTrak i zvezdica
    .replace(/^★\s*/, '')
    .replace(/StatTrak™?\s*/i, '')
    .trim();
}

// 2. Pretraga slike iz ByMykel skins.json baze
function findSkinImage(inputName, skinsList) {
  const cleanSearchName = getCleanSkinName(inputName).toLowerCase();
  
  if (!cleanSearchName) return '';
  // EKSPLICITNA PRETRAGA: Tražimo tačno poklapanje čistog imena
  const matchedSkin = skinsList.find(s => {
    const apiNameClean = s.name.toLowerCase().trim();
    return apiNameClean === cleanSearchName;
  });
  // Ako postoji slika vraćamo je, u suprotnom VRAĆAMO PRAZNO (NE SME OSTATI STARA SLIKA!)
  return matchedSkin ? matchedSkin.image : '';
}

const getAdminSkinImage = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) {
    return img.replace('community.akamai.steamstatic.com', 'community.steamstatic.com');
  }
  return '';
};

const Admin = () => {
  const { 
    user, 
    API_URL,
    skins, 
    giveaways, 
    addSkin, 
    deleteSkin, 
    restockSkin, 
    updateUserPoints, 
    fetchAdminUsers,
    modifyAdminUserPoints,
    updateAdminUserRole,
    syncGiveaways,
    clearAllGiveaways,
    resetAllData,
    isLive,
    setIsLive
  } = useApp();

  // Država forme za skin
  const [skinName, setSkinName] = useState('');
  const [isStatTrak, setIsStatTrak] = useState(false);
  const [skinType, setSkinType] = useState('Knife');
  const [skinRarity, setSkinRarity] = useState('covert');
  const [skinCondition, setSkinCondition] = useState('FN');
  const [skinPrice, setSkinPrice] = useState('15000');
  const [skinImage, setSkinImage] = useState(''); // Početno prazno, postavlja se isključivo pretragom
  const [skinEstPrice, setSkinEstPrice] = useState('');
  const [skinStock, setSkinStock] = useState('1');
  const [giftCodesText, setGiftCodesText] = useState('');

  const handleGiftCodesTextChange = (text) => {
    setGiftCodesText(text);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      setSkinStock(lines.length.toString());
    }
  };

  // Države za uvoz partnerskih giveaway-a
  const [giveawaysJsonInput, setGiveawaysJsonInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Države za upravljanje članovima i permisijama
  const [adminUsersList, setAdminUsersList] = useState([]);
  const [adminPointsDelta, setAdminPointsDelta] = useState('500');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loadingAdminUsers, setLoadingAdminUsers] = useState(false);

  const loadAdminUsers = async () => {
    setLoadingAdminUsers(true);
    const users = await fetchAdminUsers();
    setAdminUsersList(users);
    setLoadingAdminUsers(false);
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleModifyPointsAction = async (discordId, amount) => {
    const ok = await modifyAdminUserPoints(discordId, amount);
    if (ok) {
      loadAdminUsers();
    }
  };

  const handleUpdateRoleAction = async (discordId, role) => {
    const ok = await updateAdminUserRole(discordId, role);
    if (ok) {
      loadAdminUsers();
    }
  };

  const filteredAdminUsers = adminUsersList.filter(u => {
    if (!userSearchQuery.trim()) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.kickUsername && u.kickUsername.toLowerCase().includes(q)) ||
      (u.discordId && u.discordId.includes(q))
    );
  });

  const handleImportGiveaways = async (e) => {
    e.preventDefault();
    if (!giveawaysJsonInput.trim()) {
      alert('Molimo te unesi JSON kod u polje!');
      return;
    }

    try {
      const parsed = JSON.parse(giveawaysJsonInput.trim());
      if (!Array.isArray(parsed)) {
        alert('Format nije ispravan! Očekuje se niz (array) sa giveaway podacima.');
        return;
      }

      setIsSyncing(true);
      const res = await syncGiveaways(parsed);
      setIsSyncing(false);

      if (res.success) {
        setGiveawaysJsonInput('');
      }
    } catch (err) {
      alert('Greška pri parsiranju JSON koda: ' + err.message);
    }
  };

  // CS2 API i Autocomplete države
  const [skinsCatalog, setSkinsCatalog] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCatalogSkin, setSelectedCatalogSkin] = useState(null);
  const [buffPrice, setBuffPrice] = useState(null);
  const [fetchingPrice, setFetchingPrice] = useState(false);

  // Mapa wear nivoa
  const wearMap = {
    'FN': 'Factory New',
    'MW': 'Minimal Wear',
    'FT': 'Field-Tested',
    'WW': 'Well-Worn',
    'BS': 'Battle-Scarred'
  };

  // Učitavanje kataloga skinova sa GitHub-a (ByMykel API)
  useEffect(() => {
    const fetchCatalog = async () => {
      const cached = sessionStorage.getItem('csgo_skins_catalog');
      if (cached) {
        setSkinsCatalog(JSON.parse(cached));
        return;
      }

      setLoadingCatalog(true);
      try {
        const res = await fetch('https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json');
        if (res.ok) {
          const data = await res.json();
          // Čuvamo samo potrebna polja radi uštede memorije
          const mapped = data.map(s => ({
            id: s.id,
            name: s.name,
            image: s.image,
            rarity: s.rarity ? s.rarity.id : 'rarity_common_color',
            weapon: s.weapon ? s.weapon.id : 'unknown',
            category: s.category ? s.category.id : 'unknown'
          }));
          setSkinsCatalog(mapped);
          sessionStorage.setItem('csgo_skins_catalog', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Greška pri učitavanju kataloga skinova:', err);
      } finally {
        setLoadingCatalog(false);
      }
    };

    fetchCatalog();
  }, []);

  const handleSkinNameInputChange = (val) => {
    setSkinName(val);
    setSelectedCatalogSkin(null);
    // Obavezna provera 1: Resetovanje state-a pre nove pretrage
    setSkinImage('');

    if (val.trim() && skinsCatalog.length > 0) {
      const foundImage = findSkinImage(val, skinsCatalog);
      setSkinImage(foundImage);
    }
  };

  // Pretraga i autokomplet predlozi
  useEffect(() => {
    if (!skinName.trim() || selectedCatalogSkin?.name === skinName) {
      setSuggestions([]);
      return;
    }

    const cleanQuery = getCleanSkinName(skinName).toLowerCase().replace(/[^a-z0-9]/g, '');

    const filtered = skinsCatalog
      .filter(s => {
        const cleanName = getCleanSkinName(s.name).toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleanName.includes(cleanQuery) || cleanQuery.includes(cleanName);
      })
      .slice(0, 8);
    setSuggestions(filtered);

    // Automatska provera eksplicitnog poklapanja naziva sa bazu
    const foundImage = findSkinImage(skinName, skinsCatalog);
    setSkinImage(foundImage);
  }, [skinName, skinsCatalog, selectedCatalogSkin]);

  // Pomocnik za mapiranje retkosti
  const mapRarity = (rarityId) => {
    if (!rarityId) return 'milspec';
    const lower = rarityId.toLowerCase();
    if (lower.includes('ancient') || lower.includes('covert') || lower.includes('red')) return 'covert';
    if (lower.includes('legendary') || lower.includes('classified') || lower.includes('pink')) return 'classified';
    if (lower.includes('mythical') || lower.includes('restricted') || lower.includes('purple')) return 'restricted';
    return 'milspec';
  };

  // Pomocnik za tip oružja
  const mapWeaponType = (skinObj) => {
    const category = skinObj.category?.toLowerCase() || '';
    const name = skinObj.name?.toLowerCase() || '';
    
    if (category.includes('knife') || name.includes('knife') || name.includes('bayonet') || name.includes('daggers') || name.includes('karambit')) {
      return 'Knife';
    }
    if (category.includes('gloves')) {
      return 'Gloves';
    }
    if (name.includes('awp') || name.includes('ssg') || name.includes('scar') || name.includes('g3sg1')) {
      return 'Sniper Rifle';
    }
    if (name.includes('ak-47') || name.includes('m4a') || name.includes('galil') || name.includes('famas') || name.includes('aug') || name.includes('sg 553')) {
      return 'Rifle';
    }
    return 'Pistol';
  };

  // Pomoćna provera da li je predmet nož ili rukavica (Na Steam/Buff tržnici uvek imaju ★ u nazivu)
  const checkIsStarItem = (name, type) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    // Oružja koja NISU noževi ni rukavice ne smeju se pretraživati sa ★ zvezdicom
    if (lower.includes('ak-47') || lower.includes('m4a4') || lower.includes('m4a1') || lower.includes('awp') || lower.includes('glock') || lower.includes('usp') || lower.includes('desert eagle') || lower.includes('deagle') || lower.includes('mp9') || lower.includes('mac-10') || lower.includes('p250') || lower.includes('cz75') || lower.includes('five-seven') || lower.includes('tec-9') || lower.includes('ssg 08') || lower.includes('galil') || lower.includes('famas') || lower.includes('sg 553') || lower.includes('aug') || lower.includes('g3sg1') || lower.includes('scar-20') || lower.includes('ump-45') || lower.includes('p90') || lower.includes('bizon') || lower.includes('mp7') || lower.includes('mp5') || lower.includes('mag-7') || lower.includes('nova') || lower.includes('sawed-off') || lower.includes('xm1014') || lower.includes('m249') || lower.includes('negev')) {
      return false;
    }
    if (type === 'Knife' || type === 'Gloves') return true;
    const starKeywords = ['knife', 'bayonet', 'daggers', 'karambit', 'stiletto', 'ursus', 'navaja', 'talon', 'classic', 'survival', 'nomad', 'skeleton', 'paracord', 'kukri', 'bowie', 'huntsman', 'falchion', 'gut', 'gloves', 'wraps'];
    return starKeywords.some(k => lower.includes(k));
  };

  // Preuzimanje cene sa Buff163
  const fetchBuffPrice = async (name, wearCode, stattrak = false, typeOverride = null) => {
    if (!name || !name.trim()) return;
    const wearFullName = wearMap[wearCode] || 'Field-Tested';
    let cleanBase = getCleanSkinName(name);

    // Utvrđujemo fazu ako postoji u nazivu
    let phase = selectedCatalogSkin?.phase || null;
    if (!phase) {
      const phaseMatch = name.match(/\((Phase \d|Ruby|Sapphire|Black Pearl|Emerald)\)/i);
      if (phaseMatch) {
        phase = phaseMatch[1];
        cleanBase = cleanBase.replace(`(${phase})`, '').trim();
      }
    }

    let displayName = cleanBase;
    if (phase) {
      displayName = `${cleanBase} (${phase})`;
    }

    const currentType = typeOverride || skinType;
    const isKnife = checkIsStarItem(cleanBase, currentType);

    let queryName = '';
    if (stattrak) {
      queryName = isKnife ? `★ StatTrak™ ${displayName} (${wearFullName})` : `StatTrak™ ${displayName} (${wearFullName})`;
    } else {
      queryName = isKnife ? `★ ${displayName} (${wearFullName})` : `${displayName} (${wearFullName})`;
    }

    setFetchingPrice(true);
    setBuffPrice(null);
    try {
      const res = await fetch(`${API_URL}/admin/skin-price?name=${encodeURIComponent(queryName)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.price) {
          setBuffPrice(data.price);
          setSkinEstPrice('$' + data.price.toFixed(2));
          // Preporučena cena poena (1 USD = 130 PTS)
          setSkinPrice(Math.round(data.price * 130).toString());
        } else {
          setBuffPrice(null);
          setSkinEstPrice('');
        }
      }
    } catch (err) {
      console.warn('Greška pri dobavljanju cene:', err);
    } finally {
      setFetchingPrice(false);
    }
  };

  // Promena stanja izbora skina
  const handleSelectSuggestion = (skin) => {
    setSelectedCatalogSkin(skin);
    setSkinName(skin.name);
    
    // Eksplicitna pretraga slike iz ByMykel liste na osnovu unetog čistog imena
    const foundImage = findSkinImage(skin.name, skinsCatalog) || skin.image || '';
    setSkinImage(foundImage);

    const calculatedRarity = mapRarity(skin.rarity);
    const calculatedType = mapWeaponType(skin);

    setSkinRarity(calculatedRarity);
    setSkinType(calculatedType);
    setSuggestions([]);
    
    // Dohvati cenu prosleđujući tačno izračunati tip oružja (izbegava asinhrone re-rendere)
    fetchBuffPrice(skin.name, skinCondition, isStatTrak, calculatedType);
  };

  // Kada admin promeni StatTrak opciju
  const handleStatTrakToggle = (e) => {
    const checked = e.target.checked;
    setIsStatTrak(checked);
    const targetName = selectedCatalogSkin ? selectedCatalogSkin.name : skinName;
    if (targetName) {
      fetchBuffPrice(targetName, skinCondition, checked);
    }
  };

  // Kada admin promeni stanje (FN, MW...), ponovo povuci cenu
  const handleConditionChange = (e) => {
    const nextCond = e.target.value;
    setSkinCondition(nextCond);
    const targetName = selectedCatalogSkin ? selectedCatalogSkin.name : skinName;
    if (targetName) {
      fetchBuffPrice(targetName, nextCond, isStatTrak);
    }
  };

  const handleWeaponTypeChange = (e) => {
    const newType = e.target.value;
    setSkinType(newType);
    if (newType === 'Gift Card' && (!skinName || !skinName.includes('Gift Card'))) {
      handleSelectGiftCardPreset(10);
    }
  };

  const handleSelectGiftCardPreset = (amount) => {
    const cardName = `CSGO SKINS - Gift Card $${amount}`;
    const cardImage = `/img/giftcards/${amount}usd.svg`;
    setSkinName(cardName);
    setSkinType('Gift Card');
    setSkinCondition('FN');
    setSkinRarity('covert');
    setIsStatTrak(false);
    setSkinImage(cardImage);
    setSkinPrice((amount * 130).toString());
    setSkinEstPrice('$' + amount.toFixed(2));
    setSelectedCatalogSkin({
      name: cardName,
      image: cardImage
    });
    setBuffPrice(amount);
  };

  const handleAddSkinSubmit = (e) => {
    e.preventDefault();
    if (!skinName.trim()) return;

    // Obavezna provera 2: Čuvanje u Bazi - provera da li je imageUrl validan Steam CDN URL ili Gift Card
    const isValidSteamCdn = (skinImage && (
      skinImage.startsWith('https://community.akamai.steamstatic.com/') || 
      skinImage.startsWith('https://community.steamstatic.com/') ||
      skinImage.startsWith('https://steamcommunity-a.akamaihd.net/')
    )) || skinType === 'Gift Card' || skinName.includes('Gift Card');

    if (!isValidSteamCdn) {
      alert('Kritična greška pri čuvanju: Slika skina je prazna ili nevažeća! Unesite tačan naziv skina tako da pretraga pronađe validan Steam CDN URL (https://community.akamai.steamstatic.com/...). Objavljivanje je onemogućeno.');
      return;
    }

    // Normalizacija i čišćenje imena za pretragu
    let baseName = selectedCatalogSkin ? selectedCatalogSkin.name : skinName.trim();
    let cleanBase = skinType === 'Gift Card' ? baseName : getCleanSkinName(baseName);

    // Utvrđujemo fazu ako postoji
    let phase = selectedCatalogSkin?.phase || null;
    if (!phase && skinType !== 'Gift Card') {
      const phaseMatch = skinName.match(/\((Phase \d|Ruby|Sapphire|Black Pearl|Emerald)\)/i);
      if (phaseMatch) {
        phase = phaseMatch[1];
        cleanBase = cleanBase.replace(`(${phase})`, '').trim();
      }
    }

    let displayName = cleanBase;
    if (phase) {
      displayName = `${cleanBase} (${phase})`;
    }

    // Provera da li je u pitanju nož
    const isKnife = skinType === 'Gift Card' ? false : checkIsStarItem(cleanBase, skinType);

    // StatTrak formiranje naziva (Pravilo 3: zvezdica ★ pre prefiksa za noževe)
    let finalName = '';
    if (isStatTrak && skinType !== 'Gift Card') {
      finalName = isKnife ? `★ StatTrak™ ${displayName}` : `StatTrak™ ${displayName}`;
    } else {
      finalName = isKnife ? `★ ${displayName}` : displayName;
    }

    const parsedCodes = giftCodesText.split('\n').map(l => l.trim()).filter(Boolean);
    const finalStock = parsedCodes.length > 0 ? parsedCodes.length : (parseInt(skinStock) || 1);

    addSkin({
      name: finalName,
      type: skinType,
      rarity: skinRarity,
      condition: skinCondition,
      price: parseInt(skinPrice) || 1000,
      image: skinImage, // Steam CDN Link ili Gift Card Slika
      imageUrl: skinImage, // Upisuje se u bazu pod poljem imageUrl kao u specifikaciji
      estPrice: skinEstPrice || null,
      stock: finalStock,
      codes: parsedCodes
    });

    // Reset forme
    setSkinName('');
    setSkinImage('');
    setIsStatTrak(false);
    setSelectedCatalogSkin(null);
    setBuffPrice(null);
    setSkinEstPrice('');
    setSkinStock('1');
    setGiftCodesText('');
  };



  const formatPoints = (pts) => {
    return new Intl.NumberFormat().format(pts);
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.header} className="glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} color="#53fc18" />
          <div>
            <h2 style={styles.title}>Sharke Admin Dashboard</h2>
            <p style={styles.subtitle}>Upravljaj skinovima sa tržišnim cenama, permisijama i profilima članova</p>
          </div>
        </div>
      </div>

      {/* 2-Kolonski Raspored: Dodaj Skin (Levo) & Upravljanje Članovima (Desno) */}
      <div style={styles.gridTwoCols}>
        
        {/* LEVA KOLONA: Dodaj Skin Formu */}
        <div style={{ ...styles.card, width: '100%', margin: 0 }} className="glass">
          <h3 style={styles.cardTitle}>
            <Plus size={18} color="var(--accent-cyan)" /> Dodaj Novi Skin (Automatske Cene)
          </h3>
          
          <form onSubmit={handleAddSkinSubmit} style={styles.form}>

            {/* Brzi uvoz CSGO-Skins Gift Kartica ($5 - $50) */}
            <div style={{ padding: '0.85rem', borderRadius: '10px', backgroundColor: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Gift size={16} /> CSGO-Skins Gift Kartice (Brzi Izbor)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 USD = 130 PTS</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[5, 10, 15, 20, 25, 50].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleSelectGiftCardPreset(amount)}
                    style={{
                      flex: 1,
                      minWidth: '55px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      backgroundColor: skinName === `CSGO-Skins $${amount} Gift Card` ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)',
                      border: skinName === `CSGO-Skins $${amount} Gift Card` ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: skinName === `CSGO-Skins $${amount} Gift Card` ? '#000' : '#fff',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Pretraga po CS2 skinitu (Sakrivena za Gift Card) */}
            {skinType !== 'Gift Card' && (
              <div style={{ ...styles.formGroup, position: 'relative' }}>
                <label style={styles.label}>Pretraži i Izaberi CS2 Skin (CS2 API Autocomplete)</label>
                <div style={styles.inputSearchWrapper}>
                  <input
                    type="text"
                    placeholder="Počni da kucaš naziv skina (npr. Asiimov, Redline)..."
                    value={skinName}
                    onChange={(e) => handleSkinNameInputChange(e.target.value)}
                    style={styles.input}
                    required={skinType !== 'Gift Card'}
                  />
                  {loadingCatalog && <Loader size={16} className="animate-spin" style={styles.searchLoader} />}
                </div>

                {/* Autocomplete predlozi */}
                {suggestions.length > 0 && (
                  <div style={styles.suggestionsDropdown} className="glass">
                    {suggestions.map(s => (
                      <div 
                        key={s.id} 
                        style={styles.suggestionItem}
                        onClick={() => handleSelectSuggestion(s)}
                      >
                        <img src={s.image ? s.image.replace('community.akamai.steamstatic.com', 'community.steamstatic.com') : ''} alt={s.name} style={styles.suggestionImg} />
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Vizuelni prikaz selektovanog skina ili gift kartice */}
            {selectedCatalogSkin && (
              <div style={styles.selectedSkinPreview}>
                <img 
                  src={selectedCatalogSkin.image ? selectedCatalogSkin.image.replace('community.akamai.steamstatic.com', 'community.steamstatic.com') : ''} 
                  alt={selectedCatalogSkin.name} 
                  style={styles.previewImg} 
                />
                <div style={styles.previewInfo}>
                  <span style={styles.previewName}>{selectedCatalogSkin.name}</span>
                  <span style={styles.previewType}>
                    {skinType} • {skinRarity.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Kvalitet (Condition)</label>
                <select value={skinCondition} onChange={handleConditionChange} style={styles.select}>
                  <option value="FN">Factory New (FN)</option>
                  <option value="MW">Minimal Wear (MW)</option>
                  <option value="FT">Field-Tested (FT)</option>
                  <option value="WW">Well-Worn (WW)</option>
                  <option value="BS">Battle-Scarred (BS)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tip predmeta</label>
                <select value={skinType} onChange={handleWeaponTypeChange} style={styles.select}>
                  <option value="Gift Card">Gift Kartica (Gift Card)</option>
                  <option value="Knife">Nož (Knife)</option>
                  <option value="Gloves">Rukavice (Gloves)</option>
                  <option value="Rifle">Puška (Rifle)</option>
                  <option value="Sniper Rifle">Snajper (Sniper Rifle)</option>
                  <option value="Pistol">Pištolj (Pistol)</option>
                </select>
              </div>
            </div>

            {skinType !== 'Gift Card' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '4px 0' }}>
                <input
                  type="checkbox"
                  id="isStatTrak"
                  checked={isStatTrak}
                  onChange={handleStatTrakToggle}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
                />
                <label htmlFor="isStatTrak" style={{ ...styles.label, cursor: 'pointer', marginBottom: 0, fontSize: '0.85rem', color: '#fff' }}>
                  StatTrak™ Verzija Skina
                </label>
              </div>
            )}

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Cena u poenima (Automatski se preračunava)</label>
                <input
                  type="number"
                  value={skinPrice}
                  onChange={(e) => setSkinPrice(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Količina na lageru (Lager)</label>
                <input
                  type="number"
                  min="1"
                  value={skinStock}
                  onChange={(e) => setSkinStock(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Polje za kodove (npr. Gift kartice ili digitalne artikle) */}
            <div style={styles.formGroup}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={styles.label}>Kodovi za Aktivaciju (Zaseban kod u svakom redu)</label>
                {giftCodesText.split('\n').filter(l => l.trim()).length > 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Izbrojano kodova: {giftCodesText.split('\n').filter(l => l.trim()).length} kom (Lager automatski podešen)
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                placeholder={`Unesi kodove po redu (npr):\nCSGO-CARD-10USD-CODE1\nCSGO-CARD-10USD-CODE2\nCSGO-CARD-10USD-CODE3`}
                value={giftCodesText}
                onChange={(e) => handleGiftCodesTextChange(e.target.value)}
                style={{
                  ...styles.input,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                  padding: '10px'
                }}
              />
            </div>

            {/* Informacije o ceni */}
            {selectedCatalogSkin && (
              <div style={styles.priceInfoPanel}>
                {fetchingPrice ? (
                  <div style={styles.fetchingPriceText}>
                    <Loader size={14} className="animate-spin" /> Tražim najnoviju tržišnu cenu...
                  </div>
                ) : buffPrice ? (
                  <div style={styles.priceFoundText}>
                    🎉 Pronađena tržišna cena: <strong>${buffPrice.toFixed(2)}</strong>
                    <span style={styles.priceSubText}>
                      (Predložena cena u poenima: {formatPoints(Math.round(buffPrice * 130))} pts)
                    </span>
                  </div>
                ) : (
                  <div style={styles.priceNotFoundText}>
                    ⚠️ Nije pronađena tačna tržišna cena za ovaj kvalitet. Upotrebite ručni unos.
                  </div>
                )}
              </div>
            )}

            <button type="submit" className="glow-btn-cyan" style={{ backgroundColor: 'var(--accent-cyan)', color: '#000', width: '100%', fontWeight: '800' }}>
              DODAJ U PRODAVNICU
            </button>
          </form>
        </div>

        {/* DESNA KOLONA: Upravljanje Članovima & Permisijama */}
        <div style={{ ...styles.card, width: '100%', margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }} className="glass">
          <h3 style={styles.cardTitle}>
            <Users size={18} color="var(--accent-cyan)" /> Upravljanje Članovima & Permisijama
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', flex: 1 }}>
            {/* Pretraga Članova */}
            <div style={{ ...styles.inputSearchWrapper, width: '100%' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="text"
                placeholder="Pretraži člana po Discord ili Kick imenu..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                style={{ ...styles.input, paddingLeft: '38px', width: '100%' }}
              />
            </div>

            {/* Unos iznosa poena za brzu promenu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Iznos poena:</span>
              <input
                type="number"
                value={adminPointsDelta}
                onChange={(e) => setAdminPointsDelta(e.target.value)}
                style={{ ...styles.input, width: '110px', textAlign: 'center', padding: '0.4rem' }}
                placeholder="Npr. 500"
              />
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {[100, 500, 1000, 5000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAdminPointsDelta(val.toString())}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      backgroundColor: adminPointsDelta === val.toString() ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: adminPointsDelta === val.toString() ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: adminPointsDelta === val.toString() ? 'var(--accent-cyan)' : '#ccc',
                      cursor: 'pointer',
                      fontWeight: '700'
                    }}
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista Članova sa upravljanjem */}
            <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {loadingAdminUsers ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  <Loader size={20} className="animate-spin" /> Učitavam članove...
                </div>
              ) : filteredAdminUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Nema pronađenih članova.
                </div>
              ) : (
                filteredAdminUsers.map(u => (
                  <div key={u.discordId} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    {/* User Info Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {u.kickAvatar ? (
                          <img src={u.kickAvatar} alt={u.username} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0, 240, 255, 0.3)' }} />
                        ) : (
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            <UserCheck size={16} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>
                            @{u.username} {u.kickUsername && <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>(Kick: @{u.kickUsername})</span>}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                            ID: {u.discordId} • {u.hoursWatched}h gledanja
                          </div>
                        </div>
                      </div>

                      {/* Points badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(0, 240, 255, 0.1)', padding: '3px 8px', borderRadius: '20px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                        <Coins size={12} color="var(--accent-cyan)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{formatPoints(u.points)} pts</span>
                      </div>
                    </div>

                    {/* Controls Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.06)', flexWrap: 'wrap', gap: '8px' }}>
                      {/* Permisija / Uloga */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Permisija:</span>
                        <select
                          value={u.role || 'Korisnik'}
                          onChange={(e) => handleUpdateRoleAction(u.discordId, e.target.value)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: u.role === 'Admin' ? 'rgba(83, 252, 24, 0.15)' : u.role === 'Moderator' ? 'rgba(0, 240, 255, 0.15)' : '#0c0f17',
                            border: u.role === 'Admin' ? '1px solid #53fc18' : u.role === 'Moderator' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            color: u.role === 'Admin' ? '#53fc18' : u.role === 'Moderator' ? 'var(--accent-cyan)' : '#ccc',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Korisnik">Korisnik</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>

                      {/* Dugmići za Poene */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleModifyPointsAction(u.discordId, parseInt(adminPointsDelta, 10) || 500)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(83, 252, 24, 0.15)',
                            border: '1px solid #53fc18',
                            color: '#53fc18',
                            cursor: 'pointer'
                          }}
                        >
                          <UserPlus size={12} /> +{adminPointsDelta || 500}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleModifyPointsAction(u.discordId, -(parseInt(adminPointsDelta, 10) || 500))}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgb(239, 68, 68)',
                            color: 'rgb(239, 68, 68)',
                            cursor: 'pointer'
                          }}
                        >
                          <UserMinus size={12} /> -{adminPointsDelta || 500}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Upravljanje skinovima */}
      <section style={styles.section} className="glass">
        <h3 style={styles.sectionTitle}>
          <Coins size={18} color="#53fc18" /> Trenutni Skinovi u Prodavnici
        </h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Naziv Skina</th>
                <th style={styles.th}>Cena</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {skins.map((skin) => (
                <tr key={skin.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {skin.image && (
                        <img 
                          src={getAdminSkinImage(skin.imageUrl || skin.image)} 
                          alt={skin.name} 
                          style={{ width: '40px', height: 'auto', maxHeight: '30px', objectFit: 'contain' }} 
                        />
                      )}
                      <div>
                        <strong>{skin.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {skin.type} | {skin.condition} | {skin.rarity} {skin.estPrice && `| Est: ${skin.estPrice}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
                      {formatPoints(skin.price)} pts
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: skin.status === 'available' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(235, 75, 75, 0.1)',
                      color: skin.status === 'available' ? '#00ff88' : '#eb4b4b'
                    }}>
                      {skin.status === 'available' ? 'Dostupan' : 'Prodat'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>
                    <div style={styles.actionCell}>
                      {skin.status === 'sold' && (
                        <button 
                          style={styles.restockBtn} 
                          onClick={() => restockSkin(skin.id)}
                          title="Dopuni zalihe"
                        >
                          Dopuni
                        </button>
                      )}
                      <button 
                        style={styles.deleteBtn} 
                        onClick={() => deleteSkin(skin.id)}
                        title="Obriši"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Uvoz i Sinhronizacija partnerskih giveaway-a */}
      <section style={styles.section} className="glass">
        <h3 style={styles.sectionTitle}>
          <Award size={18} color="var(--accent-cyan)" /> Uvoz i Sinhronizacija partnerskih Giveaway-a
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
          Ako ti pretraživač blokira automatsko slanje skripte sa CSGO-Skins stranice na tvoj server, kopirani JSON kod iz konzole nalepi u polje ispod i klikni na dugme za uvoz.
        </p>
        <form onSubmit={handleImportGiveaways} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <textarea
            placeholder='Nalepi JSON kopiran iz konzole ovde...'
            value={giveawaysJsonInput}
            onChange={(e) => setGiveawaysJsonInput(e.target.value)}
            style={styles.textarea}
            required
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit" 
              className="glow-btn-cyan" 
              style={{ flex: 2, backgroundColor: 'var(--accent-cyan)', color: '#000', fontWeight: '800', border: 'none', padding: '0.85rem', borderRadius: '10px', cursor: 'pointer' }}
              disabled={isSyncing}
            >
              {isSyncing ? 'Sinhronizujem...' : 'UVEZI PARTNERSKE GIVEAWAY-E'}
            </button>
            <button 
              type="button" 
              onClick={clearAllGiveaways}
              style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgb(239, 68, 68)', color: 'rgb(239, 68, 68)', fontWeight: '700', padding: '0.85rem', borderRadius: '10px', cursor: 'pointer' }}
            >
              OBRIŠI SVE GW SA SERVERA
            </button>
          </div>
        </form>
      </section>

      {/* Reset dugme */}
      <div style={styles.resetContainer}>
        <button style={styles.resetBtn} onClick={resetAllData}>
          <RotateCcw size={16} /> Resetuj Sve Podatke (Fabričko Podešavanje)
        </button>
      </div>
    </div>
  );
};

const styles = {
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '1.5rem',
    alignItems: 'stretch',
    width: '100%',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    textAlign: 'left',
  },
  header: {
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#fff',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginTop: '4px',
  },
  section: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '10px',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: '#fff',
    padding: '0.75rem',
    fontFamily: 'monospace',
    fontSize: '0.8rem',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '1rem',
    resize: 'vertical',
  },
  btnGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
    '@media (min-width: 992px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  label: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.2s',
  },
  select: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#fff',
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  th: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: '1rem 1.25rem',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-color)',
    textAlign: 'left',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
    }
  },
  td: {
    padding: '1rem 1.25rem',
    color: '#fff',
    verticalAlign: 'middle',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  actionCell: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  restockBtn: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    color: '#00ff88',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(235, 75, 75, 0.1)',
    border: '1px solid rgba(235, 75, 75, 0.2)',
    color: '#eb4b4b',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endGwBtn: {
    backgroundColor: 'rgba(229, 193, 88, 0.1)',
    border: '1px solid rgba(229, 193, 88, 0.2)',
    color: '#e5c158',
    padding: '8px 14px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
  },
  resetContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  resetBtn: {
    backgroundColor: 'rgba(235, 75, 75, 0.05)',
    border: '1px solid rgba(235, 75, 75, 0.15)',
    color: '#eb4b4b',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '800',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
  },

  // Autocomplete & Price Info
  inputSearchWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  searchLoader: {
    position: 'absolute',
    right: '12px',
    color: 'var(--text-secondary)',
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    maxHeight: '220px',
    overflowY: 'auto',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    zIndex: 999,
    marginTop: '4px',
    backgroundColor: 'rgba(10, 15, 26, 0.95) !important',
    backdropFilter: 'blur(20px) !important',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  suggestionItem: {
    padding: '0.65rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.85rem',
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'rgba(83, 252, 24, 0.08)',
      color: '#53fc18',
    }
  },
  suggestionImg: {
    width: '32px',
    height: 'auto',
    maxHeight: '24px',
    objectFit: 'contain',
  },
  priceInfoPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    fontSize: '0.825rem',
    textAlign: 'left',
  },
  fetchingPriceText: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-secondary)',
  },
  priceFoundText: {
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  priceSubText: {
    fontSize: '0.75rem',
    color: '#53fc18',
    fontWeight: '700',
  },
  priceNotFoundText: {
    color: '#f97316',
    fontWeight: '500',
  },
  selectedSkinPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    padding: '8px 12px',
    marginTop: '10px',
  },
  previewImg: {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
  },
  previewInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  previewName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
  },
  previewType: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  }
};

export default Admin;
