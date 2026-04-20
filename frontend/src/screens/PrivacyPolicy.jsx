import AppHeader from '../components/AppHeader';

export default function PrivacyPolicy({ onHome, onSignOut, isGuest = false, onLogin }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        fontFamily: '"Space Mono", monospace',
        color: '#e0e0e0',
        paddingBottom: '40px',
      }}
    >
      <div style={{ padding: '24px' }}>
        <AppHeader
          title="Privacy Policy"
          showBackButton={true}
          onBack={() => window.history.back()}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#ccc',
          }}
        >
          <h2 style={{ color: '#fff', marginTop: '30px' }}>1. Data We Collect</h2>
          <p>TowMax collects and processes the following information:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Account Information:</strong> Email address, name (from Google OAuth profile)
            </li>
            <li>
              <strong>VIN Data:</strong> Vehicle Identification Numbers entered for lookups
            </li>
            <li>
              <strong>Garage Data:</strong> Vehicles saved to your garage
            </li>
            <li>
              <strong>Usage Data:</strong> Lookup history, features accessed, error logs
            </li>
            <li>
              <strong>Device Information:</strong> Browser type, IP address, operating system
            </li>
          </ul>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>2. How We Use Your Data</h2>
          <p>Your data is used for:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Providing and improving the TowMax service</li>
            <li>Authenticating your account</li>
            <li>Storing your vehicle history and preferences</li>
            <li>Analyzing usage patterns to improve user experience</li>
            <li>Detecting and preventing fraud or abuse</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>3. Third‑Party Services</h2>
          <p>TowMax uses the following third‑party services:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Supabase:</strong> Cloud database and authentication provider. Your data is
              encrypted and stored securely.
            </li>
            <li>
              <strong>Google OAuth:</strong> Sign-in authentication provider. Google does not share
              your personal information with TowMax beyond your email and profile name.
            </li>
            <li>
              <strong>NHTSA API:</strong> Vehicle data source for VIN decoding. Public data only.
            </li>
          </ul>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>4. Data Storage and Security</h2>
          <p>
            Your data is stored on Supabase servers with industry-standard encryption. We implement
            security measures to protect against unauthorized access, but no system is completely
            secure. You are responsible for keeping your login credentials confidential.
          </p>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>5. Your Data Rights</h2>
          <p>You have the right to:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Access all data we store about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Delete your account and associated data</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p>
            To exercise these rights, contact us through the application or submit a data request.
          </p>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>6. Cookies and Local Storage</h2>
          <p>TowMax uses:</p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>Session Storage:</strong> Temporary data for the current session (auth tokens,
              lookup state)
            </li>
            <li>
              <strong>Supabase Cookies:</strong> Authentication and session management
            </li>
            <li>
              <strong>No Tracking Cookies:</strong> We do not use third-party tracking or analytics
              cookies.
            </li>
          </ul>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>7. Children's Privacy</h2>
          <p>
            TowMax is not intended for children under 13. We do not knowingly collect data from
            children. If we become aware that we have collected data from a child, we will delete it
            immediately.
          </p>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted here with an
            updated "Last Updated" date. Continued use of TowMax after changes constitutes
            acceptance of the updated policy.
          </p>

          <h2 style={{ color: '#fff', marginTop: '30px' }}>9. Contact</h2>
          <p>
            If you have questions about this Privacy Policy or your data, please contact us through
            the application or submit a data request.
          </p>

          <p style={{ marginTop: '40px', fontSize: '12px', color: '#666' }}>
            Last updated: April 2026
          </p>
        </div>
      </div>
    </div>
  );
}
