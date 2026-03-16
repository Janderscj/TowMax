// backend/src/data/towPackageRules/honda.js

const hondaRules = {
  Ridgeline: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Tow Package',
        help: "Look for 'Tow Package' on your window sticker. Honda does not use RPO codes.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Tow Package listed on your window sticker, your vehicle is not equipped with a tow package.',
      },
    ],
  }),
};

module.exports = hondaRules;
