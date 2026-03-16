import { useState, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import WelcomeScreen from './screens/WelcomeScreen';
import VinEntryScreen from './screens/VinEntryScreen';
import LoadingScreen from './screens/LoadingScreen';
import QuestionsScreen from './screens/QuestionsScreen';
import RangeResultScreen from './screens/RangeResultScreen';
import ExactResultScreen from './screens/ExactResultScreen';
import LoginScreen from './screens/LoginScreen';
import GarageScreen from './screens/GarageScreen';
import { supabase } from './utils/supabase';

// API URL from env or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AppContent() {
  const { user, profile, loading: authLoading, isFree, isPremium, isDealer } = useAuth();
  const [screen, setScreen] = useState('welcome');
  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState([]);
  const [initialMissing, setInitialMissing] = useState([]);
  const [initialOptions, setInitialOptions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  // Cache for VIN responses to prevent redundant API calls
  const vinCacheRef = useRef(new Map());

  const decoded = result?.decoded ?? null;

  // Reset all state
  const resetAll = () => {
    setScreen('welcome');
    setVin('');
    setResult(null);
    setMatches([]);
    setInitialMissing([]);
    setInitialOptions(null);
    setAnswers({});
    setError(null);
  };

  // If auth is loading, show loading screen
  if (authLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, show login
  if (!user) {
    return <LoginScreen />;
  }

  // If authenticated but no profile yet, show loading
  if (!profile) {
    return <LoadingScreen />;
  }

  // Authenticated user flow
  const goToGarage = () => setScreen('garage');
  const goToVinLookup = (preVin = '') => {
    setVin(preVin);
    setScreen('vin');
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
        setScreen('welcome');
        return;
      }

      if (data.error) {
        setError(data.error);
        setScreen('welcome');
        return;
      }

      processVinResponse(data);
    } catch (err) {
      console.error('Error decoding VIN:', err);
      setError('Unable to connect to server. Please try again.');
      setScreen('welcome');
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

  return (
    <div style={styles.appContainer}>
      {screen === 'garage' && <GarageScreen onVinSelect={goToVinLookup} />}

      {screen === 'welcome' && (
        <WelcomeScreen
          error={error}
          onGetStarted={() => {
            setError(null);
            setScreen('vin');
          }}
          onGarage={goToGarage}
          showGarage={!isDealer}
        />
      )}

      {screen === 'vin' && (
        <VinEntryScreen
          vin={vin}
          setVin={setVin}
          onBack={() => {
            setError(null);
            setScreen('welcome');
          }}
          onDecode={decodeVin}
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
        />
      )}

      {screen === 'range' && decoded && minTow != null && maxTow != null && (
        <RangeResultScreen
          decoded={decoded}
          answers={answers}
          minTow={minTow}
          maxTow={maxTow}
          missingInfo={initialMissing}
          hasQuestions={initialMissing.length > 0}
          onRefine={() => setScreen('questions')}
          onNewSearch={resetAll}
        />
      )}

      {screen === 'exact' && decoded && matches.length === 1 && (
        <ExactResultScreen
          decoded={decoded}
          match={matches[0]}
          answers={answers}
          onNewSearch={resetAll}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    width: '100%',
    maxWidth: '430px',
    margin: '0 auto',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
  },
};

export default App;
