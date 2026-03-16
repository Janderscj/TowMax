// backend/src/data/towPackageRules/ram.js

const ramRules = {
  1500: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Group',
        help: "Look for 'Trailer Tow Group' on your window sticker. Ram does not use RPO codes like GM.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Group listed on your window sticker, your truck is not equipped with a tow package.',
      },
    ],
  }),

  2500: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Group',
        help: "Look for 'Trailer Tow Group' on your window sticker. Ram HD trucks do not have a Max Tow Package.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Group listed, your truck is not equipped with a tow package.',
      },
    ],
  }),

  3500: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Group',
        help: "Look for 'Trailer Tow Group' on your window sticker. Ram HD trucks do not have a Max Tow Package.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Group listed, your truck is not equipped with a tow package.',
      },
    ],
  }),
};

module.exports = ramRules;
