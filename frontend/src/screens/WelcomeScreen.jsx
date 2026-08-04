import { ArrowRight, Car } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import styles from './WelcomeScreen.module.css';

export default function WelcomeScreen({
  error,
  onGetStarted,
  onGarage,
  showGarage,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
  onUpgrade,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />
      <div className={styles.contentWrapper}>
        <AppHeader
          showBackButton={false}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
          onUpgrade={onUpgrade}
        />

        <div className={styles.mainContent}>
          <div className={styles.label}>Towing Estimator</div>

          <h1 className={styles.heading}>Know Your Limits</h1>

          <p className={styles.description}>
            Enter your VIN to discover your vehicle&apos;s estimated towing capacity in seconds.
          </p>

          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>

        <div className={styles.buttonGroup}>
          {showGarage && (
            <>
              <button onClick={onGarage} className={styles.secondaryButton}>
                <Car size={20} />
                My Garage
              </button>
              <div style={{ height: '16px' }} />
            </>
          )}

          <button onClick={onGetStarted} className={styles.primaryButton}>
            Lookup My VIN
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
