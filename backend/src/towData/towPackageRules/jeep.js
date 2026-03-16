// backend/src/data/towPackageRules/jeep.js

const jeepRules = {
  Gladiator: (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Package',
        help: "Look for 'Trailer Tow Package' on your window sticker. Jeep does not use RPO codes like GM.",
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Package listed, your vehicle is not equipped with a tow package.',
      },
    ],
  }),
};

module.exports = jeepRules;
