# Distributed Systems Failure Lab

A small, local browser exercise for learning how replication and network partitions can affect reads. The first exercise walks through one deterministic scenario: C is isolated, A accepts a write, and a direct read from C returns its old value.

This is a teaching model, not a distributed database, a consensus protocol, or a claim about how every partitioned system behaves. Its assumptions and exclusions are documented in [docs/SCENARIO.md](docs/SCENARIO.md).

## Run locally

Requires Node.js 18 or newer. No package installation or external service is needed.

```sh
npm test
npm start
```

Open <http://127.0.0.1:4173>. The app runs in the browser; refreshing restarts the exercise. The local server binds only to the loopback interface.

## Investigation flow

1. Read the mission briefing and investigation goal.
2. Predict whether the customer will receive `0` or `1`, then choose a confidence level.
3. Lock in the prediction and follow the five event cards, replica values, connection status, and replication messages.
4. Review the result and key lesson, or replay the scenario.

The prediction and confidence are held only in page memory and do not affect the model. The app does not sign in users, make external network requests from the page, or persist learner data.

## Project layout

- `web/` — the browser app and its styles
- `tests/` — focused tests for the deterministic scenario
- `scripts/` — the dependency-free local development server
- `docs/SCENARIO.md` — model rules, exact sequence, and limitations
- `docs/PROJECT_GUIDE.md` — verification and responsible next steps
- `AGENTS.md` — implementation guidance for coding agents and contributors

## Development

`npm test` runs the model tests with Node's built-in test runner. `npm start` serves the app at `127.0.0.1:4173`. No build step is required.

Before expanding the exercise, preserve its deterministic behavior and update both the scenario documentation and tests. See [AGENTS.md](AGENTS.md) for contribution constraints and [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) for validation and feedback guidance.
