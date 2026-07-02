# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A full-stack coffee shop drink menu app (Udacity FSND capstone) with two independent, unversioned-together halves:

- `backend/` — Flask + SQLAlchemy (SQLite) REST API, secured with Auth0 JWT/RBAC.
- `frontend/` — Ionic/Angular SPA that consumes the API and drives login through Auth0's implicit flow.

They communicate over plain HTTP; there is no shared build or monorepo tooling — treat them as two separate projects that happen to live in one repo.

## Common commands

### Backend (from `backend/src/`)

```bash
pip install -r ../requirements.txt   # install deps (run once, ideally in a venv)
export FLASK_APP=api.py
flask run --reload                   # dev server on http://127.0.0.1:5000, auto-restarts on change
```

There is no automated test suite for the backend; verification is done manually via the Postman collection at `backend/udacity-fsnd-udaspicelatte.postman_collection.json` (separate barista/manager JWTs).

### Frontend (from `frontend/`)

```bash
npm install
ionic serve      # or: npm start (ng serve) — dev server on http://localhost:8100
npm run build     # ng build
npm test          # ng test (Karma/Jasmine)
npm run lint      # ng lint
npm run e2e        # ng e2e
```

## Architecture

### Backend (`backend/src/`)

- `api.py` — Flask app and all routes. `CORS(app)` is enabled globally. `db_drop_and_create_all()` runs **on every app start**, wiping and reseeding the SQLite DB with a single demo drink — expect data to not persist across restarts.
- `database/models.py` — single `Drink` SQLAlchemy model (`id`, `title`, `recipe` as a JSON string blob of `{name, color, parts}`). `short()` exposes just color/parts (public view); `long()` exposes the full recipe including ingredient names (requires `get:drinks-detail`).
- `auth/auth.py` — Auth0 JWT verification (RS256, JWKS fetched live from `AUTH0_DOMAIN`) and the `@requires_auth(permission)` decorator used on protected routes. Permissions are read from the `permissions` claim in the decoded token (RBAC must be enabled in Auth0 with "Add Permissions in the Access Token").

Routes and their required scopes:
- `GET /drinks` — public, returns `short()` form.
- `GET /drinks-detail` — `get:drinks-detail`, returns `long()` form.
- `POST /drinks` — `post:drinks`.
- `PATCH /drinks/<id>` — `patch:drinks`.
- `DELETE /drinks/<id>` — `delete:drinks`.

Note: `AUTH0_DOMAIN` and `API_AUDIENCE` are hardcoded constants in `auth.py`, not environment variables.

### Frontend (`frontend/src/app/`)

- `services/auth.service.ts` — owns the Auth0 implicit-grant flow: builds the `/authorize` redirect link, parses the `access_token` out of the URL fragment on callback, stores the raw JWT in `localStorage`, decodes it, and exposes `can(permission)` for permission checks in templates/components (e.g. gating buttons in `pages/drink-menu/drink-form`).
- `services/drinks.service.ts` — HTTP client for the backend API; attaches the stored JWT as the `Authorization` header.
- `pages/drink-menu/` — main feature: `drink-menu.page.ts` lists drinks, `drink-form/` is the create/edit form (manager-only actions gated via `auth.can(...)`), `drink-graphic/` renders the ingredient-ratio graphic from a drink's `recipe`.
- `pages/tabs/` — tab navigation shell; `pages/user-page/` — login/logout entry point.
- `environments/environment.ts` (and `environment.prod.ts`) — holds `apiServerUrl` and the Auth0 `url`/`audience`/`clientId`/`callbackURL`. These must match whatever Auth0 tenant/API the backend's `auth.py` constants point at — if backend and frontend Auth0 config diverge, auth will fail silently with 401s.

## Auth0 configuration coupling

Backend (`auth/auth.py`) and frontend (`environments/environment.ts`) each hardcode their own copy of the Auth0 domain/audience. When changing Auth0 tenants, apps, or permissions, both files need to be updated together, along with the roles/permissions in the Auth0 dashboard (Barista: `get:drinks-detail`; Manager: all four scopes).
