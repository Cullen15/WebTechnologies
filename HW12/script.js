const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const music = document.getElementById("bgMusic");
const playButton = document.getElementById("playMusic");

playButton.addEventListener("click", function () {
  music.play();
});

let bgColor = "white";
let collisionTimer = 0;

class Box {
  constructor(x, y, width, height, color, speedX = 0, speedY = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.baseWidth = width;
    this.baseHeight = height;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  keepInBounds() {
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
  }

  bounceInBounds() {
    if (this.x < 0 || this.x + this.width > canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y + this.height > canvas.height) {
      this.speedY *= -1;
    }

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
  }

  resetSize() {
    this.width = this.baseWidth;
    this.height = this.baseHeight;
  }

  grow() {
    this.width = this.baseWidth + 15;
    this.height = this.baseHeight + 15;
  }
}

const player = new Box(100, 100, 60, 60, "blue");
const enemy = new Box(500, 300, 60, 60, "red", 3, 2);

const keys = {};

document.addEventListener("keydown", function (e) {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (e) {
  keys[e.key.toLowerCase()] = false;
});

function movePlayer() {
  const speed = 4;

  if (keys["w"] || keys["arrowup"]) {
    player.y -= speed;
  }
  if (keys["s"] || keys["arrowdown"]) {
    player.y += speed;
  }
  if (keys["a"] || keys["arrowleft"]) {
    player.x -= speed;
  }
  if (keys["d"] || keys["arrowright"]) {
    player.x += speed;
  }

  player.keepInBounds();
}

function hasCollided(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function handleCollision() {
  if (hasCollided(player, enemy)) {
    bgColor = "lightyellow";
    player.grow();
    enemy.grow();
    collisionTimer = 15;
  }

  if (collisionTimer > 0) {
    collisionTimer--;
  } else {
    bgColor = "white";
    player.resetSize();
    enemy.resetSize();
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  movePlayer();

  enemy.move();
  enemy.bounceInBounds();

  handleCollision();

  player.draw();
  enemy.draw();
}

setInterval(update, 1000 / 60);