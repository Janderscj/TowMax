import { AlertCircle, Search } from 'lucide-react';
import AppHeader from '../components/AppHeader';

export default function VinEntryScreen({ vin, setVin, onBack, onDecode, onHome, onSignOut }) {
  const handleDecode = () => {
    if (vin.length === 17) {
      onDecode(vin);
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
          padding: '8px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#999',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <span>9:41</span>
        <span>●●●●●</span>
      </div>

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
          title="VIN Lookup"
          showBackButton={true}
          onBack={onBack}
          onHome={onHome}
          onSignOut={onSignOut}
        />

        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}
        >
          Enter Your VIN
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: '#888',
            marginBottom: '32px',
            lineHeight: '1.5',
          }}
        >
          Your 17-character Vehicle Identification Number
        </p>

        <div style={{ flex: 1 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '2px solid rgba(255,140,0,0.3)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              position: 'relative',
            }}
          >
            <input
              type="text"
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              placeholder="1GCUYEED8NZ123456"
              maxLength={17}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                fontFamily: '"Space Mono", monospace',
                letterSpacing: '1px',
                outline: 'none',
              }}
            />
            <div
              style={{
                fontSize: '11px',
                color: '#666',
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>17 characters required</span>
              <span>{vin.length}/17</span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(33,150,243,0.1)',
              border: '1px solid rgba(33,150,243,0.2)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              gap: '12px',
              fontSize: '13px',
              color: '#64b5f6',
              lineHeight: '1.5',
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Pro Tip:</strong>
              VIN is located on the driver&apos;s side dashboard or door jamb
            </div>
          </div>
        </div>

        <button
          onClick={handleDecode}
          disabled={vin.length !== 17}
          style={{
            width: '100%',
            padding: '18px',
            background:
              vin.length === 17
                ? 'linear-gradient(135deg, #ff8c00 0%, #ff6b00 100%)'
                : 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '16px',
            color: vin.length === 17 ? '#000' : '#555',
            fontSize: '16px',
            fontWeight: '700',
            cursor: vin.length === 17 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
        >
          Decode VIN
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
