import fs from 'fs';
import path from 'path';
import { VehicleDatasetSchema } from '../schemas/vehicleSchema.js';

const dataDir = path.join(process.cwd(), 'backend/data');

function validateFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  const result = VehicleDatasetSchema.safeParse(json);

  if (!result.success) {
    console.error(` Validation failed for ${filePath}`);
    console.error(result.error.format());
    return false;
  }

  console.log(` Valid: ${filePath}`);
  return true;
}

function walk(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('.json')) {
      validateFile(fullPath);
    }
  }
}

walk(dataDir);
