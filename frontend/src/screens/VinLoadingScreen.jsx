import styles from './VinLoadingScreen.module.css';

export default function VinLoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.spinner} />

        <h3 className={styles.heading}>Decoding Your VIN</h3>

        <p className={styles.description}>Analyzing vehicle specifications and towing data...</p>
      </div>
    </div>
  );
}
