var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy, boy_running, boy_collided;
var obstacles, obstaclesImg;

var backgroundImg;

var score = 0;

var jumpSound, collidedSound;

var gameOver, restart;

var obstacle, obstacle1, obstacle2, obstacle3, obstaclesGroup;

var gameOverImg, gameOver;

var restart, restartImg;

var ground, groundImage, invisibleGround;

var gameState = PLAY;

function preload() {
  backgroundImg = loadImage("carretera.png");

  boy_running = loadAnimation(
    "boy.png",
    "boy2.png",
    "boy3.png",
    "boy4.png",
    "boy5.png",
    "boy6.png",
    "boy7.png"
  );
  boy_collided = loadAnimation("boy_collided.png");

  groundImage = loadImage("ground.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  boy = createSprite(50, height - 70, 20, 50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.setCollider("circle", 0, 0, 350);
  boy.scale = 0.08;
  boy.debug = true;

  ground = createSprite(width / 2, height, width, 2);
  ground.addImage("ground", groundImage);
  ground.x = width / 2;
  ground.velocityX = -(6 + (3 * score) / 100);

  gameOver = createSprite(width / 2, height / 2 - 50);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width / 2, height / 2);
  restart.addImage(restartImg);
  background(backgroundImg);
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  boy.debug = true;
  textSize(20);
  fill("black");
  text("Puntuación: " + score, 30, 50);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);
    ground.velocityX = -(6 + (3 * score) / 100);

    if ((touches.length > 0 || keyDown("SPACE")) && boy.y >= height - 120) {
      jumpSound.play();
      boy.velocityY = -10;
      touches = [];
    }

    boy.velocityY = boy.velocityY + 0.8;

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    boy.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();

    if (obstaclesGroup.isTouching(boy)) {
      collidedSound.play();
      gameState = END;
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);

    boy.changeAnimation("collided", boy_collided);

    obstaclesGroup.setLifetimeEach(-1);

    if (touches.length > 0 || keyDown("SPACE")) {
      reset();
      touches = [];
    }
  }

  drawSprites();
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, height - 95, 20, 30);
    obstacle.setCollider("circle", 0, 0, 45);
    obstacle.debug = true;

    obstacle.velocityX = -(6 + (3 * score) / 100);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      default:
        break;
    }

    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    boy.depth += 1;
    obstaclesGroup.add(obstacle);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();

  boy.changeAnimation("running", boy_running);

  score = 0;
}
