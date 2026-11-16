# Scenario: an isolated replica returns an old value

## Learning goal

Predict what an isolated replica returns, step through a partition and write, and explain why its value differs from the other replicas. The key distinction is between a local write acknowledgement and replication to other nodes.

## Assumptions

This exercise models **asynchronous, best-effort replication with local-only acknowledgement**:

- A write is acknowledged immediately after A applies it. Acknowledgement does not mean B or C has applied it.
- A read goes directly to the selected replica.
- A blocked replication message is dropped and is not retried.

These are rules of this exercise only. They are not guarantees about distributed databases in general.

## Initial state

| Node | Value |
| --- | ---: |
| A | 0 |
| B | 0 |
| C | 0 |

All links are open, and no replication messages are pending.

## Investigation flow

The learner first receives a mission briefing: they are troubleshooting a customer read from an isolated replica. Its impact, service-health, and known-issues labels are narrative context only; they are not modeled system state.

Before playback, the learner predicts whether the read returns `0` or `1` and chooses a confidence level. Both choices stay in page memory, are not transmitted or persisted, and do not affect the scenario. The learner then advances through the five actions, sees the node and link state plus message delivery outcomes, and receives the result and explanation at the final read.

## Ordered actions

Each press of **Next** performs exactly one action:

| Step | Action | Result |
| ---: | --- | --- |
| 1 | Isolate C | Links A-C and B-C are blocked; A-B remains open. |
| 2 | Write `1` to A | A becomes `1` and acknowledges locally. Messages A-to-B and A-to-C are queued, in that order. B and C remain `0`. |
| 3 | Deliver A-to-B | The open link permits delivery; B becomes `1`. |
| 4 | Attempt A-to-C | The blocked link drops the message; C remains `0`. There is no automatic retry. |
| 5 | Read C | The direct read returns `0`, stale relative to A's acknowledged value `1`. |

Final values: **A = 1, B = 1, C = 0**. After step 5, Next is disabled. Reset and page refresh restore the initial state.

The prediction prompt is: “A customer reads from Replica C. What do you expect to happen?” At the final read, the app reveals the result and explains the rules whether the prediction was right or wrong.

## Explicit exclusions

This is not a reusable simulator and does not model leader election, quorum, concurrent writes, retries, message reordering, partition healing, catch-up, real clocks, or real network behavior. It is not named after or presented as a particular database or consensus algorithm.
