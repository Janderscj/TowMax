import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import styles from './TermsOfService.module.css';

export default function TermsOfService({ onHome, onSignOut, isGuest = false, onLogin }) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <AppHeader
          showBackButton={true}
          onBack={() => window.history.back()}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <PageTitle>Terms of Service</PageTitle>

        <div className={styles.content}>
          <h2 className={styles.sectionHeading}>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TowMax, you accept and agree to be bound by the terms and
            provision of this agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>

          <h2 className={styles.sectionHeading}>2. Informational Use Only</h2>
          <p>
            TowMax provides estimates and information for educational and informational purposes
            only. The information is not a substitute for professional mechanical, legal, or safety
            advice. Always consult with vehicle manufacturers or certified professionals before
            making towing or vehicle modification decisions.
          </p>

          <h2 className={styles.sectionHeading}>3. No Liability</h2>
          <p>
            TowMax, its owners, operators, and contributors are not liable for any errors,
            inaccuracies, omissions, or damages resulting from the use of this service. Vehicle data
            may be outdated, incomplete, or inaccurate. Users assume all responsibility for
            decisions made based on TowMax information.
          </p>

          <h2 className={styles.sectionHeading}>4. User Responsibilities</h2>
          <p>Users are responsible for:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Verifying all towing information with official sources</li>
            <li>Following all applicable laws and regulations</li>
            <li>Ensuring vehicle safety before and during towing</li>
            <li>Maintaining insurance coverage</li>
            <li>Not misusing the service or accessing it through unauthorized means</li>
          </ul>

          <h2 className={styles.sectionHeading}>5. Data Usage</h2>
          <p>
            VIN lookups, vehicle data, and usage information may be collected and processed
            according to our Privacy Policy. By using TowMax, you consent to this data collection.
          </p>

          <h2 className={styles.sectionHeading}>6. Account Responsibilities</h2>
          <p>If you create an account, you are responsible for:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us of unauthorized access</li>
          </ul>

          <h2 className={styles.sectionHeading}>7. Service Modifications</h2>
          <p>
            TowMax reserves the right to modify or discontinue the service at any time, with or
            without notice. We are not liable for any modifications or discontinuation of the
            service.
          </p>

          <h2 className={styles.sectionHeading}>8. Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the
            Commonwealth of Massachusetts, and you irrevocably submit to the exclusive jurisdiction
            of the courts in that location.
          </p>

          <h2 className={styles.sectionHeading}>9. Contact</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us through the
            application or submit a support request.
          </p>

          <p className={styles.lastUpdated}>Last updated: April 2026</p>
        </div>
      </div>
    </div>
  );
}
