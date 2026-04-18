import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasRequiredRole } from '../utils/roleUtils';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PremiumGate({ children, onBack }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

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
        position: 'relative',
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
      )}
      <h2 style={{ marginBottom: 12 }}>Premium Feature</h2>
      <p style={{ opacity: 0.8, marginBottom: 20 }}>
        Viewing the full VIN breakdown requires a Premium account.
      </p>

      <button
        onClick={() => navigate('/upgrade')}
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
