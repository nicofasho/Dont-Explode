/* ----- constants -----*/

// TODO add bomb counter, when player places flag


const STATE = {
  bomb: 1,
  safe: 0,
  flag: '🚩',
  'question mark': '❓',
};

const DIFFICULTIES = {
  easy: {
    width: 9,
    height: 9,
    bombs: 10,
  },
  medium: {
    width: 16,
    height: 16,
    bombs: 40,
  },
  hard: {
    width: 30,
    height: 16,
    bombs: 99,
  },
};

const SPOILERS = [
  "Darth Vader is Luke Skywalker's father - Star Wars Episode V - The Empire Strikes Back",
  "Dumbledore dies - Harry Potter and the Half-Blood Prince",
  "Jim and Pam live happily ever after - The Office",
  "Rachel and Ross end up together - Friends",
  "Tyler Durden doesn't exist - Fight Club",
  "Jack couldn't fit on the raft - Titanic",
  "Ned Stark is beheaded by King Joffrey - Game of Thrones",
  "Bruce Willis was dead the whole time - The Sixth Sense",
  "Neo is the one - The Matrix",
  "Rosebud was Kane's sled - Citizen Kane",
  "Spacey is Keyser Soze - The Usual Suspects",
  "Iron Man Dabs on Taynos - Avengers: Endgame",
  "Red Wedding.... Nuff said - Game of Thrones",
  "Arthur Morgan dies of tuberculosis - Red Dead Redemption 2",
  "Samus is a woman - Metroid",
  "Auron was dead the whole time - Final Fantasy 10",
  "Tidus is a ghost? Memory? Whatever - Final Fantasy 10",
  "Aeris dies... no one used Life - Final Fantasy 7",
  "Would you kindly? - BioShock",
  "Kefka destroys the world - Final Fantasy 6",
  "Cloud modeled his personality after his dead friend Zack - Final Fantasy 7",
  "Sephiroth was ACTUALLY in the North Crater, those were clones - Final Fantasy 7",
  "Jenova is a space alien - Final Fantasy 7",
];


/* ----- app's state (variables) ----- */
let initialCell;
let board;
let boardWidth;
let boardHeight;
let numBombs;
var bombCounter;
let bombX;
let bombY;
let cellArray;
let bombsArray;
let victory;

/* ----- cached element references -----*/
const container = document.getElementById('container');
const message = document.getElementById('message');

function cacheCells() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      element.cell = document.getElementById(`${colIdx}-${rowIdx}`);
    });
  });
}

const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const form = document.getElementById('form');
const resetButton = document.getElementById('reset');


/* ----- event listeners -----*/
container.addEventListener('click', handleLeftClick);
container.addEventListener('contextmenu', handleRightClick);
easyButton.addEventListener('click', init);
mediumButton.addEventListener('click', init);
hardButton.addEventListener('click', init);
resetButton.addEventListener('click', reset);


/* ----- functions -----*/

function reset() {
  container.innerHTML = '';
  container.style.display = 'none';
  message.innerHTML = '<br>';
  form.style.display = 'block';
  form.style.marginTop = '70';
  resetButton.style.display = 'none';
  initialCell = undefined;
}

function getInitialClick(colIdx, rowIdx) {
  initialCell = [colIdx, rowIdx];
  if (isNaN(initialCell[0]) || isNaN(initialCell[1])) {
    initialCell = undefined;
    return;
  }
  setBombs(numBombs, colIdx, rowIdx);
  reveal(colIdx, rowIdx);
}


function handleRightClick(evt) {
  evt.preventDefault();
  const cellId = evt.target.id.split('-');
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);
  if (typeof initialCell !== 'undefined') {
    if (board[colIdx][rowIdx].symbol === '') {
      bombCounter -= 1;
      board[colIdx][rowIdx].symbol = STATE.flag;
    } else if (board[colIdx][rowIdx].symbol === STATE.flag) {
      bombCounter += 1;
      board[colIdx][rowIdx].symbol = STATE['question mark'];
    } else if (board[colIdx][rowIdx].symbol === STATE['question mark']) {
      board[colIdx][rowIdx].symbol = '';
    }
  }


  render();
}

function handleLeftClick(evt) {
  const cellId = evt.target.id.split('-');
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);

  if (typeof initialCell === 'undefined') {
    getInitialClick(colIdx, rowIdx);
  } else if (board[colIdx][rowIdx].value === 0) {
    reveal(colIdx, rowIdx);
  } else if (board[colIdx][rowIdx].value === 1) {
    explode();
    return;
  }


  render();
}

