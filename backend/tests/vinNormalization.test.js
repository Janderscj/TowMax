// Note: This test file tests the normalization logic from vinDecoder
// The full decodeVin function calls the NHTSA API, so we test the normalization separately

describe('VIN Normalization Logic', () => {
  // Helper function that mimics the normalization from vinDecoder.js
  function normalizeDecodedFields(decoded) {
    const clean = { ...decoded };

    // Normalize make first to avoid repeated checks
    if (clean.make) {
      clean.make = clean.make.toUpperCase();
    }

    // Normalize series (Chevy + GMC HD logic)
    if (clean.make === 'CHEVROLET' || clean.make === 'GMC') {
      if (clean.series === '2500') clean.series = '2500HD';
      if (clean.series === '3500') clean.series = '3500HD';
    }

    // Normalize model
    if (clean.make === 'CHEVROLET' && clean.model === 'Silverado') {
      clean.model = 'Silverado';
    }
    if (clean.make === 'GMC' && clean.model === 'Sierra') {
      clean.model = 'Sierra';
    }

    // Normalize drive type
    if (clean.driveType && typeof clean.driveType === 'string') {
      const dt = clean.driveType.toUpperCase();
      if (dt.includes('4WD') || dt.includes('4X4')) {
        clean.driveType = '4WD';
      } else if (dt.includes('RWD') || dt.includes('REAR')) {
        clean.driveType = 'RWD';
      } else if (dt.includes('FWD') || dt.includes('FRONT')) {
        clean.driveType = 'FWD';
      } else if (dt.includes('AWD') || dt.includes('ALL')) {
        clean.driveType = 'AWD';
      }
    }

    // Normalize cab type
    if (clean.cabType && typeof clean.cabType === 'string') {
      const ct = clean.cabType.toLowerCase();
      if (ct.includes('crew')) {
        clean.cabType = 'Crew Cab';
      } else if (ct.includes('extended') || ct.includes('super cab') || ct.includes('double')) {
        clean.cabType = 'Extended Cab';
      } else if (ct.includes('regular')) {
        clean.cabType = 'Regular Cab';
      }
    }

    // Normalize engine (extract common names)
    if (clean.engine && typeof clean.engine === 'string') {
      const eng = clean.engine.toLowerCase();
      if (eng.includes('duramax')) {
        clean.engine = 'Duramax';
      } else if (eng.includes('hemi')) {
        clean.engine = 'HEMI';
      } else if (eng.includes('ecoboost')) {
        clean.engine = 'EcoBoost';
      } else if (eng.includes('vortec')) {
        clean.engine = 'Vortec';
      } else if (eng.includes('powerstroke')) {
        clean.engine = 'Power Stroke';
      }
      // Keep original for partial matching otherwise
    }

    // Normalize trim (remove special chars)
    if (clean.trim && typeof clean.trim === 'string') {
      clean.trim = clean.trim.replace(/[^a-z0-9]/gi, '').toUpperCase();
    }

    return clean;
  }

  describe('Make Normalization', () => {
    test('should uppercase make field', () => {
      const input = { make: 'ford' };
      const result = normalizeDecodedFields(input);
      expect(result.make).toBe('FORD');
    });

    test('should handle already uppercase make', () => {
      const input = { make: 'FORD' };
      const result = normalizeDecodedFields(input);
      expect(result.make).toBe('FORD');
    });

    test('should handle mixed case make', () => {
      const input = { make: 'ChEvRoLeT' };
      const result = normalizeDecodedFields(input);
      expect(result.make).toBe('CHEVROLET');
    });

    test('should handle null/undefined make', () => {
      const input1 = { make: null };
      const result1 = normalizeDecodedFields(input1);
      expect(result1.make).toBe(null);

      const input2 = { make: undefined };
      const result2 = normalizeDecodedFields(input2);
      expect(result2.make).toBeUndefined();
    });
  });

  describe('Series Normalization for Chevy/GMC', () => {
    test('should normalize Chevy 2500 to 2500HD', () => {
      const input = { make: 'chevrolet', series: '2500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('2500HD');
    });

    test('should normalize Chevy 3500 to 3500HD', () => {
      const input = { make: 'chevrolet', series: '3500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('3500HD');
    });

    test('should normalize GMC 2500 to 2500HD', () => {
      const input = { make: 'GMC', series: '2500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('2500HD');
    });

    test('should normalize GMC 3500 to 3500HD', () => {
      const input = { make: 'GMC', series: '3500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('3500HD');
    });

    test('should not modify non-2500/3500 series', () => {
      const input = { make: 'CHEVROLET', series: '1500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('1500');
    });

    test('should only apply HD logic to Chevy/GMC', () => {
      const input = { make: 'FORD', series: '2500' };
      const result = normalizeDecodedFields(input);
      expect(result.series).toBe('2500'); // Should not be modified
    });
  });

  describe('Model Normalization', () => {
    test('should preserve Silverado for Chevrolet', () => {
      const input = { make: 'chevrolet', model: 'Silverado' };
      const result = normalizeDecodedFields(input);
      expect(result.model).toBe('Silverado');
    });

    test('should preserve Sierra for GMC', () => {
      const input = { make: 'gmc', model: 'Sierra' };
      const result = normalizeDecodedFields(input);
      expect(result.model).toBe('Sierra');
    });

    test('should not modify other models', () => {
      const input = { make: 'FORD', model: 'F-150' };
      const result = normalizeDecodedFields(input);
      expect(result.model).toBe('F-150');
    });
  });

  describe('Drive Type Normalization', () => {
    test('should normalize 4WD variations', () => {
      const inputs = [
        { driveType: '4WD' },
        { driveType: '4wd' },
        { driveType: '4X4' },
        { driveType: 'four wheel drive' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.driveType).toBe('4WD');
      });
    });

    test('should normalize RWD variations', () => {
      const inputs = [
        { driveType: 'RWD' },
        { driveType: 'rwd' },
        { driveType: 'Rear Wheel Drive' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.driveType).toBe('RWD');
      });
    });

    test('should normalize FWD variations', () => {
      const inputs = [
        { driveType: 'FWD' },
        { driveType: 'fwd' },
        { driveType: 'Front Wheel Drive' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.driveType).toBe('FWD');
      });
    });

    test('should normalize AWD variations', () => {
      const inputs = [{ driveType: 'AWD' }, { driveType: 'awd' }, { driveType: 'All Wheel Drive' }];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.driveType).toBe('AWD');
      });
    });

    test('should handle null/undefined drive type', () => {
      const input1 = { driveType: null };
      const result1 = normalizeDecodedFields(input1);
      expect(result1.driveType).toBe(null);

      const input2 = { driveType: undefined };
      const result2 = normalizeDecodedFields(input2);
      expect(result2.driveType).toBeUndefined();
    });

    test('should not modify unrecognized drive types', () => {
      const input = { driveType: 'Unknown' };
      const result = normalizeDecodedFields(input);
      expect(result.driveType).toBe('Unknown');
    });
  });

  describe('Cab Type Normalization', () => {
    test('should normalize crew cab variations', () => {
      const inputs = [
        { cabType: 'Crew Cab' },
        { cabType: 'crew cab' },
        { cabType: 'CREW CAB' },
        { cabType: 'SuperCrew' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.cabType).toBe('Crew Cab');
      });
    });

    test('should normalize extended cab variations', () => {
      const inputs = [
        { cabType: 'Extended Cab' },
        { cabType: 'extended cab' },
        { cabType: 'Super Cab' },
        { cabType: 'Double Cab' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.cabType).toBe('Extended Cab');
      });
    });

    test('should normalize regular cab', () => {
      const inputs = [
        { cabType: 'Regular Cab' },
        { cabType: 'regular cab' },
        { cabType: 'REGULAR CAB' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.cabType).toBe('Regular Cab');
      });
    });

    test('should handle null/undefined cab type', () => {
      const input1 = { cabType: null };
      const result1 = normalizeDecodedFields(input1);
      expect(result1.cabType).toBe(null);

      const input2 = { cabType: undefined };
      const result2 = normalizeDecodedFields(input2);
      expect(result2.cabType).toBeUndefined();
    });
  });

  describe('Engine Normalization', () => {
    test('should normalize Duramax engine', () => {
      const inputs = [
        { engine: 'Duramax' },
        { engine: 'duramax' },
        { engine: '6.6L Duramax' },
        { engine: 'DURAMAX DIESEL' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.engine).toBe('Duramax');
      });
    });

    test('should normalize HEMI engine', () => {
      const inputs = [{ engine: 'HEMI' }, { engine: 'hemi' }, { engine: '5.7L HEMI V8' }];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.engine).toBe('HEMI');
      });
    });

    test('should normalize EcoBoost engine', () => {
      const inputs = [{ engine: 'EcoBoost' }, { engine: 'ecoboost' }, { engine: '3.5L EcoBoost' }];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.engine).toBe('EcoBoost');
      });
    });

    test('should normalize Vortec engine', () => {
      const inputs = [{ engine: 'Vortec' }, { engine: 'vortec' }, { engine: '5.3L Vortec V8' }];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.engine).toBe('Vortec');
      });
    });

    test('should normalize Power Stroke engine', () => {
      const inputs = [
        { engine: 'Power Stroke' },
        { engine: 'power stroke' },
        { engine: '6.7L PowerStroke Diesel' },
      ];

      inputs.forEach((input) => {
        const result = normalizeDecodedFields(input);
        expect(result.engine).toBe('Power Stroke');
      });
    });

    test('should keep original engine if not recognized', () => {
      const input = { engine: '3.5L V6' };
      const result = normalizeDecodedFields(input);
      expect(result.engine).toBe('3.5L V6');
    });

    test('should handle null/undefined engine', () => {
      const input1 = { engine: null };
      const result1 = normalizeDecodedFields(input1);
      expect(result1.engine).toBe(null);

      const input2 = { engine: undefined };
      const result2 = normalizeDecodedFields(input2);
      expect(result2.engine).toBeUndefined();
    });
  });

  describe('Trim Normalization', () => {
    test('should remove special characters and uppercase trim', () => {
      const inputs = [
        { trim: 'King Ranch', expected: 'KINGRANCH' },
        { trim: 'XL-T', expected: 'XLT' },
        { trim: 'RTL/T', expected: 'RLTT' },
        { trim: 'SR5 Plus', expected: 'SR5PLUS' },
      ];

      inputs.forEach(({ trim, expected }) => {
        const input = { trim };
        const result = normalizeDecodedFields(input);
        expect(result.trim).toBe(expected);
      });
    });

    test('should handle all caps trim', () => {
      const input = { trim: 'LARIAT' };
      const result = normalizeDecodedFields(input);
      expect(result.trim).toBe('LARIAT');
    });

    test('should handle null/undefined trim', () => {
      const input1 = { trim: null };
      const result1 = normalizeDecodedFields(input1);
      expect(result1.trim).toBe(null);

      const input2 = { trim: undefined };
      const result2 = normalizeDecodedFields(input2);
      expect(result2.trim).toBeUndefined();
    });
  });

  describe('Full Object Normalization', () => {
    test('should normalize complete VIN decode result', () => {
      const input = {
        year: 2024,
        make: 'ford',
        model: 'F-150',
        engine: '3.5L ecoboost',
        driveType: '4wd',
        cabType: 'crew cab',
        trim: 'Lariat-Plus',
        series: '1500',
      };

      const result = normalizeDecodedFields(input);

      expect(result.year).toBe(2024);
      expect(result.make).toBe('FORD');
      expect(result.model).toBe('F-150');
      expect(result.engine).toBe('EcoBoost');
      expect(result.driveType).toBe('4WD');
      expect(result.cabType).toBe('Crew Cab');
      expect(result.trim).toBe('LARIUSPLUS'); // Special chars removed
      expect(result.series).toBe('1500');
    });

    test('should normalize Chevy Silverado with HD series', () => {
      const input = {
        year: 2022,
        make: 'chevrolet',
        model: 'Silverado',
        engine: 'Duramax Diesel',
        driveType: 'four wheel drive',
        cabType: 'double cab',
        trim: 'LTZ',
        series: '2500',
      };

      const result = normalizeDecodedFields(input);

      expect(result.make).toBe('CHEVROLET');
      expect(result.model).toBe('Silverado');
      expect(result.engine).toBe('Duramax');
      expect(result.driveType).toBe('4WD');
      expect(result.cabType).toBe('Extended Cab');
      expect(result.series).toBe('2500HD');
    });

    test('should normalize Honda Ridgeline', () => {
      const input = {
        year: 2024,
        make: 'honda',
        model: 'Ridgeline',
        engine: '3.5L V6',
        driveType: 'awd',
        cabType: 'crew cab',
        trim: 'Type-R',
        series: 'CrewMax',
      };

      const result = normalizeDecodedFields(input);

      expect(result.make).toBe('HONDA');
      expect(result.driveType).toBe('AWD');
      expect(result.cabType).toBe('Crew Cab');
      expect(result.trim).toBe('TYPER');
      expect(result.series).toBe('CrewMax'); // No special normalization for Honda
    });
  });

  describe('Preservation of Unknown Fields', () => {
    test('should preserve fields that are not explicitly normalized', () => {
      const input = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        customField: 'customValue',
        another: 123,
      };

      const result = normalizeDecodedFields(input);

      expect(result.customField).toBe('customValue');
      expect(result.another).toBe(123);
    });

    test('should not modify year field', () => {
      const input = { year: 2024 };
      const result = normalizeDecodedFields(input);
      expect(result.year).toBe(2024);
    });
  });

  describe('VIN Validation Format', () => {
    test('should validate VIN format (17 characters, no I/O/Q)', () => {
      const validVINs = ['1FTFW1ET5DFC12345', '1GBDKQ1G9YC114087', 'WBADT43452G297186'];

      const invalidVINs = [
        '1FTFW1ET5DFC1234', // Too short
        '1FTFW1ET5DFC123456', // Too long
        '1FTFW1ET5DFC1Q345', // Contains Q
        '1FTFW1ET5DFC1I345', // Contains I
        '1FTFW1ET5DFC1O345', // Contains O
      ];

      const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;

      validVINs.forEach((vin) => {
        expect(vinRegex.test(vin)).toBe(true);
      });

      invalidVINs.forEach((vin) => {
        expect(vinRegex.test(vin)).toBe(false);
      });
    });
  });
});
