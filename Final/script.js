const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const levelText = document.getElementById("levelText");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

let levels = [];
let currentLevel = 0;
let score = 0;
let gameStarted = false;
let gameWon = false;

let player;
let walls = [];
let coins = [];
let hazards = [];

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.color = "#2f80ed";
    this.speed = 4;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.fillRect(this.x + 8, this.y + 8, 5, 5);
    ctx.fillRect(this.x + 18, this.y + 8, 5, 5);
  }

  move() {
    let newX = this.x;
    let newY = this.y;

    if (keys.ArrowUp || keys.w) newY -= this.speed;
    if (keys.ArrowDown || keys.s) newY += this.speed;
    if (keys.ArrowLeft || keys.a) newX -= this.speed;
    if (keys.ArrowRight || keys.d) newX += this.speed;

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX + this.width > canvas.width) newX = canvas.width - this.width;
    if (newY + this.height > canvas.height) newY = canvas.height - this.height;

    let blocked = false;

    for (let wall of walls) {
      if (boxCollision({ x: newX, y: newY, width: this.width, height: this.height }, wall)) {
        blocked = true;
      }
    }

    if (!blocked) {
      this.x = newX;
      this.y = newY;
    }
  }
}

class Wall {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = "#5b4636";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 22;
    this.height = 22;
    this.collected = false;
  }

  draw() {
    if (this.collected) return;

    ctx.fillStyle = "#f2c94c";
    ctx.beginPath();
    ctx.arc(this.x + 11, this.y + 11, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fff2a8";
    ctx.beginPath();
    ctx.arc(this.x + 8, this.y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Hazard {
  constructor(x, y, width, height, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = "#d62828";
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#7a1111";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y + 5);
    ctx.lineTo(this.x + this.width - 5, this.y + this.height - 5);
    ctx.lineTo(this.x + 5, this.y + this.height - 5);
    ctx.closePath();
    ctx.fill();
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x + this.width > canvas.width) {
      this.speedX *= -1;
    }

    if (this.y < 0 || this.y + this.height > canvas.height) {
      this.speedY *= -1;
    }

    for (let wall of walls) {
      if (boxCollision(this, wall)) {
        this.speedX *= -1;
        this.speedY *= -1;
      }
    }
  }
}

function boxCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function loadLevel(levelNumber) {
  const level = levels[levelNumber];

  player = new Player(level.playerStart.x, level.playerStart.y);

  walls = [];
  coins = [];
  hazards = [];

  level.walls.forEach(function (wall) {
    walls.push(new Wall(wall.x, wall.y, wall.width, wall.height));
  });

  level.coins.forEach(function (coin) {
    coins.push(new Coin(coin.x, coin.y));
  });

  level.hazards.forEach(function (hazard) {
    hazards.push(new Hazard(hazard.x, hazard.y, hazard.width, hazard.height, hazard.speedX, hazard.speedY));
  });

  levelText.textContent = "Level: " + (currentLevel + 1);
  message.textContent = "Collect all the treasure!";
}

function checkCoins() {
  coins.forEach(function (coin) {
    if (!coin.collected && boxCollision(player, coin)) {
      coin.collected = true;
      score += 10;
      scoreText.textContent = "Score: " + score;
    }
  });

  const allCollected = coins.every(function (coin) {
    return coin.collected;
  });

  if (allCollected) {
    nextLevel();
  }
}

function checkHazards() {
  hazards.forEach(function (hazard) {
    if (boxCollision(player, hazard)) {
      score = Math.max(0, score - 10);
      scoreText.textContent = "Score: " + score;

      const level = levels[currentLevel];
      player.x = level.playerStart.x;
      player.y = level.playerStart.y;

      message.textContent = "You hit a hazard! Try again.";
    }
  });
}

function nextLevel() {
  currentLevel++;

  if (currentLevel >= levels.length) {
    gameWon = true;
    message.textContent = "You won Treasure Runner!";
  } else {
    loadLevel(currentLevel);
  }
}

function drawBackground() {
  ctx.fillStyle = "#f5f0df";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.fillRect(i, 0, 2, canvas.height);
  }
}

function drawGame() {
  drawBackground();

  walls.forEach(function (wall) {
    wall.draw();
  });

  coins.forEach(function (coin) {
    coin.draw();
  });

  hazards.forEach(function (hazard) {
    hazard.draw();
  });

  player.draw();

  if (gameWon) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "42px Arial";
    ctx.fillText("You Won!", 310, 230);

    ctx.font = "24px Arial";
    ctx.fillText("Final Score: " + score, 315, 270);
  }
}

function update() {
  if (gameStarted && !gameWon) {
    player.move();

    hazards.forEach(function (hazard) {
      hazard.move();
    });

    checkCoins();
    checkHazards();
  }

  drawGame();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", function (event) {
  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
});

startButton.addEventListener("click", function () {
  gameStarted = true;
  message.textContent = "Game started!";
});

restartButton.addEventListener("click", function () {
  score = 0;
  currentLevel = 0;
  gameStarted = false;
  gameWon = false;
  scoreText.textContent = "Score: 0";
  loadLevel(currentLevel);
  message.textContent = "Press Start to play.";
});

fetch("levels.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    levels = data;
    loadLevel(currentLevel);
    update();
  });