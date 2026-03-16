const axios = require('axios');

// ✅ NHTSA field constants (avoid magic strings)
const NHTSA_FIELDS = {
  YEAR: 'Model Year',
  MAKE: 'Make',
  MODEL: 'Model',
  ENGINE: 'Engine Model',
  DRIVE_TYPE: 'Drive Type',
  CAB_TYPE: 'Cab Type',
  TRIM: 'Trim',
  SERIES: 'Series',
};

// -----------------------------------------------------
// Normalize messy VIN API fields
// -----------------------------------------------------
function normalizeDecodedFields(decoded) {
  const clean = { ...decoded };

  // ✅ Normalize make first to avoid repeated checks
  if (clean.make) {
    clean.make = clean.make.toUpperCase();
  }

  // Normalize series (Chevy + GMC HD logic)
  if (clean.make === 'CHEVROLET' || clean.make === 'GMC') {
    if (clean.series === '2500') clean.series = '2500HD';
    if (clean.series === '3500') clean.series = '3500HD';
  }

  // Normalize model
  if (clean.make === 'CHEVROLET' && clean.model === 'Silverado') {
    clean.model = 'Silverado';
  }
  if (clean.make === 'GMC' && clean.model === 'Sierra') {
    clean.model = 'Sierra';
  }

  // Normalize drive type
  if (clean.driveType && typeof clean.driveType === 'string') {
    const dt = clean.driveType.toUpperCase();
    if (dt.includes('4WD') || dt.includes('4X4')) {
      clean.driveType = '4WD';
    } else if (dt.includes('RWD') || dt.includes('REAR')) {
      clean.driveType = 'RWD';
    } else if (dt.includes('FWD') || dt.includes('FRONT')) {
      clean.driveType = 'FWD';
    } else if (dt.includes('AWD') || dt.includes('ALL')) {
      clean.driveType = 'AWD';
    }
  }

  // Normalize cab type
  if (clean.cabType && typeof clean.cabType === 'string') {
    const ct = clean.cabType.toLowerCase();
    if (ct.includes('crew')) {
      clean.cabType = 'Crew Cab';
    } else if (ct.includes('extended') || ct.includes('super cab') || ct.includes('double')) {
      clean.cabType = 'Extended Cab';
    } else if (ct.includes('regular')) {
      clean.cabType = 'Regular Cab';
    }
  }

  // Normalize engine (extract common names)
  if (clean.engine && typeof clean.engine === 'string') {
    const eng = clean.engine.toLowerCase();
    if (eng.includes('duramax')) {
      clean.engine = 'Duramax';
    } else if (eng.includes('hemi')) {
      clean.engine = 'HEMI';
    } else if (eng.includes('ecoboost')) {
      clean.engine = 'EcoBoost';
    } else if (eng.includes('vortec')) {
      clean.engine = 'Vortec';
    } else if (eng.includes('powerstroke')) {
      clean.engine = 'Power Stroke';
    }
    // Keep original for partial matching otherwise
  }

  // Normalize trim (remove special chars)
  if (clean.trim && typeof clean.trim === 'string') {
    clean.trim = clean.trim.replace(/[^a-z0-9]/gi, '').toUpperCase();
  }

  return clean;
}

// -----------------------------------------------------
// Decode VIN using NHTSA API
// -----------------------------------------------------
async function decodeVin(vin) {
  try {
    console.log('🔧 VIN DECODE START:', vin);

    const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`;

    // ✅ Add timeout to prevent hanging
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    const results = response.data.Results;

    if (!results || !Array.isArray(results)) {
      console.error('🔧 Invalid NHTSA response format');
      return null;
    }

    console.log('🔧 RAW NHTSA RESULTS COUNT:', results.length);

    // ✅ Extract fields safely using constants
    const get = (variable) => {
      const result = results.find((r) => r.Variable === variable);
      return result?.Value || null;
    };

    // Model Year extraction (NHTSA sometimes returns "0" or null)
    const yearRaw = get(NHTSA_FIELDS.YEAR);
    const year = yearRaw && yearRaw !== '0' ? parseInt(yearRaw, 10) : null;

    // ✅ Validate year is reasonable
    const currentYear = new Date().getFullYear();
    if (year && (year < 1980 || year > currentYear + 2)) {
      console.warn('🔧 Suspicious year detected:', year);
    }

    const make = get(NHTSA_FIELDS.MAKE);
    const model = get(NHTSA_FIELDS.MODEL);
    const engine = get(NHTSA_FIELDS.ENGINE);
    const driveType = get(NHTSA_FIELDS.DRIVE_TYPE);
    const cabType = get(NHTSA_FIELDS.CAB_TYPE);
    const trim = get(NHTSA_FIELDS.TRIM);
    const series = get(NHTSA_FIELDS.SERIES);

    // Keep all non-null fields for debugging
    const cleaned = results.filter((item) => item.Value !== null && item.Value !== '');

    let decoded = {
      year,
      make,
      model,
      engine,
      driveType,
      cabType,
      trim,
      series,
      raw: cleaned,
    };

    // Apply normalization
    decoded = normalizeDecodedFields(decoded);

    console.log('🔧 FINAL DECODED:', decoded);

    return decoded;
  } catch (error) {
    // ✅ Better error logging
    if (error.code === 'ECONNABORTED') {
      console.error('VIN decode timeout - NHTSA API took too long');
    } else if (error.response) {
      console.error('VIN decode API error:', error.response.status, error.response.data);
    } else {
      console.error('VIN decode error:', error.message);
    }
    return null;
  }
}

module.exports = decodeVin;
