import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // The auth state change will handle navigation
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to TowMate</h1>
        <p style={styles.subtitle}>Your towing capacity companion</p>

        <button onClick={handleGoogleLogin} disabled={loading} style={styles.googleButton}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={styles.googleIcon}
          />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p style={styles.disclaimer}>
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: 'white',
  },
  content: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#ccc',
    marginBottom: '40px',
  },
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    width: '100%',
    maxWidth: '300px',
    padding: '12px 24px',
    backgroundColor: 'white',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '20px',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
  disclaimer: {
    fontSize: '0.9rem',
    color: '#888',
    lineHeight: '1.4',
  },
};

export default LoginScreen;
