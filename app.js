const app = document.querySelector("#app");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const numbers = Array.from({ length: 20 }, (_, index) => index + 1);
const letterSpeechNames = {
  A: "aaay",
  B: "beee",
  C: "seee",
  D: "deee",
  E: "eee",
  F: "eff",
  G: "jee",
  H: "aitch",
  I: "eye",
  J: "jay",
  K: "kay",
  L: "ell",
  M: "em",
  N: "en",
  O: "oh",
  P: "pee",
  Q: "cue",
  R: "are",
  S: "ess",
  T: "tee",
  U: "you",
  V: "vee",
  W: "double you",
  X: "ex",
  Y: "why",
  Z: "zee"
};
const playGroups = [
  ["A", "B"],
  ["C", "D"],
  ["E", "F"],
  ["G", "H"],
  ["I", "J"],
  ["K", "L"],
  ["M", "N"],
  ["O", "P"],
  ["Q", "R"],
  ["S", "T"],
  ["U", "V"],
  ["W", "X"],
  ["Y", "Z"]
];

const state = {
  screen: "splash",
  letter: "A",
  number: 1,
  traceMode: "upper",
  reward: "",
  selectedUpper: null,
  selectedLower: null,
  matched: new Set(),
  playGroup: 0,
  lastMatchWrong: false,
  sound: true,
  music: true,
  traceCompleted: false,
  traceCoverage: 0,
  stars: loadStarCount()
};

function loadStarCount() {
  return Number(localStorage.getItem("lumiaStars") || 0);
}

function saveStarCount() {
  localStorage.setItem("lumiaStars", String(state.stars));
}

function earnStar(amount = 1) {
  state.stars += amount;
  saveStarCount();
  updateStarCounters();
  setTimeout(celebrateStarCounter, 2600);
}

function resetStars() {
  state.stars = 0;
  state.matched.clear();
  saveStarCount();
  updateStarCounters();
}

function starBadge() {
  return `
    <div class="star-counter" aria-label="${state.stars} stars earned">
      <span aria-hidden="true">★</span>
      <strong>${state.stars}</strong>
      <i class="counter-spark spark-one" aria-hidden="true">✦</i>
      <i class="counter-spark spark-two" aria-hidden="true">★</i>
      <i class="counter-spark spark-three" aria-hidden="true">✦</i>
      <i class="counter-spark spark-four" aria-hidden="true">★</i>
    </div>
  `;
}

function updateStarCounters() {
  document.querySelectorAll(".star-counter strong").forEach(counter => {
    counter.textContent = state.stars;
  });
}

function celebrateStarCounter() {
  document.querySelectorAll(".star-counter").forEach(counter => {
    counter.classList.remove("spark");
    void counter.offsetWidth;
    counter.classList.add("spark");
  });
}

function mascotStars(size = 74) {
  const stars = [
    ["#ffd85a", size * 1.18],
    ["#4f8ff7", size * 0.58],
    ["#ff75a9", size * 0.62],
    ["#79ddb2", size * 0.56]
  ];

  return `
    <div class="stars-row" style="--mascot-size:${size}px" aria-label="One big LumiA Kids star mascot with three little star friends">
      ${stars.map(([color, starSize], index) => `
        <svg class="star bubbly-star star-${index + 1}" style="--star-color:${color};--size:${starSize}px" viewBox="0 0 100 100" role="img" aria-label="Smiling star mascot">
          <path class="star-body" d="M50 7 C56 7 60 26 65 30 C70 34 90 28 94 34 C98 40 82 52 80 59 C78 66 90 82 85 88 C80 94 62 83 55 84 C48 85 35 99 28 95 C21 91 27 72 24 66 C21 60 3 52 5 44 C7 36 27 36 33 31 C39 26 44 7 50 7 Z"></path>
          <circle class="star-highlight" cx="36" cy="27" r="8"></circle>
          <circle class="star-eye" cx="39" cy="48" r="4"></circle>
          <circle class="star-eye" cx="61" cy="48" r="4"></circle>
          <circle class="star-cheek" cx="32" cy="58" r="5"></circle>
          <circle class="star-cheek" cx="68" cy="58" r="5"></circle>
          <path class="star-smile" d="M40 61 C45 69 55 69 60 61"></path>
        </svg>
      `).join("")}
    </div>
  `;
}

function render() {
  const screens = {
    splash: renderSplash,
    home: renderHome,
    abc: renderAbc,
    letter: renderLetter,
    numbers: renderNumbers,
    number: renderNumber,
    play: renderPlay,
    parentGate: renderParentGate,
    parentArea: renderParentArea
  };

  app.innerHTML = screens[state.screen]();
  bindScreen();
}

function topbar(title, backTarget = "home") {
  return `
    <div class="topbar">
      <button class="back-btn" data-nav="${backTarget}" aria-label="Back">Back</button>
      <h1 class="screen-title">${title}</h1>
      <button class="icon-btn" data-nav="home" aria-label="Home">Home</button>
    </div>
  `;
}

function learningBadge() {
  return `
    <div class="learning-badge" aria-label="ABC Trace and Count">
      <span class="abc-blocks">
        <span>A</span><span>B</span><span>C</span>
      </span>
      <span class="badge-title">Trace <span>&amp;</span> Count</span>
    </div>
  `;
}

function learningPreview() {
  return `
    <div class="learning-preview" aria-hidden="true">
      <div class="preview-spark star-dot one"></div>
      <div class="preview-spark star-dot two"></div>
      <div class="preview-row">
        <div class="preview-token letter-token">A a</div>
        <div class="preview-trace">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="preview-token number-token">1 2 3</div>
      </div>
      <div class="preview-caption">learn • trace • count</div>
    </div>
  `;
}

function lowerDisplayLetter(letter) {
  const lower = letter.toLowerCase();
  return lower === "a" ? "ɑ" : lower;
}

function renderSplash() {
  return `
    <section class="screen">
      <div class="brand-lockup">
        <div class="logo-card">
          ${mascotStars(82)}
          <h1 class="brand-title">LumiA<br>Kids</h1>
        </div>
        ${learningBadge()}
        ${learningPreview()}
      </div>
      <div class="splash-actions">
        <button class="primary-btn" data-nav="home">Let's Learn!</button>
        <p class="splash-note">Offline • No ads • No login</p>
      </div>
    </section>
  `;
}

function renderHome() {
  return `
    <section class="screen">
      <div class="brand-lockup">
        ${mascotStars(58)}
        <h1 class="screen-title">LumiA Kids</h1>
        ${learningBadge()}
        ${starBadge()}
      </div>
      <div class="menu-grid">
        <button class="menu-btn abc" data-nav="abc">
          <span class="menu-visual">A a</span>
          <strong>ABC</strong>
          <small>Trace Letters</small>
        </button>
        <button class="menu-btn numbers" data-nav="numbers">
          <span class="menu-visual">1 2 3</span>
          <strong>123</strong>
          <small>Trace Numbers</small>
        </button>
        <button class="menu-btn play" data-nav="play">
          <span class="menu-visual">A → a</span>
          <strong>Play</strong>
          <small>Match Game</small>
        </button>
        <button class="menu-btn parent" data-nav="parentGate">
          <span class="menu-visual">Lock</span>
          <strong>Grown-ups</strong>
          <small>Settings</small>
        </button>
      </div>
    </section>
  `;
}

