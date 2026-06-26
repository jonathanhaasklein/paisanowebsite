import { VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE } from "./shaders.js";

window._A = { config: { v: 1, isLocal: true }, color: { bg: { hex: "#F4F1EA" }, txt: { hex: "#0F1011" }, accent1: { hex: "#FF663F" }, accent2: { hex: "#0066FF" } }, page: "home" };
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
(function setupMail() {
  var user = "jonathanhaasklein";
  var domain = "hotmail.com";
  var link = document.getElementById("mail-link");
  link.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "mailto:" + user + "@" + domain;
  });
})();
(function setupWordmark() {
  var word = "paisano";
  var el = document.getElementById("n0");
  word.split("").forEach(function (ch) {
    var span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch;
    el.appendChild(span);
  });
})();
function relativeLuminance(hex) {
  var r = parseInt(hex.slice(1, 3), 16) / 255;
  var g = parseInt(hex.slice(3, 5), 16) / 255;
  var b = parseInt(hex.slice(5, 7), 16) / 255;
  function lin(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastRatio(hexA, hexB) {
  var lA = relativeLuminance(hexA), lB = relativeLuminance(hexB);
  var lighter = Math.max(lA, lB), darker = Math.min(lA, lB);
  return (lighter + 0.05) / (darker + 0.05);
}
function pickTextColorFor(bgHex, preferredTextHex) {
  if (contrastRatio(bgHex, preferredTextHex) >= 4.5) return preferredTextHex;
  var withInk = contrastRatio(bgHex, "#0F1011");
  var withPaper = contrastRatio(bgHex, "#F4F1EA");
  if (withInk >= 4.5) return "#0F1011";
  if (withPaper >= 4.5) return "#F4F1EA";
  return withInk > withPaper ? "#0F1011" : "#F4F1EA";
}
function mixHex(hexA, hexB, t) {
  function ch(hex, i) { return parseInt(hex.slice(i, i + 2), 16); }
  function toHex(n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"); }
  var r = ch(hexA, 1) * (1 - t) + ch(hexB, 1) * t;
  var g = ch(hexA, 3) * (1 - t) + ch(hexB, 3) * t;
  var b = ch(hexA, 5) * (1 - t) + ch(hexB, 5) * t;
  return "#" + toHex(r) + toHex(g) + toHex(b);
}
function legibleAccentFor(accentHex, bgHex) {
  if (contrastRatio(accentHex, bgHex) >= 3) return accentHex;
  var target = relativeLuminance(bgHex) < 0.5 ? "#FFFFFF" : "#000000";
  for (var t = 0.05; t <= 1; t += 0.05) {
    var mixed = mixHex(accentHex, target, t);
    if (contrastRatio(mixed, bgHex) >= 3) return mixed;
  }
  return target;
}
var COLOR_GROUPS = [
  { name: "Gris Neutro & Turquesa", bg: "#2F2F30", texto: "#DADACF", acento: "#3F9999", displayFont: "'Archivo Black', sans-serif" },
  { name: "Gótico & Sangre", bg: "#1D191F", texto: "#8F8893", acento: "#B52318", displayFont: "'Anton', sans-serif" },
  { name: "Monocromo & Madera", bg: "#E9E8E1", texto: "#2F2012", acento: "#ABA8A3", displayFont: "'Big Shoulders Display', sans-serif" },
  { name: "Oro Viejo & Arena", bg: "#3A3128", texto: "#CBC9C4", acento: "#D7A640", displayFont: "'Bodoni Moda', serif" },
  { name: "Cyber Azul & Eléctrico", bg: "#151518", texto: "#F6FBED", acento: "#4981DC", displayFont: "'Audiowide', sans-serif" },
  { name: "Rosa Salmón & Tierra", bg: "#B6AEA7", texto: "#1E1A18", acento: "#D99B93", displayFont: "'Gloock', serif" },
  { name: "Asfalto & Crema", bg: "#0E0B08", texto: "#E5D9C3", acento: "#4D2B0B", displayFont: "'Unbounded', sans-serif" }
];
COLOR_GROUPS.forEach(function (g) { g.acentoTitulo = legibleAccentFor(g.acento, g.bg); });
function getMockPortfolioData() {
  var skills = ["WEBGL", "JS ANIM", "LAYOUT AVANZADO", "CIFRADO SEGURO", "FEED INTEGRATION"];
  var titles = ["estudio norte", "llovizna", "casa marfil", "río seco", "cantera", "marejada", "tierra adentro", "alto verde", "puente viejo", "monte claro", "bajo fondo", "campo abierto"];
  var types = ["IDENTIDAD", "PRODUCTO", "E-COMMERCE", "EDITORIAL", "BRANDING"];
  var roles = ["DISEÑO + DESARROLLO", "DIRECCIÓN DE ARTE", "FULLSTACK + MOTION"];
  var descTemplates = [
    "Un sistema de %TYPE% pensado para sostenerse en el tiempo, no para una campaña de temporada.",
    "Identidad y producción de %TYPE% construidas desde cero junto al cliente, sin plantillas de por medio.",
    "Pieza de %TYPE% donde la dirección de arte y el desarrollo avanzaron al mismo ritmo, no en cadena."
  ];
  var items = [];
  for (var i = 0; i < titles.length; i++) {
    var group = COLOR_GROUPS[i % COLOR_GROUPS.length];
    var tipo = types[i % types.length];
    items.push({
      id: "mock_" + i,
      title: titles[i],
      caption: "Pieza " + (i + 1).toString().padStart(2, "0"),
      url: "https://www.instagram.com/p/MOCK_" + i + "/",
      skill: skills[i % skills.length],
      hue: (i * 47) % 360,
      palette: group,
      descripcion: descTemplates[i % descTemplates.length].replace("%TYPE%", tipo.toLowerCase()),
      meta: {
        completado: "20" + (24 + (i % 3)) + " · " + ["ENE", "MAY", "SEP", "DIC"][i % 4],
        tipo: tipo,
        rol: roles[i % roles.length],
        cliente: "Proyecto propio / cliente privado"
      }
    });
  }
  return items;
}
var portfolioData = getMockPortfolioData();
(function setupAccessibleNav() {
  var list = document.getElementById("portfolio-list");
  portfolioData.forEach(function (item, i) {
    var li = document.createElement("li");
    var button = document.createElement("button");
    button.type = "button";
    button.textContent = item.caption + " — " + item.title + " (" + item.skill + ")";
    button.dataset.index = i;
    button.addEventListener("focus", function () { focusedIndex = i; snapToIndex(i); });
    button.addEventListener("click", function () { triggerExplosion(i); });
    li.appendChild(button);
    list.appendChild(li);
  });
})();
var canvas = document.getElementById("c2d");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
  console.warn("paisano: WebGL no disponible en este navegador — la galería no se renderizará.");
}
var dpr = Math.min(window.devicePixelRatio || 1, 2);
var W, H;
var TILE_ASPECT = 16 / 9;
var TILE, TILE_H, GAP, STEP, TOTAL_W, CENTER_X;
function calibrateLayout() {
  TILE = 330;
  TILE_H = 330;
  GAP = 42;
  STEP = TILE + GAP;
  TOTAL_W = STEP * portfolioData.length;
  CENTER_X = W / 2;
}
function resize() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  calibrateLayout();
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
}
resize();
window.addEventListener("resize", resize);
function compileShader(source, type) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compilando shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
var glProgram = null; var glLocations = null; var quadBuffer = null; var glTextures = [];
if (gl) {
  var vertexShader = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
  var fragmentShader = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
  glProgram = gl.createProgram();
  gl.attachShader(glProgram, vertexShader);
  gl.attachShader(glProgram, fragmentShader);
  gl.linkProgram(glProgram);
  if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
    console.error("Error enlazando el programa WebGL:", gl.getProgramInfoLog(glProgram));
    glProgram = null;
  } else {
    gl.useProgram(glProgram);
    glLocations = {
      aPosition: gl.getAttribLocation(glProgram, "aPosition"),
      aUv: gl.getAttribLocation(glProgram, "aUv"),
      uProjection: gl.getUniformLocation(glProgram, "uProjection"),
      uTileOffset: gl.getUniformLocation(glProgram, "uTileOffset"),
      uTileScale: gl.getUniformLocation(glProgram, "uTileScale"),
      uWaveCenterX: gl.getUniformLocation(glProgram, "uWaveCenterX"),
      uWaveStrength: gl.getUniformLocation(glProgram, "uWaveStrength"),
      uWaveWidth: gl.getUniformLocation(glProgram, "uWaveWidth"),
      uWaveIntensity: gl.getUniformLocation(glProgram, "uWaveIntensity"),
      uHoverReveal: gl.getUniformLocation(glProgram, "uHoverReveal"),
      uParallaxOffset: gl.getUniformLocation(glProgram, "uParallaxOffset"),
      uImage: gl.getUniformLocation(glProgram, "uImage"),
      uImageAspectCorrection: gl.getUniformLocation(glProgram, "uImageAspectCorrection"),
      uColorPaper: gl.getUniformLocation(glProgram, "uColorPaper"),
      uActiveAccent: gl.getUniformLocation(glProgram, "uActiveAccent"),
      uHighlight: gl.getUniformLocation(glProgram, "uHighlight"),
      uExplosion: gl.getUniformLocation(glProgram, "uExplosion"),
      uAlpha: gl.getUniformLocation(glProgram, "uAlpha")
    };
    var quadVertices = new Float32Array([
      -0.5, -0.5, 0.0, 1.0,
       0.5, -0.5, 1.0, 1.0,
      -0.5,  0.5, 0.0, 0.0,
       0.5,  0.5, 1.0, 0.0
    ]);
    quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
  }
}
function buildOrthoProjection(width, height) {
  return new Float32Array([2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);
}
function hexToVec3(hex) {
  var r = parseInt(hex.slice(1, 3), 16) / 255;
  var g = parseInt(hex.slice(3, 5), 16) / 255;
  var b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}
var paletteVec3 = { paper: hexToVec3("#F4F1EA") };
var sprites = portfolioData.map(function (item) {
  var off = document.createElement("canvas");
  off.width = TILE; off.height = TILE_H;
  var octx = off.getContext("2d");
  var grad = octx.createLinearGradient(0, 0, TILE, TILE_H);
  grad.addColorStop(0, "hsl(" + item.hue + ", 18%, 88%)");
  grad.addColorStop(1, "hsl(" + item.hue + ", 22%, 78%)");
  octx.fillStyle = grad;
  octx.fillRect(0, 0, TILE, TILE_H);
  octx.strokeStyle = "rgba(15,16,17,0.15)";
  octx.lineWidth = 1;
  octx.strokeRect(0.5, 0.5, TILE - 1, TILE_H - 1);
  return off;
});
if (gl && glProgram) {
  glTextures = sprites.map(function (spriteCanvas) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, spriteCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
  });
}
var VIGNETTE_THUMB_FILENAME = "01.jpg";
function vignetteThumbPath(index) {
  var folder = (index + 1).toString().padStart(2, "0");
  return "assets/viñetas/" + folder + "/" + VIGNETTE_THUMB_FILENAME;
}
var imageAspectCorrections = portfolioData.map(function () { return [1, 1]; });
if (gl && glProgram) {
  portfolioData.forEach(function (item, idx) {
    var img = new Image();
    img.onload = function () {
      var ar = img.naturalWidth / img.naturalHeight;
      var destAspect = TILE / TILE_H;
      imageAspectCorrections[idx] = [Math.min(destAspect / ar, 1), Math.min(ar / destAspect, 1)];
      gl.bindTexture(gl.TEXTURE_2D, glTextures[idx]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    img.src = vignetteThumbPath(idx);
  });
}
var metaEl = document.createElement("div");
metaEl.className = "mono";
metaEl.style.position = "fixed";
metaEl.style.zIndex = "15";
metaEl.style.pointerEvents = "none";
metaEl.style.color = "var(--txt)";
metaEl.style.opacity = "0";
metaEl.style.transition = "opacity .2s var(--ease)";
document.getElementById("app").appendChild(metaEl);
var waveLineEl = document.createElement("div");
waveLineEl.setAttribute("aria-hidden", "true");
waveLineEl.style.position = "fixed";
waveLineEl.style.left = "0";
waveLineEl.style.width = "100%";
waveLineEl.style.height = "2px";
waveLineEl.style.background = "#D4A017";
waveLineEl.style.zIndex = "6";
waveLineEl.style.pointerEvents = "none";
waveLineEl.style.opacity = "0";
document.getElementById("app").appendChild(waveLineEl);
var numberingEl = document.getElementById("numbering");
var techSheetEl = document.getElementById("tech-sheet");
function renderTechSheet(item) {
  techSheetEl.innerHTML = '<div class="field"><b>Completado</b>' + item.meta.completado + '</div>' + '<div class="field"><b>Tipo</b>' + item.meta.tipo + '</div>' + '<div class="field"><b>Rol</b>' + item.meta.rol + '</div>' + '<div class="field"><b>Cliente</b>' + item.meta.cliente + '</div>';
}
var activeProjectIndex = -1;
var activeAccentVec3 = hexToVec3(portfolioData[0].palette.acento);
function syncActiveProject(centeredIndex) {
  if (centeredIndex === activeProjectIndex) return;
  activeProjectIndex = centeredIndex;
  var item = portfolioData[centeredIndex];
  activeAccentVec3 = hexToVec3(item.palette.acento);
  document.documentElement.style.setProperty("--bg", item.palette.bg);
  document.documentElement.style.setProperty("--txt", pickTextColorFor(item.palette.bg, item.palette.texto));
  [numberingEl, techSheetEl].forEach(function (el) { el.classList.add("fade-swap"); });
  setTimeout(function () {
    numberingEl.textContent = (centeredIndex + 1).toString().padStart(2, "0") + " / " + portfolioData.length.toString().padStart(2, "0");
    renderTechSheet(item);
    [numberingEl, techSheetEl].forEach(function (el) { el.classList.remove("fade-swap"); });
  }, 160);
}
var explodedIndex = -1;
var explosionState = { progress: 0 };
var explosionTimeline = null;
var deepDiveEl = document.getElementById("deep-dive");
var ddTitleEl = document.getElementById("dd-title");
var ddDescEl = document.getElementById("dd-desc");
var ddFieldsEl = document.getElementById("dd-fields");
var explosionTitleEl = document.getElementById("explosion-display-title");
explosionTitleEl.style.position = "fixed";
explosionTitleEl.style.top = "50%";
explosionTitleEl.style.left = "50%";
explosionTitleEl.style.transform = "translate(-50%, -50%)";
explosionTitleEl.style.zIndex = "25";
explosionTitleEl.style.margin = "0";
explosionTitleEl.style.fontSize = "clamp(80px, 15vw, 180px)";
explosionTitleEl.style.fontWeight = "900";
explosionTitleEl.style.textTransform = "uppercase";
explosionTitleEl.style.color = "var(--txt)";
explosionTitleEl.style.whiteSpace = "nowrap";
explosionTitleEl.style.pointerEvents = "none";
explosionTitleEl.style.opacity = "0";
function triggerExplosion(idx) {
  if (explosionTimeline) explosionTimeline.kill();
  explodedIndex = idx;
  var item = portfolioData[idx];
  activeProjectIndex = idx;
  activeAccentVec3 = hexToVec3(item.palette.acento);
  document.documentElement.style.setProperty("--exploded-font", item.palette.displayFont);
  document.documentElement.style.setProperty("--exploded-accent", item.palette.acentoTitulo);
  ddTitleEl.textContent = item.title;
  ddDescEl.innerHTML = item.descripcion.replace(item.meta.tipo.toLowerCase(), '<span class="dd-accent">' + item.meta.tipo.toLowerCase() + '</span>');
  ddFieldsEl.innerHTML = '<div><b>Completado</b>' + item.meta.completado + '</div>' + '<div><b>Tipo</b>' + item.meta.tipo + '</div>' + '<div><b>Rol</b>' + item.meta.rol + '</div>';
  explosionTitleEl.textContent = item.title;
  gsap.set(deepDiveEl, { yPercent: 100, autoAlpha: 0 });
  gsap.set(explosionTitleEl, { opacity: 0 });
  deepDiveEl.classList.add("open");
  techSheetEl.classList.add("stage-2");
  var d = reduceMotion ? 0.15 : null;
  explosionTimeline = gsap.timeline({ onReverseComplete: function () { explodedIndex = -1; deepDiveEl.classList.remove("open"); techSheetEl.classList.remove("stage-2"); canvas.focus(); } });
  explosionTimeline.to(document.documentElement, { "--bg": item.palette.bg, "--txt": pickTextColorFor(item.palette.bg, item.palette.texto), duration: d || 0.5, ease: "power4.out" }).to(explosionState, { progress: 1, duration: d || 0.9, ease: "power4.out" }, "<").to(explosionTitleEl, { opacity: 1, duration: d || 0.9, ease: "power4.out" }, "<").to(deepDiveEl, { yPercent: 0, autoAlpha: 1, duration: d || 0.6, ease: "power4.out" }, "<0.2");
  document.getElementById("dd-close").focus();
}
function closeExplosion() { if (!explosionTimeline || explodedIndex === -1) return; explosionTimeline.reverse(); }
document.getElementById("dd-close").addEventListener("click", closeExplosion);
document.getElementById("dd-deeper").addEventListener("click", function () {
  var item = portfolioData[explodedIndex];
  var placeholder = "data:text/html;charset=utf-8," + encodeURIComponent("<title>" + item.title + "</title><body style='font-family:sans-serif;padding:48px;background:#F4F1EA;color:#0F1011'><h1>" + item.title + "</h1><p>Caso de estudio completo — pendiente de contenido real.</p><p>Cerrá esta pestaña para volver a la vista en profundidad.</p></body>");
  window.open(placeholder, "_blank", "noopener");
});
window.addEventListener("keydown", function (e) { if (e.key === "Escape" && explodedIndex !== -1) closeExplosion(); });
var scrollTarget = 0;
var scrollCurrent = 0;
var scrollVelocity = 0;
var waveIntensity = 0;
var lastTime = 0;
var focusedIndex = 0;
var hoveredIndex = -1;
var kbdHintTimer = null;
function showKbdHint() { var hint = document.getElementById("kbd-hint"); hint.classList.add("show"); clearTimeout(kbdHintTimer); kbdHintTimer = setTimeout(function () { hint.classList.remove("show"); }, 2200); }
function mod(n, m) { return ((n % m) + m) % m; }
function quadraticEase(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) * 0.5; }
var FOCUS_FALLOFF_WIDTH_FACTOR = 2.2;
function snapToIndex(i) { scrollTarget = i * STEP; showKbdHint(); }
window.addEventListener("wheel", function (e) { e.preventDefault(); if (explodedIndex !== -1) closeExplosion(); scrollTarget += e.deltaY !== 0 ? e.deltaY : e.deltaX; }, { passive: false });
var dragging = false, dragStartX = 0, dragStartScroll = 0;
canvas.style.pointerEvents = "auto";
window.addEventListener("pointerdown", function (e) { dragging = true; dragStartX = e.clientX; dragStartScroll = scrollTarget; });
window.addEventListener("pointermove", function (e) { if (!dragging) return; scrollTarget = dragStartScroll - (e.clientX - dragStartX) * 2; });
window.addEventListener("pointerup", function () { dragging = false; });
canvas.addEventListener("click", function (e) { if (Math.abs(scrollVelocity) > 4) return; var idx = hitTest(e.clientX, e.clientY); if (idx !== -1) { triggerExplosion(idx); } else if (explodedIndex !== -1) { closeExplosion(); } });
canvas.addEventListener("mousemove", function (e) { hoveredIndex = hitTest(e.clientX, e.clientY); canvas.style.cursor = hoveredIndex !== -1 ? "pointer" : "default"; });
function hitTest(mx, my) { var centerY = H / 2; for (var i = -2; i <= portfolioData.length + 2; i++) { var baseX = i * STEP - mod(scrollCurrent, TOTAL_W) + CENTER_X - TILE / 2; if (mx >= baseX && mx <= baseX + TILE && my >= centerY - TILE_H / 2 && my <= centerY + TILE_H / 2) { return mod(i, portfolioData.length); } } return -1; }
canvas.setAttribute("tabindex", "0");
canvas.style.pointerEvents = "auto";
canvas.setAttribute("role", "group");
canvas.setAttribute("aria-label", "Galería de portafolio — usa las flechas para navegar");
canvas.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { focusedIndex = mod(focusedIndex + 1, portfolioData.length); snapToIndex(focusedIndex); e.preventDefault(); } if (e.key === "ArrowLeft") { focusedIndex = mod(focusedIndex - 1, portfolioData.length); snapToIndex(focusedIndex); e.preventDefault(); } if (e.key === "Enter") { triggerExplosion(focusedIndex); } });
canvas.addEventListener("focus", showKbdHint);
function frame(timestamp) {
  var deltaTime = lastTime ? Math.min((timestamp - lastTime) / 16.667, 3) : 1;
  lastTime = timestamp;
  var lerpFactor = 1 - Math.pow(0.92, deltaTime);
  var prevCurrent = scrollCurrent;
  scrollCurrent += (scrollTarget - scrollCurrent) * lerpFactor;
  scrollVelocity = (scrollCurrent - prevCurrent) / deltaTime;
  var targetIntensity = Math.min(Math.abs(scrollVelocity) * 2.8, 1.0);
  waveIntensity += (targetIntensity - waveIntensity) * (targetIntensity > waveIntensity ? 0.35 : 0.08);
  var centeredIndex = mod(Math.round(scrollCurrent / STEP), portfolioData.length);
  syncActiveProject(centeredIndex);
  waveLineEl.style.opacity = "0";
  if (!gl || !glProgram) { requestAnimationFrame(frame); return; }
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var projection = buildOrthoProjection(W, H);
  gl.uniformMatrix4fv(glLocations.uProjection, false, projection);
  gl.uniform3fv(glLocations.uColorPaper, paletteVec3.paper);
  gl.uniform3fv(glLocations.uActiveAccent, activeAccentVec3);
  var waveCenterX = W / 2 - mod(scrollCurrent, STEP) + STEP / 2;
  gl.uniform1f(glLocations.uWaveCenterX, waveCenterX);
  gl.uniform1f(glLocations.uWaveStrength, 0.0);
  gl.uniform1f(glLocations.uWaveWidth, STEP * FOCUS_FALLOFF_WIDTH_FACTOR);
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(glLocations.aPosition);
  gl.vertexAttribPointer(glLocations.aPosition, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(glLocations.aUv);
  gl.vertexAttribPointer(glLocations.aUv, 2, gl.FLOAT, false, 16, 8);
  var centerY = H / 2;
  var visibleStart = Math.floor((mod(scrollCurrent, TOTAL_W) - CENTER_X) / STEP) - 1;
  var visibleEnd = visibleStart + Math.ceil(W / STEP) + 3;
  var activeMetaIndex = -1;
  var activeMetaX = 0, activeMetaY = 0;
  var exploding = explodedIndex !== -1;
  var progress = explosionState.progress;
  var n = portfolioData.length;
  for (var i = visibleStart; i <= visibleEnd; i++) {
    var idx = mod(i, n);
    var baseX = i * STEP - mod(scrollCurrent, TOTAL_W) + CENTER_X - TILE / 2;
    var isActive = idx === hoveredIndex || idx === focusedIndex;
    var tileOffsetX = baseX + TILE / 2;
    var tileScale = TILE;
    var tileAlpha = 1;
    var tileExplosionUniform = 0;
    if (exploding) {
      var rel = idx - explodedIndex;
      if (rel > n / 2) rel -= n;
      if (rel < -n / 2) rel += n;
      var targetOffsetX, targetScale, targetAlpha;
      if (rel === 0) {
        targetOffsetX = W / 2;
        var maxW = W * 0.78;
        var maxH = H * 0.88 * TILE_ASPECT;
        targetScale = Math.min(maxW, maxH);
        targetAlpha = 1;
      } else if (rel === -1) {
        targetOffsetX = TILE * 0.5 + 32;
        targetScale = TILE;
        targetAlpha = 1;
      } else if (rel === 1) {
        targetOffsetX = W - TILE * 0.5 - 32;
        targetScale = TILE;
        targetAlpha = 1;
      } else {
        targetOffsetX = tileOffsetX;
        targetScale = TILE;
        targetAlpha = 0;
      }
      tileOffsetX += (targetOffsetX - tileOffsetX) * progress;
      tileScale += (targetScale - tileScale) * progress;
      tileAlpha = 1 - progress * (1 - targetAlpha);
      tileExplosionUniform = rel === 0 ? progress : 0;
    }
    var tileScaleX, tileScaleY;
    if (exploding) {
      tileScaleX = tileScale;
      tileScaleY = tileScale / TILE_ASPECT;
    } else {
      tileScaleX = TILE;
      tileScaleY = TILE_H;
      tileAlpha = 1.0;
    }
    var hoverReveal = (idx === hoveredIndex && !exploding) ? 1.0 : 0.0;
    gl.uniform2f(glLocations.uTileOffset, tileOffsetX, centerY);
    gl.uniform2f(glLocations.uTileScale, tileScaleX, tileScaleY);
    gl.uniform1f(glLocations.uHighlight, isActive ? 1.0 : 0.0);
    gl.uniform1f(glLocations.uHoverReveal, hoverReveal);
    gl.uniform1f(glLocations.uExplosion, tileExplosionUniform);
    gl.uniform1f(glLocations.uAlpha, tileAlpha);
    var distFromCenter = tileOffsetX - W / 2;
    var parallax = (distFromCenter / W) * 0.4;
    gl.uniform1f(glLocations.uParallaxOffset, parallax);
    var distNorm = Math.abs(tileOffsetX - W / 2) / (W / 2);
    var proximityColor = Math.max(0, 1.0 - distNorm * 1.8);
    var finalReveal = Math.max(proximityColor * 0.3, waveIntensity * (1.0 - distNorm * 0.6));
    gl.uniform1f(glLocations.uWaveIntensity, Math.min(finalReveal, 1.0));
    gl.uniform2fv(glLocations.uImageAspectCorrection, imageAspectCorrections[idx]);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glTextures[idx]);
    gl.uniform1i(glLocations.uImage, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (isActive && !exploding) {
      activeMetaIndex = idx;
      activeMetaX = baseX;
      activeMetaY = centerY;
    }
  }
  if (activeMetaIndex !== -1) {
    metaEl.style.opacity = "1";
    metaEl.style.left = activeMetaX + "px";
    metaEl.style.top = (activeMetaY - TILE_H / 2 - 22) + "px";
    metaEl.textContent = portfolioData[activeMetaIndex].caption + " · " + portfolioData[activeMetaIndex].skill;
  } else {
    metaEl.style.opacity = "0";
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.getElementById("n0").addEventListener("click", function () {
  if (explodedIndex !== -1) closeExplosion();
  document.getElementById("about-panel").classList.remove("open");
  focusedIndex = 0;
  hoveredIndex = -1;
  scrollTarget = 0;
  canvas.focus();
});
document.getElementById("about-btn").addEventListener("click", function () {
  document.getElementById("about-panel").classList.add("open");
  document.getElementById("about-close").focus();
});
document.getElementById("about-close").addEventListener("click", function () {
  document.getElementById("about-panel").classList.remove("open");
});
document.getElementById("about-panel").addEventListener("click", function (e) {
  if (e.target === document.getElementById("about-panel")) document.getElementById("about-panel").classList.remove("open");
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (document.getElementById("about-panel").classList.contains("open")) {
      e.preventDefault();
      document.getElementById("about-panel").classList.remove("open");
      return;
    }
    if (explodedIndex !== -1) closeExplosion();
  }
});
