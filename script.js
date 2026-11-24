const gridContainer = document.getElementById('gridContainer');
const levelDisplay = document.getElementById('levelDisplay');
const scoreDisplay = document.getElementById('scoreDisplay');
const iqDisplay = document.getElementById('iqDisplay');
const statusText = document.getElementById('statusText');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const overText = document.getElementById('overText');

let level = 1;
let score = 0;
let estimatedIQ = 100;
let sequence = [];
let userSequence = [];
let isDisplayingSequence = false;

// Create 3x3 Grid Cells
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell');
  cell.dataset.index = i;
  cell.addEventListener('click', handleCellClick);
  gridContainer.appendChild(cell);
}

const cells = document.querySelectorAll('.grid-cell');

function generateNextStep() {
  const nextIndex = Math.floor(Math.random() * 9);
  sequence.push(nextIndex);
}

async function playSequence() {
  isDisplayingSequence = true;
  userSequence = [];
  statusText.innerText = "Memorize the pattern...";

  for (let i = 0; i < sequence.length; i++) {
    await new Promise(resolve => setTimeout(resolve, Math.max(250, 600 - level * 20)));
    const cellIndex = sequence[i];
    cells[cellIndex].classList.add('active');
    await new Promise(resolve => setTimeout(resolve, Math.max(200, 500 - level * 15)));
    cells[cellIndex].classList.remove('active');
  }

  isDisplayingSequence = false;
  statusText.innerText = "Repeat the pattern!";
}

function handleCellClick(e) {
  if (isDisplayingSequence) return;

  const clickedIndex = parseInt(e.target.dataset.index);
  userSequence.push(clickedIndex);

  // Visual feedback on click
  e.target.classList.add('user-selected');
  setTimeout(() => e.target.classList.remove('user-selected'), 200);

  const currentStep = userSequence.length - 1;

  if (userSequence[currentStep] !== sequence[currentStep]) {
    endGame();
    return;
  }

  if (userSequence.length === sequence.length) {
    score += level * 150;
    level++;
    estimatedIQ = Math.min(160, 100 + Math.floor(level * 3.5));
    
    updateHUD();
    generateNextStep();
    setTimeout(playSequence, 800);
  }
}

function updateHUD() {
  levelDisplay.innerText = level;
  scoreDisplay.innerText = score;
  iqDisplay.innerText = estimatedIQ;
}

function startGame() {
  level = 1;
  score = 0;
  estimatedIQ = 100;
  sequence = [];
  userSequence = [];

  updateHUD();
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');

  generateNextStep();
  playSequence();
}

function endGame() {
  statusText.innerText = "Training complete!";
  overText.innerHTML = `Highest Level Reached: <b>${level}</b><br>Score: <b>${score}</b><br><br>Estimated Index: <b style="color:#00f0ff;">${estimatedIQ} IQ</b>`;
  gameOverScreen.classList.remove('hidden');
}