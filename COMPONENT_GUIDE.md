# AppHeader Component & Global Styles - Usage Guide

## Overview

This refactoring consolidates CSS styles and creates reusable components to maintain consistency across all screens.

## New Files Created

1. **`frontend/src/components/AppHeader.jsx`** - Reusable header component
2. **`frontend/src/styles/globalStyles.js`** - Centralized global styles
3. **`frontend/src/utils/apiConfig.js`** - Consolidated API URL configuration

## Updated Files

- `frontend/src/screens/GarageScreen.jsx` - Now uses AppHeader
- `frontend/src/screens/GarageVehicleDetailsScreen.jsx` - Now uses AppHeader

## AppHeader Component

### Basic Usage

```jsx
import AppHeader from '../components/AppHeader';

export default function MyScreen({ onHome, onSignOut }) {
  return (
    <div>
      <AppHeader title="My Screen" onHome={onHome} onSignOut={onSignOut} />
      {/* Rest of screen content */}
    </div>
  );
}
```

### With Back Button

```jsx
<AppHeader
  title="Vehicle Details"
  showBackButton={true}
  onBack={() => navigate(-1)}
  onHome={onHome}
  onSignOut={onSignOut}
/>
```

### Props

| Prop             | Type     | Default   | Description                           |
| ---------------- | -------- | --------- | ------------------------------------- |
| `title`          | string   | undefined | Header title text                     |
| `showBackButton` | boolean  | false     | Show/hide back button                 |
| `onBack`         | function | undefined | Callback when back button clicked     |
| `onHome`         | function | undefined | Callback when home button clicked     |
| `onSignOut`      | function | undefined | Callback when sign out button clicked |

## Global Styles

### Available Style Objects

```javascript
import { globalStyles } from '../styles/globalStyles';

// Common style objects available:
-globalStyles.appContainer -
  globalStyles.pageContainer -
  globalStyles.navButton -
  globalStyles.backButton -
  globalStyles.primaryButton -
  globalStyles.dangerButton -
  globalStyles.card -
  globalStyles.notice -
  globalStyles.error -
  globalStyles.title -
  globalStyles.subtitle -
  globalStyles.colors;
```

### Example Usage

```jsx
import { globalStyles } from '../styles/globalStyles';

export default function MyScreen() {
  return (
    <div style={globalStyles.appContainer}>
      <h1 style={globalStyles.title}>My Title</h1>
      <button style={globalStyles.primaryButton}>Click me</button>
    </div>
  );
}
```

## How to Apply to Other Screens

### Step 1: Update imports

```jsx
// Before
import { Home, LogOut, ArrowLeft } from 'lucide-react';

// After
import AppHeader from '../components/AppHeader';
import { globalStyles } from '../styles/globalStyles';
```

### Step 2: Replace inline header with AppHeader

```jsx
// Before
<div style={styles.header}>
  <h1 style={styles.title}>My Title</h1>
  <div style={{ display: 'flex', gap: '8px' }}>
    <button onClick={onHome} style={styles.navButton}>
      <Home size={16} />
    </button>
    <button onClick={onSignOut} style={styles.navButton}>
      <LogOut size={16} />
    </button>
  </div>
</div>

// After
<AppHeader
  title="My Title"
  onHome={onHome}
  onSignOut={onSignOut}
/>
```

### Step 3: Remove unused styles from local styles object

Delete `header`, `title`, `navButton`, `iconButton` from your screen's `const styles = {}`

## Screens That Can Be Updated

The following screens currently have inline headers and could benefit from using AppHeader:

- ✅ GarageScreen (DONE)
- ✅ GarageVehicleDetailsScreen (DONE)
- [ ] VinEntryScreen - Has back button
- [ ] QuestionsScreen - Has nav buttons
- [ ] RangeResultScreen - Has nav buttons
- [ ] RangeFallbackScreen - Has nav buttons
- [ ] ExactResultScreen - Has nav buttons
- [ ] UpgradeScreen - Has back and nav buttons
- [ ] VinBreakdownScreen - Has back and nav buttons

## Benefits

1. **Consistency** - All headers look and behave the same way
2. **Maintainability** - Update header style in one place, affects all screens
3. **Reusability** - No more duplicating header code
4. **Scalability** - Easy to add new header features (badges, alerts, etc.)
5. **Smaller file sizes** - Each screen has less CSS code
