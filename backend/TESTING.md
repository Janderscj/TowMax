# Testing Guide

## Overview

This document explains the test setup for the backend, including how to run tests and what is being tested.

## Test Coverage

### 1. **matchTowing Tests** (`tests/matchTowing.test.js`)

Tests the core vehicle matching logic that finds towing capacity data based on VIN decoder output.

**What's Tested:**

- **Exact Matches**: Verifies that vehicles are correctly matched when year, make, model, and all optional fields align
- **Case-Insensitive Matching**: Ensures matching works regardless of case (e.g., 'ford' matches 'FORD')
- **Year Filtering**: Confirms only correct model years are returned
- **Make/Model Filtering**: Validates filtering by vehicle brand and model
- **Series Matching**: Tests series filtering with case-insensitive comparison
- **Engine Matching**: Verifies partial engine matching (e.g., '3.5L EcoBoost' matches 'EcoBoost')
- **Drive Type Matching**: Tests exact matching for 4WD, 2WD, AWD, RWD
- **Cab Type Matching**: Validates exact matching for Crew Cab, Extended Cab, Regular Cab
- **Multiple Filters**: Tests combining multiple filters and progressive filtering
- **Edge Cases**: Empty data, no matches, missing required fields, null values
- **Real-world Scenarios**: Tests with actual VIN decoder output patterns

**Key Test Cases:**

```javascript
// Example: Matching a Ford F-150 with specific configuration
const decoded = {
  year: 2024,
  make: 'FORD',
  model: 'F-150',
  series: '1500',
  engine: '3.5L EcoBoost',
  driveType: '4WD',
  cabType: 'Crew Cab',
};

const matches = matchTowing(decoded, towingData);
// Returns entries matching all filters
```

**Critical Paths Covered:**

- ✅ VIN lookup returns correct towing capacity
- ✅ Multiple matches handled correctly (different trims)
- ✅ Filters progressively narrow results
- ✅ Missing fields don't break matching
- ✅ Case-insensitivity works across all fields

### 2. **VIN Normalization Tests** (`tests/vinNormalization.test.js`)

Tests the normalization/cleanup logic that processes raw NHTSA VIN decoder output.

**What's Tested:**

- **Make Normalization**: Converts to uppercase (ford → FORD)
- **Series Normalization**: Applies special rules for Chevy/GMC (2500 → 2500HD)
- **Model Normalization**: Preserves model names correctly
- **Drive Type Normalization**: Converts variations to standard format
  - '4WD', '4wd', '4X4' → '4WD'
  - 'RWD', 'rwd', 'Rear Wheel Drive' → 'RWD'
  - 'AWD', 'awd', 'All Wheel Drive' → 'AWD'
  - 'FWD', 'fwd', 'Front Wheel Drive' → 'FWD'
- **Cab Type Normalization**: Standardizes cab types
  - 'Crew Cab', 'crew cab', 'SuperCrew' → 'Crew Cab'
  - 'Extended Cab', 'Super Cab', 'Double Cab' → 'Extended Cab'
  - 'Regular Cab', 'regular cab' → 'Regular Cab'
- **Engine Normalization**: Extracts key engine types
  - 'Duramax', 'duramax', '6.6L Duramax' → 'Duramax'
  - 'HEMI', '5.7L HEMI V8' → 'HEMI'
  - 'EcoBoost', '3.5L EcoBoost' → 'EcoBoost'
  - 'Vortec', '5.3L Vortec V8' → 'Vortec'
  - 'Power Stroke', '6.7L PowerStroke Diesel' → 'Power Stroke'
- **Trim Normalization**: Removes special characters and uppercases
  - 'King Ranch' → 'KINGRANCH'
  - 'XL-T' → 'XLT'
  - 'RTL/T' → 'RLTT'
- **VIN Format Validation**: Ensures VINs are valid (17 chars, no I/O/Q)

**Key Test Cases:**

```javascript
// Example: Normalize raw NHTSA output
const rawInput = {
  make: 'ford',
  model: 'F-150',
  engine: '3.5L ecoboost',
  driveType: '4wd',
  cabType: 'crew cab',
};

const normalized = normalizeDecodedFields(rawInput);
// Result:
// {
//   make: 'FORD',
//   engine: 'EcoBoost',
//   driveType: '4WD',
//   cabType: 'Crew Cab',
// }
```

**Critical Paths Covered:**

