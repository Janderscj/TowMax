import styles from './LegalDisclaimer.module.css';

export default function LegalDisclaimer() {
  return (
    <div className={styles.container}>
      <p className={styles.paragraph}>
        <strong>General Accuracy Disclaimer:</strong> TowMax provides informational estimates only.
        Vehicle specifications, towing capacities, and VIN data may contain errors or may not
        reflect modifications, packages, or real‑world conditions. Always verify towing information
        with the vehicle manufacturer or a certified professional before towing.
      </p>
      <p className={styles.paragraph}>
        <strong>Not Professional Advice:</strong> TowMax does not provide legal, mechanical, or
        safety advice. All towing decisions are the responsibility of the user.
      </p>
      <p className={styles.lastParagraph}>
        <strong>Data Sources:</strong> VIN decoding and towing information are derived from publicly
        available or third‑party data sources. TowMax is not affiliated with any vehicle
        manufacturer.
      </p>
    </div>
  );
}