function render() {
  message.textContent = `Bombs Left: ${bombCounter}`;
  board.forEach((array) => {
    array.forEach((element) => {
      
      if (element.revealed === false) {
        element.cell.style.background = '#d0d4db';
        element.cell.textContent = element.symbol;
        if (element.symbol === STATE.flag) {
        }
      } else if (element.value === STATE.safe) {
        element.cell.style.background = 'white';
        if (element.around > 0) element.cell.textContent = `${element.around}`;
      } else if (element.value === STATE.bomb) {
        explode();
      }
    });
  });
  victory = checkVictory();
  if (victory) {
    victoryMessage();
  }
}

function victoryMessage() {
  bombsArray.forEach((element) => {
    element.style.background = 'green';
    element.textContent = '🎉';
  });
  container.removeEventListener('click', handleLeftClick);
  container.removeEventListener('contextmenu', handleRightClick);
  message.textContent = 'You Avoided the Spoilers!';
  message.style.display = 'block';
  resetButton.style.display = 'block';
}

function explode() {
  bombsArray.forEach((element) => {
    element.style.background = 'red';
    element.textContent = '💣';
  });
  container.removeEventListener('click', handleLeftClick);
  container.removeEventListener('contextmenu', handleRightClick);
  message.textContent = SPOILERS[Math.floor(Math.random() * SPOILERS.length)];

  message.style.display = 'block';
  resetButton.style.display = 'block';

}

function cheat() {
  board.forEach((array) => {
    array.forEach((element) => {
      if (element.value === 0) {
        element.revealed = true;
      }
    });
  });

  render();
}

function checkVictory() {
  victory = board.every(array => array.every((element) => {
    if (element.value === STATE.bomb) {
      return !element.revealed;
    }
    return element.revealed;
  }));
  return victory;
}

function drawBoard() {
  let div = document.createElement('div');
  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      div = document.createElement('div');
      div.id = `${i}-${j}`;
      container.appendChild(div);
    }
  }
}

function reveal(colIdx, rowIdx) {
  if (board[colIdx][rowIdx].revealed === true) {
    return;
  }
  board[colIdx][rowIdx].revealed = true;
  if (board[colIdx][rowIdx].around === 0) {
    revealTopLeft(colIdx, rowIdx);
    revealTop(colIdx, rowIdx);
    revealTopRight(colIdx, rowIdx);
    revealRight(colIdx, rowIdx);
    revealBottomRight(colIdx, rowIdx);
    revealBottom(colIdx, rowIdx);
    revealBottomLeft(colIdx, rowIdx);
    revealLeft(colIdx, rowIdx);
  } else {
    board[colIdx][rowIdx].revealed = true;
  }
}

function revealTopLeft(colIdx, rowIdx) {
  if (colIdx > 0) {
    if (rowIdx > 0) {
      reveal(colIdx - 1, rowIdx - 1);
    }
  }
}

function revealTop(colIdx, rowIdx) {
  if (colIdx > 0) {
    reveal(colIdx - 1, rowIdx);
  }
}

function revealTopRight(colIdx, rowIdx) {
  if (colIdx > 0) {
    if (rowIdx < boardWidth - 1) {
      reveal(colIdx - 1, rowIdx + 1);
    }
  }
}

function revealRight(colIdx, rowIdx) {
  if (rowIdx < boardWidth - 1) {
    reveal(colIdx, rowIdx + 1);
  }
}

function revealBottomRight(colIdx, rowIdx) {
  if (colIdx < boardHeight - 1) {
    if (rowIdx < boardWidth - 1) {
      reveal(colIdx + 1, rowIdx + 1);
    }
  }
}

function revealBottom(colIdx, rowIdx) {
  if (colIdx < boardHeight - 1) {
    reveal(colIdx + 1, rowIdx);
  }
}

function revealBottomLeft(colIdx, rowIdx) {
  if (colIdx < boardHeight - 1) {
    if (rowIdx > 0) {
      reveal(colIdx + 1, rowIdx - 1);
    }
  }
}

function revealLeft(colIdx, rowIdx) {
  if (rowIdx > 0) {
    reveal(colIdx, rowIdx - 1);
  }
}