function renderAbc() {
  return `
    <section class="screen">
      ${topbar("ABC")}
      <p class="helper-text">Pick a letter to trace.</p>
      <div class="letter-grid">
        ${letters.map(letter => `
          <button class="tile letter" data-letter="${letter}">
            <span>${letter}</span>
            <small>${lowerDisplayLetter(letter)}</small>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderLetter() {
  const letter = state.letter;
  const lowerChar = lowerDisplayLetter(letter);
  const activeChar = state.traceMode === "upper" ? letter : lowerChar;
  return `
    <section class="screen">
      ${topbar("Trace Letter", "abc")}
      <div class="detail-hero">
        <div class="display-letter" aria-label="Letter ${letter}">
          <span>${letter}</span>
          <span>${lowerChar}</span>
        </div>
        <button class="primary-btn hear-btn" data-speak="${letter}" data-speak-volume="${state.traceMode === "upper" ? "1" : "0.55"}" aria-label="Hear ${activeChar}">
          <span class="speaker-icon" aria-hidden="true">&#128266;</span>
          <span>Hear ${activeChar}</span>
        </button>
      </div>
      <div class="mode-row">
        <button class="pill-btn ${state.traceMode === "upper" ? "active" : ""}" data-mode="upper">Big ${letter}</button>
        <button class="pill-btn ${state.traceMode === "lower" ? "active" : ""}" data-mode="lower">Small ${lowerChar}</button>
      </div>
      ${tracePanel(activeChar)}
    </section>
  `;
}

function renderNumbers() {
  return `
    <section class="screen">
      ${topbar("123")}
      <p class="helper-text">Pick a number to trace.</p>
      <div class="number-grid">
        ${numbers.map(number => `
          <button class="tile number" data-number="${number}">
            <span>${number}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function renderNumber() {
  return `
    <section class="screen">
      ${topbar("Trace Number", "numbers")}
      <div class="detail-hero">
        <div class="display-number">${state.number}</div>
        <button class="primary-btn hear-btn" data-speak="${state.number}" aria-label="Hear ${state.number}">
          <span class="speaker-icon" aria-hidden="true">&#128266;</span>
          <span>Hear ${state.number}</span>
        </button>
      </div>
      ${tracePanel(String(state.number))}
    </section>
  `;
}

function tracePanel(character) {
  return `
    <div class="trace-panel">
      ${starBadge()}
      <p class="helper-text">Trace it. Tap Done.</p>
      <div class="trace-prompt">Follow the dots</div>
      <div class="trace-canvas-wrap">
        <canvas id="traceCanvas" width="360" height="220" data-guide="${character}"></canvas>
        <div class="trace-sparkles" aria-hidden="true"></div>
      </div>
      <div class="trace-actions">
        <button class="pill-btn clear-btn" data-clear-trace="true">Clear</button>
        <button class="pill-btn active done-btn" data-complete-trace="true">Done!</button>
      </div>
      <div class="reward-strip">${state.reward}</div>
    </div>
    <div id="celebration" class="celebration" aria-hidden="true"></div>
  `;
}

function renderPlay() {
  const playLetters = playGroups[state.playGroup];
  const lowerLetters = shuffleForDisplay(playLetters.map(letter => letter.toLowerCase()));

  return `
    <section class="screen">
      ${topbar("Match")}
      ${mascotStars(50)}
      ${starBadge()}
      <p class="helper-text">Tap a big letter. Tap its small letter.</p>
      <div class="match-board">
        <div class="match-column">
          ${playLetters.map(letter => matchButton(letter, "upper")).join("")}
        </div>
        <div class="match-column">
          ${lowerLetters.map(letter => matchButton(letter, "lower")).join("")}
        </div>
      </div>
      <div class="reward-strip ${state.lastMatchWrong ? "wrong" : ""}">${state.reward}</div>
      <div id="celebration" class="celebration" aria-hidden="true"></div>
    </section>
  `;
}

function matchButton(letter, side) {
  const key = letter.toUpperCase();
  const selected = side === "upper" ? state.selectedUpper === key : state.selectedLower === key;
  const done = state.matched.has(key);
  return `
    <button class="match-card ${selected ? "selected" : ""} ${done ? "done" : ""}" data-match-${side}="${key}">
      ${letter}
    </button>
  `;
}

function renderParentGate() {
  const answers = [9, 12, 13, 15];
  return `
    <section class="screen">
      ${topbar("Parent Check")}
      <div class="gate-card">
        ${mascotStars(48)}
        <p class="helper-text">For parents only.</p>
        <div class="math-question">8 + 5 = ?</div>
        <div class="answer-grid">
          ${answers.map(answer => `<button class="answer-btn" data-answer="${answer}">${answer}</button>`).join("")}
        </div>
      </div>
      <div class="reward-strip">${state.reward}</div>
    </section>
  `;
}

function renderParentArea() {
  return `
    <section class="screen">
      ${topbar("Grown-ups", "home")}
      <div class="parent-panel">
        <p class="parent-note">Offline only. No ads. No child data.</p>
        ${starBadge()}
        <div class="setting-row">
          <span>Sound effects</span>
          <button class="toggle" data-toggle="sound" aria-label="Toggle sound">${state.sound ? "On" : "Off"}</button>
        </div>
        <div class="setting-row">
          <span>Gentle music</span>
          <button class="toggle" data-toggle="music" aria-label="Toggle music">${state.music ? "On" : "Off"}</button>
        </div>
        <div class="setting-row">
          <span>Reset progress</span>
          <button class="pill-btn" data-reset="true">Reset</button>
        </div>
        <div class="setting-row">
          <span>Privacy</span>
          <strong>Local only</strong>
        </div>
      </div>
    </section>
  `;
}

function bindScreen() {
  document.querySelectorAll("[data-nav]").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.nav));
  });

  document.querySelectorAll("[data-letter]").forEach(button => {
    button.addEventListener("click", () => {
      state.letter = button.dataset.letter;
      state.traceMode = "upper";
      state.reward = "";
      state.traceCompleted = false;
      state.traceCoverage = 0;
      navigate("letter");
    });
  });

  document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
      state.number = Number(button.dataset.number);
      state.reward = "";
      state.traceCompleted = false;
      state.traceCoverage = 0;
      navigate("number");
    });
  });

  document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
      state.traceMode = button.dataset.mode;
      state.reward = "";
      state.traceCompleted = false;
      state.traceCoverage = 0;
      render();
    });
  });

  document.querySelectorAll("[data-speak]").forEach(button => {
    button.addEventListener("click", () => {
      state.reward = `Sound: ${button.dataset.speak}`;
      speak(speechTextFor(button.dataset.speak), {
        volume: Number(button.dataset.speakVolume || 1)
      });
      render();
    });
  });

  document.querySelectorAll("[data-complete-trace]").forEach(button => {
    button.addEventListener("click", () => {
      completeTraceTask();
    });
  });

  document.querySelectorAll("[data-clear-trace]").forEach(button => {
    button.addEventListener("click", () => {
      state.reward = "";
      state.traceCoverage = 0;
      render();
    });
  });

  document.querySelectorAll("[data-match-upper]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedUpper = button.dataset.matchUpper;
      checkMatch();
    });
  });

  document.querySelectorAll("[data-match-lower]").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedLower = button.dataset.matchLower;
      checkMatch();
    });
  });

  document.querySelectorAll("[data-answer]").forEach(button => {
    button.addEventListener("click", () => {
      if (Number(button.dataset.answer) === 13) {
        state.reward = "";
        navigate("parentArea");
      } else {
        state.reward = "Try another answer.";
        render();
      }
    });
  });

  document.querySelectorAll("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      state[button.dataset.toggle] = !state[button.dataset.toggle];
      state.reward = `${button.dataset.toggle} ${state[button.dataset.toggle] ? "on" : "off"}`;
      render();
    });
  });

  document.querySelectorAll("[data-reset]").forEach(button => {
    button.addEventListener("click", () => {
      resetStars();
      state.reward = "Stars reset.";
      render();
    });
  });

  setupCanvas();
}

