import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AppContext = createContext();

const initialSkins = [
  {
    id: '1',
    name: 'CSGO SKINS - Gift Card $10',
    type: 'GiftCard',
    rarity: 'milspec',
    condition: 'GIFT CARD',
    price: 1300,
    estPrice: '$10.00',
    stock: 10,
    image: 'gift_card_10',
    status: 'available',
  },
  {
    id: '2',
    name: 'CSGO SKINS - Gift Card $5',
    type: 'GiftCard',
    rarity: 'milspec',
    condition: 'GIFT CARD',
    price: 700,
    estPrice: '$5.00',
    stock: 9,
    image: 'gift_card_5',
    status: 'available',
  },
  {
    id: '3',
    name: '★ Karambit | Case Hardened',
    type: 'Knife',
    rarity: 'covert',
    condition: 'FACTORY NEW',
    price: 110500,
    estPrice: '$850.00',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SH1ifyOJztN5lRi67gVNz5DvUmdj4eXuWOFAhAsF4RLFc5BC4xtbuY7yx7wDbgo9CzSj2h3xK8G81tB_XeHWq',
    status: 'available',
  },
  {
    id: '4',
    name: '★ Butterfly Knife | Blue Steel',
    type: 'Knife',
    rarity: 'covert',
    condition: 'MINIMAL WEAR',
    price: 94900,
    estPrice: '$730.00',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD3avw-JjteVWQyC0nQlpsmyBwo2tcS-eaFB2XpUjE7Jeuhi_kdfvYerj4FCMgtgUm3732ipM6jErvbi_vJM0jA',
    status: 'available',
  },
  {
    id: '5',
    name: 'AWP | Atheris',
    type: 'Sniper Rifle',
    rarity: 'restricted',
    condition: 'FIELD-TESTED',
    price: 1200,
    estPrice: '$9.20',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMPWBMWuZxuZi_rZsS3zgzU8isW3dnIr6eHKfPVAhDpojEe9YsUW4xta1Nuzm5FDci4NbjXKpmWVQppo',
    status: 'available',
  },
  {
    id: '6',
    name: 'AK-47 | Slate',
    type: 'Rifle',
    rarity: 'restricted',
    condition: 'FIELD-TESTED',
    price: 1800,
    estPrice: '$13.80',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSMOKcCGKD0ud5vuBlcCW6khUz_W3Sytb4cCqTOFUpWJtzTOUD5hPsw9a0Yrnrs1SK3ooXzy6shilM5311o7FVYrIufmI',
    status: 'available',
  },
  {
    id: '7',
    name: 'M4A1-S | Decimator',
    type: 'Rifle',
    rarity: 'classified',
    condition: 'MINIMAL WEAR',
    price: 3500,
    estPrice: '$27.00',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY',
    status: 'available',
  },
  {
    id: '8',
    name: 'M4A4 | Tooth Fairy',
    type: 'Rifle',
    rarity: 'classified',
    condition: 'FIELD-TESTED',
    price: 1500,
    estPrice: '$11.50',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSMeWWC2mWwOdkqd5lRi67gVN35WyDwtv8IC-RblVxCpchQLIOuhK8xNG2YbnktAXZjthFxCiohntP8G81tOVu8Qhw',
    status: 'available',
  },
  {
    id: '9',
    name: 'USP-S | Black Lotus',
    type: 'Pistol',
    rarity: 'milspec',
    condition: 'FACTORY NEW',
    price: 850,
    estPrice: '$6.50',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_ux6seJicCW8gQg0jDGMnYftbynFZg8nXpt2Ru8D5hSwl9PhN7_m7wzdjotFxXr62y4Y6C894OxQVKA7uvqAvobUkb8',
    status: 'available',
  },
  {
    id: '10',
    name: 'Glock-18 | Umbral Rabbit',
    type: 'Pistol',
    rarity: 'restricted',
    condition: 'MINIMAL WEAR',
    price: 650,
    estPrice: '$5.00',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-eAWie_vx3suNgWxa_nBovp3PXyo76Ii_FPAQmDMYiTLYDthm_kdbmZry2slCLjoMQzC7_3y1J7nts_a9cBi_qumx0',
    status: 'available',
  },
  {
    id: '11',
    name: 'Desert Eagle | Mecha Industries',
    type: 'Pistol',
    rarity: 'classified',
    condition: 'FACTORY NEW',
    price: 2200,
    estPrice: '$17.00',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE',
    status: 'available',
  },
  {
    id: '12',
    name: 'MAC-10 | Disco Tech',
    type: 'Pistol',
    rarity: 'classified',
    condition: 'FIELD-TESTED',
    price: 950,
    estPrice: '$7.30',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF6ueZhW2frkR5z4m_SyY37cnKRblIpW5smQOcO4EW7lYa1ZOjgtFCLg4wXnn72kGoXuTa4h8QB',
    status: 'available',
  }
];

