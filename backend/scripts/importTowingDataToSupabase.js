import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import supabase from '../src/utils/supabaseClient.js';
import { VehicleDatasetSchema } from '../schemas/vehicleSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

function getJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getJsonFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeRow(entry, filePath) {
  const sourceBrand = path.basename(filePath, '.json').toLowerCase();

  return {
    source_brand: sourceBrand,
    source_file: path.basename(filePath),
    year: entry.year,
    make: entry.make,
    model: entry.model,
    series: entry.series ?? null,
    trim: entry.trim ?? null,
    engine: entry.engine ?? null,
    drive_type: entry.driveType ?? entry.drive ?? null,
    cab_type: entry.cabType ?? entry.cab ?? null,
    bed: entry.bed ?? entry.bedLength ?? null,
    axle_ratio: entry.axleRatio ?? null,
    tow_package: entry.towPackage ?? null,
    gcwr: entry.gcwr ?? null,
    payload: entry.payload ?? null,
    max_tow: entry.maxTow ?? null,
    raw_entry: entry,
  };
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function importFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  const parsed = VehicleDatasetSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`Schema validation failed for ${filePath}`);
  }

  const rows = json.map((entry) => normalizeRow(entry, filePath));
  const batches = chunk(rows, 500);

  let importedCount = 0;
  for (const batch of batches) {
    const { error } = await supabase.from('towing_configs').upsert(batch, {
      onConflict: 'config_key',
      ignoreDuplicates: false,
    });

    if (error) {
      throw new Error(`Supabase upsert failed for ${path.basename(filePath)}: ${error.message}`);
    }

    importedCount += batch.length;
  }

  return importedCount;
}

async function runImport() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  }

  const files = getJsonFiles(dataDir);
  if (files.length === 0) {
    console.log('No dataset files found.');
    return;
  }

  let total = 0;

  for (const filePath of files) {
    const imported = await importFile(filePath);
    total += imported;
    console.log(`Imported ${imported} rows from ${path.basename(filePath)}`);
  }

  const { count, error } = await supabase
    .from('towing_configs')
    .select('id', { count: 'exact', head: true });

  if (error) {
    throw new Error(`Failed to verify row count: ${error.message}`);
  }

  console.log(`Import complete. Processed ${total} rows. Table now contains ${count} rows.`);
}

runImport().catch((error) => {
  console.error('Import failed:', error.message);
  process.exit(1);
});
