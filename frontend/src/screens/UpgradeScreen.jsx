import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import styles from './UpgradeScreen.module.css';

export default function UpgradeScreen({ onHome, onSignOut, isGuest = false, onLogin }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <AppHeader
        showBackButton={true}
        onBack={() => navigate(-1)}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <PageTitle>Upgrade to Premium</PageTitle>
      <div className={styles.content}>
        <h1 className={styles.title}>Upgrade to Premium</h1>
        <p className={styles.description}>
          Unlock full VIN breakdowns, unlimited garage vehicles, priority support, and exclusive
          features.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Full VIN Breakdown</div>
            <div className={styles.featureText}>
              Access complete vehicle history and specifications
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Unlimited Garage</div>
            <div className={styles.featureText}>Store unlimited vehicles in your garage</div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureTitle}>Priority Support</div>
            <div className={styles.featureText}>Get help when you need it, faster</div>
          </div>
        </div>

        <button onClick={() => alert('Stripe integration coming soon')} className={styles.button}>
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
