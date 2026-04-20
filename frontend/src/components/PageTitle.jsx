export default function PageTitle({ children, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
      <h2
        style={{
          fontSize: 'clamp(22px, 5vw, 28px)',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: '#fff',
          letterSpacing: '-0.5px',
        }}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 'clamp(13px, 2vw, 14px)',
            color: '#999',
            margin: 0,
            fontWeight: '500',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
