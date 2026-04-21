import { Home, LogOut, LogIn, ArrowLeft, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * AppHeader: Fixed header with two-layer structure
 *
 * Outer layer: Full viewport width, fixed positioning, blur + gradient
 * Inner layer: Centered content (max-width: 480px), matches app-shell width
 *
 * Features:
 * - Hides on scroll down, shows on scroll up
 * - Content perfectly centered inside app-shell
 * - Proper spacing and alignment
 */
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

  // Outer layer: Full viewport width, fixed positioning
  const outerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
    transition: 'transform 0.3s ease-out',
  };

  // Inner layer: Centered content matching app-shell width
  const innerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 'clamp(60px, 12vw, 72px)',
    padding: '0 clamp(16px, 3vw, 24px)',
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
  };

  const sideStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '25%',
  };

  const centerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  };

  const titleStyle = {
    fontSize: 'clamp(18px, 4vw, 22px)',
    fontWeight: '600',
    margin: 0,
    color: '#fff',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };

  const navButtonStyle = {
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
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <div style={sideStyle}>
          {showBackButton && onBack && (
            <button onClick={onBack} style={navButtonStyle}>
              <ArrowLeft size={18} />
            </button>
          )}
          {onUpgrade && (
            <button onClick={onUpgrade} style={navButtonStyle}>
              <Gem size={18} />
            </button>
          )}
        </div>
        <div style={centerStyle}>
          <h1 style={titleStyle}>TowMax</h1>
        </div>
        <div style={{ ...sideStyle, justifyContent: 'flex-end' }}>
          {onHome && (
            <button onClick={onHome} style={navButtonStyle}>
              <Home size={18} />
            </button>
          )}
          {isGuest && onLogin ? (
            <button onClick={onLogin} style={navButtonStyle}>
              <LogIn size={18} />
            </button>
          ) : onSignOut ? (
            <button onClick={onSignOut} style={navButtonStyle}>
              <LogOut size={18} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
