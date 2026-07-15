require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  EmbedBuilder, 
  PermissionFlagsBits, 
  ChannelType, 
  AuditLogEvent,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// Inicijalizacija Discord klijenta sa potrebnim intentima
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildPresences
  ]
});

// Putanja do lokalne db.json baze
const dbPath = path.join(__dirname, 'db.json');

// --- Caching Buff163 prices (csgotrader API) ---
let buffPrices = {};
const buffCachePath = path.join(__dirname, 'prices_cache.json');

if (fs.existsSync(buffCachePath)) {
  try {
    buffPrices = JSON.parse(fs.readFileSync(buffCachePath, 'utf8'));
    console.log('✅ Učitan postojeći Buff163 keš sa diska.');
  } catch (err) {
    console.warn('⚠️ Greška pri učitavanju Buff163 keša sa diska:', err.message);
  }
}

async function fetchAndCacheBuffPrices() {
  console.log('🔄 Preuzimam najnovije cene sa Buff163 (csgotrader API)...');
  try {
    const res = await fetch('https://prices.csgotrader.app/latest/buff163.json');
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const data = await res.json();
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      buffPrices = data;
      fs.writeFileSync(buffCachePath, JSON.stringify(data), 'utf8');
      console.log('✅ Buff163 cene uspešno preuzete i keširane.');
    } else {
      console.warn('⚠️ Buff163 API je vratio neočekivan format.');
    }
  } catch (err) {
    console.warn('❌ Greška pri preuzimanju Buff163 cena:', err.message);
  }
}

// Pokreni preuzimanje i postavi interval na svakih 6 sati
fetchAndCacheBuffPrices();
setInterval(fetchAndCacheBuffPrices, 6 * 60 * 60 * 1000);

// --- Početni podaci za bazu ---
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
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SH1ifyOJztN5lRi67gVNz5DvUmdj4eXuWOFAhAsF4RLFc5BC4xtbuY7yx7wDbgo9CzSj2h3xK8G81tB_XeHWq',
    status: 'available',
  },
  {
    id: '4',
    name: '★ Butterfly Knife | Blue Steel',
    type: 'Knife',
    rarity: 'covert',
    condition: 'MINIMAL WEAR',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD3avw-JjteVWQyC0nQlpsmyBwo2tcS-eaFB2XpUjE7Jeuhi_kdfvYerj4FCMgtgUm3732ipM6jErvbi_vJM0jA',
    status: 'available',
  },
  {
    id: '5',
    name: 'AWP | Atheris',
    type: 'Sniper Rifle',
    rarity: 'restricted',
    condition: 'FIELD-TESTED',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7JkMPWBMWuZxuZi_rZsS3zgzU8isW3dnIr6eHKfPVAhDpojEe9YsUW4xta1Nuzm5FDci4NbjXKpmWVQppo',
    status: 'available',
  },
  {
    id: '6',
    name: 'AK-47 | Slate',
    type: 'Rifle',
    rarity: 'restricted',
    condition: 'FIELD-TESTED',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiVI0POlPPNSMOKcCGKD0ud5vuBlcCW6khUz_W3Sytb4cCqTOFUpWJtzTOUD5hPsw9a0Yrnrs1SK3ooXzy6shilM5311o7FVYrIufmI',
    status: 'available',
  },
  {
    id: '7',
    name: 'M4A1-S | Decimator',
    type: 'Rifle',
    rarity: 'classified',
    condition: 'MINIMAL WEAR',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9JtORqRiSygRI1jDGMnYftb3iUb1dxW5ImFLNftxCxktflZLm2tgaP2otGyn_-hytOvy9q5elQV_A7uvqA6CRSoZY',
    status: 'available',
  },
  {
    id: '8',
    name: 'M4A4 | Tooth Fairy',
    type: 'Rifle',
    rarity: 'classified',
    condition: 'FIELD-TESTED',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSMeWWC2mWwOdkqd5lRi67gVN35WyDwtv8IC-RblVxCpchQLIOuhK8xNG2YbnktAXZjthFxCiohntP8G81tOVu8Qhw',
    status: 'available',
  },
  {
    id: '9',
    name: 'USP-S | Black Lotus',
    type: 'Pistol',
    rarity: 'milspec',
    condition: 'FACTORY NEW',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_ux6seJicCW8gQg0jDGMnYftbynFZg8nXpt2Ru8D5hSwl9PhN7_m7wzdjotFxXr62y4Y6C894OxQVKA7uvqAvobUkb8',
    status: 'available',
  },
  {
    id: '10',
    name: 'Glock-18 | Umbral Rabbit',
    type: 'Pistol',
    rarity: 'restricted',
    condition: 'MINIMAL WEAR',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-eAWie_vx3suNgWxa_nBovp3PXyo76Ii_FPAQmDMYiTLYDthm_kdbmZry2slCLjoMQzC7_3y1J7nts_a9cBi_qumx0',
    status: 'available',
  },
  {
    id: '11',
    name: 'Desert Eagle | Mecha Industries',
    type: 'Pistol',
    rarity: 'classified',
    condition: 'FACTORY NEW',
    stock: 1,
    image: 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE',
    status: 'available',
  },
  {
    id: '12',
    name: 'MAC-10 | Disco Tech',
    type: 'Pistol',
    rarity: 'classified',
    condition: 'FIELD-TESTED',
    stock: 1,
    image: 'https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1Y-s2jaac8cM-dD2SCxNF6ueZhW2frkR5z4m_SyY37cnKRblIpW5smQOcO4EW7lYa1ZOjgtFCLg4wXnn72kGoXuTa4h8QB',
    status: 'available',
  }
];

const initialGiveaways = [];

const initialUsers = {
  "12345678901": { username: "kiza_csgo", points: 247200, kickUsername: "kiza_csgo", hoursWatched: 412, linkedAt: new Date().toISOString() },
  "12345678902": { username: "milosh_99", points: 194500, kickUsername: "milosh_99", hoursWatched: 389, linkedAt: new Date().toISOString() },
  "12345678903": { username: "sharke_brat", points: 175000, kickUsername: "sharke_brat", hoursWatched: 350, linkedAt: new Date().toISOString() },
  "12345678904": { username: "zoki_kick", points: 149000, kickUsername: "zoki_kick", hoursWatched: 298, linkedAt: new Date().toISOString() },
  "12345678905": { username: "nikola_k", points: 142000, kickUsername: "nikola_k", hoursWatched: 284, linkedAt: new Date().toISOString() },
  "12345678906": { username: "csgo_king", points: 125500, kickUsername: "csgo_king", hoursWatched: 251, linkedAt: new Date().toISOString() },
  "12345678907": { username: "luka_kick", points: 110000, kickUsername: "luka_kick", hoursWatched: 220, linkedAt: new Date().toISOString() },
  "12345678908": { username: "sone_brat", points: 97500, kickUsername: "sone_brat", hoursWatched: 195, linkedAt: new Date().toISOString() },
  "12345678909": { username: "mare_moz", points: 91000, kickUsername: "mare_moz", hoursWatched: 182, linkedAt: new Date().toISOString() },
  "12345678910": { username: "kick_watcher", points: 85000, kickUsername: "kick_watcher", hoursWatched: 170, linkedAt: new Date().toISOString() }
};

