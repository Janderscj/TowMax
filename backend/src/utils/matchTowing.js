function matchTowing(decoded, towingData) {
  const matches = [];

  towingData.forEach((entry) => {
    // HARD FILTERS — VIN guaranteed fields only
    if (entry.year !== decoded.year) return;
    if (entry.make.toLowerCase() !== decoded.make.toLowerCase()) return;
    if (entry.model.toLowerCase() !== decoded.model.toLowerCase()) return;

    // Series must match exactly (after normalization)
    if (
      decoded.series &&
      entry.series &&
      entry.series.toString().toLowerCase() !== decoded.series.toString().toLowerCase()
    ) {
      return;
    }

    // ENGINE — safe partial match
    if (
      decoded.engine &&
      entry.engine &&
      !entry.engine.toLowerCase().includes(decoded.engine.toLowerCase())
    ) {
      return;
    }

    // DRIVE TYPE — exact match
    if (
      decoded.driveType &&
      entry.driveType &&
      entry.driveType.toLowerCase() !== decoded.driveType.toLowerCase()
    ) {
      return;
    }

    // CAB TYPE — exact match
    if (
      decoded.cabType &&
      entry.cabType &&
      entry.cabType.toLowerCase() !== decoded.cabType.toLowerCase()
    ) {
      return;
    }

    // If we reach here, this entry is a valid VIN match
    matches.push(entry);
  });

  return matches;
}

module.exports = matchTowing;
