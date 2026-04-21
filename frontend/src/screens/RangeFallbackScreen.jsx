import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import LegalDisclaimer from '../components/LegalDisclaimer';
import styles from './RangeFallbackScreen.module.css';

/**
 * RangeFallbackScreen
 *
 * Displayed when refine answers return zero exact-match configurations.
 * Instead of dead-ending the user, we preserve the prior valid configurations
 * and display the towing range they represent.
 *
 * Fallback condition (checked in App.js handleRefineAnswer):
 *   - refine returned towingMatches.length === 0
 *   - prior matches array is still non-empty (i.e. there ARE known configurations)
 *   - We did NOT overwrite matches with an empty array, so minTow/maxTow are still valid
 */
export default function RangeFallbackScreen({
  decoded,
  minTow,
  maxTow,
  onRecheck,
  onNewSearch,
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

          <h2 className={styles.heading}>No Exact Match Found</h2>

          <p className={styles.subtitle}>
            Your answers didn&apos;t match a single configuration,
            <br />
            but a towing range is still available.
          </p>
        </div>

        {/* ─── Vehicle card ─── */}
        {decoded && (
          <div className={styles.vehicleCard}>
            <div className={styles.vehicleLabel}>YOUR VEHICLE</div>
            <div className={styles.vehicleName}>
              {decoded.year} {decoded.make} {decoded.model}
            </div>
            <div className={styles.vehicleSeries}>{decoded.series}</div>
          </div>
        )}

        {/* ─── Range display ─── */}
        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>Closest Towing Range</div>
          <div className={styles.capacityValue}>
            {minTow.toLocaleString()} – {maxTow.toLocaleString()}
          </div>
          <div className={styles.capacityUnit}>pounds</div>
        </div>

        {/* ─── Explanatory note ─── */}
        <div className={styles.explanationBox}>
          <strong>No exact configuration matched your selections.</strong> The range above
          represents all remaining possible towing ratings for your vehicle. Verify final capacity
          in your owner&apos;s manual or window sticker.
        </div>

        {/* ─── Action buttons ─── */}

        {/* Recheck options → back to questions screen */}
        <button onClick={onRecheck} className={styles.primaryButton}>
          <RotateCcw size={18} />
          Recheck options?
        </button>

        {/* Try new VIN → back to VIN entry */}
        <button onClick={onNewSearch} className={styles.secondaryButton}>
          Try new VIN
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
