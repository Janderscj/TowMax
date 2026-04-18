function extractOptions(matches) {
  // Filter out null/undefined values and sort alphabetically
  const unique = (arr) => [...new Set(arr.filter(Boolean))].sort();

  return {
    axleRatio: unique(matches.map((m) => m.axleRatio)),
    bed: unique(matches.map((m) => m.bed)),
    cabType: unique(matches.map((m) => m.cabType)),
    driveType: unique(matches.map((m) => m.driveType)),
    engine: unique(matches.map((m) => m.engine)),
    trim: unique(matches.map((m) => m.trim)),
    towPackage: unique(matches.map((m) => m.towPackage)),
  };
}

module.exports = extractOptions;
