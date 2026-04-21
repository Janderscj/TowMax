import styles from './PageTitle.module.css';

export default function PageTitle({ children, subtitle }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{children}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
