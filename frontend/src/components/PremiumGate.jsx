import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasRequiredRole } from '../utils/roleUtils';

export default function PremiumGate({ children }) {
  const { profile } = useAuth();

  const allowed = hasRequiredRole(profile?.role, 'premium');

  if (allowed) return children;

  return (
    <div
      style={{
        padding: 24,
        textAlign: 'center',
        color: '#fff',
        background: 'linear-gradient(180deg, #1e1e1e, #111)',
        borderRadius: 12,
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Premium Feature</h2>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Viewing the full VIN breakdown requires a Premium account.
      </p>

      <button
        onClick={() => (window.location.href = '/upgrade')}
        style={{
          padding: '12px 20px',
          borderRadius: 8,
          background: '#4f46e5',
          color: '#fff',
          border: 'none',
          fontSize: 16,
          cursor: 'pointer',
        }}
      >
        Upgrade to Premium
      </button>
    </div>
  );
}
