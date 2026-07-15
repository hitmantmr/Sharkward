import React from 'react';
import { ShieldCheck, Lock, Home, Info } from 'lucide-react';

const Privacy = ({ setActiveTab }) => {
  return (
    <div style={styles.container} className="reveal-on-scroll">
      <div style={styles.header}>
        <ShieldCheck size={36} color="var(--accent-cyan)" />
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.subtitle}>Last updated: July 2026</p>
      </div>

      <div style={styles.card} className="glass">
        
        {/* 1. Introduction */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>1. Introduction</h3>
          <p style={styles.text}>
            SHARKAWARD ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>2. Information We Collect</h3>
          
          <h4 style={styles.subSectionTitle}>Information You Provide</h4>
          <p style={styles.text}>We may collect information you provide directly to us, such as:</p>
          <ul style={styles.list}>
            <li>Email address (if you subscribe to our newsletter or create an account).</li>
            <li>Username or display name (such as Discord and Kick usernames connected via OAuth).</li>
            <li>Steam Trade URL or any other profile details you choose to provide.</li>
            <li>Loyalty account information, including points earned, redeemed rewards, referral history, and participation in promotional campaigns.</li>
          </ul>
          <p style={{ ...styles.text, marginTop: '8px', fontStyle: 'italic' }}>
            Note on OAuth: We only receive the information that you authorize the third-party authentication provider (Discord or Kick) to share with us.
          </p>

          <h4 style={{ ...styles.subSectionTitle, marginTop: '14px' }}>Information Collected Automatically</h4>
          <p style={styles.text}>When you visit our website, we automatically collect certain information about your device, including:</p>
          <ul style={styles.list}>
            <li>IP address.</li>
            <li>Browser type and version.</li>
            <li>Operating system.</li>
            <li>Referring website.</li>
            <li>Pages visited on our site.</li>
            <li>Time and date of visits.</li>
            <li>Click-through data to partner sites.</li>
          </ul>

          <h4 style={{ ...styles.subSectionTitle, marginTop: '14px' }}>Cookies and Tracking Technologies</h4>
          <p style={styles.text}>
            We use cookies and similar tracking technologies to track activity on our website and hold certain information. The cookies we utilize include:
          </p>
          <ul style={styles.list}>
            <li><strong>Essential Cookies:</strong> Required for the technical operation and security of the website.</li>
            <li><strong>Authentication Cookies:</strong> Used to maintain your login session across refreshes.</li>
            <li><strong>Analytics Cookies:</strong> Used to analyze general traffic patterns and optimize the user experience.</li>
            <li><strong>Preference Cookies:</strong> Used to store your UI preferences (such as light/dark mode choices).</li>
          </ul>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </div>

        {/* 3. Legal Basis for Processing */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>3. Legal Basis for Processing</h3>
          <p style={styles.text}>
            Where applicable under data protection laws (such as GDPR), we process your personal information based on one or more of the following legal bases:
          </p>
          <ul style={styles.list}>
            <li><strong>Your consent:</strong> When you authorize us to link your Discord/Kick profiles.</li>
            <li><strong>Performance of a contract:</strong> To calculate points and deliver the skin rewards you redeem.</li>
            <li><strong>Compliance with legal obligations:</strong> To satisfy regulatory or compliance requests.</li>
            <li><strong>Our legitimate interests:</strong> In operating, securing, and continuously improving SHARKAWARD.</li>
          </ul>
        </div>

        {/* 4. How We Use Your Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>4. How We Use Your Information</h3>
          <p style={styles.text}>We use the information we collect in the following ways:</p>
          <ul style={styles.list}>
            <li>To provide and maintain our website.</li>
            <li>To track affiliate referrals to our partner sites.</li>
            <li>To send you newsletters and marketing communications (with your consent).</li>
            <li>To respond to your comments, questions, and support requests.</li>
            <li>To analyze usage patterns and improve our services.</li>
            <li>To detect, prevent, and address fraud, abuse, or system manipulation.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </div>

        {/* 5. Disclosure of Your Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>5. Disclosure of Your Information</h3>
          <p style={styles.text}>We may share your information in certain situations:</p>
          
          <h4 style={styles.subSectionTitle}>With Affiliate Partners</h4>
          <p style={styles.text}>
            When you click on links to our partner sites, certain information (such as your click data and referral source) may be shared with these partners for referral tracking purposes.
          </p>

          <h4 style={{ ...styles.subSectionTitle, marginTop: '14px' }}>Service Providers</h4>
          <p style={styles.text}>We may share your information with third-party service providers who help us operate our website, including:</p>
          <ul style={styles.list}>
            <li>Web hosting and server providers.</li>
            <li>Analytics services.</li>
            <li>Email delivery and communication services.</li>
          </ul>

          <h4 style={{ ...styles.subSectionTitle, marginTop: '14px' }}>Legal Requirements</h4>
          <p style={styles.text}>
            We may disclose your information if required to do so by law or in response to valid requests by public authorities.
          </p>

          <h4 style={{ ...styles.subSectionTitle, marginTop: '14px' }}>Business Transfers</h4>
          <p style={styles.text}>
            If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.
          </p>
        </div>

        {/* 6. Data Security */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>6. Data Security</h3>
          <p style={styles.text}>
            We use administrative, technical, and physical security measures to protect your personal information. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            No method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, we cannot guarantee absolute security of your data.
          </p>
        </div>

        {/* 7. Your Rights */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>7. Your Rights</h3>
          <p style={styles.text}>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul style={styles.list}>
            <li><strong>Access:</strong> You can request access to the personal information we hold about you.</li>
            <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> You can request that we delete your personal information from our active databases.</li>
            <li><strong>Opt-out:</strong> You can opt-out of receiving marketing communications from us.</li>
            <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, machine-readable format.</li>
          </ul>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            To exercise any of these rights, please contact us using the communication channels provided on our website.
          </p>
        </div>

        {/* 8. Third-Party Websites */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>8. Third-Party Websites</h3>
          <p style={styles.text}>
            Our website contains links to third-party gaming and promotion sites. We are not responsible for the privacy practices or operations of these third-party platforms. We encourage you to read the privacy policies of any site you visit.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            When you click on these links and visit our partner sites, those sites may collect information about you according to their own privacy policies.
          </p>
        </div>

        {/* 9. Children's Privacy */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>9. Children's Privacy</h3>
          <p style={{ ...styles.text, fontWeight: '700', color: '#fff' }}>
            Our website is not intended for anyone under the age of 18 or the legal gambling age in their jurisdiction. We do not knowingly collect personal information from minors.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can remove it.
          </p>
        </div>

        {/* 10. International Data Transfers */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>10. International Data Transfers</h3>
          <p style={styles.text}>
            We process and transfer data internationally in compliance with applicable cross-border regulations. By using our website, you acknowledge that your information may be processed and stored in locations where the data protection laws may differ from those of your jurisdiction.
          </p>
        </div>

        {/* 11. Analytics and Tracking */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>11. Analytics and Tracking</h3>
          <p style={styles.text}>
            We use analytics services to understand how visitors use our website. These services may collect information such as pages visited, time spent on each page, click patterns, referral sources, and device/browser info. This information helps us improve our website and provide better recommendations to our users.
          </p>
        </div>

        {/* 12. Marketing Communications */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>12. Marketing Communications</h3>
          <p style={styles.text}>If you have opted in to receive marketing communications, we may send you emails about:</p>
          <ul style={styles.list}>
            <li>New partner sites and exclusive bonuses.</li>
            <li>Promotions and special offers.</li>
            <li>Site updates and new features.</li>
            <li>Gaming tips and strategies.</li>
          </ul>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            You can unsubscribe from these communications at any time by clicking the unsubscribe link in any email or by contacting us directly.
          </p>
        </div>

        {/* 13. Data Retention */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>13. Data Retention</h3>
          <p style={styles.text}>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your personal information, we will securely delete or destroy it.
          </p>
          <p style={{ ...styles.text, marginTop: '8px', fontWeight: '500' }}>
            If you close or unlink your account, we may retain certain information where required by law or for fraud prevention purposes.
          </p>
        </div>

        {/* 14. California Privacy Rights */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>14. California Privacy Rights</h3>
          <p style={styles.text}>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including:</p>
          <ul style={styles.list}>
            <li>The right to know what personal information we collect, use, disclose, and sell.</li>
            <li>The right to request deletion of your personal information.</li>
            <li>The right to opt-out of the sale of your personal information.</li>
            <li>The right to non-discrimination for exercising your privacy rights.</li>
          </ul>
        </div>

        {/* 15. European Privacy Rights */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>15. European Privacy Rights</h3>
          <p style={styles.text}>If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including:</p>
          <ul style={styles.list}>
            <li>The right to access your personal data.</li>
            <li>The right to rectification of inaccurate data.</li>
            <li>The right to erasure ("right to be forgotten").</li>
            <li>The right to restrict processing.</li>
            <li>The right to data portability.</li>
            <li>The right to object to processing.</li>
            <li>The right to withdraw consent.</li>
          </ul>
        </div>

        {/* 16. Changes to This Privacy Policy */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>16. Changes to This Privacy Policy</h3>
          <p style={styles.text}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* 17. Contact Us */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>17. Contact Us</h3>
          <p style={styles.text}>
            If you have any questions about this Privacy Policy or our data practices, please contact us through the contact information or official social channels provided on our website.
          </p>
          <p style={{ ...styles.text, marginTop: '8px' }}>
            For data protection inquiries or to exercise your rights, please submit a request to the site administrators via the official Discord server.
          </p>
        </div>

        {/* Privacy Matters Banner */}
        <div style={styles.privacyBanner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Info size={20} color="var(--accent-cyan)" />
            <span style={{ fontWeight: '800', fontSize: '1rem', color: '#fff', letterSpacing: '0.5px' }}>YOUR PRIVACY MATTERS</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5', fontWeight: '500' }}>
            We are committed to protecting your privacy and being transparent about our data practices. If you have any concerns or questions, please don't hesitate to contact us.
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
  subSectionTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
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
  privacyBanner: {
    padding: '1.25rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 240, 255, 0.04)',
    border: '1px solid rgba(0, 240, 255, 0.2)',
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

export default Privacy;
