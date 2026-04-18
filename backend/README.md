# Towing Project Backend

Node.js/Express API for vehicle towing capacity lookup and estimation.

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm
- Supabase account (for authentication)

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file in the backend directory with the following variables:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
NODE_ENV=development
PORT=5000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Running the Server

Development mode:

```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### VIN Lookup (No Authentication Required)

#### `GET /api/towing/:vin`

Decode a VIN and get initial towing estimates based on manufacturer data.

**Parameters:**

- `vin` (string, required) - Valid 17-character VIN

**Response:**

```json
{
  "decoded": {
    "year": 2024,
    "make": "FORD",
    "model": "F-150",
    "series": "1500",
    "engine": "3.5L EcoBoost",
    "driveType": "4WD",
    "cabType": "Crew Cab"
  },
  "towingMatches": [
    {
      "year": 2024,
      "make": "FORD",
      "model": "F-150",
      "towPackage": "maxTow",
      "maxTow": 14000,
      "gcwr": 14500,
      "payload": 1560
    }
  ],
  "missingInfo": ["towPackage"],
  "options": {
    "towPackage": {
      "supportsMaxTow": true,
      "options": [...]
    }
  }
}
```

**Error Response:**

```json
{
  "error": "Invalid VIN format"
}
```

---

### Refine Results (No Authentication Required)

#### `POST /api/towing/refine`

Refine towing estimates based on user-provided additional information.

**Request Body:**

```json
{
  "vin": "1FTFW1ET5DFC12345",
  "answers": {
    "towPackage": "maxTow",
    "axleRatio": "3.55",
    "bedLength": "5.5 ft"
  }
}
```

**Response:**

```json
{
  "towingMatches": [
    {
      "year": 2024,
      "make": "FORD",
      "model": "F-150",
      "trim": "Lariat",
      "towPackage": "maxTow",
      "maxTow": 14000,
      "gcwr": 14500,
      "payload": 1560
    }
  ],
  "exactMatch": true,
  "missingInfo": []
}
```

---

### User Endpoints (Authentication Required)

All user endpoints require a valid Supabase JWT token in the `Authorization` header:

```
Authorization: Bearer <supabase_jwt_token>
```

#### `GET /api/user/profile`

Get current user's profile and role information.

**Response:**

```json
{
  "id": "uuid",
  "role": "free|premium|dealer",
  "garage_limit": 1,
  "can_replace_free_vehicle": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### `POST /api/user/role/update`

Update user role (typically admin-only in production).

**Request Body:**

```json
{
  "role": "premium"
}
```

---

### Garage Endpoints (Authentication Required)

#### `GET /api/garage`

Get all saved vehicles for the current user.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "vin": "1FTFW1ET5DFC12345",
    "year": 2024,
    "make": "FORD",
    "model": "F-150",
    "trim": "Lariat",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### `POST /api/garage/add`

Add a vehicle to the user's garage.

**Request Body:**

```json
{
  "vin": "1FTFW1ET5DFC12345",
  "year": 2024,
  "make": "FORD",
  "model": "F-150",
  "trim": "Lariat"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "vin": "1FTFW1ET5DFC12345",
  "year": 2024,
  "make": "FORD",
  "model": "F-150",
  "trim": "Lariat",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### `POST /api/garage/remove`

Remove a vehicle from the user's garage.

**Request Body:**

```json
{
  "id": "uuid"
}
```

**Response:**

```json
{
  "success": true
}
```

---

## Data Files

Vehicle data is stored in JSON files organized by brand:

- `backend/data/chevrolet.json`
- `backend/data/ford.json`
- `backend/data/gmc.json`
- `backend/data/honda.json`
- `backend/data/jeep.json`
- `backend/data/nissan.json`
- `backend/data/ram.json`
- `backend/data/toyota.json`

### Data Schema

Each vehicle entry contains:

```json
{
  "year": 2024,
  "make": "FORD",
  "model": "F-150",
  "series": "1500",
  "trim": "Lariat",
  "engine": "3.5L EcoBoost",
  "driveType": "4WD",
  "cabType": "Crew Cab",
  "bed": "5.5 ft",
  "axleRatio": "3.55",
  "towPackage": "maxTow",
  "gcwr": 14500,
  "payload": 1560,
  "maxTow": 14000
}
```

**Field Definitions:**

- `year` - Model year
- `make` - Manufacturer (e.g., "FORD")
- `model` - Model name (e.g., "F-150")
- `series` - Model series (e.g., "1500")
- `trim` - Trim level (e.g., "Lariat")
- `engine` - Engine specification
- `driveType` - "2WD" or "4WD"
- `cabType` - Cabin type (e.g., "Crew Cab", "SuperCrew")
- `bed` - Bed size/type
- `axleRatio` - Rear axle ratio
- `towPackage` - Package type: "maxTow", "standard", or "none"
- `gcwr` - Gross Combined Weight Rating (lbs)
- `payload` - Maximum payload capacity (lbs)
- `maxTow` - Maximum towing capacity (lbs)

---

## Authentication

### Google OAuth Flow

1. Frontend initiates Google OAuth via Supabase
2. Supabase validates and creates/updates user record
3. Database trigger automatically creates profile with "free" role
4. JWT token returned to frontend and used in subsequent requests

### User Roles

- **free** - Limited to 1 saved vehicle, read-only lookups
- **premium** - Up to 5 saved vehicles, priority support
- **dealer** - Unlimited vehicles, API access, no UI limitations

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not found
- `500` - Server error

Error responses include a message:

```json
{
  "error": "Invalid VIN format"
}
```

---

## Middleware

### `authenticateUser`

Attempts to extract and validate JWT from Authorization header. Sets `req.user` accordingly. **Note:** VIN endpoints allow unauthenticated access by design (sets `req.user = null`).

---

## Development

### Project Structure

```
backend/
├── src/
│   ├── server.js           # Express server entry point
│   ├── routes/             # API endpoint definitions
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   └── towData/            # Towing package rules
├── data/                   # Vehicle specifications (JSON)
└── package.json
```

### Key Files

- `src/utils/vinDecoder.js` - VIN decoding logic
- `src/utils/matchTowing.js` - Vehicle matching algorithm
- `src/utils/towPackageEngine.js` - Towing package option generator
- `src/utils/loadBrandData.js` - Data file loader

---

## Notes on Data

- All specifications sourced from official manufacturer documentation
- Data accuracy is critical for user safety when towing
- When updating data files, ensure consistency with existing schema
- VIN matching is case-insensitive for brand/model/series names

---

## License

See project LICENSE file
