# Failure Lab product vision

Failure Lab exists to help engineers build intuition about complex systems through short, interactive failure scenarios.

Each exercise should make a specific cause and its consequence understandable. Learners predict an outcome, observe what happens under stated rules, and leave with a takeaway they can apply when reasoning about real systems. The exercises are teaching models, not proofs or representations of every real-world system.

## Scenario rubric

Every scenario should provide:

1. **Setup:** Introduce the situation, goal, and assumptions needed to reason about it.
2. **Prediction:** Ask the learner to anticipate an outcome before revealing it.
3. **Observation:** Show the relevant events and their outcomes in an understandable order.
4. **Explanation:** Connect the observed outcome to the scenario's rules, including relevant limitations.
5. **Takeaway:** State the central lesson without implying it applies to every system.
Scenario Success Criteria

A learner should be able to answer:

1. What happened?
2. Why did it happen?
3. What assumption caused it?
4. Why might another system behave differently?

Keep the experience short, accessible, and understandable without relying on color. Define each scenario's behavior and assumptions explicitly, separate state transitions from rendering, and add focused tests before calling it complete.

## Implemented scenarios

1. **The Isolated Replica:** Explore a local acknowledgement and a direct read from an isolated replica. See [SCENARIO.md](SCENARIO.md).
2. **Retry Storm:** Explore how retries can add load while original requests remain queued. See [SCENARIO-02.md](SCENARIO-02.md).

## Possible future scenarios

These are ideas, not commitments or implemented exercises:

1. **Cache stampede:** Explore what can happen when many requests encounter an expired cached item.
2. **Queue backlog:** Explore messages arriving faster than workers can process them.
3. **Region outage:** Explore a regional failure; defer until its broader scope can be kept clear.
4. **Split brain:** Explore conflicting views of a system; defer until it can be introduced without unnecessary confusion.

Before building any candidate, define a separate exercise with explicit rules, learner-facing outcomes, limitations, and focused tests. Do not infer that a particular outcome is inevitable in all real systems.

## Product and engineering principles

- Improve the quality and clarity of each lesson before expanding the catalog.
- Implement early scenarios explicitly; do not build a general-purpose scenario engine in anticipation of reuse. Revisit shared abstractions only after several scenarios reveal a concrete constraint or meaningful repetition.
- Keep the experience local and static, with no authentication, backend services, telemetry, external page requests, or persistent learner data.
- Gather learner feedback separately. Ask whether participants can explain the result and whether the exercise helped; do not claim learning outcomes are validated before they respond.
- Consider a scenario catalog when there are real exercises to organize. Future ideas should not be presented as available lessons.

Scenario rules are in [SCENARIO.md](SCENARIO.md) and [SCENARIO-02.md](SCENARIO-02.md); feedback and verification guidance are in [PROJECT_GUIDE.md](PROJECT_GUIDE.md).