function navigate(screen) {
  state.screen = screen;
  state.lastMatchWrong = false;
  render();
}

function checkMatch() {
  if (!state.selectedUpper || !state.selectedLower) {
    render();
    return;
  }

  let earnedStar = false;
  if (state.selectedUpper === state.selectedLower) {
    state.matched.add(state.selectedUpper);
    state.lastMatchWrong = false;
    earnStar();
    earnedStar = true;
  } else {
    state.reward = "Oops, try again.";
    state.lastMatchWrong = true;
    playTryAgainSound();
  }

  state.selectedUpper = null;
  state.selectedLower = null;

  const groupComplete = playGroups[state.playGroup].every(letter => state.matched.has(letter));

  if (groupComplete) {
    state.reward = "Great job! Next match set coming up.";
    playSuccessSound("Great job");
  } else if (!state.lastMatchWrong) {
    state.reward = "Great match! You earned a star.";
    playSuccessSound("Great match");
  }

  render();
  if (earnedStar) showCelebration();

  if (groupComplete) {
    setTimeout(() => {
      state.playGroup = (state.playGroup + 1) % playGroups.length;
      state.matched.clear();
      state.reward = "";
      state.lastMatchWrong = false;
      if (state.screen === "play") render();
    }, 1200);
  }
}

function completeTraceTask() {
  if (state.traceCompleted) return;
  if (!hasEnoughTraceForDone()) {
    state.reward = "Try the dots first.";
    updateRewardStrip();
    return;
  }
  state.traceCompleted = true;
  earnStar();
  state.reward = `Great job! Next: ${nextTraceLabel()}`;
  updateRewardStrip();
  playSuccessSound("Hooray! Great job");
  showCelebration();

  setTimeout(() => {
    if (state.screen === "letter") {
      advanceLetterTask();
    } else if (state.screen === "number") {
      advanceNumberTask();
    }
  }, 3600);
}

function hasEnoughTraceForDone() {
  return state.traceCoverage >= 0.16;
}

function nextTraceLabel() {
  if (state.screen === "letter") return nextLetterTaskLabel();
  if (state.screen === "number") return nextNumberTaskLabel();
  return "next";
}

function nextLetterTaskLabel() {
  const currentIndex = letters.indexOf(state.letter);
  if (state.traceMode === "upper") return lowerDisplayLetter(state.letter);
  return letters[(currentIndex + 1) % letters.length];
}

function nextNumberTaskLabel() {
  const currentIndex = numbers.indexOf(state.number);
  return numbers[(currentIndex + 1) % numbers.length];
}

function advanceLetterTask() {
  const currentIndex = letters.indexOf(state.letter);

  if (state.traceMode === "upper") {
    state.traceMode = "lower";
  } else {
    state.letter = letters[(currentIndex + 1) % letters.length];
    state.traceMode = "upper";
  }

  state.reward = "";
  state.traceCompleted = false;
  state.traceCoverage = 0;
  render();
}

function advanceNumberTask() {
  const currentIndex = numbers.indexOf(state.number);
  state.number = numbers[(currentIndex + 1) % numbers.length];
  state.reward = "";
  state.traceCompleted = false;
  state.traceCoverage = 0;
  render();
}

function shuffleForDisplay(items) {
  if (items.length <= 2) return [...items].reverse();
  return [...items.slice(1), items[0]];
}

function playSuccessSound(words = "Well done") {
  if (!state.sound) return;
  playToneSequence([523, 659, 784, 1046], 0.1, "triangle", 0.07);
  playApplauseSound();
  speak(words, {
    rate: 0.82,
    pitch: 1.28,
    volume: 1
  });
}

function playTryAgainSound() {
  if (!state.sound) return;
  playToneSequence([330, 294], 0.07, "sine", 0.04);
}

function showCelebration() {
  const celebration = document.querySelector("#celebration");
  if (!celebration) return;

  celebration.innerHTML = `
    <div class="celebration-card">
      <div class="celebration-star" aria-hidden="true">★</div>
      <div class="celebration-word">Hooray!</div>
      <div class="celebration-note">You got stars!</div>
    </div>
    <div class="celebration-fly-star" aria-hidden="true">
      <span class="fly-trail trail-one">★</span>
      <span class="fly-trail trail-two">✦</span>
      <span class="fly-trail trail-three">★</span>
      <svg viewBox="0 0 100 100">
        <path d="M50 7 C56 7 60 26 65 30 C70 34 90 28 94 34 C98 40 82 52 80 59 C78 66 90 82 85 88 C80 94 62 83 55 84 C48 85 35 99 28 95 C21 91 27 72 24 66 C21 60 3 52 5 44 C7 36 27 36 33 31 C39 26 44 7 50 7 Z"></path>
        <circle class="reward-star-eye" cx="39" cy="47" r="4"></circle>
        <circle class="reward-star-eye" cx="61" cy="47" r="4"></circle>
        <path class="reward-star-smile" d="M39 60 C45 69 55 69 61 60"></path>
      </svg>
    </div>
    ${Array.from({ length: 64 }, (_, index) => {
      const left = 8 + Math.random() * 84;
      const delay = Math.random() * 1.15;
      const size = 8 + Math.random() * 12;
      const drift = -56 + Math.random() * 112;
      const color = ["#ffd85a", "#4f8ff7", "#ff75a9", "#84d98b", "#ff817d"][index % 5];
      return `<span class="confetti" style="--left:${left}%;--delay:${delay}s;--size:${size}px;--drift:${drift}px;--color:${color};"></span>`;
    }).join("")}
  `;

  const flyStar = celebration.querySelector(".celebration-fly-star");
  const counter = document.querySelector(".star-counter");
  if (flyStar && counter) {
    const celebrationBox = celebration.getBoundingClientRect();
    const counterBox = counter.getBoundingClientRect();
    const startX = celebrationBox.left + (celebrationBox.width / 2);
    const startY = celebrationBox.top + (celebrationBox.height * 0.36);
    const targetX = counterBox.left + (counterBox.width / 2);
    const targetY = counterBox.top + (counterBox.height / 2);
    const flyX = targetX - startX;
    const flyY = targetY - startY;
    flyStar.style.setProperty("--fly-x", `${flyX}px`);
    flyStar.style.setProperty("--fly-y", `${flyY}px`);
    flyStar.style.setProperty("--fly-x-12", `${flyX * 0.12}px`);
    flyStar.style.setProperty("--fly-y-12", `${flyY * 0.12}px`);
    flyStar.style.setProperty("--fly-x-28", `${flyX * 0.28}px`);
    flyStar.style.setProperty("--fly-y-28", `${flyY * 0.28}px`);
    flyStar.style.setProperty("--fly-x-48", `${flyX * 0.48}px`);
    flyStar.style.setProperty("--fly-y-48", `${flyY * 0.48}px`);
    flyStar.style.setProperty("--fly-x-68", `${flyX * 0.68}px`);
    flyStar.style.setProperty("--fly-y-68", `${flyY * 0.68}px`);
    flyStar.style.setProperty("--fly-x-86", `${flyX * 0.86}px`);
    flyStar.style.setProperty("--fly-y-86", `${flyY * 0.86}px`);
  }

  celebration.classList.add("show");

  setTimeout(() => {
    celebration.classList.remove("show");
  }, 3300);
}

function speechTextFor(value) {
  return letterSpeechNames[value] || value;
}

