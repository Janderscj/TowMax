import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
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
  const { isFree } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showFreeAccountWarning, setShowFreeAccountWarning] = useState(false);

  useEffect(() => {
    // Reset local success UI when a new exact-result vehicle is shown.
    setSaveSuccess(false);
  }, [vin, match?.maxTow]);

  const gcwr = match.gcwr ?? 14000;
  const payload = match.payload ?? 1940;
  const shouldDisableAdd = addVehicleLoading || !canAddVehicle;

  const handleGarageButtonClick = async () => {
    if (saveSuccess) {
      onViewGarage();
      return;
    }

    if (isFree) {
      setShowFreeAccountWarning(true);
      return;
    }

    const wasSaved = await onAddVehicle();
    if (wasSaved) {
      setSaveSuccess(true);
    }
  };

  const handleContinueAddVehicle = async () => {
    setShowFreeAccountWarning(false);
    const wasSaved = await onAddVehicle();
    if (wasSaved) {
      setSaveSuccess(true);
    }
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

          <h2 className={styles.heading}>Exact Match Found</h2>

          <p className={styles.subtitle}>Here&apos;s your precise towing capacity</p>
        </div>

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

        <div className={styles.capacityBox}>
          <div className={styles.capacityLabel}>Maximum Towing Capacity</div>
          <div className={styles.capacityValue}>{match.maxTow.toLocaleString()}</div>
          <div className={styles.capacityUnit}>pounds</div>
        </div>

        <div className={styles.specsBox}>
          <div className={styles.specsGrid}>
            <div className={styles.specItem}>
              <div className={styles.specLabel}>GCWR</div>
              <div className={styles.specValue}>{gcwr.toLocaleString()} lbs</div>
            </div>
            <div className={styles.specItem}>
              <div className={styles.specLabel}>Payload</div>
              <div className={styles.specValue}>{payload.toLocaleString()} lbs</div>
            </div>
          </div>
        </div>

        <div className={styles.warningBox}>
          <strong>⚠️ Important:</strong> Always verify with your owner&apos;s manual and consider
          payload, tongue weight, and trailer specifications.
        </div>

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
              disabled={saveSuccess ? false : shouldDisableAdd}
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
                Your garage is full. Find an exact match first, then upgrade to Premium to save
                unlimited vehicles.
              </div>
            )}

            {addVehicleError && !saveSuccess && (
              <div className={styles.errorBox}>{addVehicleError}</div>
            )}

            {showUpgradePrompt && !saveSuccess && (
              <div className={styles.upgradePrompt}>
                <div className={styles.upgradeTitle}>Garage Full</div>
                <div className={styles.upgradeText}>
                  Upgrade to Premium to unlock unlimited saved vehicles, then try adding this VIN
                  again.
                </div>
                <button onClick={onDismissUpgradePrompt} className={styles.upgradeButton}>
                  Dismiss
                </button>
              </div>
            )}
          </>
        )}

        <button onClick={onNewSearch} className={styles.newSearchButton}>
          Check Another Vehicle
        </button>

        {showFreeAccountWarning && (
          <div className={styles.modalOverlay} onClick={() => setShowFreeAccountWarning(false)}>
            <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.modalTitle}>Free Account Notice</h3>
              <p className={styles.modalText}>
                Free accounts can save vehicles to their garage, but cannot remove them once added.
                Upgrade to Premium to unlock full garage management and unlimited vehicles.
              </p>
              <div className={styles.modalButtonGroup}>
                <button
                  onClick={() => setShowFreeAccountWarning(false)}
                  className={`${styles.modalButton} ${styles.secondary}`}
                >
                  Back
                </button>
                <button
                  onClick={handleContinueAddVehicle}
                  className={`${styles.modalButton} ${styles.primary}`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        <LegalDisclaimer />
      </div>
    </div>
  );
}
