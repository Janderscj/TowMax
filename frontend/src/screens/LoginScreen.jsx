import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoMark}>
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

        <h1 style={styles.title}>Welcome to TowMate</h1>
        <p style={styles.subtitle}>Sign in to look up your vehicle's towing capacity</p>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>continue with</span>
          <div style={styles.dividerLine} />
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} style={styles.googleButton}>
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

        <p style={styles.disclaimer}>
          By signing in, you agree to our <span style={styles.link}>terms of service</span> and{' '}
          <span style={styles.link}>privacy policy</span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '380px',
  },
  logoMark: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '0.5px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  title: {
    fontSize: '22px',
    fontWeight: '500',
    color: '#e0e0e0',
    textAlign: 'center',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#888',
    textAlign: 'center',
    margin: '0 0 2rem',
    lineHeight: '1.5',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '1rem',
  },
  dividerLine: {
    flex: 1,
    height: '0.5px',
    background: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: '12px',
    color: '#555',
  },
  googleButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '9px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '400',
    color: '#e0e0e0',
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '12px',
  },
  disclaimer: {
    fontSize: '12px',
    color: '#555',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: '1.25rem 0 0',
  },
  link: {
    color: '#888',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
    cursor: 'pointer',
  },
};

export default LoginScreen;
