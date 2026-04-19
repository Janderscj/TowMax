// backend/src/data/towPackageRules/toyota.js

const toyotaRules = {
  Tacoma: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Tow Package',
        help: "Look for 'Tow Package' on your window sticker. Toyota does not use RPO codes like GM.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Tow Package listed on your window sticker, your truck is not equipped with a tow package.',
      },
    ],
  }),

  Tundra: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Tow Package',
        help: "Look for 'Tow Package' on your window sticker. Many Tundra trims include it as standard equipment.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Tow Package listed on your window sticker, your truck is not equipped with a tow package.',
      },
    ],
  }),
};

export default toyotaRules;
