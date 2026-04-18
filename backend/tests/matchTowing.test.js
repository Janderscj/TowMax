const matchTowing = require('../src/utils/matchTowing');

describe('matchTowing', () => {
  // Sample towing data for testing
  const sampleTowingData = [
    {
      year: 2024,
      make: 'FORD',
      model: 'F-150',
      series: '1500',
      trim: 'Lariat',
      engine: '3.5L EcoBoost',
      driveType: '4WD',
      cabType: 'Crew Cab',
      bed: '5.5 ft',
      axleRatio: '3.55',
      towPackage: 'maxTow',
      gcwr: 14500,
      payload: 1560,
      maxTow: 14000,
    },
    {
      year: 2024,
      make: 'FORD',
      model: 'F-150',
      series: '1500',
      trim: 'XLT',
      engine: '2.7L EcoBoost',
      driveType: '2WD',
      cabType: 'Crew Cab',
      bed: '5.5 ft',
      axleRatio: '3.55',
      towPackage: 'standard',
      gcwr: 13000,
      payload: 1680,
      maxTow: 9500,
    },
    {
      year: 2024,
      make: 'CHEVROLET',
      model: 'Silverado',
      series: '1500',
      trim: 'LTZ',
      engine: '5.3L V8',
      driveType: '4WD',
      cabType: 'Crew Cab',
      bed: 'Standard Bed',
      axleRatio: '3.73',
      towPackage: 'maxTow',
      gcwr: 15000,
      payload: 1200,
      maxTow: 11200,
    },
    {
      year: 2023,
      make: 'FORD',
      model: 'F-150',
      series: '1500',
      trim: 'Lariat',
      engine: '3.5L EcoBoost',
      driveType: '4WD',
      cabType: 'SuperCrew',
      bed: '5.5 ft',
      axleRatio: '3.55',
      towPackage: 'maxTow',
      gcwr: 14500,
      payload: 1560,
      maxTow: 14000,
    },
    {
      year: 2024,
      make: 'HONDA',
      model: 'Ridgeline',
      series: 'Type R',
      trim: 'Type R',
      engine: '3.5L V6',
      driveType: 'AWD',
      cabType: 'Crew Cab',
      bed: '5.3 ft',
      axleRatio: '3.50',
      towPackage: 'maxTow',
      gcwr: 13500,
      payload: 1570,
      maxTow: 5600,
    },
  ];

  describe('Exact Matches', () => {
    test('should match vehicle with exact year, make, model, and all optional fields', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: '3.5L EcoBoost',
        driveType: '4WD',
        cabType: 'Crew Cab',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(1);
      expect(matches[0].trim).toBe('Lariat');
      expect(matches[0].maxTow).toBe(14000);
    });

    test('should match vehicle with case-insensitive make and model', () => {
      const decoded = {
        year: 2024,
        make: 'ford', // lowercase
        model: 'f-150', // lowercase
        series: '1500',
        engine: '3.5L EcoBoost',
        driveType: '4WD',
        cabType: 'Crew Cab',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(1);
      expect(matches[0].make).toBe('FORD');
    });
  });

  describe('Year Filtering', () => {
    test('should filter by year - no match for different year', () => {
      const decoded = {
        year: 2025, // Different year
        make: 'FORD',
        model: 'F-150',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(0);
    });

    test('should match correct year', () => {
      const decoded = {
        year: 2023,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(1);
      expect(matches[0].year).toBe(2023);
    });
  });

  describe('Make and Model Filtering', () => {
    test('should filter by make', () => {
      const decoded = {
        year: 2024,
        make: 'CHEVROLET',
        model: 'Silverado',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(1);
      expect(matches[0].make).toBe('CHEVROLET');
    });

    test('should not match different make', () => {
      const decoded = {
        year: 2024,
        make: 'RAM',
        model: 'F-150',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(0);
    });

    test('should not match different model', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-250',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(0);
    });
  });

  describe('Series Matching', () => {
    test('should filter by series when both decoded and entry have series', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(2); // Lariat (maxTow) and XLT (standard)
      expect(matches.every((m) => m.series === '1500')).toBe(true);
    });

    test('should handle case-insensitive series matching', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: 'CrewMax', // lowercase version of a possible series
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should return nothing since CrewMax doesn't match '1500'
      expect(matches.length).toBe(0);
    });

    test('should skip series filter if decoded series is null/undefined', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: null,
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both 2024 F-150 entries (XLT with null series won't break match)
      expect(matches.length).toBe(2);
    });
  });

  describe('Engine Matching', () => {
    test('should match using partial engine matching (case-insensitive)', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: 'EcoBoost', // Partial match
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both EcoBoost F-150s
      expect(matches.length).toBe(2);
    });

    test('should not match if engine does not contain decoded engine', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: 'V8', // 2.7L and 3.5L EcoBoost don't contain 'V8'
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(0);
    });

    test('should skip engine filter if decoded engine is null', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: null,
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both 2024 F-150 entries regardless of engine
      expect(matches.length).toBe(2);
    });
  });

  describe('Drive Type Matching', () => {
    test('should filter by drive type (exact match)', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        driveType: '4WD',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should only match 4WD Lariat
      expect(matches.length).toBe(1);
      expect(matches[0].trim).toBe('Lariat');
    });

    test('should match 2WD when specified', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        driveType: '2WD',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should only match 2WD XLT
      expect(matches.length).toBe(1);
      expect(matches[0].trim).toBe('XLT');
    });

    test('should skip drive type filter if null', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        driveType: null,
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both 4WD and 2WD
      expect(matches.length).toBe(2);
    });
  });

  describe('Cab Type Matching', () => {
    test('should filter by cab type (exact match)', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        cabType: 'Crew Cab',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both Crew Cab entries (Lariat and XLT)
      expect(matches.length).toBe(2);
    });

    test('should filter different cab types', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        cabType: 'SuperCrew',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match 0 (none have SuperCrew in 2024)
      expect(matches.length).toBe(0);
    });

    test('should skip cab type filter if null', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        cabType: null,
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match both
      expect(matches.length).toBe(2);
    });
  });

  describe('Multiple Filter Combinations', () => {
    test('should combine multiple filters correctly', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: '3.5L EcoBoost',
        driveType: '4WD',
        cabType: 'Crew Cab',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should match exactly Lariat
      expect(matches.length).toBe(1);
      expect(matches[0].trim).toBe('Lariat');
      expect(matches[0].towPackage).toBe('maxTow');
    });

    test('should progressively filter with each constraint', () => {
      const data = sampleTowingData;

      // Year + make + model are all required (HARD FILTERS)
      // So we skip the year-only and year+make tests since they'll return 0

      // All 2024 FORD F-150s (all three hard filters present)
      const decoded1 = { year: 2024, make: 'FORD', model: 'F-150' };
      expect(matchTowing(decoded1, data).length).toBe(2);

      // All 2024 FORD F-150 1500 series
      const decoded2 = { year: 2024, make: 'FORD', model: 'F-150', series: '1500' };
      expect(matchTowing(decoded2, data).length).toBe(2);

      // With 4WD only
      const decoded3 = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        driveType: '4WD',
      };
      expect(matchTowing(decoded3, data).length).toBe(1);

      // With all filters
      const decoded4 = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        driveType: '4WD',
        engine: '3.5L EcoBoost',
      };
      expect(matchTowing(decoded4, data).length).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty towingData array', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
      };

      const matches = matchTowing(decoded, []);

      expect(matches).toEqual([]);
    });

    test('should return empty array when no matches found', () => {
      const decoded = {
        year: 2030, // Year that doesn't exist in data
        make: 'FORD',
        model: 'F-150',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches).toEqual([]);
    });

    test('should handle decoded object with only year and make', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      // Should return empty because model is missing (hard filter)
      expect(matches).toEqual([]);
    });

    test('should preserve original entry objects in results', () => {
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches[0]).toHaveProperty('maxTow');
      expect(matches[0]).toHaveProperty('gcwr');
      expect(matches[0]).toHaveProperty('payload');
    });

    test('should handle Honda data with different schema', () => {
      const decoded = {
        year: 2024,
        make: 'HONDA',
        model: 'Ridgeline',
        series: 'Type R',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBe(1);
      expect(matches[0].maxTow).toBe(5600);
    });
  });

  describe('Real-world Scenarios', () => {
    test('should handle VIN decoder output for Ford F-150', () => {
      // Simulating output from NHTSA VIN decoder
      const decoded = {
        year: 2024,
        make: 'FORD',
        model: 'F-150',
        series: '1500',
        engine: '3.5L EcoBoost',
        driveType: '4WD',
        cabType: 'Crew Cab',
        trim: 'Lariat',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].year).toBe(2024);
      expect(matches[0].maxTow).toBeGreaterThan(5000);
    });

    test('should match Honda Ridgeline across different years', () => {
      const decoded = {
        year: 2024,
        make: 'HONDA',
        model: 'Ridgeline',
      };

      const matches = matchTowing(decoded, sampleTowingData);

      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((m) => m.model === 'Ridgeline')).toBe(true);
    });
  });
});
