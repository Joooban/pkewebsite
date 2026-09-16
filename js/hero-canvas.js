/* PKE — hero background: rising embers, canvas + simple sine-wave drift */
(function () {
  "use strict";

  var canvas = document.querySelector("[data-hero-canvas]");
  if (!canvas || !canvas.getContext) return;

  var hero = canvas.closest(".hero");
  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var COLORS = [
    [225, 31, 38], // brand red
    [255, 159, 28], // amber
    [255, 255, 255] // soft white spark
  ];

  var particles = [];
  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var rafId = null;
  var running = false;
  var lastT = 0;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeParticle(spawnAnywhere) {
    var color = COLORS[(Math.random() * COLORS.length) | 0];
    return {
      originX: rand(0, width),
      y: spawnAnywhere ? rand(0, height) : height + rand(10, 80),
      r: rand(1, 2.6),
      speed: rand(8, 22), // px per second, upward
      swayAmp: rand(6, 26),
      swayFreq: rand(0.25, 0.6), // radians per second
      phase: rand(0, Math.PI * 2),
      pulseFreq: rand(0.6, 1.4),
      color: color,
      alphaBase: rand(0.35, 0.85)
    };
  }

  function resize() {
    var rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var targetCount = Math.min(70, Math.max(24, Math.round((width * height) / 16000)));
    if (particles.length === 0) {
      for (var i = 0; i < targetCount; i++) particles.push(makeParticle(true));
    } else if (particles.length < targetCount) {
      while (particles.length < targetCount) particles.push(makeParticle(true));
    } else if (particles.length > targetCount) {
      particles.length = targetCount;
    }
  }

  function drawFrame(tSeconds) {
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var x = p.originX + Math.sin(tSeconds * p.swayFreq + p.phase) * p.swayAmp;
      var edgeFade = 1;
      if (p.y > height - 60) edgeFade = Math.max(0, (height - p.y) / 60);
      if (p.y < 60) edgeFade = Math.min(edgeFade, Math.max(0, p.y / 60));
      var twinkle = 0.75 + 0.25 * Math.sin(tSeconds * p.pulseFreq + p.phase);
      var alpha = p.alphaBase * edgeFade * twinkle;
      if (alpha <= 0.01) continue;

      var c = p.color;
      var rgb = c[0] + "," + c[1] + "," + c[2];

      ctx.beginPath();
      ctx.fillStyle = "rgba(" + rgb + "," + (alpha * 0.16).toFixed(3) + ")";
      ctx.arc(x, p.y, p.r * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
      ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step(tMs) {
    if (!running) return;
    var dt = lastT ? (tMs - lastT) / 1000 : 0;
    lastT = tMs;
    dt = Math.min(dt, 0.05); // guard against big jumps (tab switches)

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y -= p.speed * dt;
      if (p.y < -20) {
        var np = makeParticle(false);
        particles[i] = np;
      }
    }
    drawFrame(tMs / 1000);
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    lastT = 0;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  resize();

  if (reduceMotion) {
    drawFrame(0);
  } else {
    var isIntersecting = true;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            isIntersecting = entry.isIntersecting;
            if (isIntersecting && !document.hidden) start();
            else stop();
          });
        },
        { threshold: 0.01 }
      );
      io.observe(hero);
    } else {
      start();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden || !isIntersecting) stop();
      else start();
    });
  }

  var resizeTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
        if (reduceMotion) drawFrame(0);
      }, 150);
    },
    { passive: true }
  );
})();