function playToneSequence(frequencies, duration, type, volume) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioContext = new AudioContext();
  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    const start = audioContext.currentTime + index * duration;
    oscillator.start(start);
    oscillator.stop(start + duration);
  });
}

function playApplauseSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audioContext = new AudioContext();
  const masterGain = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  masterGain.gain.value = 0.55;
  masterGain.connect(compressor);
  compressor.connect(audioContext.destination);

  Array.from({ length: 42 }).forEach((_, index) => {
    const offset = 0.05 + Math.random() * 2.25;
    const duration = 0.055 + Math.random() * 0.05;
    const bufferSize = Math.floor(audioContext.sampleRate * duration);
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      const envelope = Math.pow(1 - i / bufferSize, 2.2);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = audioContext.createBufferSource();
    const bandpass = audioContext.createBiquadFilter();
    const highpass = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    const pan = audioContext.createStereoPanner();

    bandpass.type = "bandpass";
    bandpass.frequency.value = 1100 + Math.random() * 1600;
    bandpass.Q.value = 0.9;
    highpass.type = "highpass";
    highpass.frequency.value = 550;
    gain.gain.value = 0.13 + Math.random() * 0.07;
    pan.pan.value = -0.55 + Math.random() * 1.1;

    source.buffer = buffer;
    source.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(pan);
    pan.connect(masterGain);
    source.start(audioContext.currentTime + offset + index * 0.005);
  });
}

function speak(words, options = {}) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(words);
  utterance.lang = "en-US";
  const voice = chooseCheerfulVoice();
  if (voice) utterance.voice = voice;
  utterance.rate = options.rate ?? 0.88;
  utterance.pitch = options.pitch ?? 1.18;
  utterance.volume = options.volume ?? 1;
  window.speechSynthesis.speak(utterance);
}

function chooseCheerfulVoice() {
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith("en"));
  const preferredNames = [
    "samantha",
    "karen",
    "victoria",
    "susan",
    "zira",
    "jenny",
    "aria",
    "female",
    "woman"
  ];

  return englishVoices.find(voice =>
    preferredNames.some(name => voice.name.toLowerCase().includes(name))
  ) || englishVoices[0] || voices[0];
}

function showTraceSparkle(container, x, y) {
  if (!container) return;
  const sparkle = document.createElement("span");
  sparkle.className = "trace-sparkle";
  sparkle.textContent = Math.random() > 0.45 ? "✦" : "★";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.style.setProperty("--spin", `${-30 + Math.random() * 60}deg`);
  sparkle.style.setProperty("--drift-x", `${-10 + Math.random() * 20}px`);
  sparkle.style.setProperty("--drift-y", `${-22 + Math.random() * 12}px`);
  container.appendChild(sparkle);

  const remove = () => sparkle.remove();
  sparkle.addEventListener("animationend", remove, { once: true });
  setTimeout(remove, 800);
}

