const chevroletRules = {
  'Silverado 1500': (year) => {
    const baseOptions = [
      {
        key: 'maxTow',
        displayName: 'Max Tow Package',
        officialName: 'NHT Max Trailering Package',
        help: 'Look for RPO code NHT on your door jamb QR code or glovebox sticker.',
      },
      {
        key: 'standard',
        displayName: 'Standard Tow Package',
        officialName: 'Z82 Trailering Package',
        help: 'Look for RPO code Z82 on your door jamb QR code or glovebox sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Z82 or NHT, your truck is not equipped with a tow package.',
      },
    ];

    if (year >= 2019) {
      return {
        supportsMaxTow: true,
        options: baseOptions,
        notes:
          'Max Tow Package (NHT) available on 2019+ models with specific engine/axle combinations.',
      };
    }

    return {
      supportsMaxTow: true,
      options: baseOptions,
    };
  },

  'Silverado 2500HD': (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Z82 Trailering Package',
        help: 'Look for RPO code Z82 on your door jamb QR code or glovebox sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Z82, your truck is not equipped with a tow package.',
      },
    ],
    notes: 'HD trucks typically come standard with most towing equipment.',
  }),

  'Silverado 3500HD': (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Z82 Trailering Package',
        help: 'Look for RPO code Z82 on your door jamb QR code or glovebox sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Z82, your truck is not equipped with a tow package.',
      },
    ],
    notes: 'HD trucks typically come standard with most towing equipment.',
  }),

  Silverado: (year) => {
    // Default to 1500 rules if series not specified
    return chevroletRules['Silverado 1500'](year);
  },

  // Colorado support
  Colorado: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Trailering Package',
        officialName: 'Z82 Trailering Package',
        help: 'Look for RPO code Z82 on your door jamb QR code or glovebox sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Z82, your truck does not have a tow package.',
      },
    ],
    notes: 'Mid-size truck with lower towing capacity.',
  }),

  // Tahoe/Suburban support
  Tahoe: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Max Trailering Package',
        help: 'Check for RPO code on door jamb sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'Standard vehicle configuration.',
      },
    ],
  }),

  Suburban: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Max Trailering Package',
        help: 'Check for RPO code on door jamb sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'Standard vehicle configuration.',
      },
    ],
  }),
};

export default chevroletRules;
