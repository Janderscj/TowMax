function detectMissingFields(matches, answers = {}) {
  const refineFields = ['bed', 'axleRatio', 'towPackage'];
  const missing = [];

  refineFields.forEach((field) => {
    // If user already answered this field, it's not missing
    if (answers[field]) {
      return;
    }

    const values = new Set(
      matches.map((m) => m[field]).filter((v) => v !== null && v !== undefined && v !== '')
    );

    // If multiple values exist, user must choose
    if (values.size > 1) {
      missing.push(field);
    }
  });

  return missing;
}

export default detectMissingFields;
