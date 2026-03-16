# Phase 1 Implementation: Google Authentication, User Roles, and Database Schema

## Overview

Phase 1 introduces user authentication, role-based access control, and a garage system for storing user vehicles. This enables personalized towing capacity lookups and prepares the foundation for subscription-based features.

## Database Schema

### Tables Created

#### `profiles` Table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('free', 'premium', 'dealer')) DEFAULT 'free',
  garage_limit INTEGER,
  can_replace_free_vehicle BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**

- `id`: References Supabase auth.users table
- `role`: User role ('free', 'premium', 'dealer')
- `garage_limit`: Maximum vehicles allowed (null for dealers)
- `can_replace_free_vehicle`: Whether user can replace vehicles
- `created_at`/`updated_at`: Timestamps

#### `garage` Table

```sql
CREATE TABLE garage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vin TEXT NOT NULL,
  year INTEGER,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  trim TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields:**

- `id`: Primary key
- `user_id`: References profiles table
- `vin`: Vehicle identification number
- `year`, `make`, `model`, `trim`: Vehicle details
- `created_at`: Timestamp

### Row Level Security (RLS)

Both tables have RLS enabled with policies ensuring users can only access their own data.

## Authentication Flow

### Google OAuth Integration

1. **Frontend**: User clicks "Continue with Google" button
2. **Supabase**: Redirects to Google OAuth
3. **Google**: User authenticates and grants permissions
4. **Supabase**: Creates/updates user record in auth.users
5. **Database Trigger**: Automatically creates profile with 'free' role
6. **Frontend**: Receives auth state change, fetches profile

### Auth State Management

The `AuthContext` provides:

- `user`: Current authenticated user
- `profile`: User profile with role information
- `signInWithGoogle()`: Initiates OAuth flow
- `signOut()`: Signs out user
- `isFree`/`isPremium`/`isDealer`: Role helpers

## Role Logic

### Role Assignment

**On First Login:**

- `role = "free"`
- `garageLimit = 1`
- `canReplaceFreeVehicle = false`

**Premium Upgrade:**

- `role = "premium"`
- `garageLimit = 5`
- `canReplaceFreeVehicle = true`

**Dealer Upgrade:**

- `role = "dealer"`
- `garageLimit = null` (unlimited)
- `canReplaceFreeVehicle = true`

### Role Enforcement

**Free Users:**

- Can store maximum 1 vehicle
- Cannot remove their only vehicle
- Cannot add more than 1 vehicle

**Premium Users:**

- Can store up to 5 vehicles
- Can add/remove vehicles freely

**Dealer Users:**

- No garage restrictions
- Direct access to VIN lookup tools
- Do not use garage endpoints

## Garage Rules

### Vehicle Management

1. **Adding Vehicles:**
   - Free users: Limited to 1 vehicle
   - Premium users: Limited to 5 vehicles
   - Dealers: No limit (but don't use garage)

2. **Removing Vehicles:**
   - Free users cannot remove their only vehicle
   - Other roles can remove freely

3. **VIN Uniqueness:**
   - Users cannot add duplicate VINs to their garage

### Data Validation

- VIN, year, make, model are required
- VIN is stored in uppercase
- Trim is optional

## API Endpoints

### User Endpoints

#### `GET /api/user/profile`

**Auth:** Required
**Response:**

```json
{
  "id": "uuid",
  "role": "free|premium|dealer",
  "garage_limit": 1,
  "can_replace_free_vehicle": false,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### `POST /api/user/role/update`

**Auth:** Required
**Body:**

```json
{
  "role": "free|premium|dealer"
}
```

**Response:** Updated profile object

### Garage Endpoints

#### `GET /api/garage`

**Auth:** Required
**Response:** Array of user's vehicles

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "vin": "VIN123...",
    "year": 2020,
    "make": "Ford",
    "model": "F-150",
    "trim": "XL",
    "created_at": "timestamp"
  }
]
```

#### `POST /api/garage/add`

**Auth:** Required
**Body:**

```json
{
  "vin": "VIN123...",
  "year": 2020,
  "make": "Ford",
  "model": "F-150",
  "trim": "XL"
}
```

**Response:** Added vehicle object

#### `POST /api/garage/remove`

**Auth:** Required
**Body:**

```json
{
  "vehicleId": "uuid"
}
```

**Response:**

```json
{
  "success": true
}
```

## Frontend Integration

### AuthContext Usage

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, profile, isFree, isPremium, isDealer, signInWithGoogle, signOut } = useAuth();

  if (!user) return <LoginScreen />;

  return (
    <div>
      {isFree && <FreeUserFeatures />}
      {isPremium && <PremiumUserFeatures />}
      {isDealer && <DealerFeatures />}
    </div>
  );
}
```

### Protected Routes

- **My Garage**: Available to free + premium users
- **Dealer Dashboard**: Available only to dealers
- **VIN Lookup**: Available to all authenticated users

### Role-Based UI

**Free Users:**

- Garage shows 1-slot with locked behavior
- Cannot add more than 1 vehicle
- Cannot remove only vehicle

**Premium Users:**

- Garage shows up to 5 slots
- Full add/remove functionality

**Dealer Users:**

- No garage UI
- Direct VIN lookup access

## Example User Flows

### Free User Onboarding

1. User signs in with Google
2. Profile automatically created with free role
3. User can add 1 vehicle to garage
4. User can perform VIN lookups
5. Garage shows 1 vehicle limit

### Premium Upgrade Flow

1. User has free account with vehicles
2. User upgrades via Stripe (future implementation)
3. Role updated to 'premium', garage_limit to 5
4. User can now add up to 4 more vehicles
5. UI updates to show premium features

### Dealer Login Flow

1. Dealer signs in with Google
2. Profile created with dealer role
3. No garage access
4. Direct access to VIN lookup tools
5. Dealer-specific UI elements

## Environment Variables

### Backend (.env)

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Notes for Future Phases

### Phase 2 Considerations

- Implement Stripe webhooks for role updates
- Add vehicle photo upload to garage
- Implement vehicle sharing between users
- Add towing history tracking

### Phase 3 Considerations

- Advanced dealer features (bulk lookups, reporting)
- Integration with vehicle APIs for real-time data
- Mobile app development
- Advanced analytics and reporting

### Security Considerations

- All API endpoints require authentication
- RLS ensures data isolation
- JWT tokens validated on each request
- Service role key protected server-side only

### Performance Considerations

- Garage data cached in frontend
- VIN decode results cached
- Database indexes on frequently queried fields
- Pagination for large garage lists (future)

### Testing Requirements

- Unit tests for role logic
- Integration tests for auth flow
- E2E tests for garage operations
- Load testing for concurrent users
