import QuestionAxleRatio from './QuestionAxleRatio';
import QuestionBedLength from './QuestionBedLength';
import QuestionTowPackage from './QuestionTowPackage';

export default function MissingInfoQuestions({
  missing = [],
  options,
  matches = [],
  decoded,
  currentAnswers = {},
  onAnswer,
  isLoading = false,
}) {
  if (!Array.isArray(missing) || missing.length === 0) return null;

  // Calculate progress based on how many questions have been answered
  const totalQuestions = missing.length;
  const answeredQuestions = missing.filter((field) => currentAnswers[field]).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div style={styles.container}>
      {/* Decorative background */}
      <div style={styles.background} />

      <div style={styles.content}>
        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>Refine Your Results</div>
          <h2 style={styles.title}>Answer a few questions</h2>
          <p style={styles.subtitle}>Help us narrow down your exact towing capacity</p>
        </div>

        {/* Questions */}
        <div style={styles.questions}>
          {missing.includes('axleRatio') && (
            <QuestionAxleRatio
              options={options}
              matches={matches}
              decoded={decoded}
              currentAnswers={currentAnswers}
              currentValue={currentAnswers.axleRatio}
              onAnswer={onAnswer}
              disabled={isLoading}
            />
          )}

          {missing.includes('bed') && (
            <div style={{ marginTop: missing.includes('axleRatio') ? '32px' : '0' }}>
              <QuestionBedLength
                options={options}
                matches={matches}
                currentValue={currentAnswers.bed}
                onAnswer={onAnswer}
                disabled={isLoading}
              />
            </div>
          )}

          {missing.includes('towPackage') && (
            <div
              style={{
                marginTop: missing.includes('axleRatio') || missing.includes('bed') ? '32px' : '0',
              }}
            >
              <QuestionTowPackage
                options={options}
                matches={matches}
                currentValue={currentAnswers.towPackage}
                onAnswer={onAnswer}
                disabled={isLoading}
              />
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <div style={styles.loadingText}>Refining results...</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '430px',
    margin: '0 auto',
    padding: '24px',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: '#e0e0e0',
    fontFamily: '"Space Mono", monospace',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: '-50%',
    right: '-30%',
    width: '500px',
    height: '500px',
    background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  progressBar: {
    height: '4px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '2px',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff8c00 0%, #ff6b00 100%)',
    transition: 'width 0.3s ease',
  },
  header: {
    marginBottom: '32px',
  },
  badge: {
    fontSize: '13px',
    color: '#ff8c00',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
    fontWeight: '500',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    lineHeight: '1.5',
    margin: 0,
  },
  questions: {
    display: 'flex',
    flexDirection: 'column',
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(255,140,0,0.2)',
    borderTop: '4px solid #ff8c00',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    marginTop: '16px',
    fontSize: '14px',
    color: '#ff8c00',
    fontWeight: '600',
  },
};

// Add spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  if (!document.querySelector('style[data-spinner]')) {
    styleSheet.setAttribute('data-spinner', 'true');
    document.head.appendChild(styleSheet);
  }
}
