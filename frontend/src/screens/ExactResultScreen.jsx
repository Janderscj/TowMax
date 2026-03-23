export default function ExactResultScreen({
  decoded,
  vin,
  match,
  answers,
  showAddVehicle,
  onAddVehicle,
  addVehicleLoading,
  addVehicleError,
  showUpgradePrompt,
  onDismissUpgradePrompt,
  onNewSearch,
}) {
  const gcwr = match.gcwr ?? 14000;
  const payload = match.payload ?? 1940;

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
              fontSize: '40px',
              margin: '0 auto 24px',
            }}
          >
            ✓
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
            <button
              onClick={onAddVehicle}
              disabled={addVehicleLoading}
              style={{
                backgroundColor: '#1e90ff',
                color: 'white',
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: addVehicleLoading ? 'wait' : 'pointer',
                fontSize: '16px',
                marginTop: '20px',
                marginBottom: '12px',
                width: '100%',
                fontWeight: '600',
                opacity: addVehicleLoading ? 0.7 : 1,
              }}
            >
              {addVehicleLoading ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>

            {addVehicleError && (
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

            {showUpgradePrompt && (
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
