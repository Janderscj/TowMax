// backend/src/data/towPackageRules/gmc.js

const gmcRules = {
  'Sierra 1500': (year) => ({
    supportsMaxTow: true,
    options: [
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
    ],
  }),

  'Sierra 2500HD': (year) => ({
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
  }),

  'Sierra 3500HD': (year) => ({
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
  }),

  Yukon: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Z82 Trailering Package',
        help: 'Look for Z82 on the door jamb QR code or window sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Z82, your vehicle is not equipped with a tow package.',
      },
    ],
  }),
};

module.exports = gmcRules;
