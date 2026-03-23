import { useState, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import WelcomeScreen from './screens/WelcomeScreen';
import VinEntryScreen from './screens/VinEntryScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import RangeResultScreen from './screens/RangeResultScreen';
import ExactResultScreen from './screens/ExactResultScreen';
import LoginScreen from './screens/LoginScreen';
import GarageScreen from './screens/GarageScreen';
import GarageVehicleDetailsScreen from './screens/GarageVehicleDetailsScreen';
import { supabase } from './utils/supabase';

// API URL from env or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AppContent() {
  const {
    user,
    profile,
    loading: authLoading,
    profileLoading,
    profileError,
    signOut,
    refetchProfile,
    isDealer,
  } = useAuth();
  const [screen, setScreen] = useState('welcome');
  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState([]);
  const [initialMissing, setInitialMissing] = useState([]);
  const [initialOptions, setInitialOptions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [lookupOrigin, setLookupOrigin] = useState('welcome');
  const [garageSaveMode, setGarageSaveMode] = useState(false);
  const [garageSaveLoading, setGarageSaveLoading] = useState(false);
  const [garageSaveError, setGarageSaveError] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedGarageVehicle, setSelectedGarageVehicle] = useState(null);

  // Cache for VIN responses to prevent redundant API calls
  const vinCacheRef = useRef(new Map());

  const decoded = result?.decoded ?? null;

  const clearLookupState = () => {
    setVin('');
    setResult(null);
    setMatches([]);
    setInitialMissing([]);
    setInitialOptions(null);
    setAnswers({});
    setGarageSaveLoading(false);
    setGarageSaveError(null);
    setShowUpgradePrompt(false);
  };

  // Reset all state
  const resetAll = () => {
    setLookupOrigin('welcome');
    setGarageSaveMode(false);
    setScreen('welcome');
    clearLookupState();
    setError(null);
  };

  if (authLoading || (user && profileLoading)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!profile) {
    return (
      <div style={styles.appContainer}>
        <div style={styles.profileErrorContainer}>
          <h2 style={styles.profileErrorTitle}>We couldn't load your account</h2>
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

  // Authenticated user flow
  const goToGarage = () => {
    clearLookupState();
    setSelectedGarageVehicle(null);
    setLookupOrigin('garage');
    setGarageSaveMode(false);
    setError(null);
    setScreen('garage');
  };

  const goToGarageDetails = (vehicle) => {
    setSelectedGarageVehicle(vehicle);
    setScreen('garageDetails');
  };

  const goToVinLookup = (preVin = '', options = {}) => {
    const origin = options.origin || 'welcome';
    setVin(preVin);
    setLookupOrigin(origin);
    setGarageSaveMode(Boolean(options.saveToGarage));
    setGarageSaveError(null);
    setShowUpgradePrompt(false);
    setError(null);
    setScreen('vin');
  };

  const saveVehicleToGarage = async () => {
    if (!vin) {
      setGarageSaveError('VIN is missing for this vehicle.');
      return;
    }

    try {
      setGarageSaveLoading(true);
      setGarageSaveError(null);
      setShowUpgradePrompt(false);

      const token = user ? (await supabase.auth.getSession()).data.session?.access_token : null;
      if (!token) {
        throw new Error('You must be signed in to save a vehicle.');
      }

      const response = await fetch(`${API_URL}/api/garage/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vin }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && /garage limit reached/i.test(data.error || '')) {
          setShowUpgradePrompt(true);
        }
        setGarageSaveError(data.error || 'Failed to add vehicle to garage.');
        return;
      }

      goToGarage();
    } catch (err) {
      console.error('Error saving vehicle to garage:', err);
      setGarageSaveError('Unable to save this vehicle right now. Please try again.');
    } finally {
      setGarageSaveLoading(false);
    }
  };

  // Decode VIN function with auth
  const decodeVin = async (vinInput) => {
    if (!vinInput) {
      resetAll();
      return;
    }

    try {
      setError(null);
      setVin(vinInput);

      // Check cache first
      if (vinCacheRef.current.has(vinInput)) {
        console.log('Using cached VIN data');
        const cachedData = vinCacheRef.current.get(vinInput);
        processVinResponse(cachedData);
        return;
      }

      setScreen('loading');

      const token = user ? (await supabase.auth.getSession()).data.session?.access_token : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}/api/towing/${vinInput}`, { headers });
      const data = await response.json();

      // Cache the response
      vinCacheRef.current.set(vinInput, data);

      // Better error handling
      if (!response.ok) {
        setError(data.error || `Server error (${response.status})`);
        setScreen(lookupOrigin === 'garage' ? 'vin' : 'welcome');
        return;
      }

      if (data.error) {
        setError(data.error);
        setScreen(lookupOrigin === 'garage' ? 'vin' : 'welcome');
        return;
      }

      processVinResponse(data);
    } catch (err) {
      console.error('Error decoding VIN:', err);
      setError('Unable to connect to server. Please try again.');
      setScreen(lookupOrigin === 'garage' ? 'vin' : 'welcome');
    }
  };

  // Helper function to process VIN response (avoids duplication)
  const processVinResponse = (data) => {
    setResult(data);

    const towingMatches = data.towingMatches || [];
    const missingInfo = data.missingInfo || [];
    const opts = data.options ?? null;

    setMatches(towingMatches);
    setInitialMissing(missingInfo);
    setInitialOptions(opts);

    // Navigate based on results - SHOW RANGE FIRST
    if (towingMatches.length === 1) {
      setScreen('exact');
    } else if (towingMatches.length > 1) {
      setScreen('range'); // Always show range first for multiple matches
    } else {
      setError('No towing data found for this vehicle.');
      setScreen('welcome');
    }
  };

  // Handle refinement answers with auth
  const handleRefineAnswer = async (field, value) => {
    const updated = { ...answers, [field]: value };
    setAnswers(updated);

    try {
      const token = user ? (await supabase.auth.getSession()).data.session?.access_token : null;
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`${API_URL}/api/towing/refine`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ vin, answers: updated }),
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setScreen('welcome');
        return;
      }

      const towingMatches = data.towingMatches || [];
      const newMissing = data.missingInfo || [];

      setMatches(towingMatches);
      setInitialMissing(newMissing);
      setInitialOptions(data.options);

      // Navigate based on refined results
      if (towingMatches.length === 1) {
        setScreen('exact');
      } else if (towingMatches.length > 1) {
        // Stay on questions screen until they get exact match or give up
        setScreen('questions');
      } else {
        setError('No matching configurations found. Please try again.');
        setScreen('welcome');
      }
    } catch (err) {
      console.error('Refine error:', err);
      setError('Server error while refining results. Please try again.');
      setScreen('welcome');
    }
  };

  // Calculate min/max with safety checks
  const minTow = matches.length > 0 ? Math.min(...matches.map((m) => m.maxTow || 0)) : null;
  const maxTow = matches.length > 0 ? Math.max(...matches.map((m) => m.maxTow || 0)) : null;

  const handleGlobalSignOut = async () => {
    try {
      await signOut();
      resetAll();
    } catch (err) {
      console.error('Global sign out error:', err);
    }
  };

  return (
    <div style={styles.appContainer}>
      {screen === 'garage' && (
        <GarageScreen
          onVinSelect={(selectedVin) =>
            goToVinLookup(selectedVin, { origin: 'garage', saveToGarage: false })
          }
          onVehicleClick={goToGarageDetails}
          onAddVehicle={() => goToVinLookup('', { origin: 'garage', saveToGarage: true })}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'garageDetails' && selectedGarageVehicle && (
        <GarageVehicleDetailsScreen
          vehicle={selectedGarageVehicle}
          onBack={goToGarage}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'welcome' && (
        <WelcomeScreen
          error={error}
          onGetStarted={() => {
            setError(null);
            setScreen('vin');
          }}
          onGarage={goToGarage}
          showGarage={!isDealer}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'vin' && (
        <VinEntryScreen
          vin={vin}
          setVin={setVin}
          onBack={() => {
            setError(null);
            setScreen(lookupOrigin === 'garage' ? 'garage' : 'welcome');
          }}
          onDecode={decodeVin}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'loading' && <LoadingScreen />}

      {screen === 'questions' && decoded && (
        <QuestionsScreen
          decoded={decoded}
          missing={initialMissing}
          options={initialOptions}
          answers={answers}
          onAnswer={handleRefineAnswer}
          onBack={() => setScreen('range')}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'range' && decoded && minTow != null && maxTow != null && (
        <RangeResultScreen
          decoded={decoded}
          minTow={minTow}
          maxTow={maxTow}
          onRefine={() => setScreen('questions')}
          onNewSearch={lookupOrigin === 'garage' ? goToGarage : resetAll}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}

      {screen === 'exact' && decoded && matches.length === 1 && (
        <ExactResultScreen
          decoded={decoded}
          vin={vin}
          match={matches[0]}
          answers={answers}
          showAddVehicle={garageSaveMode}
          onAddVehicle={saveVehicleToGarage}
          addVehicleLoading={garageSaveLoading}
          addVehicleError={garageSaveError}
          showUpgradePrompt={showUpgradePrompt}
          onDismissUpgradePrompt={() => setShowUpgradePrompt(false)}
          onNewSearch={lookupOrigin === 'garage' ? goToGarage : resetAll}
          onHome={resetAll}
          onSignOut={handleGlobalSignOut}
        />
      )}
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
