// backend/src/data/towPackageRules/ford.js

const fordRules = {
  'F-150': (year) => ({
    supportsMaxTow: true,
    options: [
      {
        key: 'maxTow',
        displayName: 'Max Tow Package',
        officialName: 'Max Trailer Tow Package',
        help: 'Look for option codes like 53C, 53D, or 53E on your door jamb label or window sticker.',
      },
      {
        key: 'standard',
        displayName: 'Standard Tow Package',
        officialName: 'Trailer Tow Package',
        help: 'Look for option codes like 53A or 53B on your door jamb label or window sticker.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow or Max Trailer Tow listed on your window sticker, your truck is not equipped with a tow package.',
      },
    ],
  }),

  'F-250': (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Package',
        help: 'Look for Trailer Tow Package on your window sticker or door jamb label.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Package listed, your truck is not equipped with a tow package.',
      },
    ],
  }),

  'F-350': (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Package',
        help: 'Look for Trailer Tow Package on your window sticker or door jamb label.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Package listed, your truck is not equipped with a tow package.',
      },
    ],
  }),

  'F-450': (year) => ({
    supportsMaxTow: false,
    options: [
      {
        key: 'standard',
        displayName: 'Tow Package',
        officialName: 'Trailer Tow Package',
        help: 'Look for Trailer Tow Package on your window sticker or door jamb label.',
      },
      {
        key: 'none',
        displayName: 'No Tow Package',
        officialName: null,
        help: 'If you do not see Trailer Tow Package listed, your truck is not equipped with a tow package.',
      },
    ],
  }),
};

export default fordRules;
