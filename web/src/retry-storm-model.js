export const STEP_COUNT = 5;

const initialEvent = {
  action: "Healthy starting point",
  outcome: "The service can complete three attempts per round. Its queue is empty.",
};

export function createInitialState() {
  return {
    step: 0,
    serviceCapacity: 3,
    queue: [],
    acceptedAttempts: 0,
    completedAttempts: 0,
    prediction: null,
    events: [initialEvent],
  };
}

export function setPrediction(state, value) {
  if (![0, 1, 2].includes(value)) {
    throw new TypeError("Prediction must be 0, 1, or 2.");
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
    serviceCapacity: 1,
    events: [...state.events, {
      action: "Service slows",
      outcome: "Capacity falls to one attempt per round and stays there. The queue is still empty.",
    }],
  }),
  (state) => {
    const queue = ["Request A (original)", "Request B (original)", "Request C (original)"];
    queue.shift();
    return {
      ...state,
      step: 2,
      queue,
      acceptedAttempts: 3,
      completedAttempts: 1,
      events: [...state.events, {
        action: "Three requests arrive",
        outcome: "A, B, and C enter the FIFO queue. Round 1 completes A. B and C remain queued and time out without a response.",
      }],
    };
  },
  (state) => {
    const queue = [...state.queue, "Request B (retry 1)", "Request C (retry 1)"];
    queue.shift();
    return {
      ...state,
      step: 3,
      queue,
      acceptedAttempts: 5,
      completedAttempts: 2,
      events: [...state.events, {
        action: "First retries arrive",
        outcome: "B and C each retry; their originals are still queued. Round 2 completes B's original attempt. C still has no response.",
      }],
    };
  },
  (state) => {
    const queue = [...state.queue, "Request C (retry 2)"];
    queue.shift();
    return {
      ...state,
      step: 4,
      queue,
      acceptedAttempts: 6,
      completedAttempts: 3,
      events: [...state.events, {
        action: "C retries again",
        outcome: "C's original is still queued, so C sends its second and final retry. Round 3 completes C's original; its two retries remain queued.",
      }],
    };
  },
  (state) => {
    const queue = [...state.queue];
    queue.shift();
    return {
      ...state,
      step: 5,
      queue,
      completedAttempts: 4,
      events: [...state.events, {
        action: "Backlog remains",
        outcome: "Round 4 completes B's retry. Two C retries are still queued: six attempts entered, four completed, and two remain.",
      }],
    };
  },
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
