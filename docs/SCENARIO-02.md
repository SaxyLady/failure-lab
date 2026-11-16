# Scenario 02: Retry Storm

## 1. Scenario overview

A service slows down while three requests arrive. Clients that do not receive a response retry, but their original attempts are still in the service queue. The repeated attempts compete for the same limited capacity, so work accumulates even after the original requests finish.

This is a fixed, deterministic teaching model of retry-driven load amplification. It is not a general-purpose simulator or a prediction about every retry policy.

## 2. Learner objective

Predict how many request attempts remain queued after four service rounds, then explain how retries can add work while the original attempts are still pending.

The investigation is designed to take 3-5 minutes. Its primary lesson is: **a timeout does not cancel the original request, so a retry can increase load rather than replace the work already in progress.**

## 3. Exact simulation rules

- The service starts healthy and can complete three attempts per round. It has no queued work.
- A slowdown reduces its capacity to one attempt per round for the rest of the exercise.
- Three original attempts, A, B, and C, arrive together. The service processes attempts in FIFO order.
- A client receives no response if its original attempt is still queued at the end of a round. A timeout does not cancel that attempt.
- Each client may send at most two retries, one at the end of each round in which its original attempt has not completed. A completed original attempt stops that client's retries.
- Retries join the end of the same FIFO queue. The service processes one attempt in each round after the slowdown.
- An attempt that has already entered the queue is not removed if a later attempt for the same request completes. The model counts attempts, not application side effects.
- The exercise ends after four service rounds. There are no clocks, network failures, jitter, backoff, retry budgets beyond the stated limit, or additional arrivals.

## 4. State transitions

Each press of **Next** performs exactly one transition:

| Step | Action | Queue after the action | Completed attempts |
| ---: | --- | --- | ---: |
| 1 | Slow service to one attempt per round | Empty | 0 |
| 2 | A, B, and C arrive; round 1 completes A | B original, C original | 1 |
| 3 | B and C each retry; round 2 completes B original | C original, B retry 1, C retry 1 | 2 |
| 4 | C retries again; round 3 completes C original | B retry 1, C retry 1, C retry 2 | 3 |
| 5 | Round 4 completes B retry 1 | C retry 1, C retry 2 | 4 |

Final result: **6 attempts accepted, 4 completed, and 2 queued**. The prediction is revealed only after the final step. Reset returns to the initial state.

## 5. Visual elements

- A service-capacity indicator states attempts per round in text.
- Counters show accepted and completed attempts.
- An ordered queue lists each original or retry attempt by name and order.
- A five-event timeline explains each capacity, arrival, timeout, retry, and completion outcome.
- The result panel compares the learner's prediction with the final queue and explains why retries did not replace the original work.

The interface uses text and ordering as well as color to convey status.

## 6. Verification tests

Focused model tests verify:

- The empty initial queue and healthy capacity.
- Every one of the five transitions, including exact FIFO contents, attempt counts, and event order.
- The final counts of six accepted, four completed, and two queued attempts.
- Both valid predictions, invalid predictions, the prediction gate, and no advancement after completion.
- Repeatability and reset to a fresh initial state.

The production-build test verifies the new page, model, and published specification are included and their relative links resolve beneath a repository subpath.

## 7. Common misconceptions

- **“A timeout cancels the original request.”** In this exercise it does not; the original attempt stays in the queue.
- **“A retry replaces the original.”** Here it is additional work appended to the same queue.
- **“Retries always cause a storm.”** No. This example fixes one capacity, timeout rule, and retry limit; other systems may use backoff, cancellation, deduplication, or other policies.
- **“The queued attempts necessarily cause duplicate side effects.”** The model counts attempts only and does not model application side effects or idempotency.
- **“Every slow service will recover this way.”** The ending is fixed after four rounds; the exercise does not model recovery or make a claim about real services.
