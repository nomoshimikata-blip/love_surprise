// Scene switching with fade
function goToScene(num) {
  const current = document.querySelector(".scene.active");
  if (current) current.classList.remove("active");
  const next = document.getElementById("scene" + num);
  setTimeout(() => next.classList.add("active"), 100);

  if (num === 2) startFireworks();
  if (num === 4) {
    startConfetti();
    playMusic();
  }
}

/* --- Background Music --- */
function playMusic() {
  const music = document.getElementById("bg-music");
  music.volume = 0.5;
  music.play().catch(() => {
    console.log("Autoplay blocked — will start after user clicks.");
  });
}

/* --- Fireworks --- */
function startFireworks() {
  const canvas = document.getElementById("fireworks");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createFirework(x, y) {
    const count = 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: random(-3, 3),
        vy: random(-3, 3),
        alpha: 1,
        color: `hsl(${random(0, 360)},100%,50%)`
      });
    }
  }

  function loop() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.01;
      if (p.alpha <= 0) particles.splice(i, 1);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (Math.random() < 0.05) {
      createFirework(random(100, canvas.width - 100), random(100, canvas.height - 100));
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  loop();
}

/* --- Confetti --- */
function startConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let confetti = [];
  for (let i = 0; i < 200; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 200,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      tilt: Math.random() * 10 - 10
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
      ctx.stroke();
    });
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    confetti.forEach(c => {
      c.y += Math.cos(c.d) + 1 + c.r / 2;
      c.x += Math.sin(c.d);
      if (c.y > canvas.height) {
        c.x = Math.random() * canvas.width;
        c.y = -10;
      }
    });
  }

  draw();
}
