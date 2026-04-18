import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';

export default function ExactResultScreen({
  decoded,
  vin,
  match,
  answers,
  showAddVehicle,
  canAddVehicle,
  garageLimitReached,
  onAddVehicle,
  onViewGarage,
  addVehicleLoading,
  addVehicleError,
  showUpgradePrompt,
  onDismissUpgradePrompt,
  onNewSearch,
  onBack,
  onHome,
  onSignOut,
}) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // Reset local success UI when a new exact-result vehicle is shown.
    setSaveSuccess(false);
  }, [vin, match?.maxTow]);

  const gcwr = match.gcwr ?? 14000;
  const payload = match.payload ?? 1940;
  const shouldDisableAdd = addVehicleLoading || !canAddVehicle;

  const handleGarageButtonClick = async () => {
    if (saveSuccess) {
      onViewGarage();
      return;
    }

    const wasSaved = await onAddVehicle();
    if (wasSaved) {
      setSaveSuccess(true);
    }
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
          title="Vehicle Details"
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
        />
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
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle2 size={48} color="#fff" />
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '12px',
              letterSpacing: '-0.5px',
            }}
          >
            Exact Match Found
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#888',
              marginBottom: '32px',
            }}
          >
            Here&apos;s your precise towing capacity
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
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#888',
                  marginBottom: '8px',
                }}
              >
                YOUR VEHICLE
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '4px',
                }}
              >
                {decoded.year} {decoded.make} {decoded.model}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#aaa',
                  lineHeight: '1.6',
                }}
              >
                {decoded.series}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(46,125,50,0.1) 100%)',
            border: '2px solid rgba(76,175,80,0.3)',
            borderRadius: '16px',
            padding: '32px 24px',
            marginBottom: '24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#81c784',
              marginBottom: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Maximum Towing Capacity
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-2px',
              background: 'linear-gradient(135deg, #ffffff 0%, #4caf50 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {match.maxTow.toLocaleString()}
          </div>
          <div style={{ fontSize: '18px', color: '#aaa' }}>pounds</div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              fontSize: '13px',
            }}
          >
            <div>
              <div style={{ color: '#888', marginBottom: '4px' }}>GCWR</div>
              <div style={{ fontWeight: '600' }}>{gcwr.toLocaleString()} lbs</div>
            </div>
            <div>
              <div style={{ color: '#888', marginBottom: '4px' }}>Payload</div>
              <div style={{ fontWeight: '600' }}>{payload.toLocaleString()} lbs</div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,152,0,0.08)',
            border: '1px solid rgba(255,152,0,0.2)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '24px',
            fontSize: '12px',
            color: '#ffb74d',
            lineHeight: '1.5',
          }}
        >
          <strong>⚠️ Important:</strong> Always verify with your owner&apos;s manual and consider
          payload, tongue weight, and trailer specifications.
        </div>

        {showAddVehicle && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px',
                opacity: saveSuccess ? 1 : 0,
                transform: saveSuccess ? 'scale(1)' : 'scale(0.92)',
                transition: 'opacity 220ms ease, transform 220ms ease',
                color: '#81c784',
                fontSize: '14px',
                fontWeight: 700,
                pointerEvents: 'none',
              }}
              aria-live="polite"
            >
              <CheckCircle2 size={18} />
              Saved!
            </div>

            <button
              onClick={handleGarageButtonClick}
              disabled={saveSuccess ? false : shouldDisableAdd}
              style={{
                width: '100%',
                padding: '18px',
                background: saveSuccess
                  ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                  : shouldDisableAdd
                    ? 'rgba(255,255,255,0.08)'
                    : 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)',
                border: 'none',
                borderRadius: '16px',
                color: shouldDisableAdd && !saveSuccess ? '#aaa' : '#000',
                fontSize: '16px',
                marginBottom: '12px',
                fontWeight: '700',
                cursor: addVehicleLoading
                  ? 'wait'
                  : saveSuccess
                    ? 'pointer'
                    : canAddVehicle
                      ? 'pointer'
                      : 'not-allowed',
                fontFamily: 'inherit',
                opacity: shouldDisableAdd && !saveSuccess ? 0.75 : 1,
                transition: 'background 220ms ease, transform 180ms ease, opacity 180ms ease',
              }}
            >
              {saveSuccess
                ? 'View in My Garage'
                : addVehicleLoading
                  ? 'Adding Vehicle...'
                  : 'Add Vehicle to Garage'}
            </button>

            {garageLimitReached && !saveSuccess && (
              <div
                style={{
                  background: 'rgba(255, 140, 0, 0.12)',
                  border: '1px solid rgba(255, 140, 0, 0.25)',
                  color: '#ffb74d',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                  fontSize: '13px',
                }}
              >
                Your garage is full. Find an exact match first, then upgrade to Premium to save
                unlimited vehicles.
              </div>
            )}

            {addVehicleError && !saveSuccess && (
              <div
                style={{
                  background: 'rgba(244,67,54,0.12)',
                  border: '1px solid rgba(244,67,54,0.25)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  color: '#ef9a9a',
                  fontSize: '13px',
                  lineHeight: '1.5',
                }}
              >
                {addVehicleError}
              </div>
            )}

            {showUpgradePrompt && !saveSuccess && (
              <div
                style={{
                  background: 'rgba(255,140,0,0.1)',
                  border: '1px solid rgba(255,140,0,0.24)',
                  borderRadius: '14px',
                  padding: '18px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: '#ffd180',
                    marginBottom: '8px',
                  }}
                >
                  Garage Full
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#ffcc80',
                    lineHeight: '1.6',
                    marginBottom: '14px',
                  }}
                >
                  Upgrade to Premium to unlock unlimited saved vehicles, then try adding this VIN
                  again.
                </div>
                <button
                  onClick={onDismissUpgradePrompt}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Dismiss
                </button>
              </div>
            )}
          </>
        )}

        <button
          onClick={onNewSearch}
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
          }}
        >
          Check Another Vehicle
        </button>
      </div>
    </div>
  );
}
