import { Home, LogOut, LogIn, ArrowLeft, Gem } from 'lucide-react';

export default function AppHeader({
  title,
  showBackButton = false,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
  onUpgrade,
}) {
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      marginBottom: '24px',
    },
    titleGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
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
      transition: 'all 0.2s',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
      color: '#fff',
    },
    navButtons: {
      display: 'flex',
      gap: '8px',
    },
    navButton: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.22)',
      borderRadius: '8px',
      color: '#e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.navButtons}>
        {onUpgrade && (
          <button onClick={onUpgrade} style={styles.navButton}>
            <Gem size={18} />
          </button>
        )}
      </div>
      <div style={styles.titleGroup}>
        {showBackButton && onBack && (
          <button onClick={onBack} style={styles.backButton}>
            <ArrowLeft size={16} />
            Back
          </button>
        )}
      </div>

      <div style={{ flex: 1, textAlign: 'center' }}>
        {title && <h1 style={styles.title}>{title}</h1>}
      </div>

      <div style={styles.navButtons}>
        {onHome && (
          <button onClick={onHome} style={styles.navButton}>
            <Home size={18} />
          </button>
        )}
        {isGuest && onLogin ? (
          <button onClick={onLogin} style={styles.navButton}>
            <LogIn size={18} />
          </button>
        ) : onSignOut ? (
          <button onClick={onSignOut} style={styles.navButton}>
            <LogOut size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
