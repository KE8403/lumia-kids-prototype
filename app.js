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
  traceCompleted: false
};

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
      <p class="helper-text">Trace it. Tap Done.</p>
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
      navigate("letter");
    });
  });

  document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
      state.number = Number(button.dataset.number);
      state.reward = "";
      state.traceCompleted = false;
      navigate("number");
    });
  });

  document.querySelectorAll("[data-mode]").forEach(button => {
    button.addEventListener("click", () => {
      state.traceMode = button.dataset.mode;
      state.reward = "";
      state.traceCompleted = false;
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
      state.matched.clear();
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

  if (state.selectedUpper === state.selectedLower) {
    state.matched.add(state.selectedUpper);
    state.lastMatchWrong = false;
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
  state.traceCompleted = true;
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
  render();
}

function advanceNumberTask() {
  const currentIndex = numbers.indexOf(state.number);
  state.number = numbers[(currentIndex + 1) % numbers.length];
  state.reward = "";
  state.traceCompleted = false;
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
    <div class="celebration-word">Hooray!</div>
    ${Array.from({ length: 64 }, (_, index) => {
      const left = 8 + Math.random() * 84;
      const delay = Math.random() * 0.85;
      const size = 8 + Math.random() * 12;
      const drift = -80 + Math.random() * 160;
      const color = ["#ffd85a", "#4f8ff7", "#ff75a9", "#84d98b", "#ff817d"][index % 5];
      return `<span class="confetti" style="--left:${left}%;--delay:${delay}s;--size:${size}px;--drift:${drift}px;--color:${color};"></span>`;
    }).join("")}
  `;
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
  const minimumTraceTime = 1800;

  drawGuide(context, canvas, guide);

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

    const coverage = touchedGuideCells.size / Math.max(totalGuideCells, 1);
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

    if (distance > 220 && !state.traceCompleted) {
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

function createGuideMask(canvas, guide) {
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  const maskContext = maskCanvas.getContext("2d");
  maskContext.fillStyle = "black";
  maskContext.fillRect(0, 0, canvas.width, canvas.height);
  maskContext.save();
  maskContext.font = guide.length > 1 ? "150px Arial Rounded MT Bold, Arial" : "170px Arial Rounded MT Bold, Arial";
  maskContext.textAlign = "center";
  maskContext.textBaseline = "middle";
  maskContext.lineWidth = 20;
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

render();
