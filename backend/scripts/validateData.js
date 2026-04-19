const fs = require('fs');
const path = require('path');
const { VehicleDatasetSchema } = require('../schemas/vehicleSchema.js');

const dataDir = path.join(__dirname, '../data');

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
  let allValid = true;
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    if (fs.statSync(fullPath).isDirectory()) {
      if (!walk(fullPath)) allValid = false;
    } else if (entry.endsWith('.json')) {
      if (!validateFile(fullPath)) allValid = false;
    }
  }

  return allValid;
}

function validateAllData() {
  try {
    return walk(dataDir);
  } catch (err) {
    console.error('Data validation error:', err.message);
    return false;
  }
}

module.exports = { validateAllData };

// Allow direct CLI execution: node scripts/validateData.js
if (require.main === module) {
  const valid = validateAllData();
  process.exit(valid ? 0 : 1);
}