// Pomoćne funkcije za rad sa bazom podataka
function readDb() {
  let data = {
    users: initialUsers,
    linkingCodes: {},
    stats: { youtube: 264000, tiktok: 146100, kick: 6310, registered: 91 },
    skins: initialSkins,
    giveaways: initialGiveaways
  };
  try {
    if (fs.existsSync(dbPath)) {
      const fileData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      data = { ...data, ...fileData };
      
      // Automatska migracija na nove CS2 CDN slike ako detektujemo staru listu sa slike ili neispravne preklopljene linkove
      const needsMigration = data.skins && data.skins.some(s => 
        s.image === 'fade_butterfly' || 
        s.image === 'pandora_gloves' || 
        s.image === 'dragon_lore' ||
        (s.type !== 'GiftCard' && s.image && !s.image.startsWith('http')) ||
        (s.image && s.image.includes('community.akamai.steamstatic.com')) ||
        (s.image && s.image.includes('Gz3UqlXOLrx'))
      );
      if (needsMigration) {
        data.skins = initialSkins;
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
        console.log('🔄 Baza podataka db.json je uspešno migrirana na nove aktivne CDN linkove!');
      }
    } else {
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    }
  } catch (err) {
    console.error('Error reading DB:', err);
  }
  
  // Ensure skins and giveaways and users are in there
  if (!data.skins || data.skins.length === 0) data.skins = initialSkins;
  if (!data.giveaways) data.giveaways = [];
  if (!data.users || Object.keys(data.users).length === 0) data.users = initialUsers;
  
  return data;
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

function getUserProfile(discordId, username) {
  const data = readDb();
  if (!data.users) data.users = {};
  if (!data.users[discordId]) {
    data.users[discordId] = {
      username: username,
      points: 0,
      kickUsername: null,
      hoursWatched: 0,
      linkedAt: null
    };
    writeDb(data);
  }
  return data.users[discordId];
}

// Lista svih kanala za logove koje bot treba da kreira
const LOG_CHANNELS_LIST = [
  'UPDATED-SERVER',
  'CHANNEL-CREATED',
  'CHANNEL-UPDATED',
  'CHANNEL-DELETED',
  'CHANNEL-PERMISSIONS-UPDATED',
  'THREAD-CREATED',
  'THREAD-UPDATED',
  'THREAD-DELETED',
  'ROLE-CREATED',
  'ROLE-UPDATED',
  'ROLE-DELETED',
  'ROLE-GIVEN',
  'ROLE-REMOVED',
  'MESSAGE-EDITED',
  'MESSAGE-DELETED',
  'MEMBER-JOINED',
  'MEMBER-LEFT',
  'NICKNAME-CHANGED',
  'SERVER-INVITES',
  'MEMBER-JOINED-VOICE-CHANNEL',
  'MEMBER-LEFT-VOICE-CHANNEL',
  'MEMBER-SWITCHED-VOICE',
  'MEMBER-MOVED-VOICE',
  'MEMBER-DISCONNECTED',
  'MUTE-DEAFEN',
  'AUTO-MOD',
  'MODERATION-COMMAND-USED',
  'MEMBER-KICKED',
  'MEMBER-BANNED',
  'MEMBER-UNBANNED',
  'TIMEOUT',
  'GIVEAWAY',
  'SUGESTIJE'
];

const LOGS_CATEGORY_NAME = '📌 -「 Logovi 」';
const STATS_CATEGORY_NAME = '📌 -「 Statistika 」';

client.once('ready', async () => {
  console.log(`\n=============================================`);
  console.log(`🤖 Discord bot je spreman i ulogovan kao: ${client.user.tag}`);
  console.log(`=============================================\n`);

  await registerSlashCommands();
  connectToKickWS();

  // Pokrećemo periodično ažuriranje statistike na svakih 6 minuta za sve servere na kojima je bot
  client.guilds.cache.forEach(guild => {
    updateServerStats(guild);
  });

  setInterval(() => {
    client.guilds.cache.forEach(guild => {
      updateServerStats(guild);
    });
  }, 6 * 60 * 1000); // 6 minuta

  // Pokrećemo periodičnu proveru live statusa na svakih 1 minut
  checkLiveStatus();
  setInterval(() => {
    checkLiveStatus();
  }, 1 * 60 * 1000); // 1 minut

  // Pokrećemo periodičnu proveru novih YouTube klipova na svakih 5 minuta
  checkNewVideos();
  setInterval(() => {
    checkNewVideos();
  }, 5 * 60 * 1000); // 5 minuta
});

// Registracija slash komandi
async function registerSlashCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('setup-logovi')
      .setDescription('Automatski kreira kategoriju i sve kanale za logove')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
      .setName('setup-statistika')
      .setDescription('Automatski kreira kategoriju i voice kanale za live statistiku')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    new SlashCommandBuilder()
      .setName('povezi')
      .setDescription('Poveži svoj Discord nalog sa SharkeShop profilom')
      .addStringOption(option => 
        option.setName('kod')
          .setDescription('Unesi kod za povezivanje sa sajta')
          .setRequired(true)),
          
    new SlashCommandBuilder()
      .setName('poeni')
      .setDescription('Proveri stanje poena korisnika')
      .addUserOption(option =>
        option.setName('korisnik')
          .setDescription('Korisnik čije poene želiš da proveriš')
          .setRequired(false)),

    new SlashCommandBuilder()
      .setName('info')
      .setDescription('Prikaži informacije o SharkeShop lojaliti programu'),

    new SlashCommandBuilder()
      .setName('profil')
      .setDescription('Prikaži SharkeShop profil korisnika')
      .addUserOption(option =>
        option.setName('korisnik')
          .setDescription('Korisnik čiji profil želiš da vidiš')
          .setRequired(false)),

    new SlashCommandBuilder()
      .setName('leaderboard')
      .setDescription('Rang lista korisnika sa najviše poena'),

    new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Banuj člana sa servera')
      .addUserOption(option =>
        option.setName('clan')
          .setDescription('Korisnik kog želiš da banuješ')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('razlog')
          .setDescription('Razlog za banovanje')
          .setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    new SlashCommandBuilder()
      .setName('unban')
      .setDescription('Ukloni ban korisniku sa servera')
      .addStringOption(option =>
        option.setName('id')
          .setDescription('Discord ID korisnika kog želiš da unbanuješ')
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Izbaci člana sa servera')
      .addUserOption(option =>
        option.setName('clan')
          .setDescription('Korisnik kog želiš da izbaciš')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('razlog')
          .setDescription('Razlog za izbacivanje')
          .setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    new SlashCommandBuilder()
      .setName('timeout')
      .setDescription('Ućutkaj (timeout) člana na određeno vreme')
      .addUserOption(option =>
        option.setName('clan')
          .setDescription('Korisnik kog želiš da ućutkaš')
          .setRequired(true))
      .addIntegerOption(option =>
        option.setName('trajanje')
          .setDescription('Trajanje ućutkivanja u minutima (npr. 5, 10, 60, 1440)')
          .setRequired(true))
      .addStringOption(option =>
        option.setName('razlog')
          .setDescription('Razlog za ućutkivanje')
          .setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    new SlashCommandBuilder()
      .setName('untimeout')
      .setDescription('Ukloni ućutkivanje (timeout) korisniku')
      .addUserOption(option =>
        option.setName('clan')
          .setDescription('Korisnik kom želiš da ukloniš ućutkivanje')
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Obriši određeni broj poruka iz ovog kanala')
      .addIntegerOption(option =>
        option.setName('kolicina')
          .setDescription('Broj poruka za brisanje (1-100)')
          .setMinValue(1)
          .setMaxValue(100)
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    new SlashCommandBuilder()
      .setName('lock')
      .setDescription('Zaključaj pisanje u trenutnom ili određenom kanalu')
      .addChannelOption(option =>
        option.setName('kanal')
          .setDescription('Kanal koji želiš da zaključaš')
          .setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    new SlashCommandBuilder()
      .setName('unlock')
      .setDescription('Otključaj pisanje u trenutnom ili određenom kanalu')
      .addChannelOption(option =>
        option.setName('kanal')
          .setDescription('Kanal koji želiš da otključaš')
          .setRequired(false))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    new SlashCommandBuilder()
      .setName('slowmode')
      .setDescription('Postavi slowmode za trenutni kanal')
      .addIntegerOption(option =>
        option.setName('sekunde')
          .setDescription('Broj sekundi između poruka (0 za isključivanje)')
          .setMinValue(0)
          .setMaxValue(21600)
          .setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    new SlashCommandBuilder()
      .setName('live-test')
      .setDescription('Prikaži simulirana live obaveštenja za Kick i YouTube (vidljivo samo tebi)')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('🔄 Osvežavam i registrujem slash komande...');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash komande uspešno registrovane!');
  } catch (error) {
    console.error('❌ Greška pri registraciji slash komandi:', error);
  }
}

// Pomoćni formatizer brojeva (npr. 120000 -> 120K, 1100000 -> 1.1M)
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
  if (num >= 1000) {
    // Formatira sa tačkom za hiljade (npr. 1.479)
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return num.toString();
}

// Funkcija za preuzimanje Kick pratilaca preko stabilnog CORS proksija
async function fetchKickFollowers() {
  try {
    console.log('🔄 Preuzimam tačan broj Kick pratilaca uživo (CORS proxy)...');
    const targetUrl = 'https://kick.com/api/v1/channels/sharke';
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    const response = await fetch(proxyUrl, {
      headers: {
        'Origin': 'http://localhost:5173',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (response.status === 200) {
      const data = await response.json();
      const count = data.followersCount || data.followers_count || null;
      if (count !== null) {
        return count;
      }
    }
    
    console.log(`⚠️ Hibridni odgovor proksija: status ${response.status}`);
    return null;
  } catch (err) {
    console.error('❌ Greška pri preuzimanju Kick pratilaca uživo:', err.message);
    return null;
  }
}

// Funkcija za povlačenje statistike sa YouTube, TikToka i simulacija Kick-a
// Funkcija za povlačenje statistike sa YouTube, TikToka i simulacija Kick-a
async function fetchStats() {
  console.log('🔄 Započinjem povlačenje statistika sa društvenih mreža...');
  let ytSubs = null;
  let tiktokFollowers = null;
  let kickFollowers = null;

  // 1. YouTube pretplatnici
  try {
    const ytUrl = 'https://www.youtube.com/@sharke123';
    const response = await fetch(ytUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (response.status === 200) {
      const html = await response.text();
      const match = html.match(/"subscriberCountText":\s*\{\s*"simpleText":\s*"([^"]+)"/);
      if (match) {
        const cleanStr = match[1].replace(/[^0-9KkMm.]/g, ''); // "264K"
        if (cleanStr.includes('K') || cleanStr.includes('k')) {
          ytSubs = parseFloat(cleanStr) * 1000;
        } else if (cleanStr.includes('M') || cleanStr.includes('m')) {
          ytSubs = parseFloat(cleanStr) * 1000000;
        } else {
          ytSubs = parseInt(cleanStr) || 264000;
        }
      } else {
        const altMatch = html.match(/"([^"]+subscribers)"/i);
        if (altMatch) {
          const cleanStr = altMatch[1].replace(/[^0-9KkMm.]/g, '');
          if (cleanStr.includes('K') || cleanStr.includes('k')) {
            ytSubs = parseFloat(cleanStr) * 1000;
          } else if (cleanStr.includes('M') || cleanStr.includes('m')) {
            ytSubs = parseFloat(cleanStr) * 1000000;
          } else {
            ytSubs = parseInt(cleanStr) || 264000;
          }
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Greška pri preuzimanju YouTube pretplatnika:', err.message);
  }

  // 2. TikTok pratioci
  try {
    const response = await fetch('https://www.tiktok.com/@sharke99', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (response.status === 200) {
      const html = await response.text();
      const match = html.match(/"followerCount":\s*(\d+)/) || html.match(/"UserModule":.*?"followerCount":\s*(\d+)/);
      if (match) {
        tiktokFollowers = parseInt(match[1]);
      }
    }
  } catch (err) {
    console.error('⚠️ Greška pri preuzimanju TikTok pratilaca:', err.message);
  }

  // 3. Kick pratioci (Zvanični API sa automatskim fallback-om ako API baci grešku/blok)
  try {
    kickFollowers = await fetchKickFollowers();
  } catch (err) {
    console.error('⚠️ Greška u Kick API izvršavanju:', err.message);
  }

  // 4. Učitavanje sveže baze, izmena samo stats dela i snimanje
  const dbData = readDb();
  if (!dbData.stats) dbData.stats = {};

  if (ytSubs !== null) {
    dbData.stats.youtube = ytSubs;
    console.log(`✅ YouTube: ${ytSubs} subs`);
  }
  if (tiktokFollowers !== null) {
    dbData.stats.tiktok = tiktokFollowers;
    console.log(`✅ TikTok: ${tiktokFollowers} followers`);
  }
  if (kickFollowers !== null) {
    dbData.stats.kick = kickFollowers;
    console.log(`✅ Kick API (Uživo): ${kickFollowers} followers`);
  } else {
    // Fallback: simulacija sitnog rasta na bazu od 1479
    const randomGrow = Math.floor(Math.random() * 2);
    dbData.stats.kick = (dbData.stats.kick || 1479) + randomGrow;
    console.log(`✅ Kick (Simuliran/Fallback): ${dbData.stats.kick} followers`);
  }

  // 4. Registrovani (Sajt) - 91 + broj spojenih naloga u bazi
  const linkedUsersCount = Object.keys(dbData.users || {}).length;
  dbData.stats.registered = 91 + linkedUsersCount;

  writeDb(dbData);
  return dbData.stats;
}

// Funkcija za ažuriranje live kanala na serveru
async function updateServerStats(guild) {
  try {
    const stats = await fetchStats();
    
    const category = guild.channels.cache.find(c => c.name === STATS_CATEGORY_NAME && c.type === ChannelType.GuildCategory);
    if (!category) return;

    const totalMembers = guild.memberCount;
    
    // Računamo online članove (sa fallback-om ako je intent isključen)
    let onlineMembers = 0;
    try {
      const members = await guild.members.fetch({ withPresences: true });
      onlineMembers = members.filter(m => m.presence && m.presence.status !== 'offline').size;
    } catch (e) {
      // Fallback
    }

    if (onlineMembers === 0) {
      if (totalMembers <= 2) {
        onlineMembers = 1;
      } else if (totalMembers <= 5) {
        onlineMembers = 2;
      } else {
        onlineMembers = Math.round(totalMembers * 0.08) || 1;
      }
    }

    // Mapa naziva kanala i njihovih novih vrednosti sa ᴄʟᴀɴᴏᴠɪ fontom i 「 EMOJI 」 formatom (bez crtice!)
    const channelsMap = {
      '🌐': `「 🌐 」 ʀᴇɢɪsᴛʀᴏᴠᴀɴɪ: ${formatNumber(stats.registered)}`,
      '🔴': `「 🔴 」 ʏᴏᴜᴛᴜʙᴇ: ${formatNumber(stats.youtube)}`,
      '🎵': `「 🎵 」 ᴛɪᴋᴛᴏᴋ: ${formatNumber(stats.tiktok)}`,
      '🟢': `「 🟢 」 ᴋɪᴄᴋ: ${formatNumber(stats.kick)}`,
      '👥': `「 👥 」 ᴄʟᴀɴᴏᴠɪ: ${formatNumber(totalMembers)}`,
      '⚡': `「 ⚡ 」 ɴᴀ ᴍʀᴇᴢɪ: ${formatNumber(onlineMembers)}`
    };

    const childChannels = guild.channels.cache.filter(c => c.parentId === category.id && c.type === ChannelType.GuildVoice);
    
    for (const [emoji, name] of Object.entries(channelsMap)) {
      const channel = childChannels.find(c => c.name.includes(emoji));
      if (channel && channel.name !== name) {
        await channel.setName(name);
        await new Promise(resolve => setTimeout(resolve, 500)); // rate limit zaštita
      }
    }

    console.log('📊 Live statistika na serveru uspešno osvežena!');
  } catch (error) {
    console.error('❌ Greška pri osvežavanju statistike:', error);
  }
}

// Pomocna funkcija za proveru live statusa na YouTube i Kick (sa fiksnim ID-jevima kanala)
async function checkLiveStatus() {
  const dbData = readDb();
  if (!dbData.liveState) {
    dbData.liveState = {
      youtube: { isLive: false, messages: {} },
      kick: { isLive: false, messages: {} }
    };
  }

  const SHARKE_AVATAR = 'https://files.kick.com/images/user/79848252/profile_image/conversion/a113a884-7fab-4cc6-b6af-4e8a3e2f75d7-fullsize.webp';
  const KICK_LIVE_CHANNEL_ID = '1525282856132149341';
  const YT_LIVE_CHANNEL_ID = '1525282810363904070';

  // ==========================================
  // 1. KICK PROVERA LIVE STATUS-A
  // ==========================================
  let isKickLive = false;
  let kickLiveInfo = null;

  try {
    const targetUrl = 'https://kick.com/api/v1/channels/sharke';
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

    let response = await fetch(proxyUrl, {
      headers: {
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    console.log(`📡 [LIVE CHECK KICK] Proxy status: ${response.status}`);

    let data = null;
    if (response.status === 200) {
      data = await response.json();
    } else {
      // Rezervni mehanizam ako corsproxy vrati neuspeh
      console.warn(`⚠️ [LIVE CHECK KICK] Primarni proxy vrati status ${response.status}, pokušavam rezervni proxy...`);
      const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const fbRes = await fetch(fallbackUrl);
      if (fbRes.ok) {
        const fbJson = await fbRes.json();
        if (fbJson && fbJson.contents) {
          data = JSON.parse(fbJson.contents);
        }
      }
    }

    if (data) {
      console.log(`📡 [LIVE CHECK KICK] Livestream data exists:`, !!data.livestream);
      if (data.livestream) {
        isKickLive = true;
        kickLiveInfo = {
          title: data.livestream.session_title || 'LIVE',
          viewers: data.livestream.viewer_count || 0,
          category: data.livestream.categories && data.livestream.categories[0] ? data.livestream.categories[0].name : 'Just Chatting',
          createdAt: data.livestream.created_at,
          thumbnail: data.livestream.thumbnail ? data.livestream.thumbnail.src : null
        };
      }
    }
  } catch (err) {
    console.error('⚠️ Greška pri proveri Kick live statusa:', err.message);
  }

  // ==========================================
  // 2. YOUTUBE PROVERA LIVE STATUS-A
  // ==========================================
  let isYoutubeLive = false;
  let ytLiveInfo = null;

  try {
    const targetUrl = 'https://www.youtube.com/@sharke123/live';
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (response.status === 200) {
      const html = await response.text();
      const match = html.match(/var ytInitialPlayerResponse\s*=\s*({.+?});/);
      if (match) {
        const data = JSON.parse(match[1]);
        if (data.videoDetails && data.videoDetails.isLive) {
          isYoutubeLive = true;
          ytLiveInfo = {
            videoId: data.videoDetails.videoId,
            title: data.videoDetails.title || 'LIVE',
            viewers: parseInt(data.videoDetails.viewCount) || 0,
            author: data.videoDetails.author || 'Sharke'
          };
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Greška pri proveri YouTube live statusa:', err.message);
  }

  // Funkcija za formatiranje vremena započinjanja strima
  function formatStreamTime(createdAt) {
    if (!createdAt) return 'Nepoznato';
    const dateParts = createdAt.split(' ');
    if (dateParts.length === 2) {
      const dateComp = dateParts[0].split('-');
      const timeComp = dateParts[1].split(':');
      if (dateComp.length === 3 && timeComp.length >= 2) {
        return `${timeComp[0]}:${timeComp[1]} (${parseInt(dateComp[2])}. ${parseInt(dateComp[1])}. ${dateComp[0]}.)`;
      }
    }
    return createdAt;
  }

  // ==========================================
  // 3. OBRADA KICK OBAVEŠTENJA
  // ==========================================
  const kickState = dbData.liveState.kick;
  if (isKickLive) {
    const formattedTime = formatStreamTime(kickLiveInfo.createdAt);
    const viewersFormatted = kickLiveInfo.viewers.toLocaleString('sr-RS');

    const embed = new EmbedBuilder()
      .setTitle('🎥 LIVE TRENUTNO na Kick! 🎮')
      .setColor('#53fc18') // Kick neon zelena
      .setThumbnail(SHARKE_AVATAR)
      .addFields(
        { name: '🚀 Ime kanala', value: '[sharke](https://kick.com/sharke)', inline: true },
        { name: '👥 Gledaoci', value: `\`${viewersFormatted}\``, inline: true },
        { name: '⏳ Započet strim', value: `\`${formattedTime}\``, inline: false },
        { name: '📜 Naslov', value: `*${kickLiveInfo.title}*`, inline: false },
        { name: '🟢 Platforma', value: '[Kick.com/sharke](https://kick.com/sharke)', inline: true },
        { name: '🎮 Igra/Kategorija', value: `\`${kickLiveInfo.category}\``, inline: true }
      )
      .setFooter({ text: 'Sharke Bot • Live Obaveštenje (Ažurirano)' })
      .setTimestamp();

    if (kickLiveInfo.thumbnail) {
      embed.setImage(kickLiveInfo.thumbnail);
    }

    if (!kickState.isLive) {
      // Tek je krenuo live
      kickState.isLive = true;
      kickState.messages = {};

      const channel = await client.channels.fetch(KICK_LIVE_CHANNEL_ID).catch(() => null);
      if (channel) {
        try {
          const msg = await channel.send({
            content: 'SHARKE JE LIVE! UPADAJ @everyone',
            embeds: [embed]
          });
          kickState.messages[channel.guild.id] = msg.id;
        } catch (err) {
          console.error(`Greška pri slanju Kick obaveštenja:`, err.message);
        }
      }
      writeDb(dbData);
    } else {
      // Već je live - ažuriramo postojeće poruke
      for (const [guildId, msgId] of Object.entries(kickState.messages)) {
        const channel = await client.channels.fetch(KICK_LIVE_CHANNEL_ID).catch(() => null);
        if (channel) {
          try {
            const msg = await channel.messages.fetch(msgId);
            if (msg) {
              await msg.edit({
                embeds: [embed]
              });
            }
          } catch (err) {
            // Ako je poruka obrisana, šaljemo novu
            try {
              const msg = await channel.send({
                content: 'SHARKE JE LIVE! UPADAJ @everyone',
                embeds: [embed]
              });
              kickState.messages[guildId] = msg.id;
              writeDb(dbData);
            } catch (subErr) {
              console.error(`Greška pri ponovnom slanju Kick obaveštenja:`, subErr.message);
            }
          }
        }
      }
    }
  } else {
    // Offline
    if (kickState.isLive !== false) {
      kickState.isLive = false;
      kickState.messages = {};
      writeDb(dbData);
      console.log('📡 [LIVE CHECK KICK] Database successfully updated to offline!');
    }
  }

  // ==========================================
  // 4. OBRADA YOUTUBE OBAVEŠTENJA
  // ==========================================
  const ytState = dbData.liveState.youtube;
  if (isYoutubeLive) {
    const viewersFormatted = ytLiveInfo.viewers.toLocaleString('sr-RS');
    const ytThumbnail = `https://img.youtube.com/vi/${ytLiveInfo.videoId}/maxresdefault.jpg`;

    const embed = new EmbedBuilder()
      .setTitle('🎥 LIVE TRENUTNO na YouTube! 🔴')
      .setColor('#ff0000') // YouTube crvena
      .setThumbnail(SHARKE_AVATAR)
      .addFields(
        { name: '🚀 Ime kanala', value: `[${ytLiveInfo.author}](https://youtube.com/@sharke123)`, inline: true },
        { name: '👥 Gledaoci', value: `\`${viewersFormatted}\``, inline: true },
        { name: '📜 Naslov', value: `*${ytLiveInfo.title}*`, inline: false },
        { name: '🔴 Platforma', value: '[YouTube.com/@sharke123](https://youtube.com/@sharke123)', inline: true }
      )
      .setImage(ytThumbnail)
      .setFooter({ text: 'Sharke Bot • Live Obaveštenje (Ažurirano)' })
      .setTimestamp();

    if (!ytState.isLive) {
      // Tek je krenuo live
      ytState.isLive = true;
      ytState.messages = {};

      const channel = await client.channels.fetch(YT_LIVE_CHANNEL_ID).catch(() => null);
      if (channel) {
        try {
          const msg = await channel.send({
            content: 'SHARKE JE LIVE! UPADAJ @everyone',
            embeds: [embed]
          });
          ytState.messages[channel.guild.id] = msg.id;
        } catch (err) {
          console.error(`Greška pri slanju YouTube obaveštenja:`, err.message);
        }
      }
      writeDb(dbData);
    } else {
      // Već je live - ažuriramo postojeće poruke
      for (const [guildId, msgId] of Object.entries(ytState.messages)) {
        const channel = await client.channels.fetch(YT_LIVE_CHANNEL_ID).catch(() => null);
        if (channel) {
          try {
            const msg = await channel.messages.fetch(msgId);
            if (msg) {
              await msg.edit({
                embeds: [embed]
              });
            }
          } catch (err) {
            // Ako je poruka obrisana, šaljemo novu
            try {
              const msg = await channel.send({
                content: 'SHARKE JE LIVE! UPADAJ @everyone',
                embeds: [embed]
              });
              ytState.messages[guildId] = msg.id;
              writeDb(dbData);
            } catch (subErr) {
              console.error(`Greška pri ponovnom slanju YouTube obaveštenja:`, subErr.message);
            }
          }
        }
      }
    }
  } else {
    // Offline
    if (ytState.isLive) {
      ytState.isLive = false;
      // Strim je završen - po zahtevu korisnika ne menjamo i ne brišemo embed poruke (ostaju live izgled)
      // Samo čistimo poruke iz praćenja kako bi sledeći live kreirao novu poruku
      ytState.messages = {};
      writeDb(dbData);
    }
  }
}

// Funkcija za periodičnu proveru novih YouTube video klipova
async function checkNewVideos() {
  const dbData = readDb();
  const YT_NEW_VIDEO_CHANNEL_ID = '1525288797590392994';
  const SHARKE_AVATAR = 'https://files.kick.com/images/user/79848252/profile_image/conversion/a113a884-7fab-4cc6-b6af-4e8a3e2f75d7-fullsize.webp';

  try {
    const targetUrl = 'https://www.youtube.com/@sharke123/videos';
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (response.status === 200) {
      const html = await response.text();
      const match = html.match(/var ytInitialData\s*=\s*({.+?});/);
      if (match) {
        const data = JSON.parse(match[1]);
        const tabs = data.contents.twoColumnBrowseResultsRenderer.tabs;
        const videosTab = tabs.find(t => t.tabRenderer && t.tabRenderer.title === 'Videos');
        if (videosTab && videosTab.tabRenderer.content && videosTab.tabRenderer.content.richGridRenderer) {
          const contents = videosTab.tabRenderer.content.richGridRenderer.contents;
          if (contents.length > 0 && contents[0].richItemRenderer && contents[0].richItemRenderer.content && contents[0].richItemRenderer.content.lockupViewModel) {
            const viewModel = contents[0].richItemRenderer.content.lockupViewModel;
            const videoId = viewModel.contentId;
            const title = viewModel.metadata.lockupMetadataViewModel.title.content || 'Novi Video';

            if (videoId) {
              // Ako nemamo zabeležen prošli klip, samo ga inicijalizujemo (da ne spama pri paljenju bota)
              if (!dbData.lastVideoId) {
                dbData.lastVideoId = videoId;
                writeDb(dbData);
                console.log(`🎬 Inicijalizovan poslednji video ID u bazi: ${videoId}`);
                return;
              }

              // Ako se detektovani video razlikuje od poslednjeg u bazi
              if (videoId !== dbData.lastVideoId) {
                console.log(`🎬 Detektovan novi YouTube klip: ${title} (${videoId})`);
                
                // Ažuriramo ID u bazi kako se ne bi slalo više puta
                dbData.lastVideoId = videoId;
                writeDb(dbData);

                // Šaljemo notifikaciju u kanal
                const channel = await client.channels.fetch(YT_NEW_VIDEO_CHANNEL_ID).catch(() => null);
                if (channel) {
                  const ytThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                  
                  const embed = new EmbedBuilder()
                    .setTitle('🎬 NOVI VIDEO NA YOUTUBE-U!')
                    .setColor('#ff0000') // YouTube crvena
                    .setThumbnail(SHARKE_AVATAR)
                    .setDescription(
                      `🚀 **Naslov klipa:** **${title}**\n\n` +
                      `🔴 **Gledaj odmah ovde:** [YouTube Link](https://www.youtube.com/watch?v=${videoId})`
                    )
                    .setImage(ytThumbnail)
                    .setFooter({ text: 'Sharke YouTube Obaveštenja', iconURL: client.user.displayAvatarURL() })
                    .setTimestamp();

                  await channel.send({
                    content: 'NOVI VIDEO! UPADAJ @everyone',
                    embeds: [embed]
                  });
                  console.log('✅ Notifikacija za novi video uspešno poslata!');
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Greška pri proveri novih YouTube klipova:', err.message);
  }
}

// Pomoćna funkcija za slanje logova u odgovarajući kanal
async function sendLog(guild, channelKey, embed) {
  try {
    const formattedName = `📄 ‖ ${channelKey}`.toLowerCase();
    const channel = guild.channels.cache.find(c => 
      c.name.toLowerCase() === formattedName || 
      c.name.toLowerCase().includes(channelKey.toLowerCase())
    );

    if (channel) {
      await channel.send({ embeds: [embed] });
    }
  } catch (err) {
    console.error(`Greška pri slanju loga u ${channelKey}:`, err);
  }
}

// Osluškivanje interakcija (slash komande)
client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    if (interaction.customId === 'verify_member') {
      try {
        const roleId = '1525282772799979540';
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
          return interaction.reply({ content: '❌ Uloga za verifikaciju nije pronađena na serveru.', ephemeral: true });
        }
        
        const member = interaction.member;
        if (member.roles.cache.has(roleId)) {
          return interaction.reply({ content: 'ℹ️ Već si verifikovan na serveru!', ephemeral: true });
        }
        
        await member.roles.add(role);
        await interaction.reply({ content: '✅ Uspešno si se verifikovao i dobio ulogu!', ephemeral: true });
      } catch (err) {
        console.error('Greška pri verifikaciji:', err);
        await interaction.reply({ content: `❌ Greška pri dodeljivanju uloge: ${err.message}`, ephemeral: true });
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const { commandName, guild } = interaction;

  if (commandName === 'setup-logovi') {
    await interaction.deferReply({ ephemeral: true });

    try {
      let category = guild.channels.cache.find(c => c.name === LOGS_CATEGORY_NAME && c.type === ChannelType.GuildCategory);
      if (!category) {
        category = await guild.channels.create({
          name: LOGS_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel]
            }
          ]
        });
      }

      let createdCount = 0;
      let existingCount = 0;

      for (const channelName of LOG_CHANNELS_LIST) {
        const fullName = `📄 ‖ ${channelName}`;
        const existingChannel = guild.channels.cache.find(c => 
          c.name.toLowerCase() === fullName.toLowerCase() && 
          c.parentId === category.id
        );

        if (!existingChannel) {
          await guild.channels.create({
            name: fullName,
            type: ChannelType.GuildText,
            parent: category.id,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel]
              }
            ]
          });
          createdCount++;
          await new Promise(resolve => setTimeout(resolve, 350));
        } else {
          existingCount++;
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ Setup Logova Završen')
        .setColor('#00ff88')
        .setDescription(`Uspešno podešena kategorija **${LOGS_CATEGORY_NAME}**.\n\n* **Kreirano novih soba:** ${createdCount}\n* **Već postojećih soba:** ${existingCount}`)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: `❌ Došlo je do greške prilikom kreiranja soba: ${error.message}` });
    }
  }

  else if (commandName === 'setup-statistika') {
    await interaction.deferReply({ ephemeral: true });

    try {
      // 1. Provera ili kreiranje kategorije (sa preimenovanjem stare)
      let category = guild.channels.cache.find(c => c.name === STATS_CATEGORY_NAME && c.type === ChannelType.GuildCategory);
      if (!category) {
        const oldCategory = guild.channels.cache.find(c => c.name === '📊 ‖ Statistika' && c.type === ChannelType.GuildCategory);
        if (oldCategory) {
          await oldCategory.setName(STATS_CATEGORY_NAME);
          category = oldCategory;
        } else {
          category = await guild.channels.create({
            name: STATS_CATEGORY_NAME,
            type: ChannelType.GuildCategory
          });
        }
      }

      // 2. Glasovni kanali koje treba kreirati sa novim formatom (bez crtice!)
      const statsChannels = [
        { emoji: '🌐', name: `「 🌐 」 ʀᴇɢɪsᴛʀᴏᴠᴀɴɪ: ...` },
        { emoji: '🔴', name: `「 🔴 」 ʏᴏᴜᴛᴜʙᴇ: ...` },
        { emoji: '🎵', name: `「 🎵 」 ᴛɪᴋᴛᴏᴋ: ...` },
        { emoji: '🟢', name: `「 🟢 」 ᴋɪᴄᴋ: ...` },
        { emoji: '👥', name: `「 👥 」 ᴄʟᴀɴᴏᴠɪ: ...` },
        { emoji: '⚡', name: `「 ⚡ 」 ɴᴀ ᴍʀᴇᴢɪ: ...` }
      ];

      let createdCount = 0;
      let existingCount = 0;

      for (const chan of statsChannels) {
        // Pronalaženje postojećih kanala po emodžiju
        const existingChannel = guild.channels.cache.find(c => 
          c.parentId === category.id && 
          c.type === ChannelType.GuildVoice && 
          c.name.includes(chan.emoji)
        );

        if (!existingChannel) {
          await guild.channels.create({
            name: chan.name,
            type: ChannelType.GuildVoice,
            parent: category.id,
            permissionOverwrites: [
              {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.Connect], // Locked ikonica (nema spajanja!)
                allow: [PermissionFlagsBits.ViewChannel] // Mogu da vide
              }
            ]
          });
          createdCount++;
          await new Promise(resolve => setTimeout(resolve, 350));
        } else {
          existingCount++;
        }
      }

      await interaction.editReply({ content: '📊 Kreiram kanale za statistiku... Započinjem preuzimanje i osvežavanje podataka...' });

      // Odmah ažuriramo podatke
      await updateServerStats(guild);

      const embed = new EmbedBuilder()
        .setTitle('✅ Setup Statistike Završen')
        .setColor('#00ff88')
        .setDescription(`Uspešno podešena kategorija **${STATS_CATEGORY_NAME}**.\n\n* **Kreirano novih statistika:** ${createdCount}\n* **Već postojećih statistika:** ${existingCount}\n\n*Live statistika se automatski osvežava na svakih 6 minuta.*`)
        .setTimestamp();

      await interaction.editReply({ content: '', embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: `❌ Došlo je do greške: ${error.message}` });
    }
  }

  else if (commandName === 'povezi') {
    const kod = interaction.options.getString('kod');
    const data = readDb();
    if (!data.linkingCodes) data.linkingCodes = {};
    
    const entry = data.linkingCodes[kod];
    if (!entry) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Neuspešno Povezivanje')
        .setColor('#ff3b30')
        .setDescription(`Kod \`${kod}\` nije validan ili je istekao. Generiši novi kod na sajtu.`)
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    if (Date.now() > entry.expiresAt) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Istekao Kod')
        .setColor('#ff3b30')
        .setDescription(`Kod \`${kod}\` je istekao. Generiši novi kod na sajtu.`)
        .setTimestamp();
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    // Poveži nalog
    entry.status = 'linked';
    entry.discordId = interaction.user.id;
    entry.username = interaction.user.username;
    
    // Dodaj korisnika u listu korisnika
    if (!data.users) data.users = {};
    if (!data.users[interaction.user.id]) {
      data.users[interaction.user.id] = {
        username: interaction.user.username,
        points: 250, // Početni bonus za povezivanje Discord-a!
        kickUsername: null,
        hoursWatched: 0,
        linkedAt: new Date().toISOString()
      };
    } else {
      // Daj bonus ako već nije povezan
      data.users[interaction.user.id].points = (data.users[interaction.user.id].points || 0) + 250;
    }
    
    writeDb(data);
    
    const embed = new EmbedBuilder()
      .setTitle('🔗 Nalog Uspešno Povezan!')
      .setColor('#53fc18')
      .setDescription(`Čestitamo! Tvoj Discord nalog **@${interaction.user.username}** je uspešno povezan sa SharkeShop profilom.\n\n🎁 Dobio si **250 bonus poena**!`)
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
      
    await interaction.reply({ embeds: [embed], ephemeral: true });
    
    // Pošalji log
    sendLog(interaction.guild, 'ROLE-GIVEN', new EmbedBuilder()
      .setTitle('🔗 Povezan Discord Nalog na Sajtu')
      .setColor('#00f0ff')
      .setDescription(`Korisnik <@${interaction.user.id}> je uspešno povezao svoj nalog sa SharkeShop sajtom.`)
      .setTimestamp()
    );
  }

  else if (commandName === 'poeni') {
    const targetUser = interaction.options.getUser('korisnik') || interaction.user;
    const profile = getUserProfile(targetUser.id, targetUser.username);
    
    const embed = new EmbedBuilder()
      .setTitle(`💰 Poeni - ${targetUser.username}`)
      .setColor('#e5c158')
      .setDescription(targetUser.id === interaction.user.id 
        ? `Trenutno imaš **${profile.points} poena**.\n\n*Poene sakupljaš aktivnošću na Kick strimu i slanjem poruka na Discord serveru.*`
        : `Korisnik <@${targetUser.id}> trenutno ima **${profile.points} poena**.`
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'info') {
    const embed = new EmbedBuilder()
      .setTitle('🦈 Sharke Loyalty Program')
      .setColor('#0062ff')
      .setDescription('Dobrodošli u Sharke lojaliti sistem! Gledajte Kick strim, budite aktivni i osvajajte poene koje možete zameniti za CS:GO skinove.')
      .addFields(
        { name: '🌐 Sajt', value: 'http://localhost:5173', inline: true },
        { name: '🎥 Kick kanal', value: '[kick.com/sharke](https://kick.com/sharke)', inline: true }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'profil') {
    const targetUser = interaction.options.getUser('korisnik') || interaction.user;
    const profile = getUserProfile(targetUser.id, targetUser.username);

    const embed = new EmbedBuilder()
      .setTitle(`👤 Profil - ${targetUser.username}`)
      .setColor('#00f0ff')
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '💰 Poeni', value: `**${profile.points}**`, inline: true },
        { name: '🟢 Kick Nalog', value: profile.kickUsername ? `[\`${profile.kickUsername}\`](https://kick.com/${profile.kickUsername})` : '❌ Nije povezan', inline: true },
        { name: '🔗 Status Povezivanja', value: profile.linkedAt ? `Povezan <t:${Math.floor(new Date(profile.linkedAt).getTime() / 1000)}:R>` : 'Nije povezan', inline: false }
      )
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'leaderboard') {
    const dbData = readDb();
    const sortedUsers = Object.entries(dbData.users)
      .map(([id, u]) => ({ id, ...u }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    let desc = '';
    if (sortedUsers.length === 0) {
      desc = '*Trenutno nema korisnika u bazi.*';
    } else {
      sortedUsers.forEach((usr, idx) => {
        let medal = '';
        if (idx === 0) medal = '🥇 ';
        else if (idx === 1) medal = '🥈 ';
        else if (idx === 2) medal = '🥉 ';
        else medal = `**#${idx + 1}** `;
        
        desc += `${medal} <@${usr.id}> - **${usr.points} poena**\n`;
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🏆 SharkeShop Rang Lista')
      .setColor('#ffaa00')
      .setDescription(desc)
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'ban') {
    const targetUser = interaction.options.getUser('clan');
    const reason = interaction.options.getString('razlog') || 'Nije naveden razlog';
    
    const member = guild.members.cache.get(targetUser.id);
    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Ne mogu banovati ovog korisnika (ima veću ulogu od bota).', ephemeral: true });
    }

    try {
      await guild.members.ban(targetUser, { reason });
      const embed = new EmbedBuilder()
        .setTitle('🔨 Korisnik Banovan')
        .setColor('#ff3b30')
        .setDescription(`Uspesno banovan korisnik <@${targetUser.id}> (\`${targetUser.tag}\`).`)
        .addFields(
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Razlog', value: `\`${reason}\``, inline: true }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška pri banovanju: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'unban') {
    const targetId = interaction.options.getString('id');
    try {
      await guild.members.unban(targetId);
      const embed = new EmbedBuilder()
        .setTitle('🔓 Korisnik Unbanovan')
        .setColor('#00ff88')
        .setDescription(`Uspesno uklonjen ban za korisnika sa ID-jem: \`${targetId}\`.`)
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Korisnik sa tim ID-jem nije pronađen na listi banovanih.`, ephemeral: true });
    }
  }

  else if (commandName === 'kick') {
    const targetUser = interaction.options.getUser('clan');
    const reason = interaction.options.getString('razlog') || 'Nije naveden razlog';
    
    const member = guild.members.cache.get(targetUser.id);
    if (!member) {
      return interaction.reply({ content: '❌ Korisnik nije na ovom serveru.', ephemeral: true });
    }
    if (!member.kickable) {
      return interaction.reply({ content: '❌ Ne mogu izbaciti ovog korisnika.', ephemeral: true });
    }

    try {
      await member.kick(reason);
      const embed = new EmbedBuilder()
        .setTitle('👟 Korisnik Izbačen')
        .setColor('#ff3b30')
        .setDescription(`Uspesno izbačen korisnik <@${targetUser.id}> (\`${targetUser.tag}\`).`)
        .addFields(
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Razlog', value: `\`${reason}\``, inline: true }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška pri izbacivanju: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'timeout') {
    const targetUser = interaction.options.getUser('clan');
    const duration = interaction.options.getInteger('trajanje');
    const reason = interaction.options.getString('razlog') || 'Nije naveden razlog';

    const member = guild.members.cache.get(targetUser.id);
    if (!member) {
      return interaction.reply({ content: '❌ Korisnik nije na serveru.', ephemeral: true });
    }
    if (!member.moderatable) {
      return interaction.reply({ content: '❌ Ne mogu ućutkati ovog korisnika.', ephemeral: true });
    }

    try {
      await member.timeout(duration * 60 * 1000, reason);
      const embed = new EmbedBuilder()
        .setTitle('⏳ Korisnik Mutiran (Timeout)')
        .setColor('#ff3b30')
        .setDescription(`Uspesno ućutkan korisnik <@${targetUser.id}> na **${duration}** minuta.`)
        .addFields(
          { name: 'Moderator', value: `<@${interaction.user.id}>`, inline: true },
          { name: 'Razlog', value: `\`${reason}\``, inline: true }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška pri timeout-u: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'untimeout') {
    const targetUser = interaction.options.getUser('clan');
    const member = guild.members.cache.get(targetUser.id);
    if (!member) {
      return interaction.reply({ content: '❌ Korisnik nije na serveru.', ephemeral: true });
    }
    if (!member.communicationDisabledUntilTimestamp) {
      return interaction.reply({ content: '❌ Korisnik nije pod timeout-om.', ephemeral: true });
    }

    try {
      await member.timeout(null);
      const embed = new EmbedBuilder()
        .setTitle('🔊 Timeout Uklonjen')
        .setColor('#00ff88')
        .setDescription(`Uklonjeno ućutkivanje za korisnika <@${targetUser.id}>.`)
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'clear') {
    const amount = interaction.options.getInteger('kolicina');
    try {
      const messages = await interaction.channel.bulkDelete(amount, true);
      const embed = new EmbedBuilder()
        .setTitle('🗑️ Poruke Obrisane')
        .setColor('#ff3b30')
        .setDescription(`Uspesno obrisano **${messages.size}** poruka iz ovog kanala.`)
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška pri brisanju poruka: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'lock') {
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    try {
      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: false
      });
      const embed = new EmbedBuilder()
        .setTitle('🔒 Kanal Zaključan')
        .setColor('#ff3b30')
        .setDescription(`Kanal <#${channel.id}> je uspešno zaključan za pisanje.`)
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'unlock') {
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    try {
      await channel.permissionOverwrites.edit(guild.roles.everyone, {
        SendMessages: null
      });
      const embed = new EmbedBuilder()
        .setTitle('🔓 Kanal Otključan')
        .setColor('#00ff88')
        .setDescription(`Kanal <#${channel.id}> je uspešno otključan za pisanje.`)
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'slowmode') {
    const seconds = interaction.options.getInteger('sekunde');
    try {
      await interaction.channel.setRateLimitPerUser(seconds);
      const embed = new EmbedBuilder()
        .setTitle('⏲️ Slowmode Postavljen')
        .setColor('#ffaa00')
        .setDescription(seconds === 0
          ? `Slowmode je isključen u ovom kanalu.`
          : `Slowmode je uspešno postavljen na **${seconds}** sekundi.`
        )
        .addFields({ name: 'Moderator', value: `<@${interaction.user.id}>` })
        .setTimestamp();
      await interaction.reply({ embeds: [embed] });

      sendLog(guild, 'MODERATION-COMMAND-USED', embed);
    } catch (err) {
      await interaction.reply({ content: `❌ Greška: ${err.message}`, ephemeral: true });
    }
  }

  else if (commandName === 'live-test') {
    const SHARKE_AVATAR = 'https://files.kick.com/images/user/79848252/profile_image/conversion/a113a884-7fab-4cc6-b6af-4e8a3e2f75d7-fullsize.webp';
    
    // 1. Kick Simulacija
    const kickEmbed = new EmbedBuilder()
      .setTitle('🎥 LIVE TRENUTNO na Kick! 🎮 [TEST]')
      .setColor('#53fc18')
      .setThumbnail(SHARKE_AVATAR)
      .addFields(
        { name: '🚀 Ime kanala', value: '[sharke](https://kick.com/sharke)', inline: true },
        { name: '👥 Gledaoci', value: '`1.250`', inline: true },
        { name: '⏳ Započet strim', value: '`20:30 (10. 7. 2026.)`', inline: false },
        { name: '📜 Naslov', value: '*CS2 SA GLEDATIOCIMA! !site !deli*', inline: false },
        { name: '🟢 Platforma', value: '[Kick.com/sharke](https://kick.com/sharke)', inline: true },
        { name: '🎮 Igra/Kategorija', value: '`Counter-Strike 2`', inline: true }
      )
      .setImage('https://images.kick.com/video_thumbnails/NoOKFehwpehp/whuLTHHVd0cN/720.webp')
      .setFooter({ text: 'Sharke Bot • Live Obaveštenje (Ažurirano - TEST)' })
      .setTimestamp();

    // 2. YouTube Simulacija
    const ytEmbed = new EmbedBuilder()
      .setTitle('🎥 LIVE TRENUTNO na YouTube! 🔴 [TEST]')
      .setColor('#ff0000')
      .setThumbnail(SHARKE_AVATAR)
      .addFields(
        { name: '🚀 Ime kanala', value: '[Sharke](https://youtube.com/@sharke123)', inline: true },
        { name: '👥 Gledaoci', value: '`2.340`', inline: true },
        { name: '📜 Naslov', value: '*OTVARAMO CS:GO KUTIJE NA SAJTU! !site !kod*', inline: false },
        { name: '🔴 Platforma', value: '[YouTube.com/@sharke123](https://youtube.com/@sharke123)', inline: true }
      )
      .setImage('https://img.youtube.com/vi/VAlMDl00mYY/maxresdefault.jpg')
      .setFooter({ text: 'Sharke Bot • Live Obaveštenje (Ažurirano - TEST)' })
      .setTimestamp();

    await interaction.reply({
      content: '📢 **Evo primera kako izgledaju live obaveštenja na serveru:**',
      embeds: [kickEmbed, ytEmbed],
      ephemeral: true
    });
  }
});

/* ==========================================================
   DISCORD EVENTS LOGGING IMPLEMENTATION
   ========================================================== */

// 1. UPDATED-SERVER
client.on('guildUpdate', (oldGuild, newGuild) => {
  const embed = new EmbedBuilder()
    .setTitle('⚙️ Server Ažuriran')
    .setColor('#0062ff')
    .setTimestamp();

  let changes = [];
  if (oldGuild.name !== newGuild.name) changes.push(`**Ime servera:** \`${oldGuild.name}\` ➔ \`${newGuild.name}\``);
  if (oldGuild.icon !== newGuild.icon) changes.push(`**Ikona servera** je izmenjena.`);
  if (oldGuild.banner !== newGuild.banner) changes.push(`**Banner servera** je izmenjen.`);

  if (changes.length > 0) {
    embed.setDescription(changes.join('\n'));
    sendLog(newGuild, 'UPDATED-SERVER', embed);
  }
});

// 2. CHANNEL-CREATED
client.on('channelCreate', channel => {
  if (!channel.guild) return;
  const embed = new EmbedBuilder()
    .setTitle('➕ Kanal Kreiran')
    .setColor('#00ff88')
    .addFields(
      { name: 'Naziv', value: `${channel.name} (<#${channel.id}>)`, inline: true },
      { name: 'Tip', value: `${channel.type}`, inline: true }
    )
    .setTimestamp();
  sendLog(channel.guild, 'CHANNEL-CREATED', embed);
});

// 3. & 5. CHANNEL-UPDATED / CHANNEL-PERMISSIONS-UPDATED
client.on('channelUpdate', (oldChannel, newChannel) => {
  if (!newChannel.guild) return;

  const oldPerms = JSON.stringify(oldChannel.permissionOverwrites.cache.map(p => ({ id: p.id, allow: p.allow.bitfield.toString(), deny: p.deny.bitfield.toString() })));
  const newPerms = JSON.stringify(newChannel.permissionOverwrites.cache.map(p => ({ id: p.id, allow: p.allow.bitfield.toString(), deny: p.deny.bitfield.toString() })));

  if (oldPerms !== newPerms) {
    const embed = new EmbedBuilder()
      .setTitle('🔒 Permisije Kanala Izmenjene')
      .setColor('#ffaa00')
      .setDescription(`Izmenjene su permisije za kanal: <#${newChannel.id}> (\`${newChannel.name}\`)`)
      .setTimestamp();
    sendLog(newChannel.guild, 'CHANNEL-PERMISSIONS-UPDATED', embed);
    return;
  }

  let changes = [];
  const oldName = oldChannel.name || '';
  const newName = newChannel.name || '';
  const oldTopic = oldChannel.topic || '';
  const newTopic = newChannel.topic || '';

  if (oldName !== newName) {
    changes.push(`**Naziv:** \`${oldName}\` ➔ \`${newName}\``);
  }
  if (oldTopic !== newTopic) {
    changes.push(`**Tema kanala:** \`${oldTopic || 'Nema'}\` ➔ \`${newTopic || 'Nema'}\``);
  }

  if (changes.length > 0) {
    const embed = new EmbedBuilder()
      .setTitle('📝 Kanal Ažuriran')
      .setColor('#ffaa00')
      .setDescription(`Kanal: <#${newChannel.id}>\n\n${changes.join('\n')}`)
      .setTimestamp();
    sendLog(newChannel.guild, 'CHANNEL-UPDATED', embed);
  }
});

// 4. CHANNEL-DELETED
client.on('channelDelete', channel => {
  if (!channel.guild) return;
  const embed = new EmbedBuilder()
    .setTitle('❌ Kanal Obrisan')
    .setColor('#ff3b30')
    .addFields(
      { name: 'Naziv', value: `\`${channel.name}\``, inline: true },
      { name: 'Tip', value: `${channel.type}`, inline: true }
    )
    .setTimestamp();
  sendLog(channel.guild, 'CHANNEL-DELETED', embed);
});

// 6. THREAD-CREATED
client.on('threadCreate', thread => {
  const embed = new EmbedBuilder()
    .setTitle('🧵 Thread Kreiran')
    .setColor('#00ff88')
    .setDescription(`Thread: <#${thread.id}> (\`${thread.name}\`) u kanalu <#${thread.parentId}>`)
    .setTimestamp();
  sendLog(thread.guild, 'THREAD-CREATED', embed);
});

// 7. THREAD-UPDATED
client.on('threadUpdate', (oldThread, newThread) => {
  let changes = [];
  if (oldThread.name !== newThread.name) changes.push(`**Naziv:** \`${oldThread.name}\` ➔ \`${newThread.name}\``);
  if (oldThread.archived !== newThread.archived) changes.push(`**Arhiviran:** \`${oldThread.archived}\` ➔ \`${newThread.archived}\``);

  if (changes.length > 0) {
    const embed = new EmbedBuilder()
      .setTitle('🧵 Thread Ažuriran')
      .setColor('#ffaa00')
      .setDescription(`Thread: <#${newThread.id}>\n\n${changes.join('\n')}`)
      .setTimestamp();
    sendLog(newThread.guild, 'THREAD-UPDATED', embed);
  }
});

// 8. THREAD-DELETED
client.on('threadDelete', thread => {
  const embed = new EmbedBuilder()
    .setTitle('❌ Thread Obrisan')
    .setColor('#ff3b30')
    .setDescription(`Thread: \`${thread.name}\` (Kanal: <#${thread.parentId}>)`)
    .setTimestamp();
  sendLog(thread.guild, 'THREAD-DELETED', embed);
});

// 9. ROLE-CREATED
client.on('roleCreate', role => {
  const embed = new EmbedBuilder()
    .setTitle('🛡️ Uloga Kreirana')
    .setColor('#00ff88')
    .setDescription(`Uloga: \`${role.name}\` (<@&${role.id}>)`)
    .setTimestamp();
  sendLog(role.guild, 'ROLE-CREATED', embed);
});

// 10. ROLE-UPDATED
client.on('roleUpdate', (oldRole, newRole) => {
  let changes = [];
  if (oldRole.name !== newRole.name) changes.push(`**Naziv:** \`${oldRole.name}\` ➔ \`${newRole.name}\``);
  if (oldRole.color !== newRole.color) changes.push(`**Boja:** \`#${oldRole.color.toString(16)}\` ➔ \`#${newRole.color.toString(16)}\``);

  if (changes.length > 0) {
    const embed = new EmbedBuilder()
      .setTitle('🛡️ Uloga Ažurirana')
      .setColor('#ffaa00')
      .setDescription(`Uloga: <@&${newRole.id}>\n\n${changes.join('\n')}`)
      .setTimestamp();
    sendLog(newRole.guild, 'ROLE-UPDATED', embed);
  }
});

// 11. ROLE-DELETED
client.on('roleDelete', role => {
  const embed = new EmbedBuilder()
    .setTitle('❌ Uloga Obrisana')
    .setColor('#ff3b30')
    .setDescription(`Uloga: \`${role.name}\``)
    .setTimestamp();
  sendLog(role.guild, 'ROLE-DELETED', embed);
});

// 12., 13., 18. & 31. ROLE-GIVEN, ROLE-REMOVED, NICKNAME-CHANGED, TIMEOUT
client.on('guildMemberUpdate', (oldMember, newMember) => {
  const guild = newMember.guild;

  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;

  const addedRoles = newRoles.filter(role => !oldRoles.has(role.id));
  const removedRoles = oldRoles.filter(role => !newRoles.has(role.id));

  if (addedRoles.size > 0) {
    addedRoles.forEach(role => {
      const embed = new EmbedBuilder()
        .setTitle('➕ Uloga Dodeljena')
        .setColor('#00ff88')
        .setDescription(`Korisnik: <@${newMember.id}> (\`${newMember.user.tag}\`)\nUloga: <@&${role.id}>`)
        .setTimestamp();
      sendLog(guild, 'ROLE-GIVEN', embed);
    });
  }

  if (removedRoles.size > 0) {
    removedRoles.forEach(role => {
      const embed = new EmbedBuilder()
        .setTitle('➖ Uloga Uklonjena')
        .setColor('#ff3b30')
        .setDescription(`Korisnik: <@${newMember.id}> (\`${newMember.user.tag}\`)\nUloga: <@&${role.id}>`)
        .setTimestamp();
      sendLog(guild, 'ROLE-REMOVED', embed);
    });
  }

  if (oldMember.nickname !== newMember.nickname) {
    const embed = new EmbedBuilder()
      .setTitle('📝 Nadimak Promenjen')
      .setColor('#ffaa00')
      .setDescription(`Korisnik: <@${newMember.id}> (\`${newMember.user.tag}\`)\n**Prethodni nadimak:** \`${oldMember.nickname || 'Nema nadimka'}\`\n**Novi nadimak:** \`${newMember.nickname || 'Nema nadimka'}\``)
      .setTimestamp();
    sendLog(guild, 'NICKNAME-CHANGED', embed);
  }

  const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
  const newTimeout = newMember.communicationDisabledUntilTimestamp;

  if (oldTimeout !== newTimeout && newTimeout && newTimeout > Date.now()) {
    const embed = new EmbedBuilder()
      .setTitle('⏳ Korisnik Mutiran (Timeout)')
      .setColor('#ff3b30')
      .setDescription(`Korisnik: <@${newMember.id}> (\`${newMember.user.tag}\`)\n**Ućutkan do:** <t:${Math.floor(newTimeout / 1000)}:F>`)
      .setTimestamp();
    sendLog(guild, 'TIMEOUT', embed);
  }
});

// 14. MESSAGE-EDITED
client.on('messageUpdate', (oldMessage, newMessage) => {
  if (newMessage.author?.bot) return;
  if (!newMessage.guild) return;
  if (oldMessage.content === newMessage.content) return;

  const embed = new EmbedBuilder()
    .setTitle('📝 Poruka Izmenjena')
    .setColor('#ffaa00')
    .setDescription(`Korisnik: <@${newMessage.author.id}> u kanalu <#${newMessage.channel.id}>`)
    .addFields(
      { name: 'Stara poruka', value: oldMessage.content || '*(Nema teksta/slika)*' },
      { name: 'Nova poruka', value: newMessage.content || '*(Nema teksta/slika)*' }
    )
    .setTimestamp();
  sendLog(newMessage.guild, 'MESSAGE-EDITED', embed);
});

// 15. MESSAGE-DELETED
client.on('messageDelete', message => {
  if (message.author?.bot) return;
  if (!message.guild) return;

  const embed = new EmbedBuilder()
    .setTitle('🗑️ Poruka Obrisana')
    .setColor('#ff3b30')
    .setDescription(`Autor: <@${message.author?.id || 'Nepoznat'}> u kanalu <#${message.channel.id}>`)
    .addFields(
      { name: 'Sadržaj', value: message.content || '*(Nema teksta ili je poruka bila iz brisanog kanala/stara)*' }
    )
    .setTimestamp();
  sendLog(message.guild, 'MESSAGE-DELETED', embed);
});

// 16. MEMBER-JOINED
client.on('guildMemberAdd', member => {
  const embed = new EmbedBuilder()
    .setTitle('📥 Korisnik se pridružio')
    .setColor('#00ff88')
    .setDescription(`Dobrodošao/la <@${member.id}> (\`${member.user.tag}\`)! Nalog kreiran: <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`)
    .setTimestamp();
  sendLog(member.guild, 'MEMBER-JOINED', embed);
});

// 17. & 28. MEMBER-LEFT / MEMBER-KICKED
client.on('guildMemberRemove', async member => {
  const guild = member.guild;
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const fetchedLogs = await guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberKick,
    });
    const kickLog = fetchedLogs.entries.first();

    if (kickLog && kickLog.target.id === member.id && kickLog.createdAt > Date.now() - 5000) {
      const embed = new EmbedBuilder()
        .setTitle('👟 Korisnik Izbačen (Kick)')
        .setColor('#ff3b30')
        .setDescription(`Korisnik: <@${member.id}> (\`${member.user.tag}\`)\n**Izbacio:** <@${kickLog.executor.id}>\n**Razlog:** \`${kickLog.reason || 'Nema razloga'}\``)
        .setTimestamp();
      sendLog(guild, 'MEMBER-KICKED', embed);
      return;
    }
  } catch (err) {
    console.error('Greška pri proveri kick audit loga:', err);
  }

  const embed = new EmbedBuilder()
    .setTitle('📤 Korisnik je napustio server')
    .setColor('#ffaa00')
    .setDescription(`Korisnik: <@${member.id}> (\`${member.user.tag}\`)`)
    .setTimestamp();
  sendLog(guild, 'MEMBER-LEFT', embed);
});

// 19. SERVER-INVITES
client.on('inviteCreate', invite => {
  const embed = new EmbedBuilder()
    .setTitle('✉️ Pozivnica Kreirana')
    .setColor('#00ff88')
    .setDescription(`Pozivnicu kreirao: <@${invite.inviter.id}> (\`${invite.inviter.tag}\`)\n**Kod:** \`${invite.code}\` (Kanal: <#${invite.channelId}>)`)
    .setTimestamp();
  sendLog(invite.guild, 'SERVER-INVITES', embed);
});

// 20., 21., 22., 23., 24. & 25. VOICE STATES LOGS
client.on('voiceStateUpdate', async (oldState, newState) => {
  const guild = newState.guild;
  const member = newState.member;

  if (!oldState.channelId && newState.channelId) {
    const embed = new EmbedBuilder()
      .setTitle('🔊 Pristupio Voice Kanalu')
      .setColor('#00ff88')
      .setDescription(`Korisnik: <@${member.id}> ušao u voice kanal <#${newState.channelId}>`)
      .setTimestamp();
    sendLog(guild, 'MEMBER-JOINED-VOICE-CHANNEL', embed);
  } 
  
  else if (oldState.channelId && !newState.channelId) {
    let disconnectedByAdmin = false;
    try {
      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberDisconnect,
      });
      const disconnectLog = fetchedLogs.entries.first();
      if (disconnectLog && disconnectLog.target.id === member.id && disconnectLog.createdAt > Date.now() - 3000) {
        disconnectedByAdmin = true;
        const embed = new EmbedBuilder()
          .setTitle('🔇 Diskonektovan iz Voice-a od strane Admina')
          .setColor('#ff3b30')
          .setDescription(`Korisnika <@${member.id}> je diskonektovao <@${disconnectLog.executor.id}> iz kanala \`${oldState.channel.name}\``)
          .setTimestamp();
        sendLog(guild, 'MEMBER-DISCONNECTED', embed);
      }
    } catch (e) {}

    if (!disconnectedByAdmin) {
      const embed = new EmbedBuilder()
        .setTitle('🔇 Napustio Voice Kanal')
        .setColor('#ffaa00')
        .setDescription(`Korisnik: <@${member.id}> napustio voice kanal \`${oldState.channel.name}\``)
        .setTimestamp();
      sendLog(guild, 'MEMBER-LEFT-VOICE-CHANNEL', embed);
    }
  } 
  
  else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
    let movedByAdmin = false;
    try {
      const fetchedLogs = await guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberMove,
      });
      const moveLog = fetchedLogs.entries.first();
      if (moveLog && moveLog.target.id === member.id && moveLog.createdAt > Date.now() - 3000) {
        movedByAdmin = true;
        const embed = new EmbedBuilder()
          .setTitle('🔀 Prebačen u Voice od strane Admina')
          .setColor('#ffaa00')
          .setDescription(`Korisnika <@${member.id}> je prebacio/la <@${moveLog.executor.id}>\n**Iz kanala:** \`${oldState.channel.name}\` ➔ **U kanal:** <#${newState.channelId}>`)
          .setTimestamp();
        sendLog(guild, 'MEMBER-MOVED-VOICE', embed);
      }
    } catch (e) {}

    if (!movedByAdmin) {
      const embed = new EmbedBuilder()
        .setTitle('🔄 Promenio Voice Kanal')
        .setColor('#0062ff')
        .setDescription(`Korisnik: <@${member.id}> promenio kanal\n**Iz kanala:** \`${oldState.channel.name}\` ➔ **U kanal:** <#${newState.channelId}>`)
        .setTimestamp();
      sendLog(guild, 'MEMBER-SWITCHED-VOICE', embed);
    }
  }

  const muteChanged = oldState.selfMute !== newState.selfMute || oldState.serverMute !== newState.serverMute;
  const deafChanged = oldState.selfDeaf !== newState.selfDeaf || oldState.serverDeaf !== newState.serverDeaf;

  if (muteChanged || deafChanged) {
    const embed = new EmbedBuilder()
      .setTitle('🎙️ Promena Statusa Mikrofona/Slušalica')
      .setColor('#7c8c9c')
      .setDescription(`Korisnik: <@${member.id}> u kanalu <#${newState.channelId || oldState.channelId}>\n\n` +
        `* **Self Mute:** ${newState.selfMute ? '✅' : '❌'}\n` +
        `* **Server Mute:** ${newState.serverMute ? '✅' : '❌'}\n` +
        `* **Self Deaf:** ${newState.selfDeaf ? '✅' : '❌'}\n` +
        `* **Server Deaf:** ${newState.serverDeaf ? '✅' : '❌'}`
      )
      .setTimestamp();
    sendLog(guild, 'MUTE-DEAFEN', embed);
  }
});

// 29. MEMBER-BANNED
client.on('guildBanAdd', ban => {
  const embed = new EmbedBuilder()
    .setTitle('🔨 Korisnik Banovan')
    .setColor('#ff3b30')
    .setDescription(`Korisnik: <@${ban.user.id}> (\`${ban.user.tag}\`)\n**Razlog:** \`${ban.reason || 'Nema razloga'}\``)
    .setTimestamp();
  sendLog(ban.guild, 'MEMBER-BANNED', embed);
});

// 30. MEMBER-UNBANNED
client.on('guildBanRemove', ban => {
  const embed = new EmbedBuilder()
    .setTitle('🔓 Korisnik Unbanovan')
    .setColor('#00ff88')
    .setDescription(`Korisnik: <@${ban.user.id}> (\`${ban.user.tag}\`)`)
    .setTimestamp();
  sendLog(ban.guild, 'MEMBER-UNBANNED', embed);
});

// Povezivanje na Discord sa zaštitom od nevažećeg tokena
if (process.env.DISCORD_TOKEN) {
  client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.warn('⚠️ Nije moguće povezati Discord bota (nevažeći DISCORD_TOKEN):', err.message);
    console.warn('ℹ️ Express API server nastavlja sa radom na portu 5000 za web prijavu i shop.');
  });
} else {
  console.warn('⚠️ DISCORD_TOKEN nije postavljen u .env fajlu. Express API server nastavlja rad.');
}

/* ==========================================================
   EXPRESS INTEGRATION API SERVER (PORT 5000)
   ========================================================== */
const app = express();
app.use(cors());
app.use(express.json());

// Logovanje dolaznih API zahteva radi lakše dijagnostike i otklanjanja grešaka
app.use((req, res, next) => {
  console.log(`[API REQUEST] ${req.method} ${req.url}`);
  next();
});

// Pomocna funkcija za dinamičko računanje Buff163 cene uživo za skinove (koeficijent * 130)
function calculateLivePrice(skin) {
  if (skin.type === 'GiftCard') {
    return {
      price: skin.price || 1300,
      estPrice: skin.estPrice || '$10.00'
    };
  }

  const normalizeCondition = (cond) => {
    if (!cond) return 'Field-Tested';
    const upper = cond.toUpperCase();
    if (upper === 'FN' || upper === 'FACTORY NEW') return 'Factory New';
    if (upper === 'MW' || upper === 'MINIMAL WEAR') return 'Minimal Wear';
    if (upper === 'FT' || upper === 'FIELD-TESTED') return 'Field-Tested';
    if (upper === 'WW' || upper === 'WELL-WORN') return 'Well-Worn';
    if (upper === 'BS' || upper === 'BATTLE-SCARRED') return 'Battle-Scarred';
    return cond;
  };

  const wear = normalizeCondition(skin.condition);
  const queryName = `${skin.name} (${wear})`;

  let item = buffPrices[queryName];
  
  // Rezervni mehanizam sa/bez ★ oznake
  if (!item) {
    if (queryName.startsWith('★ ')) {
      item = buffPrices[queryName.replace(/^★\s*/, '')];
    } else {
      item = buffPrices[`★ ${queryName}`];
    }
  }

  if (!item) {
    // Provera Doppler/Gamma Doppler faza
    const phaseMatch = queryName.match(/\((Phase \d|Ruby|Sapphire|Black Pearl|Emerald)\)/i);
    if (phaseMatch) {
      const phase = phaseMatch[1];
      const nameWithoutPhase = queryName.replace(` (${phase})`, '');
      const baseItem = buffPrices[nameWithoutPhase] || buffPrices[`★ ${nameWithoutPhase}`] || buffPrices[nameWithoutPhase.replace(/^★\s*/, '')];
      if (baseItem && baseItem.starting_at) {
        if (baseItem.starting_at.doppler && baseItem.starting_at.doppler[phase]) {
          item = { starting_at: { price: baseItem.starting_at.doppler[phase] } };
        } else {
          item = baseItem;
        }
      }
    }
  }

  if (item && item.starting_at) {
    const livePrice = item.starting_at.price;
    const livePoints = Math.round(livePrice * 130);
    return {
      price: livePoints,
      estPrice: `$${livePrice.toFixed(2)}`
    };
  }

  // Fallback cene ako nema na Buff163
  return {
    price: 1500,
    estPrice: '$10.00'
  };
}

// --- Discord OAuth2 Simulation Screen ---
app.get('/api/auth/discord/simulate', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="sr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Discord - Autorizacija</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #1e1f22; color: #dbdee1; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background-color: #313338; width: 100%; max-width: 480px; border-radius: 8px; padding: 32px; box-shadow: 0 8px 16px rgba(0,0,0,0.24); text-align: center; }
        .logo { font-size: 32px; color: #5865F2; margin-bottom: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .title { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #b5bac1; margin-bottom: 24px; }
        .form-group { text-align: left; margin-bottom: 16px; }
        label { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #b5bac1; margin-bottom: 8px; }
        input, select { width: 100%; padding: 10px; background-color: #1e1f22; border: 1px solid #1e1f22; border-radius: 4px; color: #dbdee1; font-size: 15px; outline: none; transition: border-color 0.2s; }
        input:focus, select:focus { border-color: #5865F2; }
        .permissions { border-top: 1px solid #3f4147; border-bottom: 1px solid #3f4147; padding: 16px 0; margin: 20px 0; text-align: left; }
        .permission-item { display: flex; align-items: center; gap: 10px; font-size: 14px; margin-bottom: 8px; }
        .permission-item svg { color: #23a55a; }
        .btn-group { display: flex; gap: 12px; margin-top: 24px; }
        button { flex: 1; padding: 12px; border: none; border-radius: 3px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background-color 0.2s; }
        .btn-primary { background-color: #5865F2; color: #fff; }
        .btn-primary:hover { background-color: #4752C4; }
        .btn-secondary { background-color: transparent; color: #fff; }
        .btn-secondary:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">
          <svg width="32" height="32" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.79-.58,1.56-1.21,2.29-1.86a75.52,75.52,0,0,0,73.4,0c.74.65,1.51,1.28,2.3,1.86a68.86,68.86,0,0,1-10.51,5,78.11,78.11,0,0,0,6.63,10.85,105.51,105.51,0,0,0,31.11-18.83C129,50.7,122.64,27.78,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg>
          <span>Discord</span>
        </div>
        <h2 class="title">Autorizacija naloga</h2>
        <p class="subtitle">Aplikacija <strong>SHARKWARD</strong> želi pristup tvom nalogu.</p>
        
        <form action="/api/auth/discord/callback" method="GET">
          <input type="hidden" name="code" value="mock_code_123">
          
          <div class="form-group">
            <label>Izaberi profil ili unesi korisničko ime</label>
            <input type="text" name="username" value="sharke_brat" required placeholder="Unesi Discord korisničko ime">
          </div>
          
          <div class="form-group">
            <label>Discord ID</label>
            <input type="text" name="id" value="12345678903" placeholder="Opciono: Discord ID">
          </div>
          
          <div class="form-group">
            <label>Član Discord Servera?</label>
            <select name="is_member">
              <option value="true">Da (Korisnik je član servera)</option>
              <option value="false">Ne (Korisnik nije član servera)</option>
            </select>
          </div>
          
          <div class="permissions">
            <div class="permission-item">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Pristup tvom korisničkom imenu i avataru</span>
            </div>
            <div class="permission-item">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>Uvid u servere na kojima se nalaziš</span>
            </div>
          </div>
          
          <div class="btn-group">
            <button type="button" class="btn-secondary" onclick="window.location.href='http://localhost:5173/watchtime?error=access_denied'">Otkaži</button>
            <button type="submit" class="btn-primary">Autorizuj</button>
          </div>
        </form>
      </div>
    </body>
    </html>
  `);
});

// --- Kick OAuth2 Simulation Screen ---
app.get('/api/auth/kick/simulate', (req, res) => {
  const discordId = req.query.discordId || '';
  const db = readDb();
  const user = db.users[discordId];
  const mockUsername = user ? user.username : 'sharke_fan';
  
  res.send(`
    <!DOCTYPE html>
    <html lang="sr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kick - Autorizacija</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        body { background-color: #0b0e11; color: #e1e6eb; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .card { background-color: #191b1f; width: 100%; max-width: 480px; border-radius: 12px; padding: 36px; border: 1px solid #53fc18; box-shadow: 0 0 20px rgba(83, 252, 24, 0.15); text-align: center; }
        .logo { font-size: 36px; font-weight: 900; color: #53fc18; margin-bottom: 24px; letter-spacing: -1px; }
        .title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #9aa4b0; margin-bottom: 24px; }
        .btn-group { display: flex; gap: 12px; margin-top: 28px; }
        button { flex: 1; padding: 14px; border: none; border-radius: 6px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-primary { background-color: #53fc18; color: #000; }
        .btn-primary:hover { background-color: #45d612; transform: translateY(-1px); }
        .btn-secondary { background-color: transparent; color: #9aa4b0; border: 1px solid #2d3139; }
        .btn-secondary:hover { background-color: rgba(255,255,255,0.03); color: #fff; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">KICK</div>
        <h2 class="title">Autorizuj Aplikaciju</h2>
        <p class="subtitle">Aplikacija <strong>SHARKWARD</strong> želi pristup tvom Kick nalogu (prijavljen kao <strong>@${mockUsername}</strong>).</p>
        
        <form action="/api/auth/kick/callback" method="GET">
          <input type="hidden" name="code" value="mock_kick_code_456">
          <input type="hidden" name="discordId" value="${discordId}">
          <input type="hidden" name="username" value="${mockUsername}">
          <input type="hidden" name="avatar" value="https://files.kick.com/images/user/79848252/profile_image/conversion/a113a884-7fab-4cc6-b6af-4e8a3e2f75d7-fullsize.webp">
          
          <div class="btn-group">
            <button type="button" class="btn-secondary" onclick="window.location.href='http://localhost:5173/watchtime?error=kick_cancelled'">Otkaži</button>
            <button type="submit" class="btn-primary">Poveži nalog</button>
          </div>
        </form>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/auth/discord/login', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID || '1525220477142827038';
  const redirectUri = encodeURIComponent('http://localhost:5000/api/auth/discord/callback');
  
  // Zapamti odakle je došao korisnik (GitHub Pages ili localhost)
  const clientOrigin = req.query.origin || req.headers.referer || 'https://hitmantmr.github.io/Sharkward';
  const state = encodeURIComponent(clientOrigin);
  
  const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify&state=${state}`;
  res.redirect(discordUrl);
});

app.get('/api/auth/discord/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Odredi ciljnu frontend adresu (npr. https://hitmantmr.github.io/Sharkward ili http://localhost:5173)
  let frontendOrigin = 'https://hitmantmr.github.io/Sharkward';
  if (state) {
    try {
      let decodedState = decodeURIComponent(state).replace(/\/$/, '');
      const validTabs = ['watchtime', 'shop', 'giveaway', 'leaderboard', 'admin', 'home'];
      validTabs.forEach(tab => {
        if (decodedState.toLowerCase().endsWith(`/${tab}`)) {
          decodedState = decodedState.slice(0, -`/${tab}`.length);
        }
      });
      if (decodedState.startsWith('http://') || decodedState.startsWith('https://')) {
        frontendOrigin = decodedState;
      }
    } catch (e) {
      // Ignoriši grešku pri dekodiranju
    }
  }

  if (!code) {
    return res.redirect(`${frontendOrigin}/watchtime?error=no_code`);
  }
  
  try {
    const clientId = process.env.DISCORD_CLIENT_ID || '1525220477142827038';
    const clientSecret = process.env.DISCORD_CLIENT_SECRET || 'BnvzjKtKeA7EoaA86ZauIQn9Cs_TGG1a';
    const redirectUri = 'http://localhost:5000/api/auth/discord/callback';
    
    const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.warn('⚠️ Greška pri razmeni tokena sa Discord-om:', errText);
      return res.redirect(`${frontendOrigin}/watchtime?error=token_exchange_failed`);
    }
    
    const tokenData = await tokenResponse.json();
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      return res.redirect(`${frontendOrigin}/watchtime?error=user_fetch_failed`);
    }
    
    const userData = await userResponse.json();
    const db = readDb();
    if (!db.users[userData.id]) {
      db.users[userData.id] = {
        username: userData.username,
        points: 0,
        hoursWatched: 0,
        linkedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    
    const userDbEntry = db.users[userData.id];
    const avatarUrl = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : '';
    
    const kickUserParam = userDbEntry.kickUsername ? `&kick_user=${encodeURIComponent(userDbEntry.kickUsername)}` : '';
    const kickIdParam = userDbEntry.kickId ? `&kick_id=${encodeURIComponent(userDbEntry.kickId)}` : '';
    const kickAvatarParam = userDbEntry.kickAvatar ? `&kick_avatar=${encodeURIComponent(userDbEntry.kickAvatar)}` : '';
    const pointsParam = `&points=${userDbEntry.points || 0}`;
    const hoursParam = `&hours=${userDbEntry.hoursWatched || 0}`;

    res.redirect(`${frontendOrigin}/watchtime?discord_user=${userData.username}&discord_id=${userData.id}&avatar=${avatarUrl}${kickUserParam}${kickIdParam}${kickAvatarParam}${pointsParam}${hoursParam}`);
  } catch (err) {
    console.error('Error during Discord login:', err.message);
    res.redirect(`${frontendOrigin}/watchtime?error=server_error`);
  }
});

const crypto = require('crypto');

function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

app.get('/api/auth/kick/login', (req, res) => {
  const discordId = req.query.discordId;
  const clientOrigin = req.query.origin || req.headers.referer || 'https://hitmantmr.github.io/Sharkward';

  if (!discordId) {
    return res.redirect(`${clientOrigin}/watchtime?error=missing_discord`);
  }

  const clientId = process.env.KICK_CLIENT_ID || '01KX73WN1QMYEY1DWB44R79539';
  const redirectUri = encodeURIComponent('http://localhost:5000/api/auth/kick/callback');
  
  // Generiši PKCE za Kick OAuth 2.1
  const pkce = generatePKCE();
  app.locals.pkce = app.locals.pkce || {};
  app.locals.pkce[discordId] = pkce.verifier;
  
  // Kombinujemo discordId i origin u state parametar
  const statePayload = `${discordId}___${encodeURIComponent(clientOrigin)}`;
  const kickUrl = `https://id.kick.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:read&state=${statePayload}&code_challenge=${pkce.challenge}&code_challenge_method=S256`;
  return res.redirect(kickUrl);
});

app.get('/api/auth/kick/callback', async (req, res) => {
  const { code, username, avatar, discordId, state } = req.query;
  
  let resolvedDiscordId = discordId;
  let frontendOrigin = 'https://hitmantmr.github.io/Sharkward';

  if (state && state.includes('___')) {
    const parts = state.split('___');
    resolvedDiscordId = parts[0];
    try {
      const decodedOrigin = decodeURIComponent(parts[1]).replace(/\/$/, '');
      const validTabs = ['watchtime', 'shop', 'giveaway', 'leaderboard', 'admin', 'home'];
      let cleanOrigin = decodedOrigin;
      validTabs.forEach(tab => {
        if (cleanOrigin.toLowerCase().endsWith(`/${tab}`)) {
          cleanOrigin = cleanOrigin.slice(0, -`/${tab}`.length);
        }
      });
      if (cleanOrigin.startsWith('http://') || cleanOrigin.startsWith('https://')) {
        frontendOrigin = cleanOrigin;
      }
    } catch (e) {}
  } else if (state) {
    resolvedDiscordId = state;
  }
  
  if (!resolvedDiscordId) {
    return res.redirect(`${frontendOrigin}/watchtime?error=missing_discord`);
  }
  
  let realUsername = username || '';
  let realAvatar = avatar || '';
  let kickUserId = '';
  
  if (code) {
    try {
      const clientId = process.env.KICK_CLIENT_ID || '01KX73WN1QMYEY1DWB44R79539';
      const clientSecret = process.env.KICK_CLIENT_SECRET;
      const redirectUri = 'http://localhost:5000/api/auth/kick/callback';
      const verifier = app.locals.pkce?.[resolvedDiscordId];

      console.log(`🔑 [REAL KICK OAuth] Razmena koda za token. Verifier: ${verifier}`);
      
      const tokenResponse = await fetch('https://id.kick.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret || '',
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code_verifier: verifier || '',
        })
      });
      
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('✅ Kick Token primljen!');
        
        const userRes = await fetch('https://api.kick.com/public/v1/users', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });
        
        if (userRes.ok) {
          const userResult = await userRes.json();
          const userData = userResult.data?.[0] || userResult.data || userResult;
          realUsername = userData.username || userData.name || userData.slug || '';
          realAvatar = userData.profile_picture || userData.avatar || '';
          kickUserId = userData.user_id || userData.id ? String(userData.user_id || userData.id) : '';
        } else {
          console.warn('⚠️ Kick user info fetch failed');
          return res.redirect(`${frontendOrigin}/watchtime?error=kick_user_fetch_failed`);
        }
      } else {
        const errorText = await tokenResponse.text();
        console.warn('⚠️ Kick Token exchange failed:', errorText);
        return res.redirect(`${frontendOrigin}/watchtime?error=kick_token_failed`);
      }
    } catch (err) {
      console.warn('⚠️ Real Kick OAuth error:', err.message);
      return res.redirect(`${frontendOrigin}/watchtime?error=kick_oauth_failed`);
    }
  }

  if (!realUsername) {
    return res.redirect(`${frontendOrigin}/watchtime?error=kick_username_required`);
  }
  
  const db = readDb();
  
  // Provera da li je ovaj Kick nalog već povezan na nekog drugog Discord korisnika
  const alreadyLinkedUser = Object.entries(db.users).find(([discId, u]) => 
    discId !== resolvedDiscordId && u.kickUsername?.toLowerCase() === realUsername.toLowerCase()
  );
  if (alreadyLinkedUser) {
    console.warn(`⚠️ [KICK LINK] Pokušaj povezivanja već povezanog Kick naloga @${realUsername} na Discord ID ${resolvedDiscordId}`);
    return res.redirect(`${frontendOrigin}/watchtime?error=kick_already_linked&kick_user=${encodeURIComponent(realUsername)}`);
  }

  let user = db.users[resolvedDiscordId];
  if (!user) {
    // Ako korisnik nije u bazi, kreiramo ga automatski
    user = {
      username: 'sharke_brat',
      points: 250,
      hoursWatched: 0,
      linkedAt: new Date().toISOString()
    };
    db.users[resolvedDiscordId] = user;
  }
  
  const wasKickLinked = !!user.kickUsername;
  user.kickUsername = realUsername;
  user.kickAvatar = realAvatar;
  user.kickId = kickUserId;
  
  if (!wasKickLinked) {
    user.points = (user.points || 0) + 250;
  }
  user.linkedAt = new Date().toISOString();
  writeDb(db);
  
  const guild = client.guilds.cache.first();
  if (guild) {
    try {
      const guildMember = await guild.members.fetch(resolvedDiscordId).catch(() => null);
      if (guildMember) {
        await guildMember.roles.add('1525282770836918474').catch(() => null);
      }
    } catch (err) {}
  }
  
  res.redirect(`${frontendOrigin}/watchtime?success=kick_linked&kick_user=${encodeURIComponent(realUsername)}&kick_id=${kickUserId}&kick_avatar=${encodeURIComponent(realAvatar)}&points=${user.points || 0}&hours=${user.hoursWatched || 0}`);
});

// 1. GET /api/stats -> Globalne statistike
app.get('/api/stats', (req, res) => {
  const data = readDb();
  const isLive = (data.liveState?.kick?.isLive) || (data.liveState?.youtube?.isLive) || false;
  res.json({
    youtube: data.stats?.youtube || 264000,
    tiktok: data.stats?.tiktok || 146100,
    kick: data.stats?.kick || 6310,
    registered: 91 + Object.keys(data.users || {}).length,
    isLive: isLive
  });
});

// 2. GET /api/leaderboard -> Rang lista
app.get('/api/leaderboard', (req, res) => {
  const data = readDb();
  const sorted = Object.entries(data.users || {})
    .filter(([id, u]) => u.kickUsername && !id.startsWith('1234567890'))
    .map(([id, u]) => ({
      username: u.username,
      kickUsername: u.kickUsername,
      kickAvatar: u.kickAvatar || '',
      hours: Math.round((u.hoursWatched || 0) * 10) / 10,
      points: u.points || 0
    }))
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ rank: i + 1, ...u }));
  res.json(sorted);
});

// 3. POST /api/link-code/generate -> Generisanje koda za Discord povezivanje
app.post('/api/link-code/generate', (req, res) => {
  const data = readDb();
  if (!data.linkingCodes) data.linkingCodes = {};
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  data.linkingCodes[code] = {
    status: 'pending',
    discordId: null,
    username: null,
    expiresAt: Date.now() + 10 * 60 * 1000 // Traje 10 minuta
  };
  writeDb(data);
  res.json({ code });
});

// 4. GET /api/link-code/status/:code -> Polling status koda
app.get('/api/link-code/status/:code', (req, res) => {
  const data = readDb();
  const entry = data.linkingCodes?.[req.params.code];
  if (!entry) {
    return res.status(404).json({ error: 'Kod nije pronađen.' });
  }
  if (Date.now() > entry.expiresAt) {
    return res.json({ status: 'expired' });
  }
  res.json(entry);
});

// 4.5 GET /api/admin/skin-price -> Pronalaženje Buff163 cene za skin
app.get('/api/admin/skin-price', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  // Pazi na Doppler / Gamma Doppler phase logic!
  let item = buffPrices[name];

  // Fallback 1: Provera sa ili bez ★ zvezdice (potrebno za Rukavice i Noževe koji imaju ★ na Buff163)
  if (!item) {
    if (name.startsWith('★ ')) {
      item = buffPrices[name.replace(/^★\s*/, '')];
    } else {
      item = buffPrices[`★ ${name}`];
    }
  }

  // Fallback 2: Doppler / Gamma Doppler sa fazama
  if (!item) {
    const phaseMatch = name.match(/\((Phase \d|Ruby|Sapphire|Black Pearl|Emerald)\)/i);
    if (phaseMatch) {
      const phase = phaseMatch[1];
      const nameWithoutPhase = name.replace(` (${phase})`, '');
      const baseItem = buffPrices[nameWithoutPhase] || buffPrices[`★ ${nameWithoutPhase}`] || buffPrices[nameWithoutPhase.replace(/^★\s*/, '')];
      if (baseItem && baseItem.starting_at) {
        if (baseItem.starting_at.doppler && baseItem.starting_at.doppler[phase]) {
          return res.json({ price: baseItem.starting_at.doppler[phase] });
        }
        return res.json({ price: baseItem.starting_at.price });
      }
    }
  }

  if (item && item.starting_at) {
    return res.json({ price: item.starting_at.price });
  }

  res.json({ price: null });
});

// 4.6 GET /api/skins -> Učitavanje skinova sa dinamički obračunatim Buff163 cenama uživo
app.get('/api/skins', (req, res) => {
  const data = readDb();
  const rawSkins = data.skins || initialSkins;
  const processedSkins = rawSkins.map(skin => {
    const p = calculateLivePrice(skin);
    return { ...skin, price: p.price, estPrice: p.estPrice };
  });
  res.json(processedSkins);
});

// 5. POST /api/link-kick -> Povezivanje Kick naloga
app.post('/api/link-kick', async (req, res) => {
  const { discordId, kickUsername } = req.body;
  const data = readDb();
  if (!data.users[discordId]) {
    return res.status(404).json({ error: 'Korisnik nije pronađen. Prvo poveži Discord.' });
  }
  
  // Provera da li je Kick nalog već povezan na nekog drugog
  const alreadyLinked = Object.values(data.users).some(u => u.kickUsername?.toLowerCase() === kickUsername.toLowerCase());
  if (alreadyLinked) {
    return res.status(400).json({ error: 'Ovaj Kick nalog je već povezan sa drugim Discord profilom.' });
  }

  // Ako ID nije simulirani, radimo pravu proveru članstva na Discord serveru
  if (discordId && !discordId.startsWith('mock_')) {
    let isMember = false;
    let guildMember = null;
    const guild = client.guilds.cache.first();
    if (guild) {
      try {
        guildMember = await guild.members.fetch(discordId);
        if (guildMember) isMember = true;
      } catch (err) {
        console.warn('Korisnik nije član servera:', err.message);
      }
    }
    
    if (!isMember) {
      return res.status(400).json({ error: 'Moraš biti član našeg Discord servera da bi uspešno povezao Kick nalog!' });
    }

    // Dodela uloge na Discordu (Role ID: 1525282770836918474)
    if (guild && guildMember) {
      try {
        await guildMember.roles.add('1525282770836918474');
      } catch (err) {
        console.warn('Greška pri dodeli uloge:', err.message);
      }
    }

    // Slanje log obaveštenja u kanal #kick-povezivanje
    if (guild) {
      try {
        const logChannel = guild.channels.cache.find(c => c.name === 'kick-povezivanje');
        if (logChannel) {
          const embed = new EmbedBuilder()
            .setTitle('🚀 Kick Nalog Povezan')
            .setColor('#53fc18')
            .setDescription(`Korisnik <@${discordId}> je uspešno povezao svoj Kick nalog **${kickUsername}**!\nDobio je ulogu **Povezan Kick**.`);
          await logChannel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.warn('Greška pri slanju obaveštenja u log kanal:', err.message);
      }
    }
  }

  const user = data.users[discordId];
  const wasKickLinked = !!user.kickUsername;
  user.kickUsername = kickUsername;
  
  // Daj 250 poena bonusa ako se prvi put povezuje
  if (!wasKickLinked) {
    user.points = (user.points || 0) + 250;
  }
  
  user.linkedAt = new Date().toISOString();
  writeDb(data);
  res.json({ success: true, user });
});

// 6. POST /api/unlink-kick -> Odjavljivanje Kick naloga
app.post('/api/unlink-kick', (req, res) => {
  const { discordId } = req.body;
  const data = readDb();
  if (data.users?.[discordId]) {
    data.users[discordId].kickUsername = null;
    writeDb(data);
    return res.json({ success: true, user: data.users[discordId] });
  }
  res.status(404).json({ error: 'Korisnik nije pronađen.' });
});

// 7. GET /api/user/:discordId -> Dobavljanje profila korisnika
app.get('/api/user/:discordId', (req, res) => {
  const data = readDb();
  const user = data.users?.[req.params.discordId];
  if (!user) {
    return res.status(404).json({ error: 'Korisnik nije pronađen.' });
  }
  res.json(user);
});

// 9. POST /api/buy-skin -> Kupovina skina iz prodavnice (dinamički obračunate cene na serveru)
app.post('/api/buy-skin', (req, res) => {
  const { discordId, skinId } = req.body;
  const data = readDb();
  const user = data.users?.[discordId];
  if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen.' });
  
  const skin = (data.skins || initialSkins).find(s => s.id === skinId);
  if (!skin) return res.status(404).json({ error: 'Skin nije pronađen.' });
  
  if (skin.status === 'sold') {
    return res.status(400).json({ error: 'Ovaj skin je već rasprodat.' });
  }
  if (!user.kickUsername) {
    return res.status(400).json({ error: 'Moraš povezati i Kick nalog da bi kupovao!' });
  }

  // Dinamičko računanje cene na serveru u sekundi kupovine
  const livePriceInfo = calculateLivePrice(skin);
  
  if (user.points < livePriceInfo.price) {
    return res.status(400).json({ error: 'Nemaš dovoljno poena za ovaj skin!' });
  }
  
  user.points -= livePriceInfo.price;
  skin.status = 'sold';
  writeDb(data);
  
  // Vratimo skinove sa cenama za korisnički prikaz
  const processedSkins = (data.skins || initialSkins).map(s => {
    const p = calculateLivePrice(s);
    return { ...s, price: p.price, estPrice: p.estPrice };
  });
  
  res.json({ success: true, user, skins: processedSkins });
});

// 10. GET /api/giveaways -> Svi giveaway-i
app.get('/api/giveaways', (req, res) => {
  const data = readDb();
  res.json(data.giveaways || []);
});

// 10b. POST /api/update-giveaways -> Ažuriranje giveaway-a iz bookmarklet skripte
app.post('/api/update-giveaways', (req, res) => {
  const token = req.headers['x-giveaways-token'];
  const expectedToken = process.env.GIVEAWAYS_SYNC_TOKEN || 'arsa-giveaways-secret-key-2026';
  
  if (token !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const list = req.body;
  if (!Array.isArray(list)) {
    return res.status(400).json({ error: 'Nevažeći format podataka (očekuje se niz).' });
  }

  const data = readDb();
  if (!data.giveaways) data.giveaways = [];

  // 1. Brišemo sve stare aktivne nagradne igre (da izbegnemo dupliranje)
  data.giveaways = data.giveaways.filter(gw => gw.status !== 'ACTIVE' && gw.status !== 'active');

  // 2. Upisujemo primljene podatke prema tačnoj specifikaciji šeme
  list.forEach(gw => {
    const formatted = {
      id: gw.id,
      prize: gw.prize,
      value: gw.value,
      minDeposit: gw.minDeposit,
      ticketCost: Number(gw.ticketCost) || 0,
      availableFrom: gw.availableFrom,
      status: gw.status.toUpperCase(), // ACTIVE ili COMPLETED
      imageUrl: gw.imageUrl,
      winnerName: gw.winnerName || null,
      winnerAvatar: gw.winnerAvatar || null,
      wonAt: gw.wonAt || null
    };

    // Ako je COMPLETED, proveravamo da li već postoji u bazi da ga prepišemo, inače ga dodajemo
    if (formatted.status === 'COMPLETED') {
      const existingIdx = data.giveaways.findIndex(g => g.id === formatted.id);
      if (existingIdx !== -1) {
        data.giveaways[existingIdx] = formatted;
      } else {
        data.giveaways.push(formatted);
      }
    } else {
      // Aktivne samo ubacujemo
      data.giveaways.push(formatted);
    }
  });

  writeDb(data);
  res.json({ success: true, count: list.length });
});

// 10c. POST /api/admin/clear-giveaways -> Brisanje svih giveaway-a sa servera
app.post('/api/admin/clear-giveaways', (req, res) => {
  const token = req.headers['x-giveaways-token'];
  const expectedToken = process.env.GIVEAWAYS_SYNC_TOKEN || 'sharke-sync-token-2026';
  
  if (token !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const data = readDb();
  data.giveaways = [];
  writeDb(data);
  res.json({ success: true, message: 'Sve nagradne igre su uspešno obrisane sa servera.' });
});

// 11. POST /api/enter-giveaway -> Prijava na giveaway
app.post('/api/enter-giveaway', (req, res) => {
  const { discordId, giveawayId } = req.body;
  const data = readDb();
  const user = data.users?.[discordId];
  if (!user) return res.status(404).json({ error: 'Korisnik nije pronađen.' });
  
  if (!user.kickUsername) {
    return res.status(400).json({ error: 'Moraš povezati i Kick nalog da bi ušao!' });
  }

  const gw = data.giveaways?.find(g => g.id === giveawayId);
  if (!gw) return res.status(404).json({ error: 'Giveaway nije pronađen.' });
  
  if (!gw.participants) gw.participants = [];
  if (gw.participants.includes(discordId)) {
    return res.status(400).json({ error: 'Već učestvuješ u ovom giveaway-u!' });
  }
  
  gw.participants.push(discordId);
  gw.participantsCount = (gw.participantsCount || 0) + 1;
  writeDb(data);
  res.json({ success: true, giveaways: data.giveaways });
});

// 12. Admin Endpoints
app.post('/api/admin/skins/add', (req, res) => {
  const data = readDb();
  const newSkin = {
    ...req.body,
    id: Date.now().toString(),
    status: 'available'
  };
  if (!data.skins) data.skins = [];
  data.skins.unshift(newSkin);
  writeDb(data);
  res.json({ success: true, skins: data.skins });
});

app.post('/api/admin/skins/delete', (req, res) => {
  const { skinId } = req.body;
  const data = readDb();
  data.skins = data.skins?.filter(s => s.id !== skinId) || [];
  writeDb(data);
  res.json({ success: true, skins: data.skins });
});

app.post('/api/admin/skins/restock', (req, res) => {
  const { skinId } = req.body;
  const data = readDb();
  data.skins = data.skins?.map(s => s.id === skinId ? { ...s, status: 'available' } : s) || [];
  writeDb(data);
  res.json({ success: true, skins: data.skins });
});

app.post('/api/admin/giveaways/add', (req, res) => {
  const data = readDb();
  const newGw = {
    ...req.body,
    id: 'g' + Date.now().toString(),
    endTime: Date.now() + 1000 * 60 * 60 * parseInt(req.body.hoursLength || 24),
    participantsCount: Math.floor(Math.random() * 20 + 5),
    participants: [],
    status: 'active'
  };
  if (!data.giveaways) data.giveaways = [];
  data.giveaways.unshift(newGw);
  writeDb(data);
  res.json({ success: true, giveaways: data.giveaways });
});

app.post('/api/admin/giveaways/end', (req, res) => {
  const { giveawayId } = req.body;
  const data = readDb();
  const gw = data.giveaways?.find(g => g.id === giveawayId);
  if (!gw) return res.status(404).json({ error: 'Giveaway nije pronađen.' });
  
  let winner = 'Nema učesnika';
  if (gw.participants && gw.participants.length > 0) {
    const winnerId = gw.participants[Math.floor(Math.random() * gw.participants.length)];
    const winnerUser = data.users[winnerId];
    winner = winnerUser ? winnerUser.kickUsername || winnerUser.username : 'Nepoznat';
  } else {
    const winnerNames = ['Stefan_BG', 'GigaMega_Kick', 'milosh_99', 'zoki_kick', 'kiza_csgo'];
    winner = winnerNames[Math.floor(Math.random() * winnerNames.length)];
  }
  
  gw.status = 'completed';
  gw.winner = winner;
  gw.endedAt = 'Upravo sad';
  writeDb(data);
  res.json({ success: true, giveaways: data.giveaways });
});

// GET /api/admin/users -> Lista svih korisnika i permisija
app.get('/api/admin/users', (req, res) => {
  const data = readDb();
  const list = Object.entries(data.users || {})
    .filter(([id, u]) => u.kickUsername)
    .map(([id, u]) => ({
      discordId: id,
      username: u.username || 'Neko',
      kickUsername: u.kickUsername,
      kickAvatar: u.kickAvatar || '',
      points: u.points || 0,
      hoursWatched: Math.round((u.hoursWatched || 0) * 10) / 10,
      role: u.role || (id === '436295751543554050' ? 'Admin' : 'Korisnik'),
      linkedAt: u.linkedAt || null
    }));
  res.json(list);
});

// POST /api/admin/points/modify -> Dodavanje ili oduzimanje poena
app.post('/api/admin/points/modify', (req, res) => {
  const { discordId, amount } = req.body;
  const data = readDb();
  if (data.users?.[discordId]) {
    data.users[discordId].points = Math.max(0, (data.users[discordId].points || 0) + parseInt(amount || 0, 10));
    writeDb(data);
    res.json({ success: true, user: data.users[discordId] });
  } else {
    res.status(404).json({ error: 'Korisnik nije pronađen.' });
  }
});

// POST /api/admin/users/role -> Izmena permisije korisnika (Admin / Moderator / Korisnik)
app.post('/api/admin/users/role', (req, res) => {
  const { discordId, role } = req.body;
  const data = readDb();
  if (data.users?.[discordId]) {
    data.users[discordId].role = role || 'Korisnik';
    writeDb(data);
    res.json({ success: true, user: data.users[discordId] });
  } else {
    res.status(404).json({ error: 'Korisnik nije pronađen.' });
  }
});

app.post('/api/admin/db/reset', (req, res) => {
  const data = {
    users: initialUsers,
    linkingCodes: {},
    stats: { youtube: 264000, tiktok: 146100, kick: 6310, registered: 91 },
    skins: initialSkins,
    giveaways: initialGiveaways
  };
  writeDb(data);
  res.json({ success: true, data });
});

// --- KICK CHAT & LOYALTY WS INTEGRACIJA ---
function isValidMessage(content) {
  if (!content) return false;
  // 1. Uklanjanje Kick custom emojija: [emoji:id:name]
  let cleaned = content.replace(/\[emoji:\d+:[^\]]+\]/g, '');
  // 2. Uklanjanje svega što nisu slova i brojevi u bilo kom pismu (uklanja sve emojije, simbole, interpunkciju, razmake)
  cleaned = cleaned.replace(/[^\p{L}\p{N}]/gu, '');
  // 3. Provera dužine (mora biti bar 2 slova/broja)
  return cleaned.length >= 2;
}

async function handleKickChatMessage(kickUsername, content) {
  try {
    const db = readDb();
    
    // 1. Proveriti da li je strim uživo (isLive == true)
    const isLive = db.liveState?.kick?.isLive || false;
    if (!isLive) return;

    // 2. Očistiti poruku i proveriti je kroz isValidMessage funkciju
    if (!isValidMessage(content)) return;

    // Pronađi korisnika sa ovim Kick imenom (case-insensitive)
    const userEntry = Object.entries(db.users).find(([discordId, u]) => 
      u.kickUsername?.toLowerCase() === kickUsername.toLowerCase()
    );
    if (!userEntry) return;

    const [discordId, user] = userEntry;
    const now = new Date();
    const tenMinutesMs = 10 * 60 * 1000;

    let lastReward = null;
    if (user.lastRewardAt) {
      lastReward = new Date(user.lastRewardAt);
    }

    // 3. Proveriti da li je prošlo 10 minuta od prethodne dodele poena
    if (!lastReward || (now - lastReward >= tenMinutesMs)) {
      // Ako jeste: upisati mu +10 poena u bazu, povećati mu vreme gledanja za +10 minuta i ažurirati vreme poslednje nagrade
      user.points = (user.points || 0) + 10;
      user.hoursWatched = parseFloat(((user.hoursWatched || 0) + (10 / 60)).toFixed(4));
      user.lastRewardAt = now.toISOString();

      writeDb(db);
      console.log(`💎 [LOYALTY] Korisnik @${kickUsername} (Discord: <@${discordId}>) je dobio +10 poena i +10m gledanja. Ukupno: ${user.points}`);
    }
  } catch (err) {
    console.warn('Greška pri obradi Kick chat poruke za loyalty poene:', err.message);
  }
}

async function handleKickSubscription(kickUsername) {
  try {
    const db = readDb();
    const userEntry = Object.entries(db.users).find(([discordId, u]) => 
      u.kickUsername?.toLowerCase() === kickUsername.toLowerCase()
    );
    if (!userEntry) return;

    const [discordId, user] = userEntry;
    // Čim se detektuje pretplata, server pronalazi korisnika po Kick imenu i dodaje mu 500 poena u bazu
    user.points = (user.points || 0) + 500;
    
    writeDb(db);
    console.log(`🎉 [SUB] Korisnik @${kickUsername} se pretplatio i dobio +500 poena!`);
  } catch (err) {
    console.warn('Greška pri obradi Kick pretplate:', err.message);
  }
}

async function handleKickGiftedSubscriptions(gifterUsername, giftedCount) {
  try {
    const db = readDb();
    const userEntry = Object.entries(db.users).find(([discordId, u]) => 
      u.kickUsername?.toLowerCase() === gifterUsername.toLowerCase()
    );
    if (!userEntry) return;

    const [discordId, user] = userEntry;
    const pointsToAdd = giftedCount * 500;
    // Čim se detektuje poklon, dodaje mu se: broj_poklonjenih_subova * 500 poena
    user.points = (user.points || 0) + pointsToAdd;

    writeDb(db);
    console.log(`🎁 [GIFT SUB] Korisnik @${gifterUsername} je poklonio ${giftedCount} subova i dobio +${pointsToAdd} poena!`);
  } catch (err) {
    console.warn('Greška pri obradi Kick giftovanih pretplata:', err.message);
  }
}

function connectToKickWS() {
  const chatroomId = '78375774'; // sharke's chatroom ID
  const pusherKey = '32cbd69e4b950bf97679'; // Kick's Pusher App Key
  const wsUrl = `wss://ws-us2.pusher.com/app/${pusherKey}?protocol=7&client=js&version=8.4.0-rc2&flash=false`;

  console.log('📡 Pokušavam povezivanje na Kick Pusher WebSocket...');
  const ws = new WebSocket(wsUrl);

  let pingInterval = null;

  ws.on('open', () => {
    console.log('✅ Kick Pusher WebSocket uspešno povezan!');
    
    // Pretplati se na chatroom kanal
    ws.send(JSON.stringify({
      event: 'pusher:subscribe',
      data: {
        auth: '',
        channel: `chatrooms.${chatroomId}.v2`
      }
    }));

    // Pusher ping-pong kako veza ne bi pukla (svaka 2 minuta)
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: 'pusher:ping', data: {} }));
      }
    }, 120000);
  });

  ws.on('message', async (dataStr) => {
    try {
      const msg = JSON.parse(dataStr);
      const eventName = msg.event;
      
      let eventData = msg.data;
      if (typeof eventData === 'string') {
        eventData = JSON.parse(eventData);
      }

      // Loguj svaki Kick Pusher događaj radi lakšeg praćenja i debugovanja
      if (eventName !== 'pusher:pong') {
        console.log(`💬 [KICK WS] Događaj: ${eventName}`, eventData);
      }

      if (eventName === 'App\\Events\\ChatMessageEvent') {
        const content = eventData.content;
        const kickUsername = eventData.sender?.username;
        if (content && kickUsername) {
          await handleKickChatMessage(kickUsername, content);
        }
      } 
      else if (eventName === 'App\\Events\\SubscriptionEvent') {
        const kickUsername = eventData.username || eventData.user?.username || eventData.subscriber?.username;
        if (kickUsername) {
          await handleKickSubscription(kickUsername);
        }
      } 
      else if (eventName === 'App\\Events\\GiftedSubscriptionsEvent' || eventName === 'App\\Events\\GiftsLeaderboardUpdated') {
        const gifterUsername = eventData.gifterUsername || eventData.gifter_username || eventData.gifter?.username || eventData.user?.username;
        const giftedCount = parseInt(eventData.giftedCount || eventData.gifted_count || eventData.gifts_count || (Array.isArray(eventData.subscriptions) ? eventData.subscriptions.length : 1), 10);
        if (gifterUsername && giftedCount > 0) {
          await handleKickGiftedSubscriptions(gifterUsername, giftedCount);
        }
      }
    } catch (err) {
      console.warn('Greška pri obradi Kick WebSocket poruke:', err.message);
    }
  });

  ws.on('error', (err) => {
    console.error('⚠️ Greška na Kick WebSocket-u:', err.message);
  });

  ws.on('close', () => {
    console.warn('⚠️ Kick WebSocket je zatvoren. Pokušavam ponovno povezivanje za 5 sekundi...');
    if (pingInterval) clearInterval(pingInterval);
    setTimeout(connectToKickWS, 5000);
  });
}

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`📡 API Server je pokrenut na http://localhost:${PORT}`);
});
