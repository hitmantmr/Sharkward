import React from 'react';
import { FileText, ShieldAlert, Home, AlertTriangle } from 'lucide-react';

const Terms = ({ setActiveTab }) => {
  return (
    <div style={styles.container} className="reveal-on-scroll">
      <div style={styles.header}>
        <FileText size={36} color="var(--accent-cyan)" />
        <h1 style={styles.title}>Terms of Service</h1>
        <p style={styles.subtitle}>Last updated: July 2026</p>
      </div>

      <div style={styles.card} className="glass">
        
        {/* 1. Acceptance of Terms */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Acceptance of Terms</h3>
          <p style={styles.text}>
            By accessing and using SHARKAWARD ("we," "our," or "us"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            SHARKAWARD operates as an affiliate marketing and community loyalty platform that provides rewards, points, and information about online gaming and promotion sites. We do not operate any gambling or gaming services directly.
          </p>
        </div>

        {/* 2. Age Restrictions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Age Restrictions</h3>
          <p style={{ ...styles.text, fontWeight: '700', color: '#fff' }}>
            You must be at least 18 years old or the legal gambling age in your jurisdiction (whichever is higher) to use this website. By using our services, you represent and warrant that you meet these age requirements.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            We do not knowingly collect or solicit information from anyone under the legal gambling age. If we learn that we have collected personal information from a minor, we will delete that information as quickly as possible.
          </p>
        </div>

        {/* 3. Affiliate Disclosure */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Affiliate Disclosure</h3>
          <p style={styles.text}>
            SHARKAWARD participates in affiliate marketing programs. This means we may earn commissions or referral bonuses when you click on links to our partner gaming sites and sign up, enter promotional codes, or make deposits. These affiliate relationships do not affect the information we provide or our recommendations.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            All opinions and reviews expressed on this site are our own, based on publicly available information and our independent evaluation.
          </p>
        </div>

        {/* 4. Gambling Disclaimer */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>4. Gambling Disclaimer</h3>
          <p style={{ ...styles.text, fontWeight: '700', color: '#fff' }}>
            Gambling involves risk. You should only gamble with money you can afford to lose. Never chase your losses or gamble under the influence of alcohol or drugs.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            We are not responsible for any losses you may incur while gambling on third-party sites. The gambling sites featured on SHARKAWARD are independent entities, and we have no control over their operations, games, or policies.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            If you feel you may have a gambling problem, please seek help immediately. Resources include:
          </p>
          <ul style={styles.list}>
            <li>National Council on Problem Gambling: 1-800-522-4700</li>
            <li>Gamblers Anonymous: <a href="https://www.gamblersanonymous.org" target="_blank" rel="noopener noreferrer" style={styles.link}>www.gamblersanonymous.org</a></li>
            <li>BeGambleAware: <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" style={styles.link}>www.begambleaware.org</a></li>
          </ul>
        </div>

        {/* 5. No Warranty */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>5. No Warranty</h3>
          <p style={styles.text}>
            The services and information provided on SHARKAWARD are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the descriptions, information, or points balances are 100% error-free, uninterrupted, or accurate.
          </p>
        </div>

        {/* 6. Account Suspension & Termination */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>6. Account Termination</h3>
          <p style={styles.text}>
            We reserve the right to suspend or terminate any account that violates these Terms of Service or engages in fraudulent activity, including abuse of our rewards system. Termination may occur immediately and without prior notice at our sole discretion.
          </p>
        </div>

        {/* 7. Loyalty Points */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>7. Loyalty Points</h3>
          <p style={styles.text}>
            Loyalty points accumulated through watchtime or events have no cash value and cannot be exchanged for money. We reserve the right to modify, remove or expire loyalty points at any time. Fraudulent earning of points (including botting, scripts, or multiple accounts) will result in permanent account suspension and loss of all accumulated points.
          </p>
        </div>

        {/* 8. Rewards */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>8. Rewards</h3>
          <p style={styles.text}>
            Rewards, including CS2 skins and digital gift cards, are subject to availability. We reserve the right to substitute rewards with alternatives of equal or greater value in the event of stock shortages or Steam trading restrictions.
          </p>
        </div>

        {/* 9. Third Party Services */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>9. Third Party Services</h3>
          <p style={styles.text}>
            SHARKAWARD is not affiliated with or operated by any third-party gaming platform (such as Rain.gg, CSGORoll, Clash.gg, or CS2-Skins) unless explicitly stated. Any use of such third-party platforms is subject to their own respective terms and conditions.
          </p>
        </div>

        {/* 10. Errors */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>10. Errors</h3>
          <p style={styles.text}>
            We reserve the right to correct any errors regarding points, rewards, promotions, or affiliate offers. In the event of a database discrepancy, incorrect item pricing, or tracking issue, SHARKAWARD reserves the right to cancel or adjust the transaction.
          </p>
        </div>

        {/* 11. Use of Bonus Codes and Promotions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>11. Use of Bonus Codes and Promotions</h3>
          <p style={styles.text}>
            We may provide bonus codes and promotional offers from our partner sites. These offers are subject to the terms and conditions of the respective gaming/gambling sites. We are not responsible for changes to or cancellation of these offers.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            Always read and understand the terms and conditions, including wagering requirements, before accepting any bonus or promotion.
          </p>
        </div>

        {/* 12. Intellectual Property */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>12. Intellectual Property</h3>
          <p style={styles.text}>
            All content on SHARKAWARD, including text, graphics, logos, images, and software, is the property of SHARKAWARD or its content suppliers and is protected by international copyright laws.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            You may not reproduce, distribute, modify, or create derivative works from any content on this site without our express written permission.
          </p>
        </div>

        {/* 13. User Conduct */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>13. User Conduct</h3>
          <p style={styles.text}>When using our services, you agree not to:</p>
          <ul style={styles.list}>
            <li>Violate any applicable laws or regulations.</li>
            <li>Attempt to gain unauthorized access to our systems or database.</li>
            <li>Interfere with or disrupt our services.</li>
            <li>Transmit any viruses, malware, or harmful code.</li>
            <li>Engage in any fraudulent or deceptive practices (including using bots/scripts for stream viewing).</li>
            <li>Harass, abuse, or harm other users.</li>
          </ul>
        </div>

        {/* 14. Limitation of Liability */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>14. Limitation of Liability</h3>
          <p style={{ ...styles.text, fontSize: '0.8rem', color: '#ffb8b8', textTransform: 'uppercase', fontWeight: '700' }}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SHARKAWARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>We are not responsible for:</p>
          <ul style={styles.list}>
            <li>Any losses incurred while gambling on third-party sites.</li>
            <li>The accuracy, completeness, or availability of information on partner sites.</li>
            <li>Any errors or omissions in our content.</li>
            <li>Technical issues or interruptions in service.</li>
          </ul>
        </div>

        {/* 15. Indemnification */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>15. Indemnification</h3>
          <p style={styles.text}>
            You agree to defend, indemnify, and hold harmless SHARKAWARD, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with your access to or use of our services.
          </p>
        </div>

        {/* 16. Geographic Restrictions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>16. Geographic Restrictions</h3>
          <p style={styles.text}>
            Online gambling laws vary by jurisdiction. It is your responsibility to ensure that your use of our affiliate partners' services complies with all applicable laws in your location.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            We do not guarantee that the gaming sites we promote are available or legal in your location. Some partner sites may restrict access based on your geographic location.
          </p>
        </div>

        {/* 17. Privacy */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>17. Privacy</h3>
          <p style={styles.text}>
            Your use of our services is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices.
          </p>
        </div>

        {/* 18. Changes to Terms */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>18. Changes to Terms</h3>
          <p style={styles.text}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of the service after any modifications indicates your acceptance of the updated terms.
          </p>
        </div>

        {/* 19. Governing Law */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>19. Governing Law</h3>
          <p style={styles.text}>
            These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction in which SHARKAWARD operates, without regard to its conflict of law provisions.
          </p>
        </div>

        {/* 20. Entire Agreement */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>20. Entire Agreement</h3>
          <p style={styles.text}>
            These Terms constitute the entire agreement between you and SHARKAWARD regarding the use of the Service, superseding any prior agreements or communications.
          </p>
        </div>

        {/* 21. Contact Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>21. Contact Information</h3>
          <p style={styles.text}>
            If you have any questions about these Terms of Service, please contact us through the contact information or social channels provided on our website.
          </p>
        </div>

        {/* Responsible Gambling Banner */}
        <div style={styles.responsibleBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <AlertTriangle size={20} color="#ff3333" />
            <span style={{ fontWeight: '800', fontSize: '1rem', color: '#ff3333', letterSpacing: '0.5px' }}>RESPONSIBLE GAMBLING</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#ff7777', lineHeight: '1.5', fontWeight: '500' }}>
            Gambling can be addictive. Please play responsibly and only bet what you can afford to lose. If you feel you may have a gambling problem, seek help immediately.
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
  link: {
    color: 'var(--accent-cyan)',
    textDecoration: 'none',
    fontWeight: '600',
  },
  responsibleBanner: {
    padding: '1.25rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 51, 51, 0.07)',
    border: '1px solid rgba(255, 51, 51, 0.3)',
    marginTop: '1rem',
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
