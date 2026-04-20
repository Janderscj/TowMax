import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import PageTitle from '../components/PageTitle';
import LegalDisclaimer from '../components/LegalDisclaimer';

export default function RangeResultScreen({
  decoded,
  minTow,
  maxTow,
  onRefine,
  onNewSearch,
  onBack,
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const navigate = useNavigate();

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
          showBackButton={true}
          onBack={onBack || (() => navigate('/vin'))}
          onHome={onHome}
          onSignOut={onSignOut}
        />

        <PageTitle>Towing Range Found</PageTitle>

        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <Target size={48} color="#000" />
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            Towing Range Found
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '32px',
            }}
          >
            Based on your vehicle configuration
          </p>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#888',
              marginBottom: '12px',
            }}
          >
            YOUR VEHICLE
          </div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            {decoded.year} {decoded.make} {decoded.model}
          </div>
          <div style={{ fontSize: '14px', color: '#aaa' }}>{decoded.series}</div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(255,140,0,0.15) 0%, rgba(255,107,0,0.1) 100%)',
            border: '2px solid rgba(255,140,0,0.3)',
            borderRadius: '16px',
            padding: '28px 24px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#ff8c00',
              marginBottom: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Towing Capacity Range
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-1px',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff8c00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {minTow.toLocaleString()} - {maxTow.toLocaleString()}
          </div>
          <div style={{ fontSize: '16px', color: '#aaa' }}>pounds</div>
        </div>

        <div
          style={{
            background: 'rgba(33,150,243,0.08)',
            border: '1px solid rgba(33,150,243,0.2)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#64b5f6',
            lineHeight: '1.6',
          }}
        >
          <strong>Multiple configurations detected.</strong> Your exact capacity depends on final
          equipment and options. Consult your owner&apos;s manual for precise specifications.
        </div>

        <button
          onClick={onRefine}
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
            fontFamily: 'inherit',
            marginBottom: '12px',
          }}
        >
          Refine Results
        </button>

        <button
          onClick={onNewSearch}
          style={{
            width: '100%',
            padding: '18px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Start New Search
        </button>

        <LegalDisclaimer />
      </div>
    </div>
  );
}
