# Failure Lab

A static learning site for investigating distributed-systems failures. Scenario 01 is a deterministic browser exercise: C is isolated, A accepts a write, and a direct read from C returns its old value.

This is a teaching model, not a distributed database, a consensus protocol, or a claim about how every partitioned system behaves. Its assumptions and exclusions are documented in [docs/SCENARIO.md](docs/SCENARIO.md).

## Run locally

Requires Node.js 18 or newer. No package installation or external service is needed.

```sh
npm test
npm start
```

Open <http://127.0.0.1:4173> for the landing page. Scenario 01 is at <http://127.0.0.1:4173/scenario/> and the project overview is at <http://127.0.0.1:4173/about/>. The local server binds only to the loopback interface.

## Build for production

```sh
npm run build
```

This dependency-free build copies the static site to `dist/` and includes the scenario specification. It intentionally keeps URL paths relative so the site works at the GitHub Pages project subpath.

## Deploy to GitHub Pages

The [Pages workflow](.github/workflows/pages.yml) builds and deploys on pushes to `main`; it can also be run manually from the Actions tab.

One-time repository setup:

1. Open **Settings → Pages**.
2. Set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` and wait for the **Deploy GitHub Pages** workflow to complete.

The public project URL will be <https://saxylady.github.io/failure-lab/>. No deployment secret or package installation is required.

The prediction and confidence are held only in page memory and do not affect the model. The app does not sign in users, make external network requests from the page, or persist learner data.

## Project layout

- `web/` — the landing page, about page, scenario, and shared styles
- `tests/` — focused tests for the deterministic scenario
- `scripts/` — the dependency-free build and local development server
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `docs/SCENARIO.md` — model rules, exact sequence, and limitations
- `docs/PROJECT_GUIDE.md` — verification and responsible next steps
- `AGENTS.md` — implementation guidance for coding agents and contributors

## Development

`npm test` runs the model tests with Node's built-in test runner. `npm start` serves the static site at `127.0.0.1:4173`. `npm run build` produces the production site in `dist/`. No runtime or build dependencies are needed.

Before expanding the exercise, preserve its deterministic behavior and update both the scenario documentation and tests. See [AGENTS.md](AGENTS.md) for contribution constraints and [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for validation and feedback guidance.