function init(evt) {
  evt.preventDefault();
  boardWidth = DIFFICULTIES[evt.target.id].width;
  boardHeight = DIFFICULTIES[evt.target.id].height;
  numBombs = DIFFICULTIES[evt.target.id].bombs;
  board = [];
  cellArray = [];
  bombsArray = [];
  bombCounter = numBombs;

  container.addEventListener('click', handleLeftClick);
  container.addEventListener('contextmenu', handleRightClick);

  if (document.documentElement.clientWidth > 768) {
    container.style.gridTemplateColumns = `repeat(${boardWidth}, 25px)`;
    container.style.gridTemplateRows = `repeat(${boardHeight}, 25px)`;
  } else {
    container.style.gridTemplateColumns = `repeat(${boardWidth}, 20px)`;
    container.style.gridTemplateRows = `repeat(${boardHeight}, 20px)`;
  }

  container.style.display = 'grid';


  initBoards(boardWidth, boardHeight);
  drawBoard();
  cacheCells();

  removeDifficultyBox();
  render();
}

function removeDifficultyBox() {
  form.style.display = 'none';
}

function initBoards(width, height) {
  container.innerHTML = '';
  for (let i = 0; i < height; i += 1) {
    board[i] = [];
    cellArray[i] = [];
    for (let j = 0; j < width; j += 1) {
      board[i][j] = {
        value: 0,
        around: 0,
        revealed: false,
        symbol: '',
      };
      cellArray[i][j] = {};
    }
  }
}

function setBombs(bombs, colIdx, rowIdx) {

  for (let i = bombs; i > 0; i -= 1) {
    bombY = Math.floor(Math.random() * boardHeight);
    bombX = Math.floor(Math.random() * boardWidth);

    while (board[bombY][bombX].value === STATE.bomb || board[colIdx][rowIdx] === board[bombY][bombX]) {
      bombY = Math.floor(Math.random() * boardHeight);
      bombX = Math.floor(Math.random() * boardWidth);
    }
    bombsArray.push(document.getElementById(`${bombY}-${bombX}`));
    board[bombY][bombX].value = STATE.bomb;
  }

  setArounds();
}


function setArounds() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      aroundTopLeft(colIdx, rowIdx, element);
      aroundTop(colIdx, rowIdx, element);
      aroundTopRight(colIdx, rowIdx, element);
      aroundRight(colIdx, rowIdx, element);
      aroundBottomRight(colIdx, rowIdx, element);
      aroundBottom(colIdx, rowIdx, element);
      aroundBottomLeft(colIdx, rowIdx, element);
      aroundLeft(colIdx, rowIdx, element);
    });
  });
}

function aroundTopLeft(colIdx, rowIdx, element) {
  if (colIdx > 0) {
    if (rowIdx > 0) {
      if (board[colIdx - 1][rowIdx - 1].value === STATE.bomb) {
        element.around += 1;
      }
    }
  }
}

function aroundTop(colIdx, rowIdx, element) {
  if (colIdx > 0) {
    if (board[colIdx - 1][rowIdx].value === STATE.bomb) {
      element.around += 1;
    }
  }
}

function aroundTopRight(colIdx, rowIdx, element) {
  if (colIdx > 0) {
    if (rowIdx < boardWidth - 1) {
      if (board[colIdx - 1][rowIdx + 1].value === STATE.bomb) {
        element.around += 1;
      }
    }
  }
}

function aroundRight(colIdx, rowIdx, element) {
  if (rowIdx < boardWidth - 1) {
    if (board[colIdx][rowIdx + 1].value === STATE.bomb) {
      element.around += 1;
    }
  }
}

function aroundBottomRight(colIdx, rowIdx, element) {
  if (colIdx < boardHeight - 1) {
    if (rowIdx < boardWidth - 1) {
      if (board[colIdx + 1][rowIdx + 1].value === STATE.bomb) {
        element.around += 1;
      }
    }
  }
}

function aroundBottom(colIdx, rowIdx, element) {
  if (colIdx < boardHeight - 1) {
    if (board[colIdx + 1][rowIdx].value === STATE.bomb) {
      element.around += 1;
    }
  }
}

function aroundBottomLeft(colIdx, rowIdx, element) {
  if (colIdx < boardHeight - 1) {
    if (rowIdx > 0) {
      if (board[colIdx + 1][rowIdx - 1].value === STATE.bomb) {
        element.around += 1;
      }
    }
  }
}

function aroundLeft(colIdx, rowIdx, element) {
  if (rowIdx > 0) {
    if (board[colIdx][rowIdx - 1].value === STATE.bomb) {
      element.around += 1;
    }
  }
}