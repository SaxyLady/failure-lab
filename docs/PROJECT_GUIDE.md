# Project guide

## Current baseline

The repository contains a landing page, an about page, and two independent deterministic, five-action browser exercises with a mission briefing, prediction, timeline playback, and result reveal. A dependency-free build produces a static site for GitHub Pages. There is no sign-in, backend, telemetry, external page request, or persisted learner state.

## Definition of done

- The exercise runs locally from the documented commands.
- Automated tests check each scenario's initial state, transitions, event ordering, repeatability, and reset.
- Each UI accepts its prediction and a confidence choice, keeps both transient, and reveals the result only after the final step.
- Keyboard-only and narrow-screen checks confirm the controls and explanation remain understandable without color.
- Each scenario's assumptions and limitations are visible in the app and its documentation.

## Follow-up

Invite two or three backend developers learning replication when available. Ask them to predict C's value before stepping, then explain the result, local acknowledgement, and one limitation of the model. Ask whether they would try another experiment. Record only non-identifying observations.

Do not report the learning outcome as validated until participants respond. If a scenario is unclear or unhelpful, improve its explanation before adding features. If participants want another experiment, define one behavior with explicit rules and tests before deciding to build it. Do not infer broad demand or commercial potential from a small feedback sample.

Feedback may happen after the implementation; participant availability is not a prerequisite for a correct local exercise.
