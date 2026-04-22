# TowMax Backend

Node.js/Express API for VIN decoding, towing lookup, refinement, garage management, and authenticated user/profile flows.

## Prerequisites

- Node.js 22.x
- npm 11.x
- Supabase project with the required tables and auth configuration

## Installation

```bash
cd backend
npm install
```

## Environment Variables

Create `backend/.env` with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed to the frontend.
- `FRONTEND_URL` controls the allowed browser origin for CORS.

## Scripts

```bash
npm run dev
```

Starts the API with `nodemon`.

```bash
npm start
```

Starts the API with Node.

```bash
npm test
npm run test:watch
npm run test:coverage
```

Runs the backend test suite.

```bash
npm run validate:data
```

Runs the towing data validation script.

## Important Endpoints

### Public endpoints

- `GET /api/towing/:vin`
- `POST /api/towing/refine`

### Authenticated endpoints

- `GET /api/user/profile`
- `GET /api/garage`
- `POST /api/garage/add`
- `POST /api/garage/remove`

Authenticated endpoints expect a Supabase JWT in the `Authorization` header:

```text
Authorization: Bearer <supabase_jwt_token>
```

## Security Notes

- `POST /api/user/role/update` is intentionally disabled for self-service clients and returns `403`.
- Production logging is intentionally reduced to avoid exposing VINs and other sensitive request details.
- This backend assumes server-side ownership of privileged Supabase operations.

## Testing

The current tests focus on core matching and VIN normalization behavior. See [TESTING.md](./TESTING.md) for more detail.

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

## Middleware

### `authenticateUser`

Attempts to extract and validate JWT from Authorization header. Sets `req.user` accordingly. **Note:** VIN endpoints allow unauthenticated access by design (sets `req.user = null`).

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

## Notes on Data

- All specifications sourced from official manufacturer documentation
- Data accuracy is critical for user safety when towing
- When updating data files, ensure consistency with existing schema
- VIN matching is case-insensitive for brand/model/series names

## License

See project LICENSE file
