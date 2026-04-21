import { Link } from 'react-router-dom';
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
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link to="/terms" className={styles.link}>
          Terms of Service
        </Link>
        <Link to="/privacy" className={styles.link}>
          Privacy Policy
        </Link>
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} TowMax. All rights reserved.</p>
    </footer>
  );
}
