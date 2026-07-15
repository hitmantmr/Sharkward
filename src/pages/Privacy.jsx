import React from 'react';
import { ShieldCheck, Lock, CheckCircle, Home } from 'lucide-react';

const Privacy = ({ setActiveTab }) => {
  return (
    <div style={styles.container} className="reveal-on-scroll">
      <div style={styles.header}>
        <ShieldCheck size={36} color="var(--accent-cyan)" />
        <h1 style={styles.title}>Politika Privatnosti</h1>
        <p style={styles.subtitle}>Poslednji put ažurirano: 15. Jul 2026.</p>
      </div>

      <div style={styles.card} className="glass">
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Informacije koje Prikupljamo</h3>
          <p style={styles.text}>
            Kako bismo vam omogućili sakupljanje poena i nesmetano korišćenje prodavnice, prikupljamo samo najneophodnije javne informacije koje nam sami stavite na raspolaganje prilikom prijave:
          </p>
          <ul style={styles.list}>
            <li><strong>Discord Nalog:</strong> Prikupljamo vaš jedinstveni Discord ID, Discord korisničko ime i profilnu sliku radi prepoznavanja.</li>
            <li><strong>Kick Nalog:</strong> Kada povežete vaš Kick nalog, beležimo vaše Kick korisničko ime radi praćenja statusa gledanja strima.</li>
            <li><strong>Statistika Aktivnosti:</strong> Pratimo broj sati koje provedete gledajući Sharke strim dok ste ulogovani, kao i istoriju vaših preuzetih skinova u prodavnici.</li>
            <li><strong>Steam Trade URL:</strong> Ukoliko odlučite da ga sačuvate na vašem profilu, koristimo ga isključivo za slanje osvojenih skinova.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Svrha Korišćenja Podataka</h3>
          <p style={styles.text}>
            Vaše podatke koristimo isključivo u sledeće svrhe:
          </p>
          <ul style={styles.list}>
            <li>Kalkulacija i dodela poena za vernost (sati gledanja).</li>
            <li>Isporuka skinova i vaučera koje naručite u našem shopu.</li>
            <li>Zaštita platforme od zloupotreba, višestrukih naloga i botova.</li>
            <li>Obezbeđivanje stabilne tehničke podrške u slučaju problema sa poenima.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Bezbednost i Skladištenje Podataka</h3>
          <div style={styles.securityBox}>
            <Lock size={20} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            <p style={{ ...styles.text, margin: 0 }}>
              Svi vaši podaci se skladište u enkriptovanoj bazi podataka na našem sigurnom serveru. <strong>Nikada nećemo tražiti lozinku vašeg Discord, Kick ili Steam naloga.</strong> Povezivanje se vrši isključivo preko sigurnog Discord i Kick OAuth sistema.
            </p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>4. Deljenje Podataka sa Trećim Licima</h3>
          <p style={styles.text}>
            Mi cenimo vašu privatnost. Vaše podatke <strong>nikada ne delimo, ne prodajemo niti iznajmljujemo</strong> marketinškim agencijama ili trećim licima. Podaci se koriste isključivo unutar platforme SHARKAWARD.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>5. Prava Korisnika</h3>
          <p style={styles.text}>
            U svakom trenutku imate pravo da zahtevate uvid u podatke koje čuvamo o vama ili da zatražite potpuno brisanje vašeg profila i svih povezanih podataka iz naše baze podataka. Za ovakve zahteve se možete obratiti administraciji direktno na Discord serveru.
          </p>
        </div>
      </div>

      <div style={styles.btnRow}>
        <button 
          className="glow-btn-cyan"
          style={styles.backBtn}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} /> POVRATAK NA POČETNU
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
    fontSize: '2rem',
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
    lineHeight: '1.6',
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
