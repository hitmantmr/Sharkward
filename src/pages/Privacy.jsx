import React from 'react';
import { ShieldCheck, Lock, Home } from 'lucide-react';

const Privacy = ({ setActiveTab }) => {
  return (
    <div style={styles.container} className="reveal-on-scroll">
      <div style={styles.header}>
        <ShieldCheck size={36} color="var(--accent-cyan)" />
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last updated: July 2026</p>
      </div>

      <div style={styles.card} className="glass">
        
        {/* 1. Information We Collect */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Information We Collect</h3>
          <p style={styles.text}>
            We only collect the minimum necessary public information required to enable stream watchtime tracking, reward calculations, and store deliveries:
          </p>
          <ul style={styles.list}>
            <li><strong>Discord Account:</strong> We collect your public Discord ID, username, and avatar URL to authenticate your session and identity on the platform.</li>
            <li><strong>Kick Account:</strong> When you link your Kick account, we save your Kick username to track stream viewing status and duration.</li>
            <li><strong>Activity Statistics:</strong> We track your watchtime hours on the Sharke stream and the transaction logs of items you purchase in our store.</li>
            <li><strong>Steam Trade URL:</strong> If you input it on your profile, we save your Trade URL solely to facilitate the delivery of CS2 skins.</li>
          </ul>
        </div>

        {/* 2. How We Use Your Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. How We Use Your Information</h3>
          <p style={styles.text}>
            Your information is used strictly for the following purposes:
          </p>
          <ul style={styles.list}>
            <li>To calculate and award loyalty points based on your watchtime.</li>
            <li>To process and deliver CS2 skins and partner gift vouchers to your account.</li>
            <li>To prevent fraud, multiple account creation (multi-accounting), and bot manipulation.</li>
            <li>To provide customer support and troubleshoot points balance discrepancies.</li>
          </ul>
        </div>

        {/* 3. Security and Storage */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Security and Storage</h3>
          <div style={styles.securityBox}>
            <Lock size={20} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            <p style={{ ...styles.text, margin: 0 }}>
              All user data is stored securely in an encrypted database on our remote server. <strong>We will never request your Discord, Kick, or Steam passwords.</strong> All authentication and account linking is done securely using Discord and Kick OAuth APIs.
            </p>
          </div>
        </div>

        {/* 4. Data Sharing */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>4. Data Sharing</h3>
          <p style={styles.text}>
            We respect your privacy. We **never share, sell, or rent** your personal data to advertisers, marketing agencies, or any third parties. All collected data is processed strictly within the SHARKAWARD platform.
          </p>
        </div>

        {/* 5. User Rights */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>5. User Rights</h3>
          <p style={styles.text}>
            You have the right to request access to the data we store about you, or to request the complete deletion of your account and all associated data from our database at any time. To make such requests, please contact the site administrators directly on the official Discord server.
          </p>
        </div>

      </div>

      <div style={styles.btnRow}>
        <button 
          className="glow-btn-cyan"
          style={styles.backBtn}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} /> BACK TO HOME
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '850px',
    margin: '2rem auto',
    padding: '0 1rem',
    color: '#f8fafc',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '900',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    margin: 0,
  },
  card: {
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: 'var(--accent-cyan)',
    letterSpacing: '0.5px',
    margin: 0,
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '8px',
  },
  text: {
    fontSize: '0.9rem',
    lineHeight: '1.65',
    color: '#cbd5e1',
    margin: 0,
  },
  list: {
    margin: 0,
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    color: '#cbd5e1',
  },
  securityBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '1rem',
    borderRadius: '10px',
    backgroundColor: 'rgba(0, 240, 255, 0.04)',
    border: '1px solid rgba(0, 240, 255, 0.15)',
    margin: '8px 0',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: 'none',
    padding: '0.85rem 1.75rem',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '800',
    cursor: 'pointer',
  }
};

export default Privacy;
