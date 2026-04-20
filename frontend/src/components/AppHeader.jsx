import { Home, LogOut, LogIn, ArrowLeft, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AppHeader({
  showBackButton = false,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
  onUpgrade,
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header if at top
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);

      // Debounce to avoid excessive updates
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {}, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 'clamp(48px, 10vw, 56px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '0 clamp(8px, 2vw, 12px)',
      marginBottom: 'clamp(16px, 3vw, 24px)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      backdropFilter: 'blur(10px)',
      transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s ease-out',
    },
    side: {
      width: '25%',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    center: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      pointerEvents: 'none',
    },
    title: {
      fontSize: 'clamp(18px, 4vw, 22px)',
      fontWeight: '600',
      margin: 0,
      color: '#fff',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    navButton: {
      width: 'clamp(32px, 8vw, 40px)',
      height: 'clamp(32px, 8vw, 40px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.22)',
      borderRadius: '8px',
      color: '#e0e0e0',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: 0,
    },
  };

  return (
    <div style={styles.header}>
      <div style={styles.side}>
        {showBackButton && onBack && (
          <button onClick={onBack} style={styles.navButton}>
            <ArrowLeft size={18} />
          </button>
        )}
        {onUpgrade && (
          <button onClick={onUpgrade} style={styles.navButton}>
            <Gem size={18} />
          </button>
        )}
      </div>
      <div style={styles.center}>
        <h1 style={styles.title}>TowMax</h1>
      </div>
      <div style={{ ...styles.side, justifyContent: 'flex-end' }}>
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
