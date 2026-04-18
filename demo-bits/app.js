// ===== Constants =====
const STATES = ['', '0', '1'];
const VALUES = [0, 0, 1]; // empty→0, "0"→0, "1"→1

// ===== Levels =====
const LEVELS = [
  {
    targets: [
      [2, 3],
      [2, 4],
    ],
  },
  {
    targets: [
      [2, 3, 3, 2, 0],
      [2, 4, 3, 2, 2],
      [2, 2, 2, 2, 2],
    ],
  },
  {
    targets: [
      [2, 2, 2, 2, 2],
      [2, 2, 1, 2, 3],
      [3, 3, 2, 3, 3],
      [1, 2, 3, 3, 1],
      [1, 1, 1, 2, 1],
    ],
  },
];

// ===== DOM =====
const $grid = document.getElementById('$grid');
const $levelLabel = document.getElementById('$levelLabel');
const $winMessage = document.getElementById('$winMessage');

// ===== State =====
let currentLevel = 0;
let gridCols = 0;
let gridRows = 0;
let targets = [];
let cells = [];
let $$sumCells = [];

// ===== Init =====
function init() {
  loadLevel(currentLevel);
  bindEvents();
}

function loadLevel(index) {
  targets = LEVELS[index].targets;
  gridRows = targets.length + 1;
  gridCols = targets[0].length + 1;
  cells = Array.from({ length: gridRows * gridCols }, () => 0);
  $$sumCells = [];

  $grid.innerHTML = '';
  $grid.style.gridTemplateColumns = `repeat(${gridCols}, var(--size-cell))`;
  $grid.style.gridTemplateRows = `repeat(${gridRows}, var(--size-cell))`;

  $levelLabel.textContent = `Level ${index + 1} / ${LEVELS.length}`;
  $winMessage.hidden = true;

  buildGrid();
  buildSumCells();
}

function buildGrid() {
  for (let i = 0; i < cells.length; i++) {
    const $cell = document.createElement('div');
    $cell.className = 'cell';
    $cell.dataset.index = i;
    $grid.appendChild($cell);
  }
}

function buildSumCells() {
  for (let r = 0; r < gridRows - 1; r++) {
    for (let c = 0; c < gridCols - 1; c++) {
      const $sum = document.createElement('div');
      $sum.className = 'sum-cell';
      $sum.dataset.row = r;
      $sum.dataset.col = c;
      $sum.textContent = targets[r][c];
      $grid.appendChild($sum);
      $$sumCells.push($sum);
    }
  }
  positionSumCells();
}

function positionSumCells() {
  const $$cells = $grid.querySelectorAll('.cell');
  for (const $sum of $$sumCells) {
    const r = Number($sum.dataset.row);
    const c = Number($sum.dataset.col);
    // Get the 4 surrounding cell elements
    const topLeft = $$cells[r * gridCols + c];
    const bottomRight = $$cells[(r + 1) * gridCols + c + 1];

    // Position at the center of the 4 cells
    const rect1 = topLeft.getBoundingClientRect();
    const rect4 = bottomRight.getBoundingClientRect();
    const gridRect = $grid.getBoundingClientRect();

    const centerX = (rect1.right + rect4.left) / 2 - gridRect.left;
    const centerY = (rect1.bottom + rect4.top) / 2 - gridRect.top;

    const sumSize = $sum.offsetWidth;
    $sum.style.left = `${centerX - sumSize / 2}px`;
    $sum.style.top = `${centerY - sumSize / 2}px`;
  }
}

// ===== Events =====
function bindEvents() {
  $grid.addEventListener('click', (e) => {
    const $cell = e.target.closest('.cell');
    if (!$cell) return;

    const index = Number($cell.dataset.index);
    cells[index] = (cells[index] + 1) % STATES.length;
    renderCell($cell, cells[index]);
    updateSums(index);
    checkWin();
  });
}

// ===== Render =====
function renderCell($cell, stateIndex) {
  $cell.textContent = STATES[stateIndex];
  $cell.classList.remove('zero', 'one');

  if (stateIndex === 1) $cell.classList.add('zero');
  if (stateIndex === 2) $cell.classList.add('one');
}

function updateSums(changedIndex) {
  const row = Math.floor(changedIndex / gridCols);
  const col = changedIndex % gridCols;

  for (const $sum of $$sumCells) {
    const sr = Number($sum.dataset.row);
    const sc = Number($sum.dataset.col);

    // Only update sum cells adjacent to the changed cell
    if (row >= sr && row <= sr + 1 && col >= sc && col <= sc + 1) {
      const sum = getSumAt(sr, sc);
      const target = targets[sr][sc];
      const allFilled = areCellsFilled(sr, sc);

      $sum.classList.remove('correct', 'wrong');
      if (allFilled) {
        $sum.classList.add(sum === target ? 'correct' : 'wrong');
      }
    }
  }
}

function getSumAt(r, c) {
  return (
    VALUES[cells[r * gridCols + c]] +
    VALUES[cells[r * gridCols + c + 1]] +
    VALUES[cells[(r + 1) * gridCols + c]] +
    VALUES[cells[(r + 1) * gridCols + c + 1]]
  );
}

function areCellsFilled(r, c) {
  return (
    cells[r * gridCols + c] !== 0 &&
    cells[r * gridCols + c + 1] !== 0 &&
    cells[(r + 1) * gridCols + c] !== 0 &&
    cells[(r + 1) * gridCols + c + 1] !== 0
  );
}

// ===== Win Check =====
function checkWin() {
  const allCorrect = $$sumCells.every(($sum) =>
    $sum.classList.contains('correct'),
  );
  if (!allCorrect) return;

  if (currentLevel < LEVELS.length - 1) {
    $winMessage.textContent = `Level ${currentLevel + 1} complete!`;
    $winMessage.hidden = false;
    currentLevel++;
    setTimeout(() => loadLevel(currentLevel), 1200);
  } else {
    $winMessage.textContent = 'All levels complete!';
    $winMessage.hidden = false;
  }
}

init();
