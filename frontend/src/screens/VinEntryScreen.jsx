import { AlertCircle, Search } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import styles from './VinEntryScreen.module.css';

export default function VinEntryScreen({
  vin,
  setVin,
  onBack,
  onDecode,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const handleDecode = () => {
    if (vin.length === 17) {
      onDecode(vin);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundGlow} />
      <div className={styles.contentWrapper}>
        <AppHeader
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <PageTitle>VIN Lookup</PageTitle>

        <h2 className={styles.heading}>Enter Your VIN</h2>

        <p className={styles.subheading}>Your 17-character Vehicle Identification Number</p>

        <div className={styles.flexContent}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="1GCUYEED8NZ123456"
              maxLength={17}
              className={styles.vinInput}
            />
            <div className={styles.counterRow}>
              <span>17 characters required</span>
              <span>{vin.length}/17</span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <AlertCircle size={20} className={styles.alertIcon} />
            <div>
              <strong className={styles.infoBold}>Tip:</strong>
              VIN is located on the driver&apos;s side dashboard or door jamb
            </div>
          </div>
        </div>

        <button onClick={handleDecode} disabled={vin.length !== 17} className={styles.button}>
          Decode VIN
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