const initialGiveaways = [];

const initialLeaderboard = [];

export const AppProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // --- State učitavanje iz localStorage sa try-catch zaštitom ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sharke_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('sharke_user');
      }
    }
    return {
      isLoggedIn: false,
      discordLinked: false,
      discordUser: null,
      discordId: null,
      kickLinked: false,
      kickUser: null,
      points: 0,
      hoursWatched: 0,
      tradeUrl: '',
    };
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      return localStorage.getItem('sharke_is_admin') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [skins, setSkins] = useState(() => {
    const saved = localStorage.getItem('sharke_skins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const needsMigration = parsed.some(s => 
          s.name === 'AWP | Asiimov' || 
          s.name === '★ StatTrak™ Flip Knife | Doppler (Phase 4)' || 
          s.name === '★ Gut Knife | Marble Fade' ||
          (s.type !== 'GiftCard' && s.image && !s.image.startsWith('http'))
        );
        if (needsMigration) {
          localStorage.setItem('sharke_skins', JSON.stringify(initialSkins));
          return initialSkins;
        }
        // Osvežavamo URL slike iz initialSkins da se pokvareni CDN linkovi iz starog localStorage keša automatski zamene
        const synced = parsed.map(s => {
          const match = initialSkins.find(init => init.id === s.id || init.name === s.name);
          if (match && match.image && match.image.startsWith('http')) {
            return { ...s, image: match.image };
          }
          return s;
        });
        localStorage.setItem('sharke_skins', JSON.stringify(synced));
        return synced;
      } catch (e) {
        return initialSkins;
      }
    }
    return initialSkins;
  });

  const [giveaways, setGiveaways] = useState(() => {
    const saved = localStorage.getItem('sharke_giveaways');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(g => g && g.id !== 'g1' && g.id !== 'g2' && g.id !== 'g3');
        }
        return initialGiveaways;
      } catch (e) {
        return initialGiveaways;
      }
    }
    return initialGiveaways;
  });

  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('sharke_leaderboard');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : initialLeaderboard;
      } catch (e) {
        return initialLeaderboard;
      }
    }
    return initialLeaderboard;
  });

  const [toasts, setToasts] = useState([]);
  const [isLive, setIsLive] = useState(false);

  // --- Sinhronizacija sa localStorage ---
  useEffect(() => {
    localStorage.setItem('sharke_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sharke_is_admin', isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('sharke_skins', JSON.stringify(skins));
  }, [skins]);

  useEffect(() => {
    localStorage.setItem('sharke_giveaways', JSON.stringify(giveaways));
  }, [giveaways]);

  useEffect(() => {
    localStorage.setItem('sharke_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // --- Učitavanje skinova sa API-ja sa dinamički izračunatim cenama ---
  const fetchSkinsFromApi = async () => {
    try {
      const res = await fetch(`${API_URL}/skins`);
      if (res.ok) {
        const data = await res.json();
        setSkins(data);
      }
    } catch (err) {
      console.warn('Greška pri povlačenju skinova sa API-ja:', err.message);
    }
  };

  // --- Učitavanje partnerskih giveaway-a sa API-ja ---
  const fetchGiveawaysFromApi = async () => {
    try {
      const res = await fetch(`${API_URL}/giveaways`);
      if (res.ok) {
        const data = await res.json();
        setGiveaways(data);
      }
    } catch (err) {
      console.warn('Greška pri povlačenju giveaway-a sa API-ja:', err.message);
    }
  };

  // --- Učitavanje rang liste sa API-ja ---
  const fetchLeaderboardFromApi = async () => {
    try {
      const res = await fetch(`${API_URL}/leaderboard`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.warn('Greška pri povlačenju rang liste sa API-ja:', err.message);
    }
  };

  useEffect(() => {
    fetchSkinsFromApi();
    fetchGiveawaysFromApi();
    fetchLeaderboardFromApi();
    
    // Sinhronizuj podatke na svakih 5 minuta za skinove, 2 minuta za giveaway-e, i 1 minut za rang listu
    const skinsInterval = setInterval(fetchSkinsFromApi, 5 * 60 * 1000);
    const gwInterval = setInterval(fetchGiveawaysFromApi, 2 * 60 * 1000);
    const lbInterval = setInterval(fetchLeaderboardFromApi, 60 * 1000);
    
    return () => {
      clearInterval(skinsInterval);
      clearInterval(gwInterval);
      clearInterval(lbInterval);
    };
  }, []);

  // --- Provera live statusa preko bota (izbegava Cloudflare blokove) ---
  const checkKickLiveStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setIsLive(!!data.isLive);
      }
    } catch (err) {
      console.warn('Greška pri proveri live statusa preko API-ja:', err.message);
    }
  };

  useEffect(() => {
    checkKickLiveStatus();
    const interval = setInterval(checkKickLiveStatus, 30000); // 30 sekundi
    return () => clearInterval(interval);
  }, []);

  // --- Periodično osvežavanje korisničkih podataka iz baze ---
  const fetchUserData = async () => {
    if (!user.discordId) return;
    try {
      const res = await fetch(`${API_URL}/user/${user.discordId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({
          ...prev,
          points: data.points || 0,
          hoursWatched: data.hoursWatched || 0,
          kickLinked: !!data.kickUsername,
          kickUser: data.kickUsername || null,
          kickId: data.kickId || null,
          kickAvatar: data.kickAvatar || null,
          lastRewardAt: data.lastRewardAt || null,
        }));
      }
    } catch (err) {
      // Tihi neuspeh pri preuzimanju statistike
    }
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 60000); // Na svakih 60 sekundi
    return () => clearInterval(interval);
  }, [user.discordId]);

  // --- Toast Funkcije ---
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Discord Povezivanje preko bota ---
  const generateLinkingCode = async () => {
    try {
      const res = await fetch(`${API_URL}/link-code/generate`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        return data.code;
      }
    } catch (err) {
      console.warn('Discord bot API offline. Koristim fallback kod.');
    }
    // Fallback ako bot nije dostupan
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'SH';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const checkLinkingStatus = async (code) => {
    try {
      const res = await fetch(`${API_URL}/link-code/status/${code}`);
      if (res.ok) {
        const entry = await res.json();
        if (entry.status === 'linked') {
          setUser(prev => ({
            ...prev,
            isLoggedIn: true,
            discordLinked: true,
            discordUser: entry.username,
            discordId: entry.discordId,
            points: prev.points + 250 // Bonus za povezivanje
          }));
          addToast(`Discord nalog @${entry.username} uspešno povezan! +250 poena bonus.`, 'success');
          return true;
        }
      }
    } catch (err) {
      // Bez loših poruka u konzoli za gašenje bota
    }
    return false;
  };

  // --- Provera OAuth2 callback parametara pri učitavanju ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const discordUser = params.get('discord_user');
    const discordId = params.get('discord_id');
    const discordAvatar = params.get('avatar');
    
    const success = params.get('success');
    const error = params.get('error');
    const kickUser = params.get('kick_user');

    if (discordUser && discordId) {
      const urlPoints = parseInt(params.get('points')) || 0;
      const urlHours = parseFloat(params.get('hours')) || 0;
      const urlKickUser = params.get('kick_user') || null;
      const urlKickId = params.get('kick_id') || null;
      const urlKickAvatar = params.get('kick_avatar') || null;

      setUser(prev => ({
        ...prev,
        isLoggedIn: true,
        discordLinked: true,
        discordUser: discordUser,
        discordId: discordId,
        discordAvatar: discordAvatar || '',
        points: params.has('points') ? urlPoints : prev.points,
        hoursWatched: params.has('hours') ? urlHours : prev.hoursWatched,
        kickLinked: urlKickUser ? true : prev.kickLinked,
        kickUser: urlKickUser || prev.kickUser,
        kickId: urlKickId || prev.kickId,
        kickAvatar: urlKickAvatar || prev.kickAvatar,
      }));
      window.history.replaceState({}, document.title, window.location.pathname);
      addToast(`Discord nalog @${discordUser} uspešno prijavljen!`, 'success');
    }

    if (success === 'kick_linked' && kickUser) {
      const kickId = params.get('kick_id');
      const kickAvatar = params.get('kick_avatar');
      const urlPoints = parseInt(params.get('points')) || 0;
      const urlHours = parseFloat(params.get('hours')) || 0;
      setUser(prev => ({
        ...prev,
        kickLinked: true,
        kickUser: kickUser,
        kickId: kickId || null,
        kickAvatar: kickAvatar || null,
        isLoggedIn: true,
        points: params.has('points') ? urlPoints : prev.points,
        hoursWatched: params.has('hours') ? urlHours : prev.hoursWatched,
      }));
      window.history.replaceState({}, document.title, window.location.pathname);
      addToast(`Kick nalog @${kickUser} uspešno povezan! Dobio si ulogu na Discordu.`, 'success');
    }

    if (error) {
      window.history.replaceState({}, document.title, window.location.pathname);
      if (error === 'not_a_member') {
        addToast('Povezivanje prekinuto: Moraš biti član našeg Discord servera da bi povezao Kick!', 'error');
      } else if (error === 'kick_already_linked') {
        addToast(`Greška: Kick nalog @${kickUser || ''} je već povezan sa drugim profilom.`, 'error');
      } else if (error === 'user_not_found') {
        addToast('Povezivanje prekinuto: Korisnički nalog nije pronađen.', 'error');
      } else if (error === 'access_denied') {
        addToast('Prijavljivanje preko Discord-a je otkazano.', 'info');
      } else if (error === 'kick_cancelled') {
        addToast('Povezivanje Kick naloga je otkazano.', 'info');
      } else {
        addToast(`Greška pri autorizaciji: ${error}`, 'error');
      }
    }
  }, []);

  // --- User Funkcije (OAuth2) ---
  const getCleanBaseOrigin = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const validTabs = ['home', 'shop', 'watchtime', 'giveaway', 'leaderboard', 'admin'];
    let path = window.location.pathname;
    if (parts.length > 0 && validTabs.includes(parts[parts.length - 1].toLowerCase())) {
      parts.pop();
      path = parts.length > 0 ? `/${parts.join('/')}` : '';
    }
    return encodeURIComponent(window.location.origin + path);
  };

  const linkKick = () => {
    if (!user.discordId) {
      addToast('Moraš se prvo prijaviti preko Discord-a!', 'error');
      return;
    }
    const currentOrigin = getCleanBaseOrigin();
    window.location.href = `${API_URL}/auth/kick/login?discordId=${user.discordId}&origin=${currentOrigin}`;
  };

  const linkDiscord = () => {
    const currentOrigin = getCleanBaseOrigin();
    window.location.href = `${API_URL}/auth/discord/login?origin=${currentOrigin}`;
  };

  const unlinkKick = async () => {
    try {
      const res = await fetch(`${API_URL}/unlink-kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId: user.discordId })
      });
      if (res.ok) {
        setUser(prev => ({
          ...prev,
          kickLinked: false,
          kickUser: null,
        }));
        addToast('Kick nalog odjavljen.', 'info');
      }
    } catch (err) {
      setUser(prev => ({
        ...prev,
        kickLinked: false,
        kickUser: null,
      }));
      addToast('Kick nalog odjavljen.', 'info');
    }
  };

  const unlinkDiscord = () => {
    setUser({
      isLoggedIn: false,
      discordLinked: false,
      discordUser: null,
      discordId: null,
      kickLinked: false,
      kickUser: null,
      points: 250,
      hoursWatched: 15.4
    });
    addToast('Discord nalog odjavljen.', 'info');
  };

  const buySkin = (skinId) => {
    const skinIndex = skins.findIndex(s => s.id === skinId);
    if (skinIndex === -1) return false;

    const skin = skins[skinIndex];
    const currentStock = typeof skin.stock === 'number' ? skin.stock : 1;

    if (skin.status === 'sold' || currentStock <= 0) {
      addToast('Ovaj artikal je rasprodat!', 'error');
      return false;
    }

    if (!user.kickLinked || !user.discordLinked) {
      addToast('Moraš povezati i Kick i Discord nalog kako bi kupovao u shopu!', 'error');
      return false;
    }

    if (user.points < skin.price) {
      addToast(`Nemaš dovoljno poena! Potrebno ti je još ${skin.price - user.points} poena.`, 'error');
      return false;
    }

    // Izvlačimo kod ako postoji u nizu kodova
    const codes = Array.isArray(skin.codes) ? [...skin.codes] : [];
    const assignedCode = codes.shift(); // Uzimamo prvi dostupan kod

    // Uspešna kupovina poena
    setUser(prev => ({
      ...prev,
      points: prev.points - skin.price
    }));

    const nextStock = currentStock - 1;

    setSkins(prev => prev.map(s => {
      if (s.id === skinId) {
        return {
          ...s,
          stock: nextStock,
          codes: codes,
          status: nextStock <= 0 ? 'sold' : 'available'
        };
      }
      return s;
    }));

    if (assignedCode) {
      addToast(`Uspešno si kupio ${skin.name}! Tvoj kod: ${assignedCode}`, 'success');
    } else {
      addToast(`Uspešno si kupio ${skin.name}! Artikal ti šaljemo na Discord.`, 'success');
    }
    return true;
  };

  const enterGiveaway = (giveawayId) => {
    if (!user.kickLinked || !user.discordLinked) {
      addToast('Moraš povezati i Kick i Discord nalog da bi ušao u giveaway!', 'error');
      return false;
    }

    setGiveaways(prev => prev.map(g => {
      if (g.id === giveawayId) {
        if (g.entered) {
          addToast('Već si prijavljen za ovaj giveaway!', 'info');
          return g;
        }
        addToast(`Uspešno si ušao u giveaway za ${g.prizeName}!`, 'success');
        return {
          ...g,
          entered: true,
          participantsCount: g.participantsCount + 1
        };
      }
      return g;
    }));
    return true;
  };

  // --- Admin Funkcije (Lokalne) ---
  const toggleAdminMode = () => {
    setIsAdmin(prev => {
      const next = !prev;
      addToast(next ? 'Admin mod aktiviran (Sharke).' : 'Admin mod ugašen.', 'info');
      return next;
    });
  };

  const addSkin = async (skin) => {
    const newSkin = {
      ...skin,
      id: Date.now().toString(),
      status: 'available'
    };
    // 1. Lokalno osvežavamo odmah
    setSkins(prev => [newSkin, ...prev]);

    // 2. Trajno čuvamo na backendu
    try {
      const res = await fetch(`${API_URL}/admin/skins/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkin)
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.skins)) {
        setSkins(data.skins);
      }
    } catch (err) {
      console.warn('Greška pri čuvanju skina na serveru:', err);
    }

    addToast(`Skin "${skin.name}" uspešno dodat u prodavnicu!`, 'success');
  };

  const deleteSkin = async (skinId) => {
    setSkins(prev => prev.filter(s => s.id !== skinId));
    try {
      const res = await fetch(`${API_URL}/admin/skins/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skinId })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.skins)) {
        setSkins(data.skins);
      }
    } catch (err) {
      console.warn('Greška pri brisanju skina sa servera:', err);
    }
    addToast('Skin uklonjen iz prodavnice.', 'info');
  };

  const restockSkin = async (skinId) => {
    setSkins(prev => prev.map(s => s.id === skinId ? { ...s, status: 'available' } : s));
    try {
      const res = await fetch(`${API_URL}/admin/skins/restock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skinId })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.skins)) {
        setSkins(data.skins);
      }
    } catch (err) {
      console.warn('Greška pri dopunjavanju skina na serveru:', err);
    }
    addToast('Skin uspešno dopunjen (ponovo dostupan).', 'success');
  };

  const updateUserPoints = (amount) => {
    setUser(prev => ({
      ...prev,
      points: Math.max(0, prev.points + amount)
    }));
    addToast(`Poeni izmenjeni za ${amount > 0 ? '+' : ''}${amount}.`, 'info');
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('Greška pri učitavanju liste članova sa servera:', err);
    }

    // Fallback: Ako API ne vrati listu (npr. prosek na Vercel-u), prikazujemo spisak iz baze/leaderboarda i prijavljenog naloga
    const fallbackList = [];
    if (user && user.discordId) {
      fallbackList.push({
        discordId: user.discordId,
        username: user.discordUser || user.kickUser || 'Sharke_Brat',
        kickUsername: user.kickUser || 'sharke',
        kickAvatar: user.kickAvatar || '',
        points: user.points || 250,
        hoursWatched: user.hoursWatched || 15.4,
        role: isAdmin ? 'Admin' : 'Korisnik'
      });
    }

    if (Array.isArray(leaderboard) && leaderboard.length > 0) {
      leaderboard.forEach(l => {
        if (!fallbackList.some(f => f.kickUsername === l.kickUsername || f.username === l.username)) {
          fallbackList.push({
            discordId: l.discordId || 'id_' + (l.kickUsername || l.username),
            username: l.username,
            kickUsername: l.kickUsername,
            kickAvatar: l.kickAvatar,
            points: l.points,
            hoursWatched: l.hours,
            role: 'Korisnik'
          });
        }
      });
    }

    if (fallbackList.length === 0) {
      fallbackList.push(
        { discordId: '436295751543554050', username: 'sharke_brat', kickUsername: 'sharke', kickAvatar: '', points: 5420, hoursWatched: 42.5, role: 'Admin' },
        { discordId: '123456789012345678', username: 'kiza_csgo', kickUsername: 'kiza_csgo', kickAvatar: '', points: 3100, hoursWatched: 28.1, role: 'Korisnik' }
      );
    }

    return fallbackList;
  };

  const modifyAdminUserPoints = async (discordId, amount) => {
    try {
      const res = await fetch(`${API_URL}/admin/points/modify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId, amount: parseInt(amount, 10) })
      });
      if (res.ok) {
        addToast(`Uspešno promenjeni poeni članu (${amount > 0 ? '+' : ''}${amount} pts)!`, 'success');
        fetchLeaderboardFromApi();
        return true;
      }
    } catch (err) {
      addToast('Greška pri izmeni poena člana.', 'error');
    }
    return false;
  };

  const updateAdminUserRole = async (discordId, role) => {
    try {
      const res = await fetch(`${API_URL}/admin/users/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordId, role })
      });
      if (res.ok) {
        addToast(`Permisija člana uspešno azurirana na: ${role}!`, 'success');
        return true;
      }
    } catch (err) {
      addToast('Greška pri izmeni permisije člana.', 'error');
    }
    return false;
  };

  const addGiveaway = (giveaway) => {
    const newGw = {
      ...giveaway,
      id: 'g' + Date.now().toString(),
      endTime: Date.now() + 1000 * 60 * 60 * parseInt(giveaway.hoursLength || 24),
      participantsCount: Math.floor(Math.random() * 200 + 50),
      status: 'active',
      entered: false,
    };
    setGiveaways(prev => [newGw, ...prev]);
    addToast(`Giveaway za "${giveaway.prizeName}" je kreiran!`, 'success');
  };

  const endGiveawayMock = (giveawayId) => {
    const winnerNames = ['Stefan_BG', 'GigaMega_Kick', 'milosh_99', 'zoki_kick', 'kiza_csgo', 'csgo_king', 'luka_kick'];
    const randomWinner = winnerNames[Math.floor(Math.random() * winnerNames.length)];
    
    setGiveaways(prev => prev.map(g => {
      if (g.id === giveawayId) {
        addToast(`Giveaway za ${g.prizeName} je završen! Pobednik je @${randomWinner}`, 'success');
        return {
          ...g,
          status: 'completed',
          winner: randomWinner,
          endedAt: 'Upravo sad'
        };
      }
      return g;
    }));
  };

  const syncGiveaways = async (list) => {
    try {
      const res = await fetch(`${API_URL}/update-giveaways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Giveaways-Token': 'sharke-sync-token-2026'
        },
        body: JSON.stringify(list)
      });
      if (res.ok) {
        const data = await res.json();
        await fetchGiveawaysFromApi();
        addToast(`Uspešno sinhronizovano ${list.length} nagradnih igara!`, 'success');
        return { success: true };
      } else {
        const err = await res.json();
        addToast(`Greška pri sinhronizaciji: ${err.error || 'Nepoznata greška'}`, 'error');
        return { success: false, error: err.error };
      }
    } catch (err) {
      addToast(`Mrežna greška pri sinhronizaciji: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const clearAllGiveaways = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/clear-giveaways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Giveaways-Token': 'sharke-sync-token-2026'
        }
      });
      if (res.ok) {
        setGiveaways([]);
        addToast('Sve nagradne igre su uspešno obrisane sa servera i klijenta!', 'success');
        return { success: true };
      } else {
        addToast('Greška pri brisanju nagradnih igara sa servera.', 'error');
        return { success: false };
      }
    } catch (err) {
      addToast(`Greška: ${err.message}`, 'error');
      return { success: false };
    }
  };

  const resetAllData = () => {
    localStorage.removeItem('sharke_user');
    localStorage.removeItem('sharke_skins');
    localStorage.removeItem('sharke_giveaways');
    localStorage.removeItem('sharke_leaderboard');
    localStorage.removeItem('sharke_is_admin');
    localStorage.removeItem('sharke_is_live');
    localStorage.removeItem('sharke_is_live_v2');
    
    setIsLive(false);
    setUser({
      isLoggedIn: false,
      discordLinked: false,
      discordUser: null,
      discordId: null,
      kickLinked: false,
      kickUser: null,
      points: 250,
      hoursWatched: 15.4,
      tradeUrl: '',
    });
    setSkins(initialSkins);
    setGiveaways(initialGiveaways);
    setLeaderboard(initialLeaderboard);
    setIsAdmin(false);
    addToast('Svi podaci vraćeni na fabrička podešavanja.', 'info');
  };

  const saveTradeUrl = (url) => {
    setUser(prev => ({
      ...prev,
      tradeUrl: url
    }));
    addToast('Steam Trade URL je uspešno sačuvan!', 'success');
  };

  return (
    <AppContext.Provider value={{
      user,
      API_URL,
      isAdmin,
      skins,
      giveaways,
      leaderboard,
      toasts,
      isLive,
      generateLinkingCode,
      checkLinkingStatus,
      setIsLive,
      addToast,
      removeToast,
      linkKick,
      linkDiscord,
      unlinkKick,
      unlinkDiscord,
      buySkin,
      enterGiveaway,
      toggleAdminMode,
      addSkin,
      deleteSkin,
      restockSkin,
      updateUserPoints,
      fetchAdminUsers,
      modifyAdminUserPoints,
      updateAdminUserRole,
      addGiveaway,
      endGiveawayMock,
      syncGiveaways,
      clearAllGiveaways,
      resetAllData,
      saveTradeUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
