# Agent and contributor guidance

## Source of truth

- Follow the exact scenario and stated assumptions in [docs/SCENARIO.md](docs/SCENARIO.md).
- Keep the five scenario transitions explicit and deterministic. Do not turn them into a general-purpose simulation engine.
- Keep scenario state transitions separate from DOM rendering.
- Update the scenario documentation and focused tests whenever scenario behavior or learner-facing outcomes change.

## Scope and safety of claims

- This is a local teaching model, not a real database, a consensus protocol, or a proof of consistency guarantees.
- Do not imply every partitioned system returns stale data. Other systems may reject or block reads or use different replication rules.
- Do not add leader election, quorum, concurrent writes, retries, message reordering, partition healing, catch-up, real clocks, or real network behavior without first defining a separate, tested exercise.
- Do not add authentication, backend services, cloud resources, telemetry, external page requests, or persistent learner data.
- Keep predictions and confidence in transient page state; do not transmit or persist them, and do not let confidence affect the model.

## Implementation

- Prefer browser and Node.js built-ins; this fixed exercise does not need runtime or test dependencies.
- Keep the development server bound to `127.0.0.1` and limited to the app and scenario's known static files.
- Use relative asset and page links so the production site works beneath the GitHub Pages repository path.
- Keep the production build static and limited to `web/` plus the published scenario specification.
- Make controls keyboard-operable and ensure meaning is conveyed by text, not color alone.
- Avoid animation and unnecessary abstractions.

## Verification

- Run `npm test` after model or interaction changes.
- Confirm each step's node values, link status, event order, acknowledgement, drop, and final read match [docs/SCENARIO.md](docs/SCENARIO.md).
- Verify reset from a partial and completed run, either prediction, and that Next is disabled before a prediction and after completion.
- Check the app at a narrow viewport and with keyboard-only interaction before calling UI work complete.
- Report exactly what was tested. Do not describe learner feedback or learning outcomes as validated until participants provide feedback.
