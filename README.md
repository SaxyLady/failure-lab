# Failure Lab

A static learning site for investigating distributed-systems failures. Scenario 01 is a deterministic browser exercise: C is isolated, A accepts a write, and a direct read from C returns its old value. Scenario 02 is a separate deterministic exercise about retries adding work to a slow service's queue.

These are teaching models, not a distributed database, a consensus protocol, or claims about how every system behaves. Their assumptions and exclusions are documented in [docs/SCENARIO.md](docs/SCENARIO.md) and [docs/SCENARIO-02.md](docs/SCENARIO-02.md).

## Run locally

Requires Node.js 18 or newer; Node.js 24 is recommended and used by the deployment workflow. No package installation or external service is needed.

```sh
npm test
npm start
```

Open <http://127.0.0.1:4173/> for Scenario 01 and <http://127.0.0.1:4173/retry-storm/> for Scenario 02. The landing page is at <http://127.0.0.1:4173/home/> and the project overview is at <http://127.0.0.1:4173/about/>. The old `/scenario/` address redirects to Scenario 01. The local server binds only to the loopback interface.

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
3. Push to `main` and wait for the **Deploy GitHub Pages** workflow to complete. If an earlier run failed before Pages was enabled, open that run in **Actions** and select **Re-run jobs → Re-run all jobs**.

The expected public project URL is <https://saxylady.github.io/failure-lab/> after a successful deployment. No deployment secret or package installation is required. If the **Configure GitHub Pages** step reports “Get Pages site failed” or “Not Found,” verify that Pages is enabled and its source is **GitHub Actions**, then rerun the workflow.

The prediction and confidence are held only in page memory and do not affect the model. The app does not sign in users, make external network requests from the page, or persist learner data.

## Project layout

- `web/` — the landing page, about page, scenario, and shared styles
- `tests/` — focused tests for the deterministic scenario
- `scripts/` — the dependency-free build and local development server
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `docs/SCENARIO.md`, `docs/SCENARIO-02.md` — model rules, exact sequences, and limitations
- `docs/PROJECT_GUIDE.md` — verification and responsible next steps
- `docs/product-vision.md` — product purpose, scenario rubric, and future ideas
- `AGENTS.md` — implementation guidance for coding agents and contributors

## Development

`npm test` runs the model tests with Node's built-in test runner. `npm start` serves the static site at `127.0.0.1:4173`. `npm run build` produces the production site in `dist/`. No runtime or build dependencies are needed.

Preserve each exercise's deterministic behavior and update its scenario documentation and focused tests when changing it. See [AGENTS.md](AGENTS.md) for contribution constraints and [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for validation and feedback guidance.
