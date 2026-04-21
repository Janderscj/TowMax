import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginScreen.module.css';

function LoginScreen() {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();
  const navigate = useNavigate();
  const [guestDenialMessage, setGuestDenialMessage] = useState(null);

  useEffect(() => {
    // Check if there's a guest denial message from a protected route
    const message = sessionStorage.getItem('guestDenialMessage');
    if (message) {
      setGuestDenialMessage(message);
      sessionStorage.removeItem('guestDenialMessage');
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGuestLogin = () => {
    try {
      signInAsGuest();
      navigate('/');
    } catch (error) {
      console.error('Guest login error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoMark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3L4 7.5V12C4 16.1 7.4 20 12 21C16.6 20 20 16.1 20 12V7.5L12 3Z"
              stroke="#888"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M9 12L11 14L15 10"
              stroke="#888"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className={styles.title}>Welcome to Max Tow</h1>
        <p className={styles.subtitle}>Sign in to look up your vehicle's towing capacity</p>

        {guestDenialMessage && (
          <div className={styles.warningBox}>
            <p className={styles.warningText}>{guestDenialMessage}</p>
          </div>
        )}

        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          <span className={styles.dividerText}>continue with</span>
          <div className={styles.dividerLine} />
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} className={styles.googleButton}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <button onClick={handleGuestLogin} disabled={loading} className={styles.guestButton}>
          Continue as Guest
        </button>

        <p className={styles.disclaimer}>
          By signing in, you agree to our{' '}
          <span className={styles.link} onClick={() => navigate('/terms')}>
            terms of service
          </span>{' '}
          and{' '}
          <span className={styles.link} onClick={() => navigate('/privacy')}>
            privacy policy
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
