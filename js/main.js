const link = document.getElementById("link");
const prompt = document.getElementById("prompt");
const game = document.getElementById("game");
const startOverlay = document.getElementById("start-overlay");
const startPlay = document.getElementById("start-play");
const screenOverlay = document.getElementById("screen-overlay");
const screenFrame = document.getElementById("screen-frame");
const screenLoading = document.getElementById("screen-loading");
const canvaLinkEl = document.getElementById("canva-link");

/* POSICION */
let x = 280;
let y = 160;

/* MOVIMIENTO */
const speed = 1.5;

/* SPRITE */
const frameWidth = 94;
const frameHeight = 120;
const totalFrames = 3;
const linkScale = 0.65;

/* ANIMACION */
let frame = 0;
let animTimer = 0;
const animSpeed = 4;

/* CONTROL */
let direction = "down";
let moving = false;
let currentInteraction = null;
let screenOpen = false;
let gameStarted = false;
let loadingTimer = null;
const screenLoadDelayMs = 2000;
let waitingForTargetScreenLoad = false;
let pendingScreenUrl = "";
let frameLoadFallbackTimer = null;

/* SPRITES */
const sprites = {
  down: "source/abajo.png",
  up: "source/arriba.png",
  left: "source/Izquierda.png",
  right: "source/derecha.png",
  idle: "source/Estatico.png"
};

const keys = {};
window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === "Escape" && screenOpen) {
    closeScreen();
    e.preventDefault();
  }
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
});

if (startPlay) {
  startPlay.addEventListener("click", startGame);
}

if (screenFrame) {
  screenFrame.addEventListener("load", () => {
    if (!screenOpen || !waitingForTargetScreenLoad) return;
    waitingForTargetScreenLoad = false;
    if (frameLoadFallbackTimer) clearTimeout(frameLoadFallbackTimer);
    if (screenLoading) screenLoading.classList.add("hidden");
    screenFrame.classList.remove("hidden");
  });
}

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  if (startOverlay) startOverlay.classList.add("hidden");
  if (game) game.classList.remove("hidden-game");
  update();
}

function renderInteractionDebug() {
  for (const area of interactions) {
    const box = document.createElement("div");
    box.className = "collision-box interaction";
    box.style.left = area.x + "px";
    box.style.top = area.y + "px";
    box.style.width = area.width + "px";
    box.style.height = area.height + "px";
    game.appendChild(box);
  }
}

function openScreen(url) {
  if (!screenFrame || !screenOverlay) return;

  screenOpen = true;
  prompt.style.display = "none";
  screenOverlay.classList.remove("hidden");
  screenOverlay.setAttribute("aria-hidden", "false");

  screenFrame.classList.add("hidden");
  if (screenLoading) screenLoading.classList.remove("hidden");

  waitingForTargetScreenLoad = false;
  pendingScreenUrl = url;
  screenFrame.src = "about:blank";
  if (loadingTimer) clearTimeout(loadingTimer);
  if (frameLoadFallbackTimer) clearTimeout(frameLoadFallbackTimer);

  loadingTimer = setTimeout(() => {
    waitingForTargetScreenLoad = true;
    screenFrame.src = pendingScreenUrl;

    // Fallback para embeds que no disparan load consistentemente.
    frameLoadFallbackTimer = setTimeout(() => {
      if (!screenOpen || !waitingForTargetScreenLoad) return;
      waitingForTargetScreenLoad = false;
      if (screenLoading) screenLoading.classList.add("hidden");
      screenFrame.classList.remove("hidden");
    }, 2000);
  }, screenLoadDelayMs);
}

function closeScreen() {
  if (!screenFrame || !screenOverlay) return;
  if (loadingTimer) clearTimeout(loadingTimer);
  if (frameLoadFallbackTimer) clearTimeout(frameLoadFallbackTimer);
  waitingForTargetScreenLoad = false;
  pendingScreenUrl = "";

  screenFrame.src = "about:blank";
  screenFrame.classList.add("hidden");
  if (screenLoading) screenLoading.classList.add("hidden");

  screenOverlay.classList.add("hidden");
  screenOverlay.setAttribute("aria-hidden", "true");
  screenOpen = false;
}

function toCanvaEmbedUrl(rawUrl) {
  try {
    const url = new URL(rawUrl, window.location.href);
    if (!url.hostname.includes("canva.com")) return rawUrl;

    if (!url.pathname.endsWith("/view")) {
      url.pathname = `${url.pathname.replace(/\/+$/, "")}/view`;
    }

    url.search = "";
    url.hash = "";
    url.searchParams.set("embed", "");
    return url.toString();
  } catch {
    return rawUrl;
  }
}

function triggerInteraction(area) {
  if (area.id === "ocarina") {
    openScreen("Ocarina/ZELDA/index.html");
    return;
  }

  if (area.id === "canva") {
    const canvaUrl = (canvaLinkEl?.href || "").trim();
    if (!canvaUrl) return;
    openScreen(toCanvaEmbedUrl(canvaUrl));
  }
}

function update() {
  if (!gameStarted) return;

  if (screenOpen) {
    requestAnimationFrame(update);
    return;
  }

  let dx = 0;
  let dy = 0;
  moving = false;

  if (keys["ArrowUp"] || keys["w"] || keys["W"]) {
    dy = -speed;
    direction = "up";
  }
  if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
    dy = speed;
    direction = "down";
  }
  if (keys["ArrowLeft"] || keys["a"] || keys["A"]) {
    dx = -speed;
    direction = "left";
  }
  if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
    dx = speed;
    direction = "right";
  }

  if (dx !== 0 || dy !== 0) moving = true;

  const nextBox = {
    x: x + dx + (32 * linkScale),
    y: y + dy + (70 * linkScale),
    width: 30 * linkScale,
    height: 40 * linkScale
  };

  let blocked = false;
  for (const wall of walls) {
    if (collide(nextBox, wall)) {
      blocked = true;
      break;
    }
  }

  if (!blocked) {
    x += dx;
    y += dy;
  }

  currentInteraction = null;
  for (const area of interactions) {
    if (collide(nextBox, area)) {
      currentInteraction = area;
      prompt.textContent = area.prompt || "Presiona E";
      prompt.style.display = "block";
      break;
    }
  }

  if (!currentInteraction) {
    prompt.style.display = "none";
  }

  if ((keys["e"] || keys["E"]) && currentInteraction) {
    triggerInteraction(currentInteraction);
    keys["e"] = false;
    keys["E"] = false;
  }

  if (moving) {
    link.style.backgroundImage = `url("${sprites[direction]}")`;
    animTimer++;
    if (animTimer >= animSpeed) {
      frame = (frame + 1) % totalFrames;
      animTimer = 0;
    }
  } else {
    link.style.backgroundImage = `url("${sprites.idle}")`;
    frame = 0;
  }

  link.style.left = x + "px";
  link.style.top = y + "px";
  link.style.width = frameWidth + "px";
  link.style.height = frameHeight + "px";
  link.style.transform = `scale(${linkScale})`;
  link.style.backgroundPosition = `-${frame * frameWidth}px 0px`;

  requestAnimationFrame(update);
}

renderInteractionDebug();
closeScreen();
