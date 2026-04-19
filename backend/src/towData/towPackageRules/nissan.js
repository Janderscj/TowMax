// backend/src/data/towPackageRules/nissan.js

const nissanRules = {
  Frontier: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Tow Package',
        help: "Look for 'Tow Package' on your window sticker. Nissan does not use RPO codes.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Tow Package listed on your window sticker, your truck is not equipped with a tow package.',
      },
    ],
  }),

  Titan: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Tow Package',
        help: "Look for 'Tow Package' on your window sticker. Many Titan trims include it as standard equipment.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Tow Package listed, your truck is not equipped with a tow package.',
      },
    ],
  }),
};

export default nissanRules;
