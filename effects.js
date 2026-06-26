// effects.js — sandbox de experimentos de animación, separado de app.js
// Pensado para probar efectos de texto en el hover del logo (#n0) con GSAP / Animate.css

var logoEl = document.getElementById("n0");

if (logoEl && window.gsap) {
  logoEl.addEventListener("mouseenter", function () {
    // gsap.to(logoEl, { ... });
  });

  logoEl.addEventListener("mouseleave", function () {
    // gsap.to(logoEl, { ... });
  });
}
