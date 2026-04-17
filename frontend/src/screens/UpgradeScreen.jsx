export default function UpgradeScreen() {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: '#fff' }}>
      <h1>Upgrade to Premium</h1>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Unlock full VIN breakdowns, unlimited garage vehicles, and more.
      </p>

      <button
        onClick={() => alert('Stripe integration coming soon')}
        style={{
          padding: '14px 24px',
          borderRadius: 8,
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          fontSize: 18,
          cursor: 'pointer',
        }}
      >
        Continue to Checkout
      </button>
    </div>
  );
}
