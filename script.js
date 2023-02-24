var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var boxSize = 10;
var direction;
var snake;
var dot;
var score;
var highestScore = localStorage.getItem("highestScore") || 0;
document.getElementById("highestscore").innerHTML = highestScore;
var gameInterval;
var difficulty,value_difficulty;
var pausedGame=false;

function createSnake() {
  var length = 5;
  snake = [];
  for (var i = length - 1; i >= 0; i--) {
    snake.push({ x: i, y: 0 });
  }
}
function createDot() {
  dot = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)),
    y: Math.floor(Math.random() * (canvas.height / boxSize)),
  };
}
function drawSnake() {
  for (var i = 0; i < snake.length; i++) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(snake[i].x * boxSize, snake[i].y * boxSize, boxSize, boxSize);
  }
}
function drawDot() {
  ctx.fillStyle = "#f00";
  ctx.fillRect(dot.x * boxSize, dot.y * boxSize, boxSize, boxSize);
}
function moveSnake() {
  var head = {
    x: snake[0].x,
    y: snake[0].y,
  };
  switch (direction) {
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++;
      break;
  }
  if (
    head.x < 0 ||
    head.x * boxSize >= canvas.width ||
    head.y < 0 ||
    head.y * boxSize >= canvas.height
  ) {
    endGame();
    return;
  }
  for (var i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      endGame();
      return;
    }
  }
  snake.unshift(head);
  if (head.x == dot.x && head.y == dot.y) {
    score++;
    if (score > highestScore) {
      highestScore = score;
      localStorage.setItem("highestScore", highestScore);
    }
    document.getElementById("score").innerHTML = score;
    document.getElementById("highestscore").innerHTML = highestScore;
    createDot();
    if(difficulty=="auto"){
      clearInterval(gameInterval);
      value_difficulty=value_difficulty-1;
      gameInterval = setInterval(moveSnake, value_difficulty);
      console.log(value_difficulty);
    }
  } else {
    snake.pop();
  }
  draw();
}
function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSnake();
  drawDot();
}
function startGame() {
  difficulty = document.getElementsByName("difficulty");
  for (var item of difficulty){
    if (item.checked) {
      difficulty=item.value;
    }
  }
  value_difficulty = difficulty == "baja" ? 150 : difficulty == "media" ? 100 : difficulty == "alta" ? 50 : difficulty == "auto" ? 150 : 150;
  clearInterval(gameInterval);
  createSnake();
  createDot();
  direction = "right";
  score = 0;
  gameInterval = setInterval(moveSnake, value_difficulty);
  document.getElementById("score").innerHTML = score;
  document.getElementById("highestscore").innerHTML = highestScore;
  draw();
}
function endGame() {
  clearInterval(gameInterval);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", 100, 200);
}
function restartGame() {
  score=0;
  document.getElementById("restart").style.display = "block";
  endGame();
  startGame();
}
function pauseGame() {
  if(pausedGame==true){
    pausedGame=false;
    gameInterval = setInterval(moveSnake, difficulty);
  }
  else{
    pausedGame=true;
    clearInterval(gameInterval); 
  }
}
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37 || e.keyCode == 65) {
    if (direction != "right") {
      direction = "left";
    }
  } else if (e.keyCode == 38 || e.keyCode == 87) {
    if (direction != "down") {
      direction = "up";
    }
  } else if (e.keyCode == 39 || e.keyCode == 68) {
    if (direction != "left") {
      direction = "right";
    }
  } else if (e.keyCode == 40 || e.keyCode == 83) {
    if (direction != "up") {
      direction = "down";
    }
  }
});
document.getElementById("restart").addEventListener("click", restartGame);
document.getElementById("stop").addEventListener("click", endGame);
//document.getElementById("pause").addEventListener("click", pauseGame);