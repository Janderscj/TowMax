import { ArrowRight, Car } from 'lucide-react';
import AppHeader from '../components/AppHeader';

export default function WelcomeScreen({
  error,
  onGetStarted,
  onGarage,
  showGarage,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
  onUpgrade,
}) {
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
          position: 'absolute',
          top: '-50%',
          right: '-30%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 40px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <AppHeader
          showBackButton={false}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
          onUpgrade={onUpgrade}
        />

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '13px',
              color: '#ff8c00',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontWeight: '500',
            }}
          >
            Towing Estimator
          </div>

          <h1
            style={{
              fontSize: '42px',
              fontWeight: '700',
              lineHeight: '1.1',
              marginBottom: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff8c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-1px',
            }}
          >
            Know Your Limits
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#b0b0b0',
              marginBottom: '40px',
              maxWidth: '320px',
            }}
          >
            Enter your VIN to discover your vehicle&apos;s estimated towing capacity in seconds.
          </p>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Car size={24} color="#000" />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#fff',
                    marginBottom: '4px',
                    fontWeight: '600',
                  }}
                >
                  Find Your VIN
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#888',
                    lineHeight: '1.4',
                  }}
                >
                  Check driver-side door jamb or windshield base
                </div>
              </div>
            </div>
          </div>

          {error && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: 16 }}>{error}</p>}
        </div>

        {showGarage && (
          <button
            onClick={onGarage}
            style={{
              width: '100%',
              padding: '18px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              marginBottom: '12px',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Car size={20} />
            My Garage
          </button>
        )}

        <button
          onClick={onGetStarted}
          style={{
            width: '100%',
            padding: '18px',
            background: 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)',
            border: 'none',
            borderRadius: '16px',
            color: '#000',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Get Started
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
