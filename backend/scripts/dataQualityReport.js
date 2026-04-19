import fs from 'fs';
import path from 'path';
import { VehicleConfigSchema } from '../schemas/vehicleSchema.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function walkJsonFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      files.push(...walkJsonFiles(full));
    } else if (entry.endsWith('.json')) {
      files.push(full);
    }
  }

  return files;
}

function detectDuplicates(configs) {
  const seen = new Map();
  const duplicates = [];

  for (const config of configs) {
    const key = `${config.year}|${config.make}|${config.model}`;

    if (seen.has(key)) {
      duplicates.push({ key, entries: [seen.get(key), config] });
    } else {
      seen.set(key, config);
    }
  }

  return duplicates;
}

function analyzeNumericAnomalies(config) {
  const issues = [];

  if (config.gcwr && config.maxTow && config.maxTow > config.gcwr) {
    issues.push('maxTow exceeds gcwr');
  }
  if (config.gcwr && config.gcwr < 5000) {
    issues.push('gcwr seems unusually low');
  }
  if (config.maxTow && config.maxTow < 1000) {
    issues.push('maxTow seems unusually low');
  }
  return issues;
}
export default function runDataQualityReport() {
  console.log('\n=== DATA QUALITY REPORT ===\n');

  const files = walkJsonFiles(dataDir);
  const allConfigs = [];
  const brandCounts = {};
  const missingFields = {};
  const towPackageIssues = [];
  const numericIssues = [];
  const schemaDrift = [];

  for (const file of files) {
    const json = loadJson(file);

    const brand = path.basename(file, '.json');
    brandCounts[brand] = (brandCounts[brand] || 0) + json.length;

    for (const cfg of json) {
      allConfigs.push(cfg);

      // Schema drift detection
      const schemaCheck = VehicleConfigSchema.safeParse(cfg);
      if (!schemaCheck.success) {
        schemaDrift.push({
          file,
          config: cfg,
          errors: schemaCheck.error.format(),
        });
      }

      // Missing fields
      const required = ['year', 'make', 'model', 'engine', 'towPackage'];
      for (const field of required) {
        if (cfg[field] === undefined || cfg[field] === null || cfg[field] === '') {
          missingFields[field] = (missingFields[field] || 0) + 1;
        }
      }

      // Tow package inconsistencies
      if (typeof cfg.towPackage !== 'string') {
        towPackageIssues.push({ file, cfg });
      }

      // Numeric anomalies
      const anomalies = analyzeNumericAnomalies(cfg);
      if (anomalies.length > 0) {
        numericIssues.push({ file, cfg, anomalies });
      }
    }
  }

  // Duplicate detection
  const duplicates = detectDuplicates(allConfigs);

  // Print report
  console.log('Brands analyzed:', Object.keys(brandCounts).length);
  console.log('Total configs:', allConfigs.length, '\n');

  console.log('Per-brand counts:');
  for (const [brand, count] of Object.entries(brandCounts)) {
    console.log(`- ${brand}: ${count}`);
  }
  console.log('');

  console.log('Missing required fields:');
  if (Object.keys(missingFields).length === 0) {
    console.log(' None');
  } else {
    for (const [field, count] of Object.entries(missingFields)) {
      console.log(`- ${field}: ${count}`);
    }
  }
  console.log('');

  console.log('Tow package inconsistencies:');
  if (towPackageIssues.length === 0) {
    console.log(' None');
  } else {
    console.log(` ${towPackageIssues.length} configs with non-string towPackage`);
  }
  console.log('');

  console.log('Numeric anomalies:');
  if (numericIssues.length === 0) {
    console.log(' None');
  } else {
    for (const issue of numericIssues) {
      console.log(`- ${issue.anomalies.join(', ')} in ${issue.file}`);
    }
  }
  console.log('');

  console.log('Duplicate configurations:');
  if (duplicates.length === 0) {
    console.log(' None');
  } else {
    console.log(` ${duplicates.length} duplicates found`);
  }
  console.log('');

  console.log('Schema drift:');
  if (schemaDrift.length === 0) {
    console.log(' None');
  } else {
    console.log(` ${schemaDrift.length} configs failed schema validation`);
  }

  console.log('\n=== END REPORT ===\n');
}
