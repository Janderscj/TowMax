/**
 * Global styles shared across all screens
 * Consolidates common layout patterns and color schemes
 */

export const globalStyles = {
  // Container and layout
  appContainer: {
    padding: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: 'white',
    fontFamily: '"Space Mono", monospace',
    position: 'relative',
    overflow: 'hidden',
  },

  pageContainer: {
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    minHeight: '100vh',
    fontFamily: '"Space Mono", monospace',
    color: '#e0e0e0',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: '24px',
  },

  // Buttons
  navButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '6px',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  primaryButton: {
    background: '#4ecdc4',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },

  dangerButton: {
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  // Cards and containers
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '15px',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  notice: {
    background: 'rgba(255, 140, 0, 0.12)',
    border: '1px solid rgba(255, 140, 0, 0.25)',
    color: '#ffb74d',
    borderRadius: '10px',
    padding: '12px 14px',
    lineHeight: 1.5,
    fontSize: '0.95rem',
  },

  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: '20px',
  },

  // Typography
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    color: '#fff',
  },

  subtitle: {
    fontSize: '14px',
    color: '#999',
  },

  // Colors
  colors: {
    primary: '#4ecdc4',
    danger: '#ff6b6b',
    warning: '#ffb74d',
    accent: '#ff8c00',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    text: '#e0e0e0',
    textLight: '#999',
  },
};
