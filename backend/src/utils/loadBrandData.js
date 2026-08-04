import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from './supabaseClient.js';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDevelopment = process.env.NODE_ENV !== 'production';
const useSupabaseTowingData = process.env.USE_SUPABASE_TOWING_DATA === 'true';
const allowSupabaseFallback = process.env.SUPABASE_TOWING_FALLBACK_TO_JSON !== 'false';

// In-memory cache to avoid repeated file reads
const dataCache = new Map();

function mapSupabaseRowToDatasetEntry(row) {
  return {
    year: row.year,
    make: row.make,
    model: row.model,
    series: row.series,
    trim: row.trim,
    engine: row.engine,
    driveType: row.drive_type,
    cabType: row.cab_type,
    bed: row.bed,
    axleRatio: row.axle_ratio,
    towPackage: row.tow_package,
    gcwr: row.gcwr,
    payload: row.payload,
    maxTow: row.max_tow,
  };
}

async function loadBrandDataFromJson(brand) {
  const filePath = path.join(__dirname, `../../data/${brand}.json`);

  try {
    await fs.access(filePath);
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Dataset not found for brand: ${brand}`);
    }

    console.error(`Error loading dataset for brand ${brand}:`, err);
    throw new Error('Failed to load brand dataset');
  }
}

async function loadBrandDataFromSupabase(brand) {
  const { data, error } = await supabase
    .from('towing_configs')
    .select(
      'year, make, model, series, trim, engine, drive_type, cab_type, bed, axle_ratio, tow_package, gcwr, payload, max_tow'
    )
    .eq('source_brand', brand)
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error(`No Supabase dataset found for brand: ${brand}`);
  }

  return data.map(mapSupabaseRowToDatasetEntry);
}

async function loadBrandData(brand) {
  if (!brand) {
    throw new Error('Brand is required to load dataset');
  }

  const normalizedBrand = brand.toLowerCase();
  const sourceKey = useSupabaseTowingData ? 'supabase' : 'json';
  const cacheKey = `${sourceKey}:${normalizedBrand}`;

  // Return cached data if available
  if (dataCache.has(cacheKey)) {
    if (isDevelopment) {
      console.log(`Using cached ${sourceKey} data for: ${normalizedBrand}`);
    }
    return dataCache.get(cacheKey);
  }

  try {
    let data;

    if (useSupabaseTowingData) {
      try {
        data = await loadBrandDataFromSupabase(normalizedBrand);
      } catch (error) {
        if (!allowSupabaseFallback) {
          throw error;
        }

        if (isDevelopment) {
          console.warn(
            `Supabase towing lookup failed for ${normalizedBrand}. Falling back to JSON: ${error.message}`
          );
        }

        data = await loadBrandDataFromJson(normalizedBrand);
      }
    } else {
      data = await loadBrandDataFromJson(normalizedBrand);
    }

    // Cache the data
    dataCache.set(cacheKey, data);
    if (isDevelopment) {
      console.log(`Loaded and cached ${sourceKey} data for: ${normalizedBrand}`);
    }

    return data;
  } catch (err) {
    console.error(`Error loading dataset for brand ${normalizedBrand}:`, err);
    throw new Error('Failed to load brand dataset');
  }
}

export default loadBrandData;
