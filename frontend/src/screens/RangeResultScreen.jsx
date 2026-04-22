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

  const hasRange = minTow && maxTow;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <AppHeader
          showBackButton={true}
          onBack={onBack || (() => navigate('/vin'))}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <PageTitle>Towing Range Found</PageTitle>

        <div className={styles.centerSection}>
          <div className={styles.iconBox}>
            <Target size={48} color="#000" />
          </div>

          <h2 className={styles.heading}>
            {hasRange ? 'Towing Range Found' : 'Towing Data Unavailable'}
          </h2>

          <p className={styles.subtitle}>
            {hasRange
              ? 'Based on your vehicle configuration'
              : 'Your VIN was decoded successfully, but towing data is not available in this prototype.'}
          </p>
        </div>

        <div className={styles.vehicleCard}>
          <div className={styles.vehicleLabel}>YOUR VEHICLE</div>
          <div className={styles.vehicleName}>
            {decoded.year} {decoded.make} {decoded.model}
          </div>
          <div className={styles.vehicleSeries}>{decoded.series}</div>
        </div>

        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>
            {hasRange ? 'Towing Capacity Range' : 'Towing Capacity'}
          </div>

          <div className={styles.capacityValue}>
            {hasRange ? `${minTow.toLocaleString()} – ${maxTow.toLocaleString()}` : '—'}
          </div>

          <div className={styles.capacityUnit}>{hasRange ? 'pounds' : 'No prototype data'}</div>
        </div>

        <div className={styles.infoBox}>
          {hasRange ? (
            <>
              <strong>Multiple configurations detected.</strong> Your exact capacity depends on
              final equipment and options. Consult your owner&apos;s manual for precise
              specifications.
            </>
          ) : (
            <>
              <strong>Towing data not available in prototype dataset.</strong> You can still view
              the full VIN breakdown for complete vehicle details.
            </>
          )}
        </div>

        {hasRange && (
          <button onClick={onRefine} className={styles.primaryButton}>
            Refine Results
          </button>
        )}

        <button onClick={onNewSearch} className={styles.secondaryButton}>
          Start New Search
        </button>

        <button onClick={() => navigate('/vin/full')} className={styles.secondaryButton}>
          View Full VIN Breakdown
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
