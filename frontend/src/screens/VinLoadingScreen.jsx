export default function VinLoadingScreen() {
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
          paddingTop: 'clamp(60px, 12vw, 72px)',
          minHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            border: '3px solid rgba(255,140,0,0.2)',
            borderTop: '3px solid #ff8c00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '24px',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px',
          }}
        >
          Decoding Your VIN
        </h3>

        <p
          style={{
            fontSize: '14px',
            color: '#888',
            textAlign: 'center',
            maxWidth: '280px',
          }}
        >
          Analyzing vehicle specifications and towing data...
        </p>
      </div>
    </div>
  );
}
