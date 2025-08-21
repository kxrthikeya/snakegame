const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
const musicToggleBtn = document.getElementById("musicToggleBtn");

// All our sound elements
const eatSound = document.getElementById("eatSound");
const bgMusic = document.getElementById("bgMusic");
const gameOverSound = document.getElementById("gameOverSound");

let snake;
let direction;
let food;
let score;
let game;
let musicOn = true;

// Function to start or restart the game
function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  generateFood();
  score = 0;
  document.getElementById("score").textContent = "Score: " + score;
   updateMusicBtn();

  if (bgMusic) {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  if (musicOn) {
    bgMusic.play();
  }
}

  
  // Reset and pause music
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  if (game) clearInterval(game);
  game = setInterval(draw, 120);
}
function toggleMusic() {
  musicOn = !musicOn;
  if (!musicOn) {
    if (bgMusic) bgMusic.pause();
  } else {
    if (bgMusic) bgMusic.play();
  }
  updateMusicBtn();
}

function updateMusicBtn() {
  if (musicToggleBtn) {
    musicToggleBtn.textContent = musicOn ? "Music: On" : "Music: Off";
  }
}


// Generate food at a location not on the snake
function generateFood() {
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      generateFood();
      return;
    }
  }
}

  // Swipe controls
let startX, startY;

document.addEventListener("touchstart", function(e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, false);

//swipe handler

document.addEventListener("touchend", function(e) {
  let endX = e.changedTouches[0].clientX;
  let endY = e.changedTouches[0].clientY;

  let dxSwipe = endX - startX;
  let dySwipe = endY - startY;

  if (direction === null && bgMusic && bgMusic.paused && musicOn) {
    bgMusic.play(); // start music on first swipe
  }

  if (Math.abs(dxSwipe) > Math.abs(dySwipe)) {
    if (dxSwipe > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dxSwipe < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dySwipe > 0 && direction !== "UP") direction = "DOWN";
    else if (dySwipe < 0 && direction !== "DOWN") direction = "UP";
  }
}, false);





// Button controls

  function move(dir) {
  if (direction === null && bgMusic && bgMusic.paused && musicOn) {
    bgMusic.play(); // start music on first tap
  }

  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  else if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}
// keyword controls
document.addEventListener("keydown", function(event) {
  if (direction === null && bgMusic && bgMusic.paused && musicOn) {
    bgMusic.play(); // start music at first key press
  }

  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Main game loop
function draw() {
  if (!direction) {
    drawInitialState();
    return;
  }

  let head = { x: snake[0].x, y: snake[0].y };

  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Check for game over
  if (
    head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    if (bgMusic) bgMusic.pause(); // Stop the background music
    if (gameOverSound) gameOverSound.play(); // Play the dangerous sound
    ctx.fillStyle = "#c02626";
    ctx.font = "32px Arial";
    ctx.fillText("Game Over!", 110, 210);
    return;
  }

  // Check if snake eats food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    if (eatSound) eatSound.play();
    generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);
  drawAll();
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function drawAll() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#22c55e" : "#a7f3d0";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
  ctx.fillStyle = "#f59e42";
  ctx.fillRect(food.x, food.y, box, box);
}

function drawInitialState() {
  drawAll();
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Press an arrow key to start!", 75, 210);
}

function restartGame() {
  initGame();
}

initGame();
