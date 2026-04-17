import { Routes, Route, Navigate, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useLookup } from './contexts/LookupContext';
import WelcomeScreen from './screens/WelcomeScreen';
import VinEntryScreen from './screens/VinEntryScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import RangeResultScreen from './screens/RangeResultScreen';
import RangeFallbackScreen from './screens/RangeFallbackScreen';
import ExactResultScreen from './screens/ExactResultScreen';
import LoginScreen from './screens/LoginScreen';
import GarageScreen from './screens/GarageScreen';
import GarageVehicleDetailsScreen from './screens/GarageVehicleDetailsScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import { supabase } from './utils/supabase';
import { useEffect } from 'react';

// API URL from env or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProtectedRoute({ children }) {
  const { user, loading: authLoading, profileLoading } = useAuth();

  if (authLoading || (user && profileLoading)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GarageDetailsWrapper() {
  const { id } = useParams();
  const {
    selectedGarageVehicle,
    clearLookupState,
    setSelectedGarageVehicle,
    setLookupOrigin,
    setError,
    signOut,
    resetAll,
  } = useLookup();
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
    error,
    setError,
    lookupOrigin,
    clearLookupState,
    setSelectedGarageVehicle,
    setLookupOrigin,
    resetAll,
    signOut,
  } = useLookup();
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
    />
  );
}

function AuthenticatedRoutes() {
  const { user, profile, profileError, signOut, refetchProfile, isDealer } = useAuth();

  const {
    vin,
    setVin,
    result,
    matches,
    initialMissing,
    initialOptions,
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
    selectedGarageVehicle,
    setSelectedGarageVehicle,
    garageCount,
    setGarageCount,
    garageCountLoading,
    setGarageCountLoading,
    isRefining,
    decoded,
    garageLimit,
    garageLimitReached,
    canAddVehicleToGarage,
    clearLookupState,
    resetAll,
    decodeVin,
    handleRefineAnswer,
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
      if (!user || isDealer || !profile || garageLimit == null) return;

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
  }, [user, isDealer, profile, garageLimit]);

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

  // Handle navigation after VIN decode
  const handleVinDecoded = () => {
    if (matches.length === 1) {
      navigate('/results/exact');
    } else if (matches.length > 1) {
      navigate('/results/range');
    } else {
      setError('No towing data found for this vehicle.');
      navigate('/');
    }
  };

  // Call handleVinDecoded when result changes
  useEffect(() => {
    if (result && !error) {
      handleVinDecoded();
    }
  }, [result, error]);

  if (!profile) {
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
            showGarage={!isDealer}
            onHome={() => navigate('/')}
            onSignOut={handleGlobalSignOut}
          />
        }
      />
      <Route
        path="/vin"
        element={
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
          />
        }
      />
      <Route
        path="/results/range"
        element={
          decoded && matches.length > 1 ? (
            <RangeResultScreen
              decoded={decoded}
              minTow={Math.min(...matches.map((m) => m.maxTow || 0))}
              maxTow={Math.max(...matches.map((m) => m.maxTow || 0))}
              onRefine={() => navigate('/questions')}
              onNewSearch={lookupOrigin === 'garage' ? goToGarage : () => navigate('/')}
              onHome={() => navigate('/')}
              onSignOut={handleGlobalSignOut}
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
            />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/garage"
        element={
          <GarageScreen
            onVinSelect={(selectedVin) =>
              goToVinLookup(selectedVin, { origin: 'garage', saveToGarage: false })
            }
            onVehicleClick={goToGarageDetails}
            onAddVehicle={() => goToVinLookup('', { origin: 'garage', saveToGarage: true })}
            onHome={() => navigate('/')}
            onSignOut={handleGlobalSignOut}
          />
        }
      />
      <Route path="/garage/:id" element={<GarageDetailsWrapper />} />
      <Route path="/upgrade" element={<UpgradeScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContent() {
  return (
    <div style={styles.appContainer}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AuthenticatedRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return <AppContent />;
}

const styles = {
  appContainer: {
    width: '100%',
    maxWidth: '430px',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  },
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
