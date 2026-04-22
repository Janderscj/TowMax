# TowMax Frontend

React client for the TowMax prototype.

## Scripts

From the `frontend/` directory:

```bash
npm start
```

Starts the development server on `http://localhost:3000`.

```bash
npm run build
```

Builds the production bundle into `build/`.

```bash
npm test
```

Runs the test runner.

## Environment Variables

Create a local `.env` or `.env.local` file in `frontend/` with:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Notes:

- `REACT_APP_SUPABASE_ANON_KEY` is a public client key and is expected to be exposed to the browser.
- Do not place `SUPABASE_SERVICE_ROLE_KEY` or any other server-only secret in the frontend.
- Frontend env files are ignored by Git and should stay that way.

## Deployment

- The frontend is built as a static Create React App bundle.
- Vercel should build this directory with `npm run build` and publish the `build/` output.
- Production environment variables must be configured in the hosting provider, not committed to the repository.