function setupCanvas() {
  const canvas = document.querySelector("#traceCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const guide = canvas.dataset.guide;
  const sparkleContainer = document.querySelector(".trace-sparkles");
  let drawing = false;
  let distance = 0;
  let lastPoint = null;
  let traceStartedAt = 0;
  let lastSparkleAt = 0;
  const touchedGuideCells = new Set();
  const mask = createGuideMask(canvas, guide);
  const totalGuideCells = countGuideCells(mask);
  const autoCompleteDistance = guide.length > 1 ? 920 : 720;
  const requiredCoverage = guide.length > 1 ? 0.68 : 0.72;
  const feedbackCoverage = guide.length > 1 ? 0.32 : 0.36;
  const minimumTraceTime = 1800;

  drawGuide(context, canvas, guide);

  const currentCoverage = () => touchedGuideCells.size / Math.max(totalGuideCells, 1);

  const sparklePoint = event => {
    const rect = canvas.getBoundingClientRect();
    const client = event.touches ? event.touches[0] : event;
    return {
      x: client.clientX - rect.left,
      y: client.clientY - rect.top
    };
  };

  const point = event => {
    const rect = canvas.getBoundingClientRect();
    const client = event.touches ? event.touches[0] : event;
    return {
      x: (client.clientX - rect.left) * (canvas.width / rect.width),
      y: (client.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const start = event => {
    event.preventDefault();
    drawing = true;
    const p = point(event);
    lastPoint = p;
    if (!traceStartedAt) traceStartedAt = Date.now();
    markGuideCell(p, mask, touchedGuideCells);
    state.traceCoverage = currentCoverage();
    context.beginPath();
    context.moveTo(p.x, p.y);
  };

  const move = event => {
    if (!drawing) return;
    event.preventDefault();
    const p = point(event);
    if (lastPoint) {
      distance += Math.hypot(p.x - lastPoint.x, p.y - lastPoint.y);
    }
    lastPoint = p;
    markGuideCell(p, mask, touchedGuideCells);
    context.lineTo(p.x, p.y);
    context.strokeStyle = "#ff817d";
    context.lineWidth = 14;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    const now = Date.now();
    if (
      now - lastSparkleAt >= 120 &&
      !state.traceCompleted &&
      isNearGuide(p, mask, 18)
    ) {
      lastSparkleAt = now;
      const sp = sparklePoint(event);
      showTraceSparkle(sparkleContainer, sp.x, sp.y);
    }

    const coverage = currentCoverage();
    state.traceCoverage = coverage;
    const hasTracedLongEnough = Date.now() - traceStartedAt >= minimumTraceTime;

    if (
      distance >= autoCompleteDistance &&
      coverage >= requiredCoverage &&
      hasTracedLongEnough &&
      !state.traceCompleted
    ) {
      completeTraceTask();
      return;
    }

    if (distance > 260 && coverage >= feedbackCoverage && !state.traceCompleted) {
      state.reward = "Nice tracing. Tap Done when ready.";
      const reward = document.querySelector(".reward-strip");
      if (reward) reward.textContent = state.reward;
    }
  };

  const stop = () => {
    drawing = false;
    lastPoint = null;
  };

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  canvas.addEventListener("touchstart", start, { passive: false });
  canvas.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("touchend", stop);
}

function updateRewardStrip() {
  const reward = document.querySelector(".reward-strip");
  if (reward) reward.textContent = state.reward;
}

function drawGuide(context, canvas, guide) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff8dc";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawGuideText(context, canvas, guide);
}

function drawGuideText(context, canvas, guide) {
  if (guide === "A") {
    drawUpperAStrokeGuide(context);
    return;
  }

  if (guide === "B") {
    drawUpperBStrokeGuide(context);
    return;
  }

  const worksheetStrokes = uppercaseWorksheetStrokes(guide);
  if (worksheetStrokes) {
    drawWorksheetStrokeGuide(context, worksheetStrokes);
    return;
  }

  const numberStrokes = numberWorksheetStrokes(guide);
  if (numberStrokes) {
    drawWorksheetStrokeGuide(context, numberStrokes.strokes, numberStrokes.options);
    return;
  }

  const lowercaseStrokes = lowercaseWorksheetStrokes(guide);
  if (lowercaseStrokes) {
    drawWorksheetStrokeGuide(context, lowercaseStrokes.strokes, lowercaseStrokes.options);
    return;
  }

  context.save();
  context.font = guide.length > 1 ? "150px Arial Rounded MT Bold, Arial" : "170px Arial Rounded MT Bold, Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.setLineDash([10, 12]);
  context.lineWidth = 5;
  context.strokeStyle = "#4f8ff7";
  context.strokeText(guide, canvas.width / 2, canvas.height / 2 + 8);
  context.fillStyle = "rgba(79, 143, 247, 0.08)";
  context.fillText(guide, canvas.width / 2, canvas.height / 2 + 8);
  context.restore();
}

function drawUpperAStrokeGuide(context) {
  const strokes = upperAStrokes();

  context.save();
  context.setLineDash([]);
  context.lineCap = "round";
  context.lineJoin = "round";

  drawUpperAOutline(context);

  strokes.forEach((points, index) => {
    drawDottedPolyline(context, points, {
      fillStyle: "#27416f",
      radius: 3,
      spacing: index === 2 ? 12 : 11.5,
      skipFirst: false
    });
  });
  drawGuideDot(context, 180, 74, 3);
  context.restore();
}

function drawUpperAOutline(context) {
  context.save();
  context.strokeStyle = "#27416f";
  context.lineWidth = 4.5;
  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();
  context.moveTo(92, 184);
  context.lineTo(156, 54);
  context.quadraticCurveTo(180, 30, 204, 54);
  context.lineTo(268, 184);
  context.quadraticCurveTo(272, 196, 260, 198);
  context.lineTo(238, 198);
  context.quadraticCurveTo(226, 198, 222, 186);
  context.lineTo(208, 150);
  context.lineTo(152, 150);
  context.lineTo(138, 186);
  context.quadraticCurveTo(134, 198, 122, 198);
  context.lineTo(100, 198);
  context.quadraticCurveTo(88, 196, 92, 184);
  context.closePath();
  context.stroke();

  context.beginPath();
  context.moveTo(160, 130);
  context.lineTo(180, 76);
  context.lineTo(200, 130);
  context.closePath();
  context.stroke();
  context.restore();
}

function upperAStrokes() {
  return [
    [{ x: 116, y: 176 }, { x: 167, y: 66 }],
    [{ x: 193, y: 66 }, { x: 244, y: 176 }],
    [{ x: 154, y: 141 }, { x: 206, y: 141 }]
  ];
}

function drawDottedPolyline(context, points, options) {
  context.save();
  context.fillStyle = options.fillStyle;

  points.slice(0, -1).forEach((start, index) => {
    const end = points[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    const steps = Math.max(1, Math.floor(length / options.spacing));

    const startStep = options.skipFirst ? 1 : 0;
    for (let step = startStep; step <= steps; step += 1) {
      const progress = step / steps;
      const x = start.x + (end.x - start.x) * progress;
      const y = start.y + (end.y - start.y) * progress;
      context.beginPath();
      context.arc(x, y, options.radius, 0, Math.PI * 2);
      context.fill();
    }
  });

  context.restore();
}

function drawGuideDot(context, x, y, radius) {
  context.save();
  context.fillStyle = "#27416f";
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawUpperBStrokeGuide(context) {
  const strokes = upperBStrokes();

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

  drawUpperBPath(context, {
    strokeStyle: "#27416f",
    lineWidth: 52
  });
  drawUpperBPath(context, {
    strokeStyle: "#fff8dc",
    lineWidth: 42
  });

  strokes.forEach(points => {
    drawDottedPolyline(context, points, {
      fillStyle: "#27416f",
      radius: 3,
      spacing: 12,
      skipFirst: false
    });
  });
  context.restore();
}

function drawUpperBPath(context, options) {
  context.save();
  context.strokeStyle = options.strokeStyle;
  context.lineWidth = options.lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();
  context.moveTo(124, 42);
  context.lineTo(124, 178);

  context.moveTo(124, 42);
  context.bezierCurveTo(220, 42, 226, 103, 124, 103);

  context.moveTo(124, 103);
  context.bezierCurveTo(236, 103, 236, 178, 124, 178);

  context.stroke();
  context.restore();
}

function upperBStrokes() {
  return [
    [{ x: 124, y: 42 }, { x: 124, y: 178 }],
    cubicPoints({ x: 124, y: 42 }, { x: 220, y: 42 }, { x: 226, y: 103 }, { x: 124, y: 103 }, 15),
    cubicPoints({ x: 124, y: 103 }, { x: 236, y: 103 }, { x: 236, y: 178 }, { x: 124, y: 178 }, 18)
  ];
}

function drawWorksheetStrokeGuide(context, strokes, options = {}) {
  const lineWidth = options.lineWidth ?? 52;
  const dotRadius = options.dotRadius ?? 3;
  const dotSpacing = options.dotSpacing ?? 12;

  context.save();
  drawWorksheetStrokePath(context, strokes, {
    strokeStyle: "#27416f",
    lineWidth
  });
  drawWorksheetStrokePath(context, strokes, {
    strokeStyle: "#fff8dc",
    lineWidth: Math.max(10, lineWidth - 10)
  });
  strokes.forEach(points => {
    drawDottedPolyline(context, points, {
      fillStyle: "#27416f",
      radius: dotRadius,
      spacing: dotSpacing,
      skipFirst: false
    });
  });
  drawWorksheetCutouts(context, options.cutouts);
  context.restore();
}

function drawWorksheetCutouts(context, cutouts = []) {
  if (!cutouts.length) return;
  context.save();
  context.fillStyle = "#fff8dc";
  context.strokeStyle = "#27416f";
  context.lineWidth = 4;
  context.lineJoin = "round";
  context.lineCap = "round";

  cutouts.forEach(points => {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.closePath();
    context.fill();
    context.stroke();
  });

  context.restore();
}

function drawWorksheetStrokePath(context, strokes, options) {
  context.save();
  context.strokeStyle = options.strokeStyle;
  context.lineWidth = options.lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";

  strokes.forEach(points => {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach(point => context.lineTo(point.x, point.y));
    context.stroke();
  });

  context.restore();
}

function uppercaseWorksheetStrokes(guide) {
  switch (guide) {
    case "C":
      return [[
        ...cubicPoints({ x: 234, y: 62 }, { x: 190, y: 34 }, { x: 120, y: 50 }, { x: 116, y: 112 }, 18),
        ...cubicPoints({ x: 116, y: 112 }, { x: 120, y: 184 }, { x: 190, y: 192 }, { x: 234, y: 162 }, 18).slice(1)
      ]];
    case "D":
      return [
        [{ x: 124, y: 42 }, { x: 124, y: 178 }],
        cubicPoints({ x: 124, y: 42 }, { x: 252, y: 46 }, { x: 252, y: 174 }, { x: 124, y: 178 }, 26)
      ];
    case "E":
      return [
        [{ x: 236, y: 48 }, { x: 124, y: 48 }, { x: 124, y: 178 }, { x: 238, y: 178 }],
        [{ x: 124, y: 112 }, { x: 214, y: 112 }]
      ];
    case "F":
      return [
        [{ x: 236, y: 48 }, { x: 124, y: 48 }, { x: 124, y: 178 }],
        [{ x: 124, y: 112 }, { x: 214, y: 112 }]
      ];
    case "G":
      return [
        [
          ...cubicPoints({ x: 238, y: 62 }, { x: 198, y: 34 }, { x: 112, y: 46 }, { x: 108, y: 112 }, 16),
          ...cubicPoints({ x: 108, y: 112 }, { x: 112, y: 186 }, { x: 226, y: 188 }, { x: 240, y: 138 }, 18).slice(1)
        ],
        [{ x: 202, y: 126 }, { x: 242, y: 126 }, { x: 242, y: 172 }]
      ];
    case "H":
      return [
        [{ x: 120, y: 44 }, { x: 120, y: 178 }],
        [{ x: 240, y: 44 }, { x: 240, y: 178 }],
        [{ x: 120, y: 112 }, { x: 240, y: 112 }]
      ];
    case "I":
      return [
        [{ x: 132, y: 48 }, { x: 228, y: 48 }],
        [{ x: 180, y: 48 }, { x: 180, y: 178 }],
        [{ x: 132, y: 178 }, { x: 228, y: 178 }]
      ];
    case "J":
      return [
        [{ x: 132, y: 48 }, { x: 236, y: 48 }],
        [{ x: 214, y: 48 }, { x: 214, y: 142 }],
        cubicPoints({ x: 214, y: 142 }, { x: 214, y: 188 }, { x: 138, y: 188 }, { x: 138, y: 144 }, 18)
      ];
    case "K":
      return [
        [{ x: 124, y: 44 }, { x: 124, y: 178 }],
        [{ x: 238, y: 48 }, { x: 124, y: 112 }],
        [{ x: 124, y: 112 }, { x: 242, y: 178 }]
      ];
    case "L":
      return [[{ x: 124, y: 44 }, { x: 124, y: 178 }, { x: 238, y: 178 }]];
    case "M":
      return [[
        { x: 104, y: 178 },
        { x: 104, y: 48 },
        { x: 180, y: 124 },
        { x: 256, y: 48 },
        { x: 256, y: 178 }
      ]];
    case "N":
      return [[
        { x: 116, y: 178 },
        { x: 116, y: 48 },
        { x: 244, y: 178 },
        { x: 244, y: 48 }
      ]];
    case "O":
      return [ellipsePoints(180, 112, 74, 72, 38)];
    case "P":
      return [
        [{ x: 124, y: 178 }, { x: 124, y: 44 }],
        cubicPoints({ x: 124, y: 44 }, { x: 236, y: 44 }, { x: 236, y: 116 }, { x: 124, y: 116 }, 24)
      ];
    case "Q":
      return [
        ellipsePoints(180, 108, 72, 68, 38),
        [{ x: 214, y: 150 }, { x: 256, y: 188 }]
      ];
    case "R":
      return [
        [{ x: 124, y: 178 }, { x: 124, y: 44 }],
        cubicPoints({ x: 124, y: 44 }, { x: 236, y: 44 }, { x: 236, y: 116 }, { x: 124, y: 116 }, 24),
        [{ x: 154, y: 116 }, { x: 244, y: 178 }]
      ];
    case "S":
      return [[
        ...cubicPoints({ x: 238, y: 58 }, { x: 186, y: 34 }, { x: 112, y: 54 }, { x: 122, y: 100 }, 16),
        ...cubicPoints({ x: 122, y: 100 }, { x: 132, y: 136 }, { x: 236, y: 102 }, { x: 236, y: 154 }, 18).slice(1),
        ...cubicPoints({ x: 236, y: 154 }, { x: 236, y: 196 }, { x: 126, y: 190 }, { x: 102, y: 164 }, 16).slice(1)
      ]];
    case "T":
      return [
        [{ x: 112, y: 48 }, { x: 248, y: 48 }],
        [{ x: 180, y: 48 }, { x: 180, y: 178 }]
      ];
    case "U":
      return [[
        { x: 116, y: 48 },
        { x: 116, y: 128 },
        ...cubicPoints({ x: 116, y: 128 }, { x: 116, y: 188 }, { x: 244, y: 188 }, { x: 244, y: 128 }, 20).slice(1),
        { x: 244, y: 48 }
      ]];
    case "V":
      return [[{ x: 108, y: 48 }, { x: 180, y: 178 }, { x: 252, y: 48 }]];
    case "W":
      return [[
        { x: 88, y: 48 },
        { x: 126, y: 178 },
        { x: 180, y: 94 },
        { x: 234, y: 178 },
        { x: 272, y: 48 }
      ]];
    case "X":
      return [
        [{ x: 112, y: 48 }, { x: 248, y: 178 }],
        [{ x: 248, y: 48 }, { x: 112, y: 178 }]
      ];
    case "Y":
      return [
        [{ x: 104, y: 48 }, { x: 180, y: 112 }],
        [{ x: 256, y: 48 }, { x: 180, y: 112 }, { x: 180, y: 190 }]
      ];
    case "Z":
      return [[{ x: 112, y: 48 }, { x: 248, y: 48 }, { x: 112, y: 178 }, { x: 248, y: 178 }]];
    default:
      return null;
  }
}

function numberWorksheetStrokes(guide) {
  if (!/^\d+$/.test(guide)) return null;
  const digits = guide.split("");
  const isSingleDigit = digits.length === 1;
  const scale = isSingleDigit ? 1.1 : 0.82;
  const y = isSingleDigit ? 38 : 50;
  const digitWidth = 100 * scale;
  const gap = isSingleDigit ? 0 : 10;
  const totalWidth = (digitWidth * digits.length) + (gap * (digits.length - 1));
  const startX = (360 - totalWidth) / 2;
  const digitX = index => startX + (index * (digitWidth + gap));

  const strokes = digits.flatMap((digit, index) =>
    transformStrokes(
      digitWorksheetStrokes(digit),
      digitX(index),
      y,
      scale
    )
  );
  const cutouts = digits.flatMap((digit, index) =>
    transformStrokes(
      digitWorksheetCutouts(digit),
      digitX(index),
      y,
      scale
    )
  );

  return {
    strokes,
    cutouts,
    options: isSingleDigit
      ? {
          lineWidth: 52,
          dotRadius: 3,
          dotSpacing: 12,
          cutouts
        }
      : {
          lineWidth: 42,
          dotRadius: 2.7,
          dotSpacing: 10,
          cutouts
        }
  };
}

function lowercaseWorksheetStrokes(guide) {
  const strokeOptions = { lineWidth: 46, dotRadius: 2.8, dotSpacing: 11 };

  switch (guide) {
    case "ɑ":
      return { strokes: [
        ellipsePoints(172, 122, 46, 48, 34),
        [{ x: 214, y: 84 }, { x: 214, y: 170 }]
      ], options: strokeOptions };
    case "b":
      return { strokes: [
        [{ x: 130, y: 44 }, { x: 130, y: 170 }],
        ellipsePoints(176, 126, 46, 44, 34)
      ], options: strokeOptions };
    case "c":
      return { strokes: [[
        ...cubicPoints({ x: 224, y: 92 }, { x: 190, y: 68 }, { x: 124, y: 78 }, { x: 122, y: 126 }, 16),
        ...cubicPoints({ x: 122, y: 126 }, { x: 126, y: 176 }, { x: 192, y: 180 }, { x: 224, y: 154 }, 16).slice(1)
      ]], options: strokeOptions };
    case "d":
      return { strokes: [
        ellipsePoints(164, 126, 46, 44, 34),
        [{ x: 210, y: 44 }, { x: 210, y: 170 }]
      ], options: strokeOptions };
    case "e":
      return { strokes: [[
        { x: 220, y: 122 },
        { x: 130, y: 122 },
        ...cubicPoints({ x: 130, y: 122 }, { x: 132, y: 72 }, { x: 224, y: 74 }, { x: 224, y: 126 }, 18).slice(1),
        ...cubicPoints({ x: 224, y: 126 }, { x: 222, y: 180 }, { x: 142, y: 182 }, { x: 122, y: 144 }, 16).slice(1)
      ]], options: strokeOptions };
    case "f":
      return { strokes: [
        cubicPoints({ x: 210, y: 48 }, { x: 150, y: 34 }, { x: 152, y: 84 }, { x: 152, y: 172 }, 24),
        [{ x: 122, y: 100 }, { x: 206, y: 100 }]
      ], options: strokeOptions };
    case "g":
      return { strokes: [
        ellipsePoints(162, 92, 46, 42, 34),
        [{ x: 210, y: 56 }, { x: 210, y: 166 }],
        [
          { x: 210, y: 166 },
          ...cubicPoints({ x: 210, y: 166 }, { x: 196, y: 206 }, { x: 122, y: 202 }, { x: 112, y: 174 }, 20).slice(1)
        ]
      ], options: strokeOptions };
    case "h":
      return { strokes: [[
        { x: 126, y: 44 },
        { x: 126, y: 172 },
        ...cubicPoints({ x: 126, y: 110 }, { x: 148, y: 76 }, { x: 216, y: 80 }, { x: 216, y: 172 }, 22).slice(1)
      ]], options: strokeOptions };
    case "i":
      return { strokes: [
        [{ x: 178, y: 90 }, { x: 178, y: 172 }],
        [{ x: 178, y: 50 }, { x: 178, y: 52 }]
      ], options: strokeOptions };
    case "j":
      return { strokes: [
        [{ x: 198, y: 88 }, { x: 198, y: 166 }],
        cubicPoints({ x: 198, y: 166 }, { x: 198, y: 212 }, { x: 130, y: 210 }, { x: 136, y: 170 }, 18),
        [{ x: 198, y: 50 }, { x: 198, y: 52 }]
      ], options: strokeOptions };
    case "k":
      return { strokes: [
        [{ x: 126, y: 44 }, { x: 126, y: 172 }],
        [{ x: 218, y: 86 }, { x: 126, y: 126 }],
        [{ x: 126, y: 126 }, { x: 224, y: 172 }]
      ], options: strokeOptions };
    case "l":
      return { strokes: [[{ x: 180, y: 44 }, { x: 180, y: 172 }]], options: strokeOptions };
    case "m":
      return { strokes: [[
        { x: 88, y: 172 },
        { x: 88, y: 88 },
        ...cubicPoints({ x: 88, y: 112 }, { x: 110, y: 72 }, { x: 154, y: 86 }, { x: 154, y: 172 }, 18).slice(1),
        ...cubicPoints({ x: 154, y: 112 }, { x: 178, y: 72 }, { x: 230, y: 86 }, { x: 230, y: 172 }, 18).slice(1)
      ]], options: { lineWidth: 40, dotRadius: 2.5, dotSpacing: 10 } };
    case "n":
      return { strokes: [[
        { x: 126, y: 172 },
        { x: 126, y: 88 },
        ...cubicPoints({ x: 126, y: 112 }, { x: 150, y: 72 }, { x: 220, y: 84 }, { x: 220, y: 172 }, 22).slice(1)
      ]], options: strokeOptions };
    case "o":
      return { strokes: [ellipsePoints(180, 126, 50, 48, 36)], options: strokeOptions };
    case "p":
      return { strokes: [
        [{ x: 130, y: 202 }, { x: 130, y: 86 }],
        ellipsePoints(176, 126, 46, 42, 34)
      ], options: strokeOptions };
    case "q":
      return { strokes: [
        ellipsePoints(164, 112, 46, 42, 34),
        [{ x: 210, y: 72 }, { x: 210, y: 192 }],
        cubicPoints({ x: 210, y: 192 }, { x: 224, y: 202 }, { x: 246, y: 192 }, { x: 254, y: 176 }, 8)
      ], options: strokeOptions };
    case "r":
      return { strokes: [[
        { x: 132, y: 172 },
        { x: 132, y: 88 },
        ...cubicPoints({ x: 132, y: 106 }, { x: 154, y: 80 }, { x: 196, y: 84 }, { x: 206, y: 104 }, 12).slice(1)
      ]], options: strokeOptions };
    case "s":
      return { strokes: [
        [
          ...cubicPoints({ x: 216, y: 94 }, { x: 184, y: 76 }, { x: 128, y: 86 }, { x: 148, y: 120 }, 16),
          ...cubicPoints({ x: 148, y: 120 }, { x: 174, y: 144 }, { x: 218, y: 146 }, { x: 212, y: 170 }, 14).slice(1),
          ...cubicPoints({ x: 212, y: 170 }, { x: 188, y: 194 }, { x: 132, y: 186 }, { x: 126, y: 160 }, 14).slice(1)
        ],
      ], options: strokeOptions };
    case "t":
      return { strokes: [
        [{ x: 176, y: 58 }, { x: 176, y: 160 }],
        cubicPoints({ x: 176, y: 160 }, { x: 176, y: 184 }, { x: 214, y: 178 }, { x: 218, y: 156 }, 10),
        [{ x: 134, y: 96 }, { x: 216, y: 96 }]
      ], options: strokeOptions };
    case "u":
      return { strokes: [[
        { x: 126, y: 88 },
        { x: 126, y: 146 },
        ...cubicPoints({ x: 126, y: 146 }, { x: 126, y: 184 }, { x: 214, y: 184 }, { x: 214, y: 146 }, 18).slice(1),
        { x: 214, y: 88 }
      ]], options: strokeOptions };
    case "v":
      return { strokes: [[{ x: 122, y: 88 }, { x: 180, y: 172 }, { x: 238, y: 88 }]], options: strokeOptions };
    case "w":
      return { strokes: [[
        { x: 110, y: 88 },
        { x: 138, y: 172 },
        { x: 180, y: 116 },
        { x: 222, y: 172 },
        { x: 250, y: 88 }
      ]], options: { lineWidth: 40, dotRadius: 2.5, dotSpacing: 10 } };
    case "x":
      return { strokes: [
        [{ x: 126, y: 88 }, { x: 228, y: 172 }],
        [{ x: 228, y: 88 }, { x: 126, y: 172 }]
      ], options: strokeOptions };
    case "y":
      return { strokes: [
        [
          { x: 132, y: 58 },
          { x: 132, y: 122 },
          ...cubicPoints({ x: 132, y: 122 }, { x: 132, y: 166 }, { x: 228, y: 166 }, { x: 228, y: 122 }, 18).slice(1)
        ],
        [
          { x: 228, y: 58 },
          { x: 228, y: 184 },
          ...cubicPoints({ x: 228, y: 184 }, { x: 222, y: 214 }, { x: 136, y: 212 }, { x: 136, y: 180 }, 16).slice(1)
        ]
      ], options: strokeOptions };
    case "z":
      return { strokes: [[{ x: 126, y: 90 }, { x: 226, y: 90 }, { x: 126, y: 172 }, { x: 226, y: 172 }]], options: strokeOptions };
    default:
      return null;
  }
}

function digitWorksheetStrokes(digit) {
  switch (digit) {
    case "0":
      return [ellipsePoints(50, 70, 34, 62, 34)];
    case "1":
      return [[
        { x: 38, y: 28 },
        { x: 54, y: 12 },
        { x: 54, y: 132 }
      ]];
    case "2":
      return [[
        ...cubicPoints({ x: 24, y: 32 }, { x: 52, y: 4 }, { x: 92, y: 26 }, { x: 74, y: 60 }, 14),
        ...cubicPoints({ x: 74, y: 60 }, { x: 60, y: 86 }, { x: 34, y: 100 }, { x: 22, y: 132 }, 12).slice(1),
        { x: 86, y: 132 }
      ]];
    case "3":
      return [[
        ...cubicPoints({ x: 24, y: 28 }, { x: 62, y: 0 }, { x: 100, y: 34 }, { x: 58, y: 68 }, 18),
        ...cubicPoints({ x: 58, y: 68 }, { x: 106, y: 82 }, { x: 86, y: 148 }, { x: 24, y: 120 }, 20).slice(1)
      ]];
    case "4":
      return [
        [{ x: 74, y: 12 }, { x: 28, y: 92 }, { x: 88, y: 92 }],
        [{ x: 74, y: 12 }, { x: 74, y: 132 }]
      ];
    case "5":
      return [[
        { x: 86, y: 16 },
        { x: 28, y: 16 },
        { x: 24, y: 70 },
        { x: 58, y: 70 },
        ...cubicPoints({ x: 58, y: 70 }, { x: 108, y: 70 }, { x: 98, y: 142 }, { x: 28, y: 126 }, 24).slice(1)
      ]];
    case "6":
      return [[
        ...cubicPoints({ x: 76, y: 18 }, { x: 36, y: 34 }, { x: 22, y: 76 }, { x: 30, y: 108 }, 16),
        ...cubicPoints({ x: 30, y: 108 }, { x: 40, y: 154 }, { x: 100, y: 140 }, { x: 84, y: 94 }, 18).slice(1),
        ...cubicPoints({ x: 84, y: 94 }, { x: 72, y: 58 }, { x: 20, y: 66 }, { x: 30, y: 108 }, 18).slice(1)
      ]];
    case "7":
      return [[
        { x: 22, y: 18 },
        { x: 86, y: 18 },
        { x: 42, y: 132 }
      ]];
    case "8":
      return [[
        ...cubicPoints({ x: 50, y: 12 }, { x: 94, y: 12 }, { x: 94, y: 66 }, { x: 50, y: 72 }, 18),
        ...cubicPoints({ x: 50, y: 72 }, { x: 6, y: 78 }, { x: 8, y: 132 }, { x: 50, y: 132 }, 18).slice(1),
        ...cubicPoints({ x: 50, y: 132 }, { x: 94, y: 132 }, { x: 94, y: 78 }, { x: 50, y: 72 }, 18).slice(1),
        ...cubicPoints({ x: 50, y: 72 }, { x: 8, y: 66 }, { x: 6, y: 12 }, { x: 50, y: 12 }, 18).slice(1)
      ]];
    case "9":
      return [
        ellipsePoints(42, 54, 32, 38, 34),
        [{ x: 79, y: 24 }, { x: 79, y: 142 }]
      ];
    default:
      return [];
  }
}

function digitWorksheetCutouts(digit) {
  if (digit !== "4") return [];
  return [[
    { x: 47, y: 86 },
    { x: 64, y: 46 },
    { x: 64, y: 86 }
  ]];
}

function transformStrokes(strokes, offsetX, offsetY, scale) {
  return strokes.map(points => points.map(point => ({
    x: offsetX + (point.x * scale),
    y: offsetY + (point.y * scale)
  })));
}

function cubicPoints(start, controlA, controlB, end, steps) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = index / steps;
    const inverse = 1 - t;
    return {
      x: (inverse ** 3 * start.x) +
        (3 * inverse ** 2 * t * controlA.x) +
        (3 * inverse * t ** 2 * controlB.x) +
        (t ** 3 * end.x),
      y: (inverse ** 3 * start.y) +
        (3 * inverse ** 2 * t * controlA.y) +
        (3 * inverse * t ** 2 * controlB.y) +
        (t ** 3 * end.y)
    };
  });
}

function arcPoints(centerX, centerY, radiusX, radiusY, startAngle, endAngle, steps) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const progress = index / steps;
    const angle = startAngle + (endAngle - startAngle) * progress;
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY
    };
  });
}

