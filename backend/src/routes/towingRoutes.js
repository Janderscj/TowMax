import express from 'express';
import supabase from '../utils/supabaseClient.js';
import decodeVin from '../utils/vinDecoder.js';
import matchTowing from '../utils/matchTowing.js';
import detectMissingFields from '../utils/detectMissingFields.js';
import extractOptions from '../utils/extractOptions.js';
import { getTowPackageOptions } from '../utils/towPackageEngine.js';
import loadBrandData from '../utils/loadBrandData.js';
import getBrandFromVin from '../utils/getBrandFromVin.js';

const router = express.Router();

// Middleware to verify JWT token
// NOTE: VIN lookup endpoint is intentionally accessible without authentication
// This allows free users to test the tool before signing up
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Allow unauthenticated access for VIN lookups; garage endpoints check req.user separately
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);
    if (error || !user) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  } catch (err) {
    req.user = null;
    next();
  }
};

// -----------------------------------------------------
// VIN VALIDATION
// -----------------------------------------------------
function isValidVin(vin) {
  // VIN must be exactly 17 characters, no I, O, or Q
  return /^[A-HJ-NPR-Z0-9]{17}$/i.test(vin);
}

// -----------------------------------------------------
// GET /api/towing/:vin
// -----------------------------------------------------
// Public endpoint by design:
// - VIN lookups are free (no auth) to reduce friction for new users.
// - Saving vehicles to garage still requires authentication.
router.get('/:vin', authenticateUser, async (req, res) => {
  const vin = req.params.vin?.toUpperCase();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`[${requestId}] VIN decode request:`, vin);

  // Validate VIN format
  if (!isValidVin(vin)) {
    return res.status(400).json({
      error: 'Invalid VIN format',
      details: 'VIN must be 17 characters (A-Z, 0-9, excluding I, O, Q)',
    });
  }

  try {
    const decoded = await decodeVin(vin);
    console.log(`[${requestId}] Decoded:`, decoded);

    if (!decoded) {
      return res.status(400).json({ error: 'Unable to decode VIN' });
    }

    // check required fields
    if (!decoded.year || !decoded.make || !decoded.model) {
      return res.status(400).json({
        error: 'Incomplete VIN data',
        details: 'Could not determine year, make, or model from VIN',
      });
    }

    const brand = getBrandFromVin(vin);
    if (!brand) {
      return res.status(400).json({
        error: 'Unsupported vehicle brand',
        details: 'This VIN is not for a supported truck brand',
      });
    }

    const towingData = await loadBrandData(brand);

    // Tow package options
    const towPackages = getTowPackageOptions({
      brand: decoded.make,
      model: decoded.model,
      year: decoded.year,
    });

    // Match against brand-specific dataset
    const matches = matchTowing(decoded, towingData);

    if (!matches || matches.length === 0) {
      return res.status(404).json({
        error: 'No towing data found for this vehicle',
        vehicle: `${decoded.year} ${decoded.make} ${decoded.model}`,
      });
    }

    console.log(`[${requestId}] Found ${matches.length} matches`);

    // Multiple matches → refine flow
    if (matches.length > 1) {
      const missing = detectMissingFields(matches);
      const options = extractOptions(matches);

      return res.json({
        decoded,
        towingMatches: matches,
        missingInfo: missing,
        options,
        towPackages,
      });
    }

    // Exact match
    return res.json({
      decoded,
      towingMatches: matches,
      towPackages,
    });
  } catch (error) {
    console.error(`[${requestId}] Route error:`, error);
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// -----------------------------------------------------
// POST /api/towing/refine
// -----------------------------------------------------
router.post('/refine', authenticateUser, async (req, res) => {
  const { vin, answers } = req.body;
  const requestId = Math.random().toString(36).substring(7);

  console.log(`[${requestId}] Refine request:`, { vin, answers });

  // Validate inputs
  if (!vin || !answers) {
    return res.status(400).json({ error: 'Missing VIN or answers' });
  }

  // Validate answers object structure
  if (typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({
      error:
        'Invalid answers format. Expected object with optional properties: axleRatio, towPackage, bedLength',
    });
  }

  if (!isValidVin(vin)) {
    return res.status(400).json({ error: 'Invalid VIN format' });
  }

  try {
    const decoded = await decodeVin(vin);

    const brand = getBrandFromVin(vin);
    if (!brand) {
      return res.status(400).json({ error: 'Unknown brand from VIN' });
    }

    const towingData = await loadBrandData(brand);

    const matches = matchTowing(decoded, towingData);

    if (!matches || matches.length === 0) {
      return res.json({
        towingMatches: [],
        missingInfo: ['noMatches'],
        options: null,
      });
    }

    console.log(`[${requestId}] Initial matches: ${matches.length}`);

    // Apply refine filters
    const narrowed = matches.filter((entry) => {
      return Object.entries(answers).every(([field, value]) => {
        // Skip filtering if user clicked "I'm not sure"
        if (value === "I'm not sure" || value === '' || value === null || value === undefined) {
          return true;
        }

        // Null safety
        if (!entry[field]) return false;

        const datasetValue = String(entry[field]).trim().toLowerCase();
        const answerValue = String(value).trim().toLowerCase();

        return datasetValue.includes(answerValue);
      });
    });

    console.log(`[${requestId}] Narrowed to ${narrowed.length} matches`);

    if (!narrowed || narrowed.length === 0) {
      return res.json({
        towingMatches: [],
        missingInfo: ['noMatches'],
        options: null,
      });
    }

    // Extract updated refine options
    const options = extractOptions(narrowed);
    const missingInfo = detectMissingFields(narrowed, answers);

    res.json({
      towingMatches: narrowed,
      missingInfo,
      options,
    });
  } catch (error) {
    console.error(`[${requestId}] Refine route error:`, error);
    res.status(500).json({
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;
