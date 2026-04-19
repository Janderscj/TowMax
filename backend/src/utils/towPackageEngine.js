// backend/src/utils/towPackageEngine.js

import towPackageRules from '../towData/towPackageRules/index.js';

function getTowPackageOptions({ brand, model, year }) {
  // Normalize brand to title-case to match towPackageRules keys
  const normalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  const brandRules = towPackageRules[normalizedBrand];
  if (!brandRules) return null;

  const modelRule = brandRules[model];
  if (!modelRule) return null;

  return modelRule(year);
}

export { getTowPackageOptions };