function ellipsePoints(centerX, centerY, radiusX, radiusY, steps) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / steps;
    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY
    };
  });
}

function traceGuideFont(guide) {
  return guide.length > 1 ? "164px Arial Rounded MT Bold, Arial" : "188px Arial Rounded MT Bold, Arial";
}

function createGuideMask(canvas, guide) {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "black";
  maskContext.fillRect(0, 0, canvas.width, canvas.height);

  if (guide === "A") {
    drawWorksheetStrokePath(maskContext, upperAStrokes(), {
      strokeStyle: "white",
      lineWidth: 44
    });
    return maskContext;
  }

  if (guide === "B") {
    drawUpperBPath(maskContext, {
      strokeStyle: "white",
      lineWidth: 44
    });
    return maskContext;
  }

  const worksheetStrokes = uppercaseWorksheetStrokes(guide);
  if (worksheetStrokes) {
    drawWorksheetStrokePath(maskContext, worksheetStrokes, {
      strokeStyle: "white",
      lineWidth: 44
    });
    return maskContext;
  }

  const numberStrokes = numberWorksheetStrokes(guide);
  if (numberStrokes) {
    drawWorksheetStrokePath(maskContext, numberStrokes.strokes, {
      strokeStyle: "white",
      lineWidth: Math.max(10, (numberStrokes.options.lineWidth ?? 52) - 8)
    });
    return maskContext;
  }

  const lowercaseStrokes = lowercaseWorksheetStrokes(guide);
  if (lowercaseStrokes) {
    drawWorksheetStrokePath(maskContext, lowercaseStrokes.strokes, {
      strokeStyle: "white",
      lineWidth: Math.max(10, (lowercaseStrokes.options.lineWidth ?? 46) - 8)
    });
    return maskContext;
  }

  maskContext.save();
  maskContext.font = traceGuideFont(guide);
  maskContext.textAlign = "center";
  maskContext.textBaseline = "middle";
  maskContext.lineWidth = 26;
  maskContext.strokeStyle = "white";
  maskContext.fillStyle = "white";
  maskContext.strokeText(guide, canvas.width / 2, canvas.height / 2 + 8);
  maskContext.fillText(guide, canvas.width / 2, canvas.height / 2 + 8);
  maskContext.restore();
  return maskContext;
}

