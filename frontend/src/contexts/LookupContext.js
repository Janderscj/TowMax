import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabase';
import { API_URL } from '../utils/apiConfig';

const LookupContext = createContext();

export const useLookup = () => {
  const context = useContext(LookupContext);
  if (!context) {
    throw new Error('useLookup must be used within a LookupProvider');
  }
  return context;
};

export const LookupProvider = ({ children }) => {
  const { user, isDealer, profile, signOut } = useAuth();

  const [vin, setVin] = useState('');
  const [result, setResult] = useState(null);
  const [matches, setMatches] = useState([]);
  const [initialMissing, setInitialMissing] = useState([]);
  const [initialOptions, setInitialOptions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [lookupOrigin, setLookupOrigin] = useState('welcome');
  const [garageSaveLoading, setGarageSaveLoading] = useState(false);
  const [garageSaveError, setGarageSaveError] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedGarageVehicle, setSelectedGarageVehicle] = useState(null);
  const [garageCount, setGarageCount] = useState(0);
  const [garageCountLoading, setGarageCountLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);

  // Cache for VIN responses to prevent redundant API calls
  const vinCacheRef = useRef(new Map());
  // Synchronous lock to prevent same-tick double clicks before state updates flush.
  const refineInFlightRef = useRef(false);

  const decoded = result?.decoded ?? null;
  const garageLimit = profile?.garage_limit;
  const garageLimitReached =
    !isDealer && garageLimit != null && Number.isFinite(garageCount) && garageCount >= garageLimit;
  const canAddVehicleToGarage = !isDealer && !garageLimitReached && !garageCountLoading;

  useEffect(() => {
    const loadGarageCount = async () => {
      if (!user || isDealer || garageLimit == null) return;

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
  }, [user, isDealer, garageLimit]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setIsRefining(false);
    setVinDecoding(false);
    setGarageCount(0);
    setGarageCountLoading(false);
    refineInFlightRef.current = false;
  };

  // Reset all state
  const resetAll = () => {
    setLookupOrigin('welcome');
    clearLookupState();
    setError(null);
  };

  const performGarageSave = async ({ navigateOnSuccess }) => {
    if (!vin) {
      setGarageSaveError('VIN is missing for this vehicle.');
      return false;
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
          if (garageLimit != null) {
            setGarageCount(garageLimit);
          }
        }
        setGarageSaveError(data.error || 'Failed to add vehicle to garage.');
        return false;
      }

      // Keep garage count fresh so limit checks remain consistent.
      setGarageCount((count) => count + 1);

      if (navigateOnSuccess) {
        // Navigation will be handled by the calling component
      }

      return true;
    } catch (err) {
      console.error('Error saving vehicle to garage:', err);
      setGarageSaveError('Unable to save this vehicle right now. Please try again.');
      return false;
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

    setVinDecoding(true);

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

      const token = user ? (await supabase.auth.getSession()).data.session?.access_token : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_URL}/api/towing/${vinInput}`, { headers });
      const data = await response.json();

      // Cache the response
      vinCacheRef.current.set(vinInput, data);

      // Better error handling
      if (!response.ok) {
        setError(data.error || `Server error (${response.status})`);
        return;
      }

      if (data.error) {
        setError(data.error);
        return;
      }

      processVinResponse(data);
    } catch (err) {
      console.error('Error decoding VIN:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setVinDecoding(false);
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
  };

  // Handle refinement answers with auth.
  // Real-time narrowing: called after EVERY single answer, not just the final one.
  // The backend returns options filtered to only configurations that still match
  // all answers so far — so the UI automatically narrows to valid choices.
  const handleRefineAnswer = async (field, value) => {
    // Prevent overlapping concurrent refine calls (race condition guard).
    // The UI should already be disabled via isRefining, but this is the
    // final safety net in case a click slips through.
    if (isRefining || refineInFlightRef.current) return;

    refineInFlightRef.current = true;

    const updated = { ...answers, [field]: value };
    // Guard for "refine flow complete" before this request is sent.
    // If this becomes true, the user has already answered all currently missing fields.
    const unansweredBeforeCall = initialMissing.filter((missingField) => !updated[missingField]);
    const hasCompletedAllCurrentRefineQuestions = unansweredBeforeCall.length === 0;

    setAnswers(updated);
    setIsRefining(true);

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
        return 'error';
      }

      const towingMatches = data.towingMatches || [];
      const newMissing = data.missingInfo || [];

      if (towingMatches.length === 0) {
        // Only allow fallback when:
        // A) refine returned zero matches
        // B) previous valid matches still exist
        // C) all missing refine questions were already answered BEFORE this call
        if (matches.length > 0 && hasCompletedAllCurrentRefineQuestions) {
          setInitialMissing(newMissing);
          setInitialOptions(data.options);
          // Intentionally preserve previous matches so min/max remain available.
          return 'range-fallback';
        }

        // Mid-flow zero result: keep current narrowed dataset in state and
        // stay in questions so the user cannot get pushed into fallback too early.
        if (matches.length > 0) {
          return 'questions';
        }

        setError('No matching configurations found. Please try again.');
        return 'error';
      }

      setMatches(towingMatches);
      setInitialMissing(newMissing);
      setInitialOptions(data.options);

      // Navigate based on refined results
      if (towingMatches.length === 1) {
        return 'exact';
      } else if (towingMatches.length > 1) {
        // Stay on questions screen until they get exact match or give up
        return 'questions';
      } else {
        // True dead-end: no prior matches and no new ones (shouldn't normally occur)
        setError('No matching configurations found. Please try again.');
        return 'error';
      }
    } catch (err) {
      console.error('Refine error:', err);
      setError('Server error while refining results. Please try again.');
      return 'error';
    } finally {
      // Always re-enable the UI, even on error
      refineInFlightRef.current = false;
      setIsRefining(false);
    }
  };

  const value = {
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
    vinDecoding,
    decoded,
    garageLimit,
    garageLimitReached,
    canAddVehicleToGarage,
    clearLookupState,
    resetAll,
    decodeVin,
    handleRefineAnswer,
    performGarageSave,
    signOut,
  };

  return <LookupContext.Provider value={value}>{children}</LookupContext.Provider>;
};
