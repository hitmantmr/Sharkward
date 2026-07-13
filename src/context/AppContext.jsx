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
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF6ueZhW2e2frkR5z4m_SyY37cnKRblIpW5smQOcO4EW7lYa1ZOjgtFCLg4wXnn72kGoXuTa4h8QB',
    status: 'available',
  }
];

const initialGiveaways = [
  {
    id: 'g1',
    prizeName: '★ Karambit | Doppler',
    condition: 'Factory New',
    rarity: 'covert',
    image: 'doppler_karambit',
    endsIn: '2 days',
    sponsor: 'CSGO Skins',
    endTime: Date.now() + 1000 * 60 * 60 * 48, // 48h od sada
    participantsCount: 1243,
    requiresDiscord: true,
    requiresKick: true,
    status: 'active',
    entered: false,
  },
  {
    id: 'g2',
    prizeName: 'AK-47 | Vulcan',
    condition: 'Minimal Wear',
    rarity: 'classified',
    image: 'vulcan_ak',
    sponsor: 'Mozzart',
    status: 'completed',
    winner: 'GigaMega_Kick',
    endedAt: 'Juče',
  },
  {
    id: 'g3',
    prizeName: 'USP-S | Kill Confirmed',
    condition: 'Field-Tested',
    rarity: 'classified',
    image: 'kill_confirmed_usp',
    sponsor: 'CSGO Skins',
    status: 'completed',
    winner: 'Stefan_BG',
    endedAt: 'Pre 3 dana',
  }
];

const initialLeaderboard = [
  { rank: 1, username: 'kiza_csgo', hours: 412, points: 247200 },
  { rank: 2, username: 'milosh_99', hours: 389, points: 194500 },
  { rank: 3, username: 'sharke_brat', hours: 350, points: 175000 },
  { rank: 4, username: 'zoki_kick', hours: 298, points: 149000 },
  { rank: 5, username: 'nikola_k', hours: 284, points: 142000 },
  { rank: 6, username: 'csgo_king', hours: 251, points: 125500 },
  { rank: 7, username: 'luka_kick', hours: 220, points: 110000 },
  { rank: 8, username: 'sone_brat', hours: 195, points: 97500 },
  { rank: 9, username: 'mare_moz', hours: 182, points: 91000 },
  { rank: 10, username: 'kick_watcher', hours: 170, points: 85000 },
];

export const AppProvider = ({ children }) => {
  const API_URL = 'http://localhost:5000/api';

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
      points: 250, // Početni poeni za demo
      hoursWatched: 15.4,
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
        return parsed;
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
        return Array.isArray(parsed) ? parsed : initialGiveaways;
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
      const res = await fetch('http://localhost:5000/api/skins');
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
      const res = await fetch('http://localhost:5000/api/giveaways');
      if (res.ok) {
        const data = await res.json();
        setGiveaways(data);
      }
    } catch (err) {
      console.warn('Greška pri povlačenju giveaway-a sa API-ja:', err.message);
    }
  };

  useEffect(() => {
    fetchSkinsFromApi();
    fetchGiveawaysFromApi();
    
    // Sinhronizuj podatke na svakih 5 minuta za skinove i 2 minuta za giveaway-e
    const skinsInterval = setInterval(fetchSkinsFromApi, 5 * 60 * 1000);
    const gwInterval = setInterval(fetchGiveawaysFromApi, 2 * 60 * 1000);
    
    return () => {
      clearInterval(skinsInterval);
      clearInterval(gwInterval);
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
      setUser(prev => ({
        ...prev,
        isLoggedIn: true,
        discordLinked: true,
        discordUser: discordUser,
        discordId: discordId,
        discordAvatar: discordAvatar || '',
      }));
      window.history.replaceState({}, document.title, window.location.pathname);
      addToast(`Discord nalog @${discordUser} uspešno prijavljen!`, 'success');
    }

    if (success === 'kick_linked' && kickUser) {
      const kickId = params.get('kick_id');
      const kickAvatar = params.get('kick_avatar');
      setUser(prev => ({
        ...prev,
        kickLinked: true,
        kickUser: kickUser,
        kickId: kickId || null,
        kickAvatar: kickAvatar || null,
        isLoggedIn: true,
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
  const linkKick = () => {
    if (!user.discordId) {
      addToast('Moraš se prvo prijaviti preko Discord-a!', 'error');
      return;
    }
    window.location.href = `http://localhost:5000/api/auth/kick/login?discordId=${user.discordId}`;
  };

  const linkDiscord = () => {
    window.location.href = 'http://localhost:5000/api/auth/discord/login';
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

    if (skin.status === 'sold') {
      addToast('Ovaj skin je već rasprodat!', 'error');
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

    // Uspešna kupovina
    setUser(prev => ({
      ...prev,
      points: prev.points - skin.price
    }));

    setSkins(prev => prev.map(s => s.id === skinId ? { ...s, status: 'sold' } : s));
    addToast(`Uspešno si kupio ${skin.name}! Skin ti šaljemo na Discord.`, 'success');
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

  const addSkin = (skin) => {
    const newSkin = {
      ...skin,
      id: Date.now().toString(),
      status: 'available'
    };
    setSkins(prev => [newSkin, ...prev]);
    addToast(`Skin "${skin.name}" uspešno dodat u prodavnicu!`, 'success');
  };

  const deleteSkin = (skinId) => {
    setSkins(prev => prev.filter(s => s.id !== skinId));
    addToast('Skin uklonjen iz prodavnice.', 'info');
  };

  const restockSkin = (skinId) => {
    setSkins(prev => prev.map(s => s.id === skinId ? { ...s, status: 'available' } : s));
    addToast('Skin uspešno dopunjen (ponovo dostupan).', 'success');
  };

  const updateUserPoints = (amount) => {
    setUser(prev => ({
      ...prev,
      points: Math.max(0, prev.points + amount)
    }));
    addToast(`Poeni izmenjeni za ${amount > 0 ? '+' : ''}${amount}.`, 'info');
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
      addGiveaway,
      endGiveawayMock,
      resetAllData,
      saveTradeUrl
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
