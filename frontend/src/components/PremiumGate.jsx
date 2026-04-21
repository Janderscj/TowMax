import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasRequiredRole } from '../utils/roleUtils';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PremiumGate.module.css';

export default function PremiumGate({ children, onBack }) {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const allowed = hasRequiredRole(profile?.role, 'premium');

  if (allowed) return children;

  return (
    <div className={styles.modal}>
      {onBack && (
        <button onClick={onBack} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back
        </button>
      )}
      <h2 className={styles.title}>Premium Feature</h2>
      <p className={styles.description}>
        Viewing the full VIN breakdown requires a Premium account.
      </p>

      <button onClick={() => navigate('/upgrade')} className={styles.button}>
        Upgrade to Premium
      </button>
    </div>
  );
}
