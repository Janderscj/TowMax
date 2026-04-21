import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';
import VinBreakdownScreen from './VinBreakdownScreen';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import styles from './GarageVehicleDetailsScreen.module.css';

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
    <div className={styles.container}>
      <AppHeader
        showBackButton={true}
        onBack={onBack}
        onHome={onHome}
        onSignOut={onSignOut}
        isGuest={isGuest}
        onLogin={onLogin}
      />

      <PageTitle>Vehicle Details</PageTitle>
      <div className={styles.vehicleCard}>
        <p className={styles.vehicleName}>
          {vehicle?.year} {vehicle?.make} {vehicle?.model}
          {vehicle?.trim ? ` ${vehicle.trim}` : ''}
        </p>
        <p className={styles.vehicleMeta}>VIN: {vehicle?.vin}</p>
      </div>

      {loading && <div className={styles.loading}>Loading towing details...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {!loading && !error && (
        <>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Towing Information</h2>

            {towingSummary.type === 'exact' && (
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Exact Maximum Tow</p>
                <p className={styles.summaryValue}>
                  {(towingSummary.maxTow || 0).toLocaleString()} lbs
                </p>
                <p className={styles.summaryMeta}>
                  GCWR: {towingSummary.gcwr ? `${towingSummary.gcwr.toLocaleString()} lbs` : 'N/A'}
                </p>
                <p className={styles.summaryMeta}>
                  Payload:{' '}
                  {towingSummary.payload ? `${towingSummary.payload.toLocaleString()} lbs` : 'N/A'}
                </p>
              </div>
            )}

            {towingSummary.type === 'range' && (
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Estimated Towing Range</p>
                <p className={styles.summaryValue}>
                  {towingSummary.minTow.toLocaleString()} - {towingSummary.maxTow.toLocaleString()}{' '}
                  lbs
                </p>
                <p className={styles.summaryMeta}>
                  Based on {towingSummary.combinations} possible configurations for this VIN.
                </p>
              </div>
            )}

            {towingSummary.type === 'multiple' && (
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>Multiple Configurations Found</p>
                <p className={styles.summaryMeta}>
                  Exact towing numbers are unavailable for this saved VIN.
                </p>
              </div>
            )}

            {towingSummary.type === 'none' && (
              <div className={styles.summaryCard}>
                <p className={styles.summaryLabel}>No Towing Match Found</p>
                <p className={styles.summaryMeta}>We could not map this VIN to a towing record.</p>
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Decoded VIN Data</h2>
            <div className={styles.decodedGrid}>
              {decodedPairs.map((field) => (
                <div key={field.key} className={styles.decodedRow}>
                  <span className={styles.decodedLabel}>{field.label}</span>
                  <span className={styles.decodedValue}>{String(field.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Show breakdown button only when raw NHTSA data is available */}
          {decoded?.raw && decoded.raw.length > 0 && (
            <button onClick={() => setShowBreakdown(true)} className={styles.breakdownButton}>
              View Full VIN Breakdown
            </button>
          )}
        </>
      )}
    </div>
  );
}
