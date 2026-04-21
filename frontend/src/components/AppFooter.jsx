import { useNavigate } from 'react-router-dom';
import styles from './AppFooter.module.css';

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

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a
          className={styles.link}
          onClick={() => navigate('/terms')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/terms')}
          role="button"
          tabIndex={0}
        >
          Terms of Service
        </a>
        <a
          className={styles.link}
          onClick={() => navigate('/privacy')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/privacy')}
          role="button"
          tabIndex={0}
        >
          Privacy Policy
        </a>
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} TowMax. All rights reserved.</p>
    </footer>
  );
}
