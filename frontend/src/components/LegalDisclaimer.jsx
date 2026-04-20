export default function LegalDisclaimer() {
  return (
    <div
      style={{
        marginTop: '40px',
        padding: '16px',
        background: 'rgba(255, 152, 0, 0.05)',
        border: '1px solid rgba(255, 152, 0, 0.15)',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#999',
        lineHeight: '1.6',
      }}
    >
      <p style={{ margin: '0 0 10px 0' }}>
        <strong>General Accuracy Disclaimer:</strong> TowMax provides informational estimates only.
        Vehicle specifications, towing capacities, and VIN data may contain errors or may not
        reflect modifications, packages, or real‑world conditions. Always verify towing information
        with the vehicle manufacturer or a certified professional before towing.
      </p>
      <p style={{ margin: '0 0 10px 0' }}>
        <strong>Not Professional Advice:</strong> TowMax does not provide legal, mechanical, or
        safety advice. All towing decisions are the responsibility of the user.
      </p>
      <p style={{ margin: 0 }}>
        <strong>Data Sources:</strong> VIN decoding and towing information are derived from publicly
        available or third‑party data sources. TowMax is not affiliated with any vehicle
        manufacturer.
      </p>
    </div>
  );
}
