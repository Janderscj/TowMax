import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLookup } from './contexts/LookupContext';
import WelcomeScreen from './screens/WelcomeScreen';
import VinEntryScreen from './screens/VinEntryScreen';
import VinLoadingScreen from './screens/VinLoadingScreen';
import ProfileLoadingScreen from './screens/ProfileLoadingScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import RangeResultScreen from './screens/RangeResultScreen';
import RangeFallbackScreen from './screens/RangeFallbackScreen';
import ExactResultScreen from './screens/ExactResultScreen';
import LoginScreen from './screens/LoginScreen';
import GarageScreen from './screens/GarageScreen';
import GarageVehicleDetailsScreen from './screens/GarageVehicleDetailsScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import TermsOfService from './screens/TermsOfService';
import PrivacyPolicy from './screens/PrivacyPolicy';
import VinBreakdownScreen from './screens/VinBreakdownScreen';
import PrototypeBanner from './components/PrototypeBanner';
import AppShell from './components/AppShell';
import ScrollToTop from './components/ScrollToTop';
import { supabase } from './utils/supabase';
import { API_URL } from './utils/apiConfig';
import { useEffect, useCallback } from 'react';

function ProtectedRoute({ children }) {
  const { user, loading: authLoading, profileLoading } = useAuth();

  if (authLoading || (user && profileLoading)) {
    return <ProfileLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Protected routes that deny guest access (require authenticated user)
function GuestDeniedRoute({ children, guestMessage }) {
  const { user, loading: authLoading, profileLoading, isGuest } = useAuth();

  if (authLoading || (user && profileLoading)) {
    return <ProfileLoadingScreen />;
  }

  if (!user || isGuest) {
    // Store the message in sessionStorage so LoginScreen can display it
    if (isGuest) {
      sessionStorage.setItem(
        'guestDenialMessage',
        guestMessage || 'Please sign in to access this feature.'
      );
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GarageDetailsWrapper() {
  const {
    selectedGarageVehicle,
    clearLookupState,
    setSelectedGarageVehicle,
    setLookupOrigin,
    setError,
    signOut,
    resetAll,
  } = useLookup();
  const { isGuest } = useAuth();
  const navigate = useNavigate();

  const goToGarage = () => {
    clearLookupState();
    setSelectedGarageVehicle(null);
    setLookupOrigin('garage');
    setError(null);
    navigate('/garage');
  };

  const handleGlobalSignOut = async () => {
    try {
      await signOut();
      resetAll();
      navigate('/');
    } catch (err) {
      console.error('Global sign out error:', err);
    }
  };

  if (!selectedGarageVehicle) {
    return <Navigate to="/garage" replace />;
  }

  return (
    <GarageVehicleDetailsScreen
      vehicle={selectedGarageVehicle}
      onBack={goToGarage}
      onHome={() => navigate('/')}
      onSignOut={handleGlobalSignOut}
      isGuest={isGuest}
      onLogin={() => navigate('/login')}
    />
  );
}

function QuestionsWrapper() {
  const {
    decoded,
    initialMissing,
    initialOptions,
    matches,
    answers,
    handleRefineAnswer,
    resetAll,
    signOut,
  } = useLookup();
  const { isGuest } = useAuth();
  const navigate = useNavigate();

  const handleGlobalSignOut = async () => {
    try {
      await signOut();
      resetAll();
      navigate('/');
    } catch (err) {
      console.error('Global sign out error:', err);
    }
  };

  const handleAnswer = async (field, value) => {
    const result = await handleRefineAnswer(field, value);
    if (result === 'exact') {
      navigate('/results/exact');
    } else if (result === 'range-fallback') {
      navigate('/range-fallback');
    } else if (result === 'error') {
      navigate('/');
    }
    // For "questions", stay on current page
  };

  if (!decoded) {
    return <Navigate to="/" replace />;
  }

  return (
    <QuestionsScreen
      decoded={decoded}
      missing={initialMissing}
      options={initialOptions}
      matches={matches}
      answers={answers}
      onAnswer={handleAnswer}
      onBack={() => navigate('/results/range')}
      onHome={() => navigate('/')}
      onSignOut={handleGlobalSignOut}
      isRefining={false} // This will be handled internally
      isGuest={isGuest}
      onLogin={() => navigate('/login')}
    />
  );
}

function VinBreakdownWrapper() {
  const { decoded, vin, signOut, resetAll } = useLookup();
  const { isGuest } = useAuth();
  const navigate = useNavigate();

  const handleGlobalSignOut = async () => {
    try {
      await signOut();
      resetAll();
      navigate('/');
    } catch (err) {
      console.error('Global sign out error:', err);
    }
  };

  return (
    <VinBreakdownScreen
      vehicle={
        decoded
          ? {
              year: decoded.year,
              make: decoded.make,
              model: decoded.model,
              trim: decoded.series,
              vin: vin,
            }
          : null
      }
      rawVinData={decoded?.raw}
      onBack={() => navigate(-1)}
      onHome={() => navigate('/')}
      onSignOut={handleGlobalSignOut}
      isGuest={isGuest}
      onLogin={() => navigate('/login')}
    />
  );
}

function AuthenticatedRoutes() {
  const { user, profile, profileError, signOut, refetchProfile, isDealer, isGuest } = useAuth();

  const {
    vin,
    setVin,
    result,
    matches,
    answers,
    error,
    setError,
    lookupOrigin,
    setLookupOrigin,
    garageSaveLoading,
    garageSaveError,
    setGarageSaveError,
    showUpgradePrompt,
    setShowUpgradePrompt,
    setSelectedGarageVehicle,
    setGarageCount,
    setGarageCountLoading,
    decoded,
    vinDecoding,
    garageLimit,
    garageLimitReached,
    canAddVehicleToGarage,
    clearLookupState,
    resetAll,
    decodeVin,
    performGarageSave,
  } = useLookup();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get VIN from URL params if present
  useEffect(() => {
    const vinParam = searchParams.get('vin');
    if (vinParam) {
      setVin(vinParam);
    }
  }, [searchParams, setVin]);

  useEffect(() => {
    const loadGarageCount = async () => {
      if (!user || isDealer || !profile) return;

      try {
        setGarageCountLoading(true);
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return;

        const response = await fetch(`${API_URL}/api/garage`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return;

        const garage = await response.json();
        if (Array.isArray(garage)) {
          setGarageCount(garage.length);
        }
      } catch (err) {
        console.error('Failed to load garage count:', err);
      } finally {
        setGarageCountLoading(false);
      }
    };

    loadGarageCount();
  }, [user, isDealer, profile, garageLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGlobalSignOut = async () => {
    try {
      await signOut();
      resetAll();
      navigate('/');
    } catch (err) {
      console.error('Global sign out error:', err);
    }
  };

  const goToGarage = () => {
    clearLookupState();
    setSelectedGarageVehicle(null);
    setLookupOrigin('garage');
    setError(null);
    navigate('/garage');
  };

  const goToGarageDetails = (vehicle) => {
    setSelectedGarageVehicle(vehicle);
    navigate(`/garage/${vehicle.id}`);
  };

  const goToVinLookup = (preVin = '', options = {}) => {
    const origin = options.origin || 'welcome';
    setVin(preVin);
    setLookupOrigin(origin);
    setGarageSaveError(null);
    setShowUpgradePrompt(false);
    setError(null);
    navigate(`/vin${preVin ? `?vin=${preVin}` : ''}`);
  };

  const saveVehicleToGarageFromExact = async () => performGarageSave({ navigateOnSuccess: false });

  // Handle navigation after VIN decode (memoized to prevent dependency issues)
  const handleVinDecoded = useCallback(() => {
    if (matches.length === 1) {
      navigate('/results/exact');
    } else if (matches.length > 1) {
      navigate('/results/range');
    } else {
      setError('No towing data found for this vehicle.');
      navigate('/');
    }
  }, [matches, navigate, setError]);

  // Call handleVinDecoded when result changes
  useEffect(() => {
    if (result && !error) {
      handleVinDecoded();
    }
  }, [result, error, handleVinDecoded]);

  if (!profile && !isGuest) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.profileErrorContainer}>
          <h2 style={styles.profileErrorTitle}>We couldn\'t load your account</h2>
          <p style={styles.profileErrorText}>
            {profileError || 'Your session was restored, but your profile data is unavailable.'}
          </p>
          <button style={styles.primaryButton} onClick={() => refetchProfile()}>
            Retry
          </button>
          <button style={styles.secondaryButton} onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <WelcomeScreen
            error={error}
            onGetStarted={() => {
              setError(null);
              navigate('/vin');
            }}
            onGarage={goToGarage}
            showGarage={!isDealer && !isGuest}
            onHome={() => navigate('/')}
            onSignOut={handleGlobalSignOut}
            isGuest={isGuest}
            onLogin={() => navigate('/login')}
            onUpgrade={() => navigate('/upgrade')}
          />
        }
      />
      <Route
        path="/vin"
        element={
          vinDecoding ? (
            <VinLoadingScreen />
          ) : (
            <VinEntryScreen
              vin={vin}
              setVin={setVin}
              onBack={() => {
                setError(null);
                navigate(lookupOrigin === 'garage' ? '/garage' : '/');
              }}
              onDecode={decodeVin}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          )
        }
      />
      <Route
        path="/results/range"
        element={
          matches.length > 1 && decoded ? (
            <RangeResultScreen
              decoded={decoded}
              minTow={Math.min(...matches.map((m) => m.maxTow || 0))}
              maxTow={Math.max(...matches.map((m) => m.maxTow || 0))}
              onRefine={() => navigate('/questions')}
              onNewSearch={() => (lookupOrigin === 'garage' ? navigate('/garage') : navigate('/'))}
              onBack={() => navigate('/vin')}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/results/exact"
        element={
          decoded && matches.length === 1 ? (
            <ExactResultScreen
              decoded={decoded}
              vin={vin}
              match={matches[0]}
              answers={answers}
              showAddVehicle={!isDealer}
              canAddVehicle={canAddVehicleToGarage}
              garageLimitReached={garageLimitReached}
              onAddVehicle={saveVehicleToGarageFromExact}
              onViewGarage={goToGarage}
              addVehicleLoading={garageSaveLoading}
              addVehicleError={garageSaveError}
              showUpgradePrompt={showUpgradePrompt}
              onDismissUpgradePrompt={() => setShowUpgradePrompt(false)}
              onNewSearch={lookupOrigin === 'garage' ? goToGarage : () => navigate('/')}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="/questions" element={<QuestionsWrapper />} />
      <Route
        path="/range-fallback"
        element={
          decoded && matches.length > 0 ? (
            <RangeFallbackScreen
              decoded={decoded}
              minTow={Math.min(...matches.map((m) => m.maxTow || 0))}
              maxTow={Math.max(...matches.map((m) => m.maxTow || 0))}
              onRecheck={() => navigate('/questions')}
              onNewSearch={lookupOrigin === 'garage' ? goToGarage : () => navigate('/')}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/garage"
        element={
          <GuestDeniedRoute guestMessage="Please sign in to save vehicles to your garage.">
            <GarageScreen
              onVinSelect={(selectedVin) =>
                goToVinLookup(selectedVin, { origin: 'garage', saveToGarage: false })
              }
              onVehicleClick={goToGarageDetails}
              onAddVehicle={() => goToVinLookup('', { origin: 'garage', saveToGarage: true })}
              onBack={() => navigate('/')}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          </GuestDeniedRoute>
        }
      />
      <Route
        path="/garage/:id"
        element={
          <GuestDeniedRoute guestMessage="Please sign in to view saved vehicles.">
            <GarageDetailsWrapper />
          </GuestDeniedRoute>
        }
      />
      <Route
        path="/upgrade"
        element={
          <GuestDeniedRoute guestMessage="Please sign in to upgrade to Premium.">
            <UpgradeScreen
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
              isGuest={isGuest}
              onLogin={() => navigate('/login')}
            />
          </GuestDeniedRoute>
        }
      />
      <Route
        path="/terms"
        element={
          <TermsOfService
            onHome={() => navigate('/')}
            onSignOut={handleGlobalSignOut}
            isGuest={isGuest}
            onLogin={() => navigate('/login')}
          />
        }
      />
      <Route
        path="/privacy"
        element={
          <PrivacyPolicy
            onHome={() => navigate('/')}
            onSignOut={handleGlobalSignOut}
            isGuest={isGuest}
            onLogin={() => navigate('/login')}
          />
        }
      />
      <Route path="/vin/full" element={<VinBreakdownWrapper />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <PrototypeBanner />
              <ScrollToTop />
              <AuthenticatedRoutes />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return <AppContent />;
}

const styles = {
  profileErrorContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '24px',
    color: '#e0e0e0',
    textAlign: 'center',
  },
  profileErrorTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 600,
  },
  profileErrorText: {
    margin: 0,
    color: '#a0a0a0',
    lineHeight: 1.5,
  },
  primaryButton: {
    width: '100%',
    maxWidth: '240px',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#ff8c00',
    color: '#111',
    fontWeight: 600,
    cursor: 'pointer',
  },
  secondaryButton: {
    width: '100%',
    maxWidth: '240px',
    padding: '12px 16px',
    border: '1px solid #444',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    color: '#e0e0e0',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default App;
