import { Home, LogOut, LogIn, ArrowLeft, Gem } from 'lucide-react';
import { useState, useEffect } from 'react';
import styles from './AppHeader.module.css';

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

  // Dynamic style for visibility animation
  const outerStyle = {
    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
  };

  return (
    <div className={styles.headerOuter} style={outerStyle}>
      <div className={styles.headerInner}>
        <div className={styles.sideNav}>
          {showBackButton && onBack && (
            <button onClick={onBack} className={styles.navButton}>
              <ArrowLeft size={18} />
            </button>
          )}
          {onUpgrade && (
            <button onClick={onUpgrade} className={styles.navButton}>
              <Gem size={18} />
            </button>
          )}
        </div>
        <div className={styles.centerNav}>
          <h1 className={styles.title}>TowMax</h1>
        </div>
        <div className={`${styles.sideNav} ${styles.sideNavRight}`}>
          {onHome && (
            <button onClick={onHome} className={styles.navButton}>
              <Home size={18} />
            </button>
          )}
          {isGuest && onLogin ? (
            <button onClick={onLogin} className={styles.navButton}>
              <LogIn size={18} />
            </button>
          ) : onSignOut ? (
            <button onClick={onSignOut} className={styles.navButton}>
              <LogOut size={18} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
