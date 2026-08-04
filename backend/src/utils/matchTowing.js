function matchTowing(decoded, towingData) {
  const matches = [];

  towingData.forEach((entry) => {
    // HARD FILTERS — VIN guaranteed fields only
    if (entry.year !== decoded.year) return;
    if (!decoded.make || !entry.make || entry.make.toLowerCase() !== decoded.make.toLowerCase())
      return;
    if (!decoded.model || !entry.model || entry.model.toLowerCase() !== decoded.model.toLowerCase())
      return;

    // Series must match exactly if both are present
    if (
      decoded.series &&
      entry.series &&
      entry.series.toString().toLowerCase() !== decoded.series.toString().toLowerCase()
    ) {
      return;
    }

    // ENGINE — partial match
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

    // valid VIN match
    matches.push(entry);
  });

  return matches;
}

export default matchTowing;
