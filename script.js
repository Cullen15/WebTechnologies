// Features added:
// 1. Spacebar jump
// 2. Individual star gravity
// 3. Bomb hazards
// 4. Different collectibles with different values
// 5. Level system + extra platforms

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;
let spaceKey;
let stars;
let specialStars;
let bombs;
let score = 0;
let scoreText;
let level = 1;
let levelText;

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");

  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  this.add.image(400, 300, "sky");

  platforms = this.physics.add.staticGroup();

  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  scoreText = this.add.text(16, 16, "Score: 0", {
    fontSize: "24px",
    fill: "#000"
  });

  levelText = this.add.text(16, 46, "Level: 1", {
    fontSize: "24px",
    fill: "#000"
  });

  buildLevel.call(this);

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(specialStars, platforms);
  this.physics.add.collider(bombs, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);
  this.physics.add.overlap(player, specialStars, collectSpecialStar, null, this);
  this.physics.add.overlap(player, bombs, hitBomb, null, this);
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  // spacebar jump
  if (spaceKey.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function buildLevel() {
  platforms.clear(true, true);

  // base platforms
  platforms.create(400, 568, "ground").setScale(2).refreshBody();
  platforms.create(600, 400, "ground");
  platforms.create(50, 250, "ground");
  platforms.create(750, 220, "ground");

  // extra platforms 
  if (level >= 2) {
    platforms.create(400, 320, "ground");
  }

  if (level >= 3) {
    platforms.create(200, 150, "ground");
    platforms.create(650, 120, "ground");
  }

  createStars.call(this);
  createSpecialStars.call(this);
  createBombs.call(this);
}

function createStars() {
  if (stars) {
    stars.clear(true, true);
  }

  stars = this.physics.add.group({
    key: "star",
    repeat: 7,
    setXY: { x: 12, y: 0, stepX: 100 }
  });

  // each star get different gravity
  stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.3, 0.8));
    child.setGravityY(Phaser.Math.Between(30, 180));
  });
}

function createSpecialStars() {
  if (specialStars) {
    specialStars.clear(true, true);
  }

  specialStars = this.physics.add.group();

  let special1 = specialStars.create(150, 0, "star");
  special1.setTint(0x00ffff);
  special1.setScale(0.8);
  special1.setBounceY(Phaser.Math.FloatBetween(0.3, 0.7));
  special1.setGravityY(120);

  if (level >= 2) {
    let special2 = specialStars.create(700, 0, "star");
    special2.setTint(0xff66cc);
    special2.setScale(0.8);
    special2.setBounceY(Phaser.Math.FloatBetween(0.3, 0.7));
    special2.setGravityY(160);
  }
}

function createBombs() {
  if (bombs) {
    bombs.clear(true, true);
  }

  bombs = this.physics.add.group();

  let bomb1 = bombs.create(300, 16, "bomb");
  bomb1.setBounce(1);
  bomb1.setCollideWorldBounds(true);
  bomb1.setVelocity(Phaser.Math.Between(-120, 120), 20);

  let bomb2 = bombs.create(500, 16, "bomb");
  bomb2.setBounce(1);
  bomb2.setCollideWorldBounds(true);
  bomb2.setVelocity(Phaser.Math.Between(-120, 120), 20);

  if (level >= 2) {
    let bomb3 = bombs.create(650, 16, "bomb");
    bomb3.setBounce(1);
    bomb3.setCollideWorldBounds(true);
    bomb3.setVelocity(Phaser.Math.Between(-150, 150), 20);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);
  checkLevelComplete.call(this);
}

function collectSpecialStar(player, star) {
  star.disableBody(true, true);
  score += 25;
  scoreText.setText("Score: " + score);
  checkLevelComplete.call(this);
}

function hitBomb(player, bomb) {
  score = Math.max(0, score - 10);
  scoreText.setText("Score: " + score);

  player.setTint(0xff0000);

  this.time.delayedCall(200, () => {
    player.clearTint();
    player.setPosition(100, 450);
    player.setVelocity(0, 0);
  });
}

function checkLevelComplete() {
  const normalStarsLeft = stars.countActive(true);
  const specialStarsLeft = specialStars.countActive(true);

  if (normalStarsLeft === 0 && specialStarsLeft === 0) {
    level++;
    levelText.setText("Level: " + level);

    buildLevel.call(this);

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(specialStars, platforms);
    this.physics.add.collider(bombs, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, specialStars, collectSpecialStar, null, this);
    this.physics.add.overlap(player, bombs, hitBomb, null, this);

    player.setPosition(100, 450);
    player.setVelocity(0, 0);
  }
}