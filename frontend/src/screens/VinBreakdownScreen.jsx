import { useMemo } from 'react';
import AppHeader from '../components/AppHeader';
import PremiumGate from '../components/PremiumGate';
/**
 * VinBreakdownScreen
 *
 * Displays a full alphabetically-sorted list of every decoded VIN field
 * sourced from the raw NHTSA API response (decoded.raw).
 *
 * Filtering rules applied before display:
 *  - Exclude entries where Value === "Not Applicable"
 *  - Exclude entries where Value === "" (empty string)
 *  - Exclude entries where Value is null or undefined
 *
 * The backend already strips null/"" before storing raw, but we re-check
 * here to handle vehicles added before that backend logic was in place.
 *
 * TODO: enforce premium access here when gating is ready
 */
export default function VinBreakdownScreen({ vehicle, rawVinData, onBack, onHome, onSignOut }) {
  const breakdownFields = useMemo(() => {
    if (!rawVinData || !Array.isArray(rawVinData)) return [];

    return (
      rawVinData
        // Exclude non-applicable, empty, or missing values
        .filter(
          (item) =>
            item.Value !== 'Not Applicable' &&
            item.Value !== '' &&
            item.Value !== null &&
            item.Value !== undefined
        )
        // Map each NHTSA entry to a clean { label, value } pair
        .map((item) => ({
          label: item.Variable,
          value: item.Value,
        }))
        // Sort alphabetically by label for easy scanning
        .sort((a, b) => a.label.localeCompare(b.label))
    );
  }, [rawVinData]);

  return (
    <PremiumGate onBack={onBack}>
      <div style={styles.container}>
        <AppHeader
          title="Full VIN Breakdown"
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
        />

        {/* Vehicle identity card */}
        <div style={styles.vehicleCard}>
          <p style={styles.vehicleName}>
            {vehicle?.year} {vehicle?.make} {vehicle?.model}
            {vehicle?.trim ? ` ${vehicle.trim}` : ''}
          </p>
          <p style={styles.vehicleMeta}>VIN: {vehicle?.vin}</p>
        </div>

        {breakdownFields.length === 0 ? (
          /*
           * Empty state: raw data missing or entirely filtered out.
           * Most likely for vehicles added before raw data was stored.
           * Removing and re-adding the vehicle will refresh its data.
           */
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No VIN breakdown data available for this vehicle.</p>
            <p style={styles.emptySubtext}>
              This can happen for vehicles added before this feature was introduced. Try removing
              and re-adding the vehicle to refresh its data.
            </p>
          </div>
        ) : (
          <>
            <p style={styles.fieldCount}>{breakdownFields.length} fields decoded</p>

            {/* Two-column field list: label left, value right */}
            <div style={styles.fieldList}>
              {breakdownFields.map((field) => (
                <div key={field.label} style={styles.fieldRow}>
                  <span style={styles.fieldLabel}>{field.label}</span>
                  <span style={styles.fieldValue}>{String(field.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </PremiumGate>
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
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    borderRadius: '10px',
    padding: '10px 12px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  title: {
    fontSize: '1.8rem',
    margin: '0 0 16px',
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
  fieldCount: {
    margin: '0 0 12px',
    color: '#888',
    fontSize: '0.85rem',
  },
  fieldList: {
    display: 'grid',
    gap: '6px',
  },
  fieldRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  fieldLabel: {
    color: '#bdbdbd',
    fontSize: '0.82rem',
    flexShrink: 0,
    maxWidth: '55%',
  },
  fieldValue: {
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: '600',
    textAlign: 'right',
    wordBreak: 'break-word',
  },
  emptyState: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
  },
  emptyText: {
    margin: '0 0 10px',
    fontSize: '0.95rem',
    color: '#ccc',
  },
  emptySubtext: {
    margin: 0,
    fontSize: '0.82rem',
    color: '#888',
    lineHeight: 1.6,
  },
};
