import { useNavigate } from 'react-router-dom';

export default function AppFooter() {
  const navigate = useNavigate();

  const styles = {
    footer: {
      marginTop: '60px',
      paddingTop: '24px',
      paddingBottom: '24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center',
      fontSize: '12px',
      color: '#666',
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '16px',
      flexWrap: 'wrap',
    },
    link: {
      color: '#4ecdc4',
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: '12px',
      transition: 'color 0.2s',
    },
  };

  const handleLinkClick = (path) => {
    navigate(path);
  };

  return (
    <div style={styles.footer}>
      <div style={styles.links}>
        <span
          style={styles.link}
          onClick={() => handleLinkClick('/terms')}
          onKeyDown={(e) => e.key === 'Enter' && handleLinkClick('/terms')}
          role="button"
          tabIndex={0}
        >
          Terms of Service
        </span>
        <span style={{ color: '#444' }}>•</span>
        <span
          style={styles.link}
          onClick={() => handleLinkClick('/privacy')}
          onKeyDown={(e) => e.key === 'Enter' && handleLinkClick('/privacy')}
          role="button"
          tabIndex={0}
        >
          Privacy Policy
        </span>
      </div>
      <div>© 2026 TowMax. All rights reserved.</div>
    </div>
  );
}
