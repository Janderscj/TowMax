import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache to avoid repeated file reads
const dataCache = new Map();

async function loadBrandData(brand) {
  if (!brand) {
    throw new Error('Brand is required to load dataset');
  }

  // Return cached data if available
  if (dataCache.has(brand)) {
    console.log(` Using cached data for: ${brand}`);
    return dataCache.get(brand);
  }

  const filePath = path.join(__dirname, `../../data/${brand}.json`);

  try {
    // Check if file exists (async)
    await fs.access(filePath);

    // Read file asynchronously
    const raw = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(raw);

    // Cache the data
    dataCache.set(brand, data);
    console.log(` Loaded and cached data for: ${brand}`);

    return data;
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Dataset not found for brand: ${brand}`);
    }
    console.error(`Error loading dataset for brand ${brand}:`, err);
    throw new Error('Failed to load brand dataset');
  }
}

export default loadBrandData;
