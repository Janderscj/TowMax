import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';

export default function UpgradeScreen({ onHome, onSignOut, isGuest = false, onLogin }) {
  const navigate = useNavigate();

  const styles = {
    container: {
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      minHeight: '100vh',
      fontFamily: '"Space Mono", monospace',
      color: '#e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
      paddingTop: 'clamp(60px, 12vw, 72px)',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      marginTop: '24px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    description: {
      opacity: 0.8,
      marginBottom: '32px',
      fontSize: '16px',
      lineHeight: '1.6',
      maxWidth: '400px',
    },
    features: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '40px',
      width: '100%',
      maxWidth: '600px',
    },
    feature: {
      padding: '20px',
      background: 'rgba(79, 70, 229, 0.1)',
      border: '1px solid rgba(79, 70, 229, 0.3)',
      borderRadius: '8px',
    },
    featureTitle: {
      fontWeight: 'bold',
      marginBottom: '8px',
      fontSize: '14px',
    },
    featureText: {
      fontSize: '13px',
      opacity: 0.7,
    },
    button: {
      padding: '14px 28px',
      borderRadius: '8px',
      background: '#4f46e5',
      color: '#fff',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <AppHeader
        showBackButton={true}
        onBack={() => navigate(-1)}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <PageTitle>Upgrade to Premium</PageTitle>
      <div style={styles.content}>
        <h1 style={styles.title}>Upgrade to Premium</h1>
        <p style={styles.description}>
          Unlock full VIN breakdowns, unlimited garage vehicles, priority support, and exclusive
          features.
        </p>

        <div style={styles.features}>
          <div style={styles.feature}>
            <div style={styles.featureTitle}>Full VIN Breakdown</div>
            <div style={styles.featureText}>Access complete vehicle history and specifications</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureTitle}>Unlimited Garage</div>
            <div style={styles.featureText}>Store unlimited vehicles in your garage</div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureTitle}>Priority Support</div>
            <div style={styles.featureText}>Get help when you need it, faster</div>
          </div>
        </div>

        <button onClick={() => alert('Stripe integration coming soon')} style={styles.button}>
          Continue to Checkout
        </button>
      </div>
    </div>
  );
}
