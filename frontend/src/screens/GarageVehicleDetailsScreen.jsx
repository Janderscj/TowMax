import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';
import VinBreakdownScreen from './VinBreakdownScreen';
import AppHeader from '../components/AppHeader';

export default function GarageVehicleDetailsScreen({
  vehicle,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [matches, setMatches] = useState([]);
  // Controls whether the full VIN breakdown sub-screen is shown
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    if (!vehicle?.vin) {
      setError('Vehicle VIN is missing.');
      setLoading(false);
      return;
    }

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        const token = session?.access_token;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/api/towing/${vehicle.vin}`, { headers });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to load towing details.');
        }

        setDecoded(payload.decoded || null);
        setMatches(payload.towingMatches || []);
      } catch (err) {
        setError(err.message || 'Unable to load towing details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [vehicle, API_URL]); // eslint-disable-line react-hooks/exhaustive-deps

  const towingSummary = useMemo(() => {
    if (!matches.length) {
      return { type: 'none' };
    }

    if (matches.length === 1) {
      const match = matches[0];
      return {
        type: 'exact',
        maxTow: match.maxTow,
        gcwr: match.gcwr,
        payload: match.payload,
      };
    }

    const capacities = matches.map((m) => m.maxTow).filter((value) => typeof value === 'number');
    if (!capacities.length) {
      return { type: 'multiple' };
    }

    return {
      type: 'range',
      minTow: Math.min(...capacities),
      maxTow: Math.max(...capacities),
      combinations: matches.length,
    };
  }, [matches]);

  const decodedPairs = useMemo(() => {
    if (!decoded) return [];

    return Object.entries(decoded)
      .filter(
        ([key, value]) => key !== 'raw' && value !== null && value !== undefined && value !== ''
      )
      .map(([key, value]) => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase()),
        value,
      }));
  }, [decoded]);

  // Render the full VIN breakdown sub-screen when requested.
  // Uses internal state so App.js navigation stays unchanged.
  if (showBreakdown) {
    return (
      <VinBreakdownScreen
        vehicle={vehicle}
        rawVinData={decoded?.raw}
        onBack={() => setShowBreakdown(false)}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />
    );
  }

  return (
    <div style={styles.container}>
      <AppHeader
        title="Vehicle Details"
        showBackButton={true}
        onBack={onBack}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <div style={styles.vehicleCard}>
        <p style={styles.vehicleName}>
          {vehicle?.year} {vehicle?.make} {vehicle?.model}
          {vehicle?.trim ? ` ${vehicle.trim}` : ''}
        </p>
        <p style={styles.vehicleMeta}>VIN: {vehicle?.vin}</p>
      </div>

      {loading && <div style={styles.loading}>Loading towing details...</div>}
      {error && <div style={styles.error}>{error}</div>}

      {!loading && !error && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Towing Information</h2>

            {towingSummary.type === 'exact' && (
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Exact Maximum Tow</p>
                <p style={styles.summaryValue}>
                  {(towingSummary.maxTow || 0).toLocaleString()} lbs
                </p>
                <p style={styles.summaryMeta}>
                  GCWR: {towingSummary.gcwr ? `${towingSummary.gcwr.toLocaleString()} lbs` : 'N/A'}
                </p>
                <p style={styles.summaryMeta}>
                  Payload:{' '}
                  {towingSummary.payload ? `${towingSummary.payload.toLocaleString()} lbs` : 'N/A'}
                </p>
              </div>
            )}

            {towingSummary.type === 'range' && (
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Estimated Towing Range</p>
                <p style={styles.summaryValue}>
                  {towingSummary.minTow.toLocaleString()} - {towingSummary.maxTow.toLocaleString()}{' '}
                  lbs
                </p>
                <p style={styles.summaryMeta}>
                  Based on {towingSummary.combinations} possible configurations for this VIN.
                </p>
              </div>
            )}

            {towingSummary.type === 'multiple' && (
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>Multiple Configurations Found</p>
                <p style={styles.summaryMeta}>
                  Exact towing numbers are unavailable for this saved VIN.
                </p>
              </div>
            )}

            {towingSummary.type === 'none' && (
              <div style={styles.summaryCard}>
                <p style={styles.summaryLabel}>No Towing Match Found</p>
                <p style={styles.summaryMeta}>We could not map this VIN to a towing record.</p>
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Decoded VIN Data</h2>
            <div style={styles.decodedGrid}>
              {decodedPairs.map((field) => (
                <div key={field.key} style={styles.decodedRow}>
                  <span style={styles.decodedLabel}>{field.label}</span>
                  <span style={styles.decodedValue}>{String(field.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Show breakdown button only when raw NHTSA data is available */}
          {decoded?.raw && decoded.raw.length > 0 && (
            <button onClick={() => setShowBreakdown(true)} style={styles.breakdownButton}>
              View Full VIN Breakdown
            </button>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: '#fff',
    padding: '20px',
    fontFamily: '"Space Mono", monospace',
  },
  vehicleCard: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '18px',
  },
  vehicleName: {
    margin: 0,
    fontWeight: '700',
    fontSize: '1rem',
  },
  vehicleMeta: {
    margin: '6px 0 0',
    color: '#b0b0b0',
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '24px 0',
    color: '#ccc',
  },
  error: {
    textAlign: 'center',
    padding: '16px',
    borderRadius: '10px',
    background: 'rgba(244,67,54,0.14)',
    border: '1px solid rgba(244,67,54,0.25)',
    color: '#ef9a9a',
    marginBottom: '16px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 10px',
    fontSize: '1.05rem',
  },
  summaryCard: {
    background: 'rgba(255,140,0,0.10)',
    border: '1px solid rgba(255,140,0,0.25)',
    borderRadius: '12px',
    padding: '14px',
  },
  summaryLabel: {
    margin: 0,
    color: '#ffcc80',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  summaryValue: {
    margin: '8px 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
  },
  summaryMeta: {
    margin: '4px 0 0',
    color: '#ddd',
    fontSize: '0.9rem',
  },
  decodedGrid: {
    display: 'grid',
    gap: '8px',
  },
  decodedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  decodedLabel: {
    color: '#bdbdbd',
    fontSize: '0.85rem',
  },
  decodedValue: {
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'right',
  },
  breakdownButton: {
    width: '100%',
    marginTop: '8px',
    padding: '14px',
    background: 'rgba(255,140,0,0.12)',
    border: '1px solid rgba(255,140,0,0.35)',
    borderRadius: '12px',
    color: '#ff8c00',
    fontFamily: '"Space Mono", monospace',
    fontSize: '0.9rem',
    fontWeight: '700',
    cursor: 'pointer',
    letterSpacing: '0.03em',
  },
};
