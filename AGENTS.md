# Repository Guidelines

## Project Structure & Module Organization

This repository contains two applications. `backend/src/` holds the Flask API: routes are in `api.py`, Auth0/JWT helpers in `auth/auth.py`, and the SQLAlchemy model plus SQLite data in `database/`. `frontend/src/app/` contains the Ionic/Angular UI, organized into `pages/` and shared `services/`; assets live in `frontend/src/assets/`, and runtime settings in `frontend/src/environments/`. Unit tests sit beside their subjects as `*.spec.ts`; end-to-end tests are under `frontend/e2e/`. The backend uses `backend/udacity-fsnd-udaspicelatte.postman_collection.json` instead of an automated suite.

## Build, Test, and Development Commands

Run frontend commands from `frontend/`:

- `npm ci` installs the exact dependency tree from `package-lock.json`.
- `npm start` launches the Angular development server.
- `npm run build` creates a production build.
- `npm test` runs Karma/Jasmine tests; use `-- --watch=false` in CI.
- `npm run lint` checks TypeScript style, and `npm run e2e` runs the end-to-end suite.

For the API, create and activate a virtual environment, then run:

```bash
pip install -r backend/requirements.txt
flask --app backend.src.api run --reload
```

Starting the API recreates and seeds its SQLite database; local data does not survive restarts.

## Coding Style & Naming Conventions

Use four spaces and PEP 8 conventions for Python; keep route handlers and helpers in `snake_case`. TypeScript uses two spaces, single quotes, and a 140-character line limit per `frontend/tslint.json`. Name Angular classes in PascalCase with `Page`, `Component`, or `Service` suffixes. Keep selectors kebab-case with the `app-` prefix and files lowercase with hyphens, such as `drink-menu.page.ts`.

## Testing Guidelines

Add Jasmine specs beside new Angular code and describe observable behavior. Run the relevant spec plus the full frontend test/build before submitting. For backend changes, run the Postman collection against public, Barista, and Manager permissions; cover success responses and 400/401/404 paths.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects. Follow the existing Conventional Commit style when practical, for example `fix: validate drink recipes` or `build(deps): bump Flask`. Keep dependency and feature changes separate. Pull requests should explain the behavior changed, list validation commands, link the issue, and include screenshots for visible UI changes. Call out Auth0, API contract, or database changes explicitly.

## Security & Configuration

Never commit JWTs or tenant secrets. Frontend environment values are bundled into the client and therefore are not secret. Keep the Auth0 domain, audience, callback URL, and RBAC permissions aligned across frontend settings and `backend/src/auth/auth.py`.
