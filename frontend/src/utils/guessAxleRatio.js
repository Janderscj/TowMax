function toNumberRatio(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function includesAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

// Deterministic smart-guess heuristic based on decoded hints + current answers.
// Returns a single best guess when confidence is high; otherwise returns multiple
// likely ratios so the UI can intentionally use the existing range fallback flow.
export function guessAxleRatio({ decoded = {}, currentAnswers = {}, options = {} }) {
  const availableRatios = Array.isArray(options.axleRatio) ? options.axleRatio : [];
  if (!availableRatios.length) {
    return {
      mode: 'none',
      bestGuess: null,
      likelyRatios: [],
      reason: 'No axle ratio options available.',
    };
  }

  if (availableRatios.length === 1) {
    return {
      mode: 'exact',
      bestGuess: availableRatios[0],
      likelyRatios: availableRatios,
      reason: 'Only one axle ratio is valid for this configuration.',
    };
  }

  const make = normalizeText(decoded.make);
  const engine = normalizeText(decoded.engine);
  const trim = normalizeText(decoded.trim);
  const driveType = normalizeText(decoded.driveType);
  const year = Number(decoded.year) || 0;
  const towPackageAnswer = normalizeText(currentAnswers.towPackage);

  const scores = {};
  availableRatios.forEach((ratio) => {
    scores[ratio] = 0;
  });

  const adjustByNumeric = (predicate, amount) => {
    availableRatios.forEach((ratio) => {
      const numeric = toNumberRatio(ratio);
      if (numeric !== null && predicate(numeric)) {
        scores[ratio] += amount;
      }
    });
  };

  const boost = (ratio, amount) => {
    if (Object.prototype.hasOwnProperty.call(scores, ratio)) {
      scores[ratio] += amount;
    }
  };

  // Tow-package answers are a strong signal.
  if (includesAny(towPackageAnswer, ['yes', 'max tow', 'trailering'])) {
    adjustByNumeric((n) => n >= 3.73, 3);
    adjustByNumeric((n) => n >= 4.1, 1);
  }

  if (includesAny(towPackageAnswer, ['no', 'none'])) {
    adjustByNumeric((n) => n <= 3.55, 2);
  }

  // Drive type influences common axle choices.
  if (includesAny(driveType, ['4wd', '4x4', 'awd'])) {
    adjustByNumeric((n) => n >= 3.73, 2);
  }

  if (includesAny(driveType, ['rwd', 'rear'])) {
    adjustByNumeric((n) => n <= 3.55, 1);
  }

  // Engine and trim cues.
  if (includesAny(engine, ['diesel', 'duramax', 'power stroke', 'powerstroke', 'hemi', 'v8'])) {
    adjustByNumeric((n) => n >= 3.73, 2);
  }

  if (includesAny(engine, ['turbo', 'ecoboost'])) {
    adjustByNumeric((n) => n >= 3.55, 1);
  }

  if (includesAny(trim, ['max tow', 'tow', 'trailering', 'off-road', 'off road', 'trd', 'rebel'])) {
    adjustByNumeric((n) => n >= 3.73, 2);
  }

  // Brand-specific defaults requested by product requirements.
  if (make.includes('ford')) {
    boost('3.55', 2);
    boost('3.73', 1);
  }

  if (make.includes('chevrolet') || make.includes('gmc') || make.includes('gm')) {
    boost('3.42', 2);
    boost('3.73', 2);
    boost('4.10', 1);

    if (year >= 2020) {
      boost('3.23', 1);
    }
  }

  if (make.includes('ram')) {
    boost('3.55', 2);
    boost('3.92', 2);
    boost('4.10', 1);

    if (includesAny(towPackageAnswer, ['yes', 'max tow', 'trailering'])) {
      boost('3.92', 1);
      boost('4.10', 1);
    }
  }

  if (make.includes('toyota') || make.includes('nissan')) {
    boost('3.13', 3);
    boost('3.73', 1);
  }

  const ranked = [...availableRatios].sort((a, b) => {
    const scoreDiff = (scores[b] || 0) - (scores[a] || 0);
    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    // Tie-breaker: prefer numerically higher axle ratio for tow-focused safety.
    const aNumeric = toNumberRatio(a) ?? 0;
    const bNumeric = toNumberRatio(b) ?? 0;
    return bNumeric - aNumeric;
  });

  const topScore = scores[ranked[0]];
  const secondScore = scores[ranked[1]];
  const confidentSingle = topScore - secondScore >= 2;

  if (confidentSingle) {
    return {
      mode: 'exact',
      bestGuess: ranked[0],
      likelyRatios: [ranked[0]],
      reason: 'High-confidence guess from vehicle configuration signals.',
    };
  }

  return {
    mode: 'range',
    bestGuess: ranked[0],
    likelyRatios: ranked.slice(0, Math.min(3, ranked.length)),
    reason: 'Multiple axle ratios are plausible, so using range fallback is safer.',
  };
}
