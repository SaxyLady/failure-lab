import assert from "node:assert/strict";
import test from "node:test";
import { advance, createInitialState, setPrediction, STEP_COUNT } from "../web/src/retry-storm-model.js";

function runScenario(prediction = 0) {
  let state = setPrediction(createInitialState(), prediction);
  const states = [];
  for (let index = 0; index < STEP_COUNT; index += 1) {
    state = advance(state);
    states.push(state);
  }
  return { state, states };
}

test("initial state has a healthy service and empty queue", () => {
  const state = createInitialState();
  assert.equal(state.serviceCapacity, 3);
  assert.deepEqual(state.queue, []);
  assert.equal(state.acceptedAttempts, 0);
  assert.equal(state.completedAttempts, 0);
  assert.equal(state.step, 0);
  assert.equal(state.events.length, 1);
});

test("each of the five transitions follows the specified FIFO retry sequence", () => {
  const { states, state } = runScenario();

  assert.equal(states[0].serviceCapacity, 1);
  assert.deepEqual(states[0].queue, []);

  assert.deepEqual(states[1].queue, ["Request B (original)", "Request C (original)"]);
  assert.equal(states[1].acceptedAttempts, 3);
  assert.equal(states[1].completedAttempts, 1);
  assert.match(states[1].events[2].outcome, /time out without a response/);

  assert.deepEqual(states[2].queue, [
    "Request C (original)",
    "Request B (retry 1)",
    "Request C (retry 1)",
  ]);
  assert.equal(states[2].acceptedAttempts, 5);
  assert.equal(states[2].completedAttempts, 2);

  assert.deepEqual(states[3].queue, [
    "Request B (retry 1)",
    "Request C (retry 1)",
    "Request C (retry 2)",
  ]);
  assert.equal(states[3].acceptedAttempts, 6);
  assert.equal(states[3].completedAttempts, 3);

  assert.deepEqual(state.queue, ["Request C (retry 1)", "Request C (retry 2)"]);
  assert.equal(state.acceptedAttempts, 6);
  assert.equal(state.completedAttempts, 4);
  assert.equal(state.step, STEP_COUNT);
  assert.equal(state.events.length, STEP_COUNT + 1);
});

test("both predictions are accepted, and advancing is gated and bounded", () => {
  const initial = createInitialState();
  assert.equal(setPrediction(initial, 0).prediction, 0);
  assert.equal(setPrediction(initial, 1).prediction, 1);
  assert.equal(setPrediction(initial, 2).prediction, 2);
  assert.throws(() => setPrediction(initial, 3), /must be 0, 1, or 2/);
  assert.throws(() => advance(initial), /Choose a prediction/);

  const { state } = runScenario(2);
  assert.equal(advance(state), state);
  assert.throws(() => setPrediction(state, 1), /after stepping begins/);
});

test("the simulation is repeatable and reset creates a fresh initial state", () => {
  assert.deepEqual(runScenario(2).state, runScenario(2).state);
  const completed = runScenario(2).state;
  const reset = createInitialState();
  assert.deepEqual(reset, createInitialState());
  assert.equal(reset.step, 0);
  assert.deepEqual(reset.queue, []);
  assert.equal(reset.prediction, null);
  assert.notEqual(reset, completed);
});
