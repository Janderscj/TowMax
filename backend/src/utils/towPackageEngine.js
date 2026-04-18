// backend/src/utils/towPackageEngine.js

const towPackageRules = require('../towData/towPackageRules/index.js');

function getTowPackageOptions({ brand, model, year }) {
  // Normalize brand to title-case to match towPackageRules keys
  const normalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  const brandRules = towPackageRules[normalizedBrand];
  if (!brandRules) return null;

  const modelRule = brandRules[model];
  if (!modelRule) return null;

  return modelRule(year);
}

module.exports = { getTowPackageOptions };
