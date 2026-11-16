import { advance, createInitialState, setPrediction, STEP_COUNT } from "./retry-storm-model.js";

const confidenceLabels = {
  guessing: "Guessing",
  "pretty-sure": "Pretty sure",
  "extremely-confident": "Extremely confident",
};

let state = createInitialState();
let phase = "briefing";
let confidence = "guessing";

const elements = {
  missionBriefing: document.querySelector("#mission-briefing"),
  missionHeading: document.querySelector("#mission-heading"),
  startButton: document.querySelector("#start-button"),
  predictionPanel: document.querySelector("#prediction-panel"),
  predictionHeading: document.querySelector("#prediction-heading"),
  predictionOptions: document.querySelector("#prediction-options"),
  confidenceOptions: document.querySelector("#confidence-options"),
  lockButton: document.querySelector("#lock-button"),
  playbackPanel: document.querySelector("#playback-panel"),
  playbackHeading: document.querySelector("#playback-heading"),
  stepStatus: document.querySelector("#step-status"),
  serviceCapacity: document.querySelector("#service-capacity"),
  acceptedAttempts: document.querySelector("#accepted-attempts"),
  completedAttempts: document.querySelector("#completed-attempts"),
  queueCount: document.querySelector("#queue-count"),
  attemptQueue: document.querySelector("#attempt-queue"),
  nextButton: document.querySelector("#next-button"),
  resetButton: document.querySelector("#reset-button"),
  timeline: document.querySelector("#event-timeline"),
  resultPanel: document.querySelector("#result-panel"),
  resultHeading: document.querySelector("#result-heading"),
  resultCount: document.querySelector("#result-count"),
  resultPrediction: document.querySelector("#result-prediction"),
  resultVerdict: document.querySelector("#result-verdict"),
  resultConfidence: document.querySelector("#result-confidence"),
  replayButton: document.querySelector("#replay-button"),
};

function renderTimeline() {
  elements.timeline.replaceChildren(...state.events.map((event, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const title = document.createElement("h3");
    const outcome = document.createElement("p");

    item.className = index === state.events.length - 1 ? "event-card event-current" : "event-card";
    label.className = "event-label";
    label.textContent = index === 0 ? "Before the incident" : `Event ${index} of ${STEP_COUNT}`;
    title.textContent = event.action;
    outcome.textContent = event.outcome;
    item.append(label, title, outcome);
    return item;
  }));
}

function renderResult() {
  if (state.step !== STEP_COUNT) {
    return;
  }

  elements.resultCount.textContent = state.queue.length;
  elements.resultPrediction.textContent = state.prediction;
  elements.resultVerdict.textContent = state.prediction === state.queue.length ? "Correct" : "Incorrect";
  elements.resultConfidence.textContent = confidenceLabels[confidence];
}

function renderQueue() {
  elements.queueCount.textContent = `${state.queue.length} ${state.queue.length === 1 ? "attempt" : "attempts"} waiting`;
  elements.attemptQueue.replaceChildren(...state.queue.map((attempt) => {
    const item = document.createElement("li");
    item.textContent = attempt;
    return item;
  }));
  if (state.queue.length === 0) {
    const item = document.createElement("li");
    item.textContent = "No attempts waiting";
    elements.attemptQueue.append(item);
  }
}

function render() {
  elements.missionBriefing.hidden = phase !== "briefing";
  elements.predictionPanel.hidden = phase !== "prediction";
  elements.playbackPanel.hidden = phase !== "playback";
  elements.resultPanel.hidden = phase !== "result";

  elements.stepStatus.textContent = state.step === 0
    ? `Ready for event 1 of ${STEP_COUNT}`
    : `Event ${state.step} of ${STEP_COUNT}`;
  elements.serviceCapacity.textContent = `${state.serviceCapacity} ${state.serviceCapacity === 1 ? "attempt" : "attempts"} per round`;
  elements.acceptedAttempts.textContent = state.acceptedAttempts;
  elements.completedAttempts.textContent = state.completedAttempts;
  elements.predictionOptions.disabled = phase !== "prediction";
  elements.confidenceOptions.disabled = phase !== "prediction";
  elements.lockButton.disabled = state.prediction === null;
  elements.nextButton.disabled = phase !== "playback" || state.step === STEP_COUNT;

  renderQueue();
  renderTimeline();
  renderResult();
}

elements.startButton.addEventListener("click", () => {
  phase = "prediction";
  render();
  elements.predictionHeading.focus();
});

elements.predictionOptions.addEventListener("change", (event) => {
  if (event.target.name === "prediction") {
    state = setPrediction(state, Number(event.target.value));
    render();
  }
});

elements.confidenceOptions.addEventListener("change", (event) => {
  if (event.target.name === "confidence" && Object.hasOwn(confidenceLabels, event.target.value)) {
    confidence = event.target.value;
    render();
  }
});

elements.lockButton.addEventListener("click", () => {
  if (state.prediction === null) {
    return;
  }
  phase = "playback";
  render();
  elements.playbackHeading.focus();
});

elements.nextButton.addEventListener("click", () => {
  if (phase !== "playback") {
    return;
  }
  state = advance(state);
  if (state.step === STEP_COUNT) {
    phase = "result";
  }
  render();
  if (phase === "result") {
    elements.resultHeading.focus();
  }
});

function restartScenario() {
  state = createInitialState();
  phase = "briefing";
  confidence = "guessing";
  elements.predictionOptions.querySelectorAll('input[name="prediction"]').forEach((input) => {
    input.checked = false;
  });
  elements.confidenceOptions.querySelectorAll('input[name="confidence"]').forEach((input) => {
    input.checked = input.value === confidence;
  });
  render();
  elements.missionHeading.focus();
}

elements.resetButton.addEventListener("click", restartScenario);
elements.replayButton.addEventListener("click", restartScenario);

render();
