// Selecionando o canvas e seu contexto
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Definindo o tamanho do canvas
let gridSize = 20;
let tileCountX, tileCountY;

// Inicializando as variáveis do jogo
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let xVelocity = 0;
let yVelocity = 0;
let score = 0;
let highScore = 0;
let interval;

// Função para atualizar o tamanho do canvas
function updateCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  tileCountX = Math.floor(canvas.width / gridSize);
  tileCountY = Math.floor(canvas.height / gridSize);
}

// Função para iniciar o jogo
function startGame() {
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);

  interval = setInterval(moveSnake, 100); // Game Loop
}

// Função para movimentar a cobra
function moveSnake() {
  const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };

  // Verificando se a cobra atingiu as bordas
  if (head.x < 0) {
    head.x = tileCountX - 1;
  } else if (head.x >= tileCountX) {
    head.x = 0;
  }
  if (head.y < 0) {
    head.y = tileCountY - 1;
  } else if (head.y >= tileCountY) {
    head.y = 0;
  }

  snake.unshift(head);

  // Verificando se a cobra comeu a maçã
  if (head.x === apple.x && head.y === apple.y) {
    score++;
    generateApple();
    // Não remover o último bloco da cobra para aumentar seu tamanho
  } else {
    snake.pop();
  }

  checkCollision();
  updateScore();
  drawGame();
}

function generateApple() {
  let newAppleX;
  let newAppleY;

  do {
    newAppleX = Math.floor(Math.random() * tileCountX);
    newAppleY = Math.floor(Math.random() * tileCountY);
  } while (isAppleOnSnake(newAppleX, newAppleY));

  apple = { x: newAppleX, y: newAppleY };
}

// Função para verificar se a maçã está fora dos limites do jogo
function isAppleOutsideGame(x, y) {
  return x < 0 || x >= tileCountX || y < 0 || y >= tileCountY || isAppleOnSnake(x, y);
}

// Função para verificar se a maçã está na posição da cobra
function isAppleOnSnake(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }
  return false;
}

// Restante do código do jogo...

// Função para desenhar o jogo no canvas
function drawGame() {
  // Limpar o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar a cobra
  ctx.fillStyle = 'green';
  snake.forEach(block => {
    ctx.fillRect(block.x * gridSize, block.y * gridSize, gridSize, gridSize);
  });

  // Desenhar a maçã
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

// Restante do código do jogo...

// Função para verificar colisões
function checkCollision() {
  const head = snake[0];

  // Verificar se a cabeça da cobra colide com alguma parte do corpo
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Verificar se a cobra atingiu as bordas do canvas
  if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
    gameOver();
  }
}

// Função para atualizar a pontuação na tela
function updateScore() {
  const currentScoreElement = document.getElementById('currentScore');
  currentScoreElement.textContent = score;

  const highScoreElement = document.getElementById('highScore');
  highScoreElement.textContent = highScore;
}

// Função para encerrar o jogo
function gameOver() {
  clearInterval(interval);
  if (score > highScore) {
    highScore = score;
  }
  alert('Game Over! Sua pontuação foi: ' + score);
  location.reload();
}

// Capturando eventos de teclado para controlar a direção da cobra
document.addEventListener('keydown', event => {
  // Definindo a direção da cobra com base nas teclas pressionadas (WASD ou setas)
  switch (event.keyCode) {
    case 37: // Tecla seta para a esquerda
    case 65: // Tecla A
      if (xVelocity !== 1) {
        xVelocity = -1;
        yVelocity = 0;
      }
      break;
    case 38: // Tecla seta para cima
    case 87: // Tecla W
      if (yVelocity !== 1) {
        xVelocity = 0;
        yVelocity = -1;
      }
      break;
    case 39: // Tecla seta para a direita
    case 68: // Tecla D
      if (xVelocity !== -1) {
        xVelocity = 1;
        yVelocity = 0;
      }
      break;
    case 40: // Tecla seta para baixo
    case 83: // Tecla S
      if (yVelocity !== -1) {
        xVelocity = 0;
        yVelocity = 1;
      }
      break;
  }
});

// Game Loop
window.addEventListener('DOMContentLoaded', startGame);

