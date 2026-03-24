import { X } from 'lucide-react';

function normalizeMake(make) {
  return String(make || '')
    .trim()
    .toLowerCase();
}

export default function HelpModalAxleRatio({ make, onClose, onUseBestGuess, guessSummary }) {
  const brand = normalizeMake(make);
  const isFord = brand.includes('ford');
  const isGm = brand.includes('chevrolet') || brand.includes('gmc') || brand.includes('gm');
  const isRam = brand.includes('ram');
  const isToyotaOrNissan = brand.includes('toyota') || brand.includes('nissan');

  return (
    <div style={styles.backdrop} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.headerRow}>
          <h3 style={styles.title}>How do I find my axle ratio?</h3>
          <button onClick={onClose} style={styles.closeButton} aria-label="Close help modal">
            <X size={16} />
          </button>
        </div>

        <p style={styles.subtitle}>
          Use one of these methods, then choose the matching axle ratio option.
        </p>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Door Sticker</h4>
          <p style={styles.sectionText}>
            Check the driver door jamb label. Look for fields like <strong>AXLE</strong> or{' '}
            <strong>A/TM</strong> depending on brand.
          </p>

          {isFord && (
            <p style={styles.brandHint}>
              Ford: use the door jamb <strong>AXLE</strong> code, then decode it from your build
              sheet lookup.
            </p>
          )}

          {isRam && (
            <p style={styles.brandHint}>
              Ram: the door sticker and equipment listing can both confirm axle ratio.
            </p>
          )}

          {isToyotaOrNissan && (
            <p style={styles.brandHint}>
              Toyota/Nissan: find the <strong>A/TM</strong> field on the door sticker.
            </p>
          )}
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Window Sticker</h4>
          <p style={styles.sectionText}>
            If you have the Monroney/window sticker, check the axle or towing package line item.
          </p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Build Sheet</h4>
          <p style={styles.sectionText}>
            Use your VIN on the manufacturer build sheet lookup page to see factory axle details.
          </p>

          {isFord && (
            <p style={styles.brandHint}>Ford: build sheet lookup is often the quickest source.</p>
          )}

          {isGm && (
            <p style={styles.brandHint}>
              GM: build sheet plus RPO list is best when the axle sticker is unclear.
            </p>
          )}

          {isRam && (
            <p style={styles.brandHint}>
              Ram: use your equipment listing lookup from VIN for axle details.
            </p>
          )}
        </div>

        {isGm && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>RPO Codes (GM only)</h4>
            <p style={styles.sectionText}>
              Check glovebox/service-parts label for RPO codes like <strong>GU6</strong>,{' '}
              <strong>GT4</strong>, or <strong>GT5</strong>.
            </p>
          </div>
        )}

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Use Best Guess</h4>
          <p style={styles.sectionText}>
            If you cannot confirm the exact ratio, we can estimate using engine, trim, drive type,
            tow package, and model year.
          </p>
          {guessSummary && <p style={styles.guessSummary}>{guessSummary}</p>}
          <button onClick={onUseBestGuess} style={styles.bestGuessButton}>
            Use Best Guess
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.72)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 1400,
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    maxHeight: '82vh',
    overflowY: 'auto',
    background: 'linear-gradient(135deg, #141414 0%, #1d1d1d 100%)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    padding: '18px',
    color: '#e8e8e8',
    fontFamily: '"Space Mono", monospace',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    letterSpacing: '-0.2px',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    margin: '0 0 16px',
    color: '#aaa',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  section: {
    padding: '12px 0',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '14px',
    color: '#ffb74d',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
  sectionText: {
    margin: 0,
    color: '#d3d3d3',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  brandHint: {
    margin: '8px 0 0',
    color: '#9ecbff',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  guessSummary: {
    margin: '8px 0 0',
    color: '#9dd7a6',
    fontSize: '12px',
    lineHeight: 1.45,
  },
  bestGuessButton: {
    width: '100%',
    marginTop: '12px',
    padding: '12px 14px',
    border: '1px solid rgba(255,140,0,0.35)',
    borderRadius: '10px',
    background: 'rgba(255,140,0,0.14)',
    color: '#ffb74d',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
