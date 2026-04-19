import { useNavigate } from 'react-router-dom';
import { RotateCcw, Search } from 'lucide-react';
import AppHeader from '../components/AppHeader';

/**
 * RangeFallbackScreen
 *
 * Displayed when refine answers return zero exact-match configurations.
 * Instead of dead-ending the user, we preserve the prior valid configurations
 * and display the towing range they represent.
 *
 * Fallback condition (checked in App.js handleRefineAnswer):
 *   - refine returned towingMatches.length === 0
 *   - prior matches array is still non-empty (i.e. there ARE known configurations)
 *   - We did NOT overwrite matches with an empty array, so minTow/maxTow are still valid
 */
export default function RangeFallbackScreen({
  decoded,
  minTow,
  maxTow,
  onRecheck, // → navigate back to MissingInfoQuestions / QuestionsScreen
  onNewSearch, // → navigate to VIN input screen
  onHome,
  onSignOut,
  isGuest = false,
  onLogin,
}) {
  const navigate = useNavigate();
  const iconBtnStyle = {
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.22)',
    borderRadius: '8px',
    color: '#fff',
    cursor: 'pointer',
  };

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
          title="Refine Results"
          showBackButton={true}
          onBack={onRecheck || (() => navigate('/results/range'))}
          onHome={onHome}
          onSignOut={onSignOut}
          isGuest={isGuest}
          onLogin={onLogin}
        />

        {/* ─── Hero section ─── */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '32px',
          }}
        >
          {/* Amber/orange icon to match app palette, uses Search to signal "investigating" */}
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
            <Search size={40} color="#000" />
          </div>

          <h2
            style={{
              fontSize: '26px',
              fontWeight: '700',
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            No Exact Match Found
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '32px',
              lineHeight: '1.5',
            }}
          >
            Your answers didn&apos;t match a single configuration,
            <br />
            but a towing range is still available.
          </p>
        </div>

        {/* ─── Vehicle card ─── */}
        {decoded && (
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
              YOUR VEHICLE
            </div>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              {decoded.year} {decoded.make} {decoded.model}
            </div>
            <div style={{ fontSize: '14px', color: '#aaa' }}>{decoded.series}</div>
          </div>
        )}

        {/* ─── Range display ─── */}
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
            Closest Towing Range
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
            {minTow.toLocaleString()} – {maxTow.toLocaleString()}
          </div>
          <div style={{ fontSize: '16px', color: '#aaa' }}>pounds</div>
        </div>

        {/* ─── Explanatory note ─── */}
        <div
          style={{
            background: 'rgba(255,140,0,0.06)',
            border: '1px solid rgba(255,140,0,0.18)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#ffb347',
            lineHeight: '1.6',
          }}
        >
          <strong>No exact configuration matched your selections.</strong> The range above
          represents all remaining possible towing ratings for your vehicle. Verify final capacity
          in your owner&apos;s manual or window sticker.
        </div>

        {/* ─── Action buttons ─── */}

        {/* Recheck options → back to questions screen */}
        <button
          onClick={onRecheck}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <RotateCcw size={18} />
          Recheck options?
        </button>

        {/* Try new VIN → back to VIN entry */}
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
          Try new VIN
        </button>
      </div>
    </div>
  );
}
