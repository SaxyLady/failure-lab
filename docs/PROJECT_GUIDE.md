# Project guide

## Current baseline

The repository contains one deterministic, five-action browser exercise with a mission briefing, prediction, timeline playback, and result reveal. It uses a dependency-free local server and focused model tests. There is no sign-in, backend, cloud resource, telemetry, external page request, or persisted learner state.

## Definition of done

- The exercise runs locally from the documented commands.
- Automated tests check the initial state, each transition, event ordering, repeatability, and reset.
- The UI accepts either prediction and a confidence choice, keeps both transient, and reveals the read result only after the final step.
- Keyboard-only and narrow-screen checks confirm the controls and explanation remain understandable without color.
- The scenario's assumptions and limitations are visible in the app and documentation.

## Follow-up

Invite two or three backend developers learning replication when available. Ask them to predict C's value before stepping, then explain the result, local acknowledgement, and one limitation of the model. Ask whether they would try another experiment. Record only non-identifying observations.

Do not report the learning outcome as validated until participants respond. If the scenario is unclear or unhelpful, improve its explanation before adding features. If participants want another experiment, define one behavior with explicit rules and tests before deciding to build it. Do not infer broad demand or commercial potential from a small feedback sample.

Feedback may happen after the implementation; participant availability is not a prerequisite for a correct local exercise.
