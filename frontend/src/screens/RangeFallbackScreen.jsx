import { Search, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LegalDisclaimer from '../components/LegalDisclaimer';
import AppHeader from '../components/AppHeader';
import styles from './RangeFallbackScreen.module.css';

export default function RangeFallback({
  decoded,
  minTow,
  maxTow,
  onRecheck,
  onNewSearch,
  onHome,
  onSignOut,
  isGuest,
  onLogin,
}) {
  const navigate = useNavigate();

  const hasRange = minTow && maxTow;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <AppHeader
          title="Refine Results"
          showBackButton={true}
          onBack={onRecheck || (() => navigate('/results/range'))}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <div className={styles.centerSection}>
          <div className={styles.iconBox}>
            <Search size={40} color="#000" />
          </div>

          <h2 className={styles.heading}>
            {hasRange ? 'No Exact Match Found' : 'Towing Data Unavailable'}
          </h2>

          <p className={styles.subtitle}>
            {hasRange ? (
              <>
                Your answers didn&apos;t match a single configuration,
                <br />
                but a towing range is still available.
              </>
            ) : (
              <>
                Your VIN was decoded successfully,
                <br />
                but towing data is not available in this prototype.
              </>
            )}
          </p>
        </div>

        {decoded && (
          <div className={styles.vehicleCard}>
            <div className={styles.vehicleLabel}>YOUR VEHICLE</div>
            <div className={styles.vehicleName}>
              {decoded.year} {decoded.make} {decoded.model}
            </div>
            <div className={styles.vehicleSeries}>{decoded.series}</div>
          </div>
        )}

        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>
            {hasRange ? 'Closest Towing Range' : 'Towing Capacity'}
          </div>

          <div className={styles.capacityValue}>
            {hasRange ? `${minTow.toLocaleString()} – ${maxTow.toLocaleString()}` : '—'}
          </div>

          <div className={styles.capacityUnit}>{hasRange ? 'pounds' : 'No prototype data'}</div>
        </div>

        <div className={styles.explanationBox}>
          {hasRange ? (
            <>
              <strong>No exact configuration matched your selections.</strong> The range above
              represents all remaining possible towing ratings for your vehicle. Verify final
              capacity in your owner&apos;s manual or window sticker.
            </>
          ) : (
            <>
              <strong>Towing data not available in prototype dataset.</strong> You can still view
              the full VIN breakdown for complete vehicle details.
            </>
          )}
        </div>

        {hasRange && (
          <button onClick={onRecheck} className={styles.primaryButton}>
            <RotateCcw size={18} />
            Recheck options?
          </button>
        )}

        <button onClick={onNewSearch} className={styles.secondaryButton}>
          Try new VIN
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigate('/vin/full');
          }}
          className={styles.secondaryButton}
        >
          View Full VIN Breakdown
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
