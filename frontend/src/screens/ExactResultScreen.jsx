import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../contexts/AuthContext';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import LegalDisclaimer from '../components/LegalDisclaimer';
import styles from './ExactResultScreen.module.css';

export default function ExactResultScreen({
  decoded,
  vin,
  match,
  answers,
  showAddVehicle,
  canAddVehicle,
  garageLimitReached,
  onAddVehicle,
  onViewGarage,
  addVehicleLoading,
  addVehicleError,
  showUpgradePrompt,
  onDismissUpgradePrompt,
  onNewSearch,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const navigate = useNavigate();
  //freeze isFree
  //const { isFree } = useAuth();

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setSaveSuccess(false);
  }, [vin, match?.maxTow]);

  const gcwr = match.gcwr ?? null;
  const payload = match.payload ?? null;
  const hasTowData = match?.maxTow != null;

  const handleGarageButtonClick = async () => {
    if (saveSuccess) {
      onViewGarage();
      return;
    }

    // Free users are now allowed to save normally
    const wasSaved = await onAddVehicle();
    if (wasSaved) setSaveSuccess(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <AppHeader
          title="Vehicle Details"
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <PageTitle>Vehicle Details</PageTitle>

        <div className={styles.centerSection}>
          <div className={styles.iconBox}>
            <CheckCircle2 size={48} color="#fff" />
          </div>

          <h2 className={styles.heading}>
            {hasTowData ? 'Exact Match Found' : 'Towing Data Unavailable'}
          </h2>

          <p className={styles.subtitle}>
            {hasTowData
              ? 'Here’s your precise towing capacity'
              : 'Your VIN was decoded successfully, but towing data is not available in this prototype.'}
          </p>
        </div>

        {/* Vehicle Card */}
        <div className={styles.vehicleCard}>
          <div className={styles.vehicleCardHeader}>
            <div>
              <div className={styles.vehicleLabel}>YOUR VEHICLE</div>
              <div className={styles.vehicleName}>
                {decoded.year} {decoded.make} {decoded.model}
              </div>
              <div className={styles.vehicleSeries}>{decoded.series}</div>
            </div>
          </div>
        </div>

        {/* Towing Capacity */}
        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>Maximum Towing Capacity</div>
          <div className={styles.capacityValue}>
            {hasTowData ? match.maxTow.toLocaleString() : '—'}
          </div>
          <div className={styles.capacityUnit}>{hasTowData ? 'pounds' : 'No prototype data'}</div>
        </div>

        {/* Specs */}
        {hasTowData && (
          <div className={styles.specsBox}>
            <div className={styles.specsGrid}>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>GCWR</div>
                <div className={styles.specValue}>
                  {gcwr ? `${gcwr.toLocaleString()} lbs` : '—'}
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.specLabel}>Payload</div>
                <div className={styles.specValue}>
                  {payload ? `${payload.toLocaleString()} lbs` : '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className={styles.warningBox}>
          <strong>⚠️ Important:</strong> Always verify with your owner&apos;s manual and consider
          payload, tongue weight, and trailer specifications.
        </div>

        {/* Save to Garage */}
        {showAddVehicle && !isGuest && (
          <>
            <div
              className={`${styles.successIndicator} ${saveSuccess ? styles.visible : ''}`}
              aria-live="polite"
            >
              <CheckCircle2 size={18} />
              Saved!
            </div>

            <button
              onClick={handleGarageButtonClick}
              disabled={!saveSuccess && (addVehicleLoading || !canAddVehicle)}
              className={`${styles.addVehicleButton} ${saveSuccess ? styles.success : ''}`}
            >
              {saveSuccess
                ? 'View in My Garage'
                : addVehicleLoading
                  ? 'Adding Vehicle...'
                  : 'Add Vehicle to Garage'}
            </button>

            {garageLimitReached && !saveSuccess && (
              <div className={styles.garageLimitWarning}>
                Your garage is full. Upgrade to Premium to save unlimited vehicles.
              </div>
            )}

            {addVehicleError && !saveSuccess && (
              <div className={styles.errorBox}>{addVehicleError}</div>
            )}

            {showUpgradePrompt && !saveSuccess && (
              <div className={styles.upgradePrompt}>
                <div className={styles.upgradeTitle}>Garage Full</div>
                <div className={styles.upgradeText}>
                  Upgrade to Premium to unlock unlimited saved vehicles.
                </div>
                <button onClick={onDismissUpgradePrompt} className={styles.upgradeButton}>
                  Dismiss
                </button>
              </div>
            )}
          </>
        )}

        {/* Always show VIN breakdown */}
        <button onClick={() => navigate('/vin/full')} className={styles.newSearchButton}>
          View Full VIN Breakdown
        </button>

        <button onClick={onNewSearch} className={styles.newSearchButton}>
          Check Another Vehicle
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
