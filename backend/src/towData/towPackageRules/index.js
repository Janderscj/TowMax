const chevrolet = require('./chevrolet.js');
const ford = require('./ford.js');
const ram = require('./ram.js');
const toyota = require('./toyota.js');
const gmc = require('./gmc.js');
const nissan = require('./nissan.js');
const honda = require('./honda.js');
const jeep = require('./jeep.js');

const towPackageRules = {
  Chevrolet: chevrolet,
  Ford: ford,
  Ram: ram,
  Toyota: toyota,
  GMC: gmc,
  Nissan: nissan,
  Honda: honda,
  Jeep: jeep,
};

module.exports = towPackageRules;