function countGuideCells(maskContext) {
  const cells = new Set();
  const width = maskContext.canvas.width;
  const height = maskContext.canvas.height;
  for (let x = 0; x < width; x += 18) {
    for (let y = 0; y < height; y += 18) {
      if (isNearGuide({ x, y }, maskContext, 8)) {
        cells.add(cellKey({ x, y }, width, height));
      }
    }
  }
  return cells.size;
}

function markGuideCell(point, maskContext, cells) {
  if (!isNearGuide(point, maskContext, 16)) return;
  cells.add(cellKey(point, maskContext.canvas.width, maskContext.canvas.height));
}

function cellKey(point, width, height) {
  const column = Math.min(7, Math.max(0, Math.floor((point.x / width) * 8)));
  const row = Math.min(5, Math.max(0, Math.floor((point.y / height) * 6)));
  return `${column}:${row}`;
}

function isNearGuide(point, maskContext, radius) {
  const x = Math.round(point.x);
  const y = Math.round(point.y);
  const width = maskContext.canvas.width;
  const height = maskContext.canvas.height;

  for (let dx = -radius; dx <= radius; dx += 6) {
    for (let dy = -radius; dy <= radius; dy += 6) {
      const sampleX = Math.min(width - 1, Math.max(0, x + dx));
      const sampleY = Math.min(height - 1, Math.max(0, y + dy));
      const pixel = maskContext.getImageData(sampleX, sampleY, 1, 1).data;
      if (pixel[0] > 180) return true;
    }
  }

  return false;
}

function isInsideGuide(point, maskContext) {
  const x = Math.round(point.x);
  const y = Math.round(point.y);
  const width = maskContext.canvas.width;
  const height = maskContext.canvas.height;
  if (x < 0 || y < 0 || x >= width || y >= height) return false;
  const pixel = maskContext.getImageData(x, y, 1, 1).data;
  return pixel[0] > 180;
}

render();
