function getBrandFromVin(vin) {
  if (!vin || vin.length < 3) return null;

  const wmi = vin.substring(0, 3).toUpperCase();

  const map = {
    // Ford
    '1FT': 'ford',
    '1F1': 'ford',
    '1FA': 'ford',
    '1FM': 'ford', // ✅ Ford trucks/SUVs
    '1FD': 'ford',

    // Chevrolet / GM
    '1GC': 'chevrolet',
    '3GC': 'chevrolet',
    '1G1': 'chevrolet',
    '2GC': 'chevrolet', // Canada
    '1GT': 'gmc',
    '3GT': 'gmc',
    '2GT': 'gmc', // ✅ Canada GMC

    // Ram / Dodge / Stellantis
    '1C6': 'ram',
    '3C6': 'ram',
    '1D3': 'ram', // ✅ Older Dodge Ram
    '1D7': 'ram',

    // Jeep
    '1C4': 'jeep',
    '3C4': 'jeep',

    // Toyota
    '5TF': 'toyota',
    '4T1': 'toyota', // US-built Toyota cars
    JTD: 'toyota', // Japan-built Toyota
    '5TD': 'toyota', // ✅ Tundra/Tacoma
    '3TM': 'toyota', // ✅ Mexico-built

    // Nissan
    '1N6': 'nissan',
    '5N1': 'nissan',
    JN1: 'nissan', // ✅ Japan-built
    '3N6': 'nissan', // ✅ Mexico-built

    // Honda
    '5FP': 'honda',
    '1HG': 'honda',
    '2HG': 'honda', // ✅ Canada
    JHM: 'honda', // ✅ Japan

    // ✅ Additional popular brands
    // Tesla
    '5YJ': 'tesla',
    '7SA': 'tesla', // UK Tesla

    // Subaru
    JF1: 'subaru',
    JF2: 'subaru',
    '4S3': 'subaru',
    '4S4': 'subaru',

    // Mazda
    JM1: 'mazda',
    JM3: 'mazda',
    '3MZ': 'mazda',

    // Volkswagen
    '1VW': 'volkswagen',
    '3VW': 'volkswagen',
    WVW: 'volkswagen',

    // BMW
    WBA: 'bmw',
    WBS: 'bmw',
    '4US': 'bmw',

    // Mercedes
    WDB: 'mercedes',
    WDD: 'mercedes',
    '4JG': 'mercedes',

    // Audi
    WAU: 'audi',
    WA1: 'audi',

    // Hyundai
    KMH: 'hyundai',
    '5NP': 'hyundai',
    '5NM': 'hyundai',

    // Kia
    KNA: 'kia',
    '5XY': 'kia',
    KND: 'kia',
  };

  return map[wmi] || null;
}

module.exports = getBrandFromVin;
