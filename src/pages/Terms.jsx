import React from 'react';
import { FileText, ShieldAlert, CheckCircle, Home } from 'lucide-react';

const Terms = ({ setActiveTab }) => {
  return (
    <div style={styles.container} className="reveal-on-scroll">
      <div style={styles.header}>
        <FileText size={36} color="var(--accent-cyan)" />
        <h1 style={styles.title}>Uslovi Korišćenja</h1>
        <p style={styles.subtitle}>Poslednji put ažurirano: 15. Jul 2026.</p>
      </div>

      <div style={styles.card} className="glass">
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Opšte Odredbe</h3>
          <p style={styles.text}>
            Dobrodošli na <strong>SHARKAWARD</strong>. Pristupanjem ovom sajtu, povezivanjem vašeg Discord i Kick naloga, i korišćenjem bilo kog dela naših usluga, potvrđujete da ste u potpunosti pročitali, razumeli i prihvatili ove Uslove Korišćenja. Ukoliko se ne slažete sa bilo kojim delom ovih uslova, molimo vas da odmah prestanete sa korišćenjem sajta.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Status Sajta i Virtuelni Poeni</h3>
          <p style={styles.text}>
            SHARKAWARD je zabavno-promotivni portal namenjen isključivo gledaocima i zajednici strimera Sharke. 
          </p>
          <ul style={styles.list}>
            <li>Poeni koje sakupljate gledanjem strima na Kick-u su isključivo virtuelni i <strong>nemaju nikakvu stvarnu novčanu vrednost</strong>.</li>
            <li>Poeni se ne mogu prodati, preneti na drugog korisnika niti zameniti za pravi novac.</li>
            <li>Zadržavamo pravo da u bilo kom trenutku izmenimo stopu sakupljanja poena, cene skinova u prodavnici ili resetujemo poene u slučaju tehničkih izmena ili zloupotreba.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Pravila Ponašanja i Zabrana Zloupotrebe</h3>
          <div style={styles.alertBox}>
            <ShieldAlert size={20} color="#eb4b4b" style={{ flexShrink: 0 }} />
            <p style={{ ...styles.text, margin: 0, color: '#ff8888' }}>
              <strong>Upozorenje:</strong> Svaki pokušaj manipulacije sistemom biće sankcionisan trajnim banom bez prava na isporuku skinova.
            </p>
          </div>
          <p style={styles.text}> Strogo je zabranjeno: </p>
          <ul style={styles.list}>
            <li>Korišćenje bilo kakvih botova, skripti, virtuelnih privatnih mreža (VPN), virtuelnih mašina ili emulatora za simulaciju prisustva na strimu i veštačko sakupljanje sati.</li>
            <li>Otvaranje i povezivanje više različitih naloga (multi-accounting) od strane jedne fizičke osobe.</li>
            <li>Eksploatisanje (iskorišćavanje) bilo kakvih sistemskih ili softverskih bagova radi neopravdanog sticanja poena.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>4. Skinovi, Vaučeri i Isporuka</h3>
          <p style={styles.text}>
            Preuzimanje artikala iz prodavnice vrši se isključivo putem sakupljenih virtuelnih poena.
          </p>
          <ul style={styles.list}>
            <li>Korisnik je dužan da obezbedi tačan i ispravan Steam Trade URL na svom profilu. Ukoliko je Trade URL neispravan ili je nalog korisnika zaključan (Steam Trade Ban/Escrow), isporuka neće biti moguća.</li>
            <li>Sve isporuke skinova vrše se ručno ili automatski u roku od 24-72 sata od trenutka naručivanja.</li>
            <li>Vaučeri za partnerske sajtove (poput CS2-Skins) isporučuju se u vidu digitalnih kodova koje možete iskoristiti na tim platformama.</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>5. Odricanje od Odgovornosti (Disclaimer)</h3>
          <p style={styles.text}>
            SHARKAWARD nije sponzorisan, podržan niti na bilo koji način povezan sa Valve Corporation, Steam-om, niti bilo kojim drugim brendom ili zaštitnim znakom u vlasništvu Valve-a. Sve slike skinova i igara pripadaju njihovim zvaničnim vlasnicima. Takođe nismo zvanično povezani sa platformama Kick ili Discord, već koristimo njihove javne interfejse (API) za proveru statusa korisnika.
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
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '1rem',
    borderRadius: '10px',
    backgroundColor: 'rgba(235, 75, 75, 0.08)',
    border: '1px solid rgba(235, 75, 75, 0.25)',
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

export default Terms;
