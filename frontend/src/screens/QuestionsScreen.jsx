import AppHeader from '../components/AppHeader';
import MissingInfoQuestions from '../components/questions/MissingInfoQuestions';

export default function QuestionsScreen({
  decoded,
  missing,
  options,
  matches,
  answers,
  onAnswer,
  onBack,
  onHome,
  onSignOut,
  isRefining,
  isGuest = false,
  onLogin,
}) {
  if (!missing || missing.length === 0) return null;

  const totalQuestions = missing.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
        minHeight: '100vh',
        fontFamily: '"Space Mono", monospace',
        color: '#e0e0e0',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '24px',
      }}
    >
      <div
        style={{
          padding: '24px',
          minHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AppHeader
          title="Refine Your Results"
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />
        {/* Progress Bar */}
        <div
          style={{
            height: '4px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '2px',
            marginBottom: '24px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #ff8c00 0%, #ff6b00 100%)',
              width: `${progress}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Vehicle Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, rgba(255,140,0,0.2) 0%, rgba(255,107,0,0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🚙
          </div>
          <div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '2px',
              }}
            >
              {decoded.year} {decoded.make}
            </div>
            <div style={{ fontSize: '13px', color: '#888' }}>
              {decoded.model} {decoded.series}
            </div>
          </div>
        </div>

        {/* Step Counter */}
        <div
          style={{
            fontSize: '12px',
            color: '#888',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Question {answeredCount + 1} of {totalQuestions}
        </div>

        {/* Header */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.5px',
          }}
        >
          We need a bit more information
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '24px',
          }}
        >
          This helps us determine your exact towing capacity.
        </p>

        {/* Render the questions */}
        <MissingInfoQuestions
          missing={missing}
          options={options}
          matches={matches}
          decoded={decoded}
          currentAnswers={answers}
          onAnswer={onAnswer}
          isLoading={isRefining}
        />
      </div>
    </div>
  );
}