- ✅ Messy NHTSA output is cleaned properly
- ✅ All engine variants recognized
- ✅ Drive type standardized across vendors
- ✅ Chevy/GMC special rules applied correctly
- ✅ Invalid VINs rejected
- ✅ Unknown fields preserved

---

## Running Tests

### Install Dependencies

```bash
cd backend
npm install
```

This will install Jest and other test dependencies.

### Run All Tests

```bash
npm test
```

Output:

```
PASS  tests/matchTowing.test.js
PASS  tests/vinNormalization.test.js

Test Suites: 2 passed, 2 total
Tests:       150+ passed, 150+ total
```

### Run Tests in Watch Mode

For development, watch mode re-runs tests when files change:

```bash
npm run test:watch
```

### View Coverage Report

Generate a coverage report showing which code paths are tested:

```bash
npm run test:coverage
```

Output includes:

- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

---

## Test Structure

### Directory Layout

```
backend/
├── src/
│   └── utils/
│       ├── matchTowing.js       (being tested)
│       └── vinDecoder.js        (being tested)
├── tests/
│   ├── matchTowing.test.js      (test file)
│   └── vinNormalization.test.js (test file)
├── jest.config.js               (Jest configuration)
└── package.json                 (with test scripts)
```

### Test File Naming

- Test files use `*.test.js` naming convention
- Collocated in `tests/` directory
- Match the core utilities they test

### Test Organization

Each test file uses Jest's `describe()` and `test()` structure:

```javascript
describe('Feature Name', () => {
  describe('Sub-feature', () => {
    test('should do something specific', () => {
      // Arrange
      const input = {
        /* setup */
      };

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

---

## Coverage Goals

The project targets:

- **60%+ line coverage** - Most code executed
- **60%+ branch coverage** - Most logic paths tested
- **60%+ function coverage** - Most functions tested
- **60%+ statement coverage** - Most statements executed

Current coverage focuses on critical paths:

- Data matching and filtering
- Input normalization
- Edge cases and error conditions

---

## Adding New Tests

### When to Add Tests

Add tests when:

- Adding new utility functions
- Fixing bugs (write test for bug first)
- Adding error handling
- Creating critical business logic

### Example: Adding a Test

```javascript
describe('New Feature', () => {
  test('should handle specific scenario', () => {
    // Setup test data
    const input = {
      field1: 'value',
      field2: 123,
    };

    // Call function
    const result = newFunction(input);

    // Assert expectations
    expect(result).toEqual({
      processed: true,
      field1: 'VALUE',
    });
  });
});
```

### Running Your New Test

```bash
npm run test:watch
# Tests re-run automatically when you save changes
```

---

## CI/CD Integration

To integrate tests into your CI/CD pipeline:

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm test
      - run: cd backend && npm run test:coverage
```

---

## Troubleshooting

### Tests Not Running

**Problem**: `npm test` command not found or errors

**Solution**:

```bash
# Ensure dependencies are installed
npm install

# Run tests with explicit path
./node_modules/.bin/jest
```

### Import Errors

**Problem**: `Cannot find module` errors

**Solution**:

- Ensure `jest.config.js` has correct `testEnvironment: 'node'`
- Check module paths in tests match actual file locations
- Use relative paths (e.g., `../src/utils/matchTowing`)

### Timeout Errors

**Problem**: Tests timeout (tests take > 5 seconds)

**Solution**:

- Tests that call external APIs (NHTSA) are not included
- Mock external API calls in future expansion
- Current tests are all synchronous and fast

---

## Future Enhancements

### Testing Opportunities

1. **API Route Testing**
   - Test Express routes with supertest
   - Mock Supabase auth
   - Verify request/response handling

2. **Integration Tests**
   - Full VIN → towing capacity flow
   - Garage CRUD operations
   - User role enforcement

3. **Error Handling**
   - Invalid input handling
   - API failure scenarios
   - Database error cases

4. **Performance Tests**
   - Benchmark VIN matching
   - Test with large datasets
   - Memory usage verification

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://jestjs.io/docs/getting-started)
- [JavaScript Testing Guide](https://testingjavascript.com/)

---

## Questions?

If tests fail or you need help:

1. Read the test output carefully - Jest provides detailed error messages
2. Check the specific test file for what's being tested
3. Review the function being tested to understand expected behavior
4. Run `npm run test:watch` and modify code/tests interactively
