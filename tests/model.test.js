import assert from "node:assert/strict";
import test from "node:test";
import { advance, createInitialState, setPrediction, STEP_COUNT } from "../web/src/model.js";

function runScenario(prediction = 0) {
  let state = setPrediction(createInitialState(), prediction);
  const states = [];
  for (let index = 0; index < STEP_COUNT; index += 1) {
    state = advance(state);
    states.push(state);
  }
  return { state, states };
}

test("initial state has three zero-valued nodes, open links, and no pending messages", () => {
  const state = createInitialState();
  assert.deepEqual(state.nodes, { A: 0, B: 0, C: 0 });
  assert.equal(state.step, 0);
  assert.equal(state.isolatedC, false);
  assert.deepEqual(state.pendingMessages, []);
  assert.equal(state.events.length, 1);
});

test("each of the five ordered actions produces the specified outcome", () => {
  const { states, state } = runScenario();

  assert.deepEqual(states[0].nodes, { A: 0, B: 0, C: 0 });
  assert.equal(states[0].isolatedC, true);

  assert.deepEqual(states[1].nodes, { A: 1, B: 0, C: 0 });
  assert.equal(states[1].acknowledgedValue, 1);
  assert.deepEqual(states[1].pendingMessages, ["A-to-B", "A-to-C"]);
  assert.match(states[1].events[2].outcome, /acknowledges the write locally/);

  assert.deepEqual(states[2].nodes, { A: 1, B: 1, C: 0 });
  assert.deepEqual(states[2].pendingMessages, ["A-to-C"]);

  assert.deepEqual(states[3].nodes, { A: 1, B: 1, C: 0 });
  assert.deepEqual(states[3].pendingMessages, []);
  assert.match(states[3].events[4].outcome, /drops the message/);
  assert.match(states[3].events[4].outcome, /no automatic retry/);

  assert.deepEqual(state.nodes, { A: 1, B: 1, C: 0 });
  assert.equal(state.step, STEP_COUNT);
  assert.equal(state.readResult, 0);
  assert.match(state.events[5].outcome, /returns 0/);
  assert.match(state.events[5].outcome, /acknowledged value 1/);
});

test("repeating the scenario produces identical state and event order", () => {
  assert.deepEqual(runScenario(0).state, runScenario(0).state);
});

test("either prediction is accepted, and reset returns to the initial state", () => {
  const initial = createInitialState();
  const predictedZero = setPrediction(initial, 0);
  const predictedOne = setPrediction(initial, 1);
  assert.equal(predictedZero.prediction, 0);
  assert.equal(predictedOne.prediction, 1);

  let partial = advance(predictedOne);
  partial = advance(partial);
  assert.equal(partial.step, 2);
  assert.deepEqual(partial.nodes, { A: 1, B: 0, C: 0 });
  const resetAfterPartialRun = createInitialState();
  assert.deepEqual(resetAfterPartialRun, initial);

  const completed = runScenario(1).state;
  assert.equal(completed.readResult, 0);
  const resetAfterCompletion = createInitialState();
  assert.deepEqual(resetAfterCompletion, initial);
});

test("advancing requires a prediction, and a finished exercise cannot advance", () => {
  assert.throws(() => advance(createInitialState()), /Choose a prediction/);
  const { state } = runScenario(1);
  assert.equal(advance(state), state);
  assert.throws(() => setPrediction(state, 0), /after stepping begins/);
  assert.throws(() => setPrediction(createInitialState(), 2), /must be 0 or 1/);
});
