import { useNavigate } from 'react-router-dom';

/**
 * AppFooter: Sits at bottom of app-shell
 *
 * Features:
 * - Width matches app-shell (100% max-width: 480px)
 * - Consistent spacing and alignment
 * - Legal links with hover states
 */
export default function AppFooter() {
  const navigate = useNavigate();

  const footerStyle = {
    marginTop: 'auto',
    paddingTop: '24px',
    paddingBottom: '24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'center',
  };

  const linksStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };

  const linkStyle = {
    color: '#4ecdc4',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '12px',
    transition: 'color 0.2s',
  };

  const copyrightStyle = {
    fontSize: '12px',
    color: '#666',
    margin: 0,
  };

  return (
    <footer style={footerStyle}>
      <div style={linksStyle}>
        <a
          style={linkStyle}
          onClick={() => navigate('/terms')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/terms')}
          role="button"
          tabIndex={0}
        >
          Terms of Service
        </a>
        <a
          style={linkStyle}
          onClick={() => navigate('/privacy')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/privacy')}
          role="button"
          tabIndex={0}
        >
          Privacy Policy
        </a>
      </div>
      <p style={copyrightStyle}>© {new Date().getFullYear()} TowMax. All rights reserved.</p>
    </footer>
  );
}
