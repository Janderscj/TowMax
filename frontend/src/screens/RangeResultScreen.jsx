import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import LegalDisclaimer from '../components/LegalDisclaimer';
import styles from './RangeResultScreen.module.css';

export default function RangeResultScreen({
  decoded,
  minTow,
  maxTow,
  onRefine,
  onNewSearch,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <AppHeader
          showBackButton={true}
          onBack={onBack || (() => navigate('/vin'))}
          onHome={onHome}
          onSignOut={onSignOut}
        />

        <PageTitle>Towing Range Found</PageTitle>

        <div className={styles.centerSection}>
          <div className={styles.iconBox}>
            <Target size={48} color="#000" />
          </div>

          <h2 className={styles.heading}>Towing Range Found</h2>

          <p className={styles.subtitle}>Based on your vehicle configuration</p>
        </div>

        <div className={styles.vehicleCard}>
          <div className={styles.vehicleLabel}>YOUR VEHICLE</div>
          <div className={styles.vehicleName}>
            {decoded.year} {decoded.make} {decoded.model}
          </div>
          <div className={styles.vehicleSeries}>{decoded.series}</div>
        </div>

        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>Towing Capacity Range</div>
          <div className={styles.capacityValue}>
            {minTow.toLocaleString()} - {maxTow.toLocaleString()}
          </div>
          <div className={styles.capacityUnit}>pounds</div>
        </div>

        <div className={styles.infoBox}>
          <strong>Multiple configurations detected.</strong> Your exact capacity depends on final
          equipment and options. Consult your owner&apos;s manual for precise specifications.
        </div>

        <button onClick={onRefine} className={styles.primaryButton}>
          Refine Results
        </button>

        <button onClick={onNewSearch} className={styles.secondaryButton}>
          Start New Search
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
