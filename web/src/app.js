import { advance, createInitialState, setPrediction, STEP_COUNT } from "./model.js";

const confidenceLabels = {
  guessing: "Guessing",
  "pretty-sure": "Pretty sure",
  "extremely-confident": "Extremely confident",
};

const eventTitles = [
  "Starting conditions",
  "Network partition",
  "New write arrives",
  "A-to-B is delivered",
  "A-to-C is dropped",
  "Customer reads Replica C",
];

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
  partitionStatus: document.querySelector("#partition-status"),
  values: {
    A: document.querySelector("#value-a"),
    B: document.querySelector("#value-b"),
    C: document.querySelector("#value-c"),
  },
  replicaC: document.querySelector("#replica-c"),
  cStatus: document.querySelector("#c-status"),
  links: {
    AB: document.querySelector("#link-ab"),
    AC: document.querySelector("#link-ac"),
    BC: document.querySelector("#link-bc"),
  },
  messageBoard: document.querySelector("#message-board"),
  messages: {
    AB: document.querySelector("#message-ab"),
    AC: document.querySelector("#message-ac"),
  },
  reflectionPrompt: document.querySelector("#reflection-prompt"),
  nextButton: document.querySelector("#next-button"),
  resetButton: document.querySelector("#reset-button"),
  timeline: document.querySelector("#event-timeline"),
  resultPanel: document.querySelector("#result-panel"),
  resultHeading: document.querySelector("#result-heading"),
  resultValue: document.querySelector("#result-value"),
  resultPrediction: document.querySelector("#result-prediction"),
  resultVerdict: document.querySelector("#result-verdict"),
  resultConfidence: document.querySelector("#result-confidence"),
  replayButton: document.querySelector("#replay-button"),
};

function renderTimeline() {
  elements.timeline.replaceChildren(...state.events.map((event, index) => {
    const item = document.createElement("li");
    const label = document.createElement("span");
    const title = document.createElement("h4");
    const outcome = document.createElement("p");

    item.className = index === state.events.length - 1 ? "event-card event-current" : "event-card";
    label.className = "event-label";
    label.textContent = index === 0 ? "Before the incident" : `Event ${index} of ${STEP_COUNT}`;
    title.textContent = eventTitles[index];
    outcome.textContent = event.outcome;
    item.append(label, title, outcome);
    return item;
  }));
}

function renderResult() {
  if (state.readResult === null) {
    return;
  }

  elements.resultValue.textContent = state.readResult;
  elements.resultPrediction.textContent = state.prediction;
  elements.resultVerdict.textContent = state.prediction === state.readResult ? "Correct" : "Incorrect";
  elements.resultConfidence.textContent = confidenceLabels[confidence];
}

function renderMessages() {
  elements.messageBoard.hidden = state.step < 2;
  const statuses = {
    AB: state.step >= 3 ? "Delivered" : "Pending",
    AC: state.step >= 4 ? "Dropped" : "Pending",
  };

  for (const [message, status] of Object.entries(statuses)) {
    const item = elements.messages[message];
    item.querySelector("strong").textContent = status;
    item.classList.toggle("delivered", status === "Delivered");
    item.classList.toggle("dropped", status === "Dropped");
  }
}

function render() {
  elements.missionBriefing.hidden = phase !== "briefing";
  elements.predictionPanel.hidden = phase !== "prediction";
  elements.playbackPanel.hidden = phase !== "playback";
  elements.resultPanel.hidden = phase !== "result";

  for (const node of ["A", "B", "C"]) {
    elements.values[node].value = state.nodes[node];
  }

  elements.stepStatus.textContent = state.step === 0
    ? `Ready for event 1 of ${STEP_COUNT}`
    : `Event ${state.step} of ${STEP_COUNT}`;
  elements.partitionStatus.textContent = state.isolatedC ? "Replica C isolated" : "All links connected";
  elements.partitionStatus.classList.toggle("is-isolated", state.isolatedC);
  elements.replicaC.classList.toggle("isolated", state.isolatedC);
  elements.cStatus.textContent = state.isolatedC ? "Isolated" : "Connected";
  elements.links.AB.textContent = "A ↔ B: Connected";
  elements.links.AB.classList.remove("blocked");
  elements.links.AC.textContent = state.isolatedC ? "A ↔ C: Blocked" : "A ↔ C: Connected";
  elements.links.AC.classList.toggle("blocked", state.isolatedC);
  elements.links.BC.textContent = state.isolatedC ? "B ↔ C: Blocked" : "B ↔ C: Connected";
  elements.links.BC.classList.toggle("blocked", state.isolatedC);

  elements.predictionOptions.disabled = phase !== "prediction";
  elements.confidenceOptions.disabled = phase !== "prediction";
  elements.lockButton.disabled = state.prediction === null;
  elements.nextButton.disabled = phase !== "playback" || state.step === STEP_COUNT;
  elements.reflectionPrompt.hidden = state.step !== 2;
  renderMessages();
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
  if (state.readResult !== null) {
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
