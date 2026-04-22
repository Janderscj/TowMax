import styles from './PrototypeBanner.module.css';

export default function PrototypeBanner() {
  return (
    <div className={styles.prototypeBanner}>
      <span className={styles.prototypeDot} />
      <span className={styles.prototypeText}>
        Prototype Preview — Towing data is limited in this demo.
      </span>
    </div>
  );
}
