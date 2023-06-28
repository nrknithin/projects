const canvas = document.querySelector("#particleCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

// mouse
let mouse = {
  x: null,
  y: null,
  radius: 150
};
const mouseMoveFn = event => {
  mouse.x = event.x + canvas.clientLeft / 2;
  mouse.y = event.y + canvas.clientTop / 2;
};

window.addEventListener("mousemove", mouseMoveFn);

const drawImage = () => {
  let imageWidth = png.width;
  let imageHeight = png.height;

  const data = ctx.getImageData(0, 0, imageWidth, imageHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  class Particle {
    constructor(x, y, color, size) {
      this.x = x + canvas.width / 2 - png.width * 2;
      this.y = y + canvas.height / 2 - png.height * 2;
      this.color = color;
      this.size = size;
      this.baseX = x + canvas.width / 2 - png.width * 2;
      this.baseY = y + canvas.height / 2 - png.height * 2;
      this.density = Math.random() * 10 + 1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      ctx.fillStyle = this.color;
      // collision detection
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;

      // max distance, past that the force will be 0
      const maxDistance = 150;
      let force = (maxDistance - distance) / maxDistance;
      if (force < 0) force = 0;
      let directionX = forceDirectionX * force * this.density * 0.6;
      let directionY = forceDirectionY * force * this.density * 0.6;
      if (distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 20;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 20;
        }
      }
      this.draw();
    }
  }
  function init() {
    particleArray = [];
    for (let y = 0, y2 = data.height; y < y2; y++) {
      for (let x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[y * 4 * data.width + x * 4 + 3] > 128) {
          let positionX = x;
          let positionY = y;
          let color =
            "rgb(" +
            data.data[y * 4 * data.width + x * 4] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 1] +
            "," +
            data.data[y * 4 * data.width + x * 4 + 2] +
            ")";
          particleArray.push(new Particle(positionX * 4, positionY * 4, color, 2));
        }
      }
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0,.05)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();
  window.addEventListener("resize", function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  });
};
const png = new Image();

png.src =
  "data:image/png;base64,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";

const loadPage = event => {
  console.log("page Loaded");
  ctx.drawImage(png, 0, 0);
  drawImage();
};
window.addEventListener("load", loadPage);
