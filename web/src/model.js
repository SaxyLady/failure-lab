export const STEP_COUNT = 5;

const initialEvent = {
  action: "Initial state",
  outcome: "A, B, and C each hold 0. All links are open; no messages are pending.",
};

export function createInitialState() {
  return {
    step: 0,
    nodes: { A: 0, B: 0, C: 0 },
    isolatedC: false,
    pendingMessages: [],
    events: [initialEvent],
    prediction: null,
    acknowledgedValue: null,
    readResult: null,
  };
}

export function setPrediction(state, value) {
  if (value !== 0 && value !== 1) {
    throw new TypeError("Prediction must be 0 or 1.");
  }
  if (state.step !== 0) {
    throw new Error("Prediction cannot change after stepping begins.");
  }
  return { ...state, prediction: value };
}

const transitions = [
  (state) => ({
    ...state,
    step: 1,
    isolatedC: true,
    events: [...state.events, {
      action: "Isolate C",
      outcome: "Links A-C and B-C are blocked. A-B remains open.",
    }],
  }),
  (state) => ({
    ...state,
    step: 2,
    nodes: { ...state.nodes, A: 1 },
    acknowledgedValue: 1,
    pendingMessages: ["A-to-B", "A-to-C"],
    events: [...state.events, {
      action: "Write 1 to A",
      outcome: "The customer writes value 1 to A. A applies it and acknowledges the write locally. Messages A-to-B and A-to-C are queued, in that order; B and C remain 0.",
    }],
  }),
  (state) => ({
    ...state,
    step: 3,
    nodes: { ...state.nodes, B: 1 },
    pendingMessages: state.pendingMessages.filter((message) => message !== "A-to-B"),
    events: [...state.events, {
      action: "Deliver A-to-B",
      outcome: "The open link delivers the message. B becomes 1.",
    }],
  }),
  (state) => ({
    ...state,
    step: 4,
    pendingMessages: state.pendingMessages.filter((message) => message !== "A-to-C"),
    events: [...state.events, {
      action: "Attempt A-to-C",
      outcome: "The blocked link drops the message. C remains 0; there is no automatic retry.",
    }],
  }),
  (state) => ({
    ...state,
    step: 5,
    readResult: state.nodes.C,
    events: [...state.events, {
      action: "Read C",
      outcome: `A direct read from C returns ${state.nodes.C}; it is stale relative to A's acknowledged value ${state.acknowledgedValue}.`,
    }],
  }),
];

export function advance(state) {
  if (state.prediction === null) {
    throw new Error("Choose a prediction before advancing.");
  }
  if (state.step >= STEP_COUNT) {
    return state;
  }
  return transitions[state.step](state);
}
