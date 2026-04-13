const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let obstacles = [];
let collectibles = [];
let score = 0;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

class Player {
  constructor(x, y, width, height, color, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    let newX = this.x;
    let newY = this.y;

    if (keys.ArrowUp) newY -= this.speed;
    if (keys.ArrowDown) newY += this.speed;
    if (keys.ArrowLeft) newX -= this.speed;
    if (keys.ArrowRight) newX += this.speed;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + this.width > canvas.width) newX = canvas.width - this.width;
    if (newY + this.height > canvas.height) newY = canvas.height - this.height;

    let blocked = false;

    for (let obstacle of obstacles) {
      if (hasCollidedBox(newX, newY, this.width, this.height, obstacle)) {
        blocked = true;
        break;
      }
    }

    if (!blocked) {
      this.x = newX;
      this.y = newY;
    }
  }
}

class Obstacle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Collectible {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.active = true;
  }

  draw() {
    if (this.active) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

const player = new Player(30, 30, 30, 30, "blue", 3);

function hasCollided(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

function hasCollidedBox(x, y, width, height, obj2) {
  return (
    x < obj2.x + obj2.width &&
    x + width > obj2.x &&
    y < obj2.y + obj2.height &&
    y + height > obj2.y
  );
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

function checkCollectibles() {
  collectibles.forEach((item) => {
    if (item.active && hasCollided(player, item)) {
      item.active = false;
      score++;
    }
  });
}

function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  obstacles.forEach((obstacle) => obstacle.draw());
  collectibles.forEach((item) => item.draw());

  player.draw();
  drawScore();
}

function update() {
  player.move();
  checkCollectibles();
  drawEverything();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

async function loadGameData() {
  const obstacleResponse = await fetch("obstacles.json");
  const obstacleData = await obstacleResponse.json();

  obstacles = obstacleData.map(
    (item) => new Obstacle(item.x, item.y, item.width, item.height, item.color)
  );

  const collectibleResponse = await fetch("collectibles.json");
  const collectibleData = await collectibleResponse.json();

  collectibles = collectibleData.map(
    (item) => new Collectible(item.x, item.y, item.width, item.height, item.color)
  );

  update();
}

loadGameData();