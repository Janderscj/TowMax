import styles from './ProfileLoadingScreen.module.css';

export default function ProfileLoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.spinner} />

        <h3 className={styles.heading}>Loading Session</h3>

        <p className={styles.description}>Analyzing profile ...</p>
      </div>
    </div>
  );
}
