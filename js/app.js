/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* ----- constants -----*/
const STATE = {
  bomb: 1,
  safe: 0,
  flag: 'F',
  'question mark': 'Q',
};

/* ----- app's state (variables) ----- */
let initialCell;
let board;
let boardWidth;
let boardHeight;
let exploded;
let numBombs;
let difficulty;
let bombX;
let bombY;
let cellArray;
let bombsArray;

/* ----- cached element references -----*/
// eslint-disable-next-line no-undef
const container = document.getElementById('container');
// going to cache all squares - there could be a more elegant solution, but this will work for now

function cacheCells() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      board[colIdx][rowIdx].cell = document.getElementById(`${colIdx}-${rowIdx}`);
    });
  });
}


/* ----- event listeners -----*/
// eslint-disable-next-line no-use-before-define
container.addEventListener('mousedown', handleClick);


/* ----- functions -----*/
// eslint-disable-next-line no-use-before-define
init();

function getInitialClick(colIdx, rowIdx) {
  initialCell = [colIdx, rowIdx];

  setBombs(numBombs, colIdx, rowIdx);
  reveal(colIdx, rowIdx);
  logBoards();
  render();
}

function handleClick(evt) {
  // add logic to differentiate between left and right clicks
  const cellId = evt.target.id.split('-');
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);
  exploded = board[cellId[0]][cellId[1]].value;

  console.log(`${evt.target.id} clicked!`);

  if (!initialCell[0]) {
    getInitialClick(colIdx, rowIdx);
  } else if (exploded === 0) {
    // eslint-disable-next-line no-use-before-define
    reveal(colIdx, rowIdx);
  } else {
    // eslint-disable-next-line no-use-before-define
    explode();
    return;
  }
  render();
}

function render() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      // if not revealed, then blank
      // if revealed, then white, red, flag, or question mark
      // if value === 0 then white
      // if value === 0 and around > 0, then show around
      // if value === f, then show flag or F for now
      // if value === q, then show question mark or Q for now
      // if value === 1, then exploded, game ends, let's do game end logic here

      if (element.revealed === false) {
        element.cell.style.background = 'blanchedalmond';
      } else if (element.value === STATE.safe) {
        element.cell.style.background = 'white';
        if (element.around > 0) element.cell.textContent = `${element.around}`;
      } else if (element.value === STATE.flag) element.cell.textContent = 'F';
      else if (element.value === STATE.['question mark']) element.cell.textContent = '?';
      else if (element.value === STATE.bomb) {
        explode();
      }
    });
  });
}

function explode() {
  // user clicked a bomb
  // find all bomb cells
  // change color to red


  // bombs.forEach((element) => element.revealed = true);
  bombsArray.forEach((element, idx) => {
    element.style.background = 'red';
  });
  // evt.target.style.background = 'red';
  console.log('you exploded :/');
}

function drawBoard() {
  // eslint-disable-next-line no-undef
  let div = document.createElement('div');
  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      // eslint-disable-next-line no-undef
      div = document.createElement('div');
      div.id = `${j}-${i}`;
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
    if (colIdx > 0) {
      if (rowIdx > 0) {
        reveal((colIdx - 1), (rowIdx - 1));
      }
      if (rowIdx < boardWidth - 1) {
        reveal((colIdx - 1), (rowIdx + 1));
      }
      reveal((colIdx - 1), (rowIdx));
    }
    if (colIdx < boardHeight - 1) {
      if (rowIdx > 0) {
        reveal((colIdx + 1), (rowIdx - 1));
      }
      if (rowIdx < boardWidth - 1) {
        reveal((colIdx + 1), (rowIdx + 1));
      }
      reveal((colIdx + 1), (rowIdx));
    }
    if (rowIdx > 0) {
      reveal((colIdx), (rowIdx - 1));
    }
    if (rowIdx < boardWidth - 1) {
      reveal((colIdx), (rowIdx + 1));
    }
  } else {
    board[colIdx][rowIdx].revealed = true;
  }
}

function init() {
  boardWidth = 20; // TODO: update with dynamic sizing
  boardHeight = 20;
  board = [];
  difficulty = '';
  numBombs = 40;
  cellArray = [];
  bombsArray = [];
  initialCell = [];
  container.style.gridTemplateColumns = `repeat(${boardWidth}, ${60/boardWidth}vw)`;
  container.style.gridTemplateRows = `repeat(${boardHeight}, ${80/boardHeight}vh)`;
  // TODO: will be calculated from difficulty or input from user

  // TODO: get initial cell from click here

  // eslint-disable-next-line no-use-before-define
  initBoards(boardWidth, boardHeight);
  drawBoard();
  cacheCells();


  // eslint-disable-next-line no-use-before-define
  render();
}


function initBoards(width, height) {
  for (let i = 0; i < height; i += 1) {
    board[i] = [];
    cellArray[i] = [];
    for (let j = 0; j < width; j += 1) {
      board[i][j] = {
        value: 0,
        around: 0,
        revealed: false,
      };
      cellArray[i][j] = {};
    }
  }
}

function setBombs(bombs, colIdx, rowIdx) {
  // Place bombs on hidden board
  // Use randomizer on size of board to find bomb positions, limited by numBombs

  for (let i = bombs; i > 0; i -= 1) {
    bombY = Math.floor(Math.random() * boardHeight);
    bombX = Math.floor(Math.random() * boardWidth);

    // TODO: add OR  board[initialCell.x][initialCell.y].value === STATE.bomb
    while (board[bombX][bombY].value === STATE.bomb || board[colIdx][rowIdx] === board[bombX][bombY]) {
      bombY = Math.floor(Math.random() * boardHeight);
      bombX = Math.floor(Math.random() * boardWidth);
    }
    bombsArray.push(document.getElementById(`${bombX}-${bombY}`));
    board[bombX][bombY].value = STATE.bomb;
    // console.log(`bomb values: X - ${bombX} Y - ${bombY}`);
  }

  // eslint-disable-next-line no-use-before-define
  setArounds();
}

function logBoards() {
  console.log('Checking if around values are updated : ');
  let bombLog = '';

  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      bombLog += `${board[j][i].value} `;
    }
    bombLog += '\n';
  }
  console.log(bombLog);

  let aroundLog = '';

  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      aroundLog += `${board[j][i].around} `;
    }
    aroundLog += '\n';
  }
  console.log(aroundLog);
}

function setArounds() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      if (colIdx > 0) {
        if (rowIdx > 0) {
          if (board[colIdx - 1][rowIdx - 1].value === STATE.bomb) {
            element.around += 1;
          }
        }
        if (rowIdx < boardWidth - 1) {
          if (board[colIdx - 1][rowIdx + 1].value === STATE.bomb) {
            element.around += 1;
          }
        }
        if (board[colIdx - 1][rowIdx].value === STATE.bomb) {
          element.around += 1;
        }
      }
      if (colIdx < boardHeight - 1) {
        if (rowIdx > 0) {
          if (board[colIdx + 1][rowIdx - 1].value === STATE.bomb) {
            element.around += 1;
          }
        }
        if (rowIdx < boardWidth - 1) {
          if (board[colIdx + 1][rowIdx + 1].value === STATE.bomb) {
            // eslint-disable-next-line no-param-reassign
            element.around += 1;
          }
        }
        if (board[colIdx + 1][rowIdx].value === STATE.bomb) {
          element.around += 1;
        }
      }
      if (rowIdx > 0) {
        if (board[colIdx][rowIdx - 1].value === STATE.bomb) {
          element.around += 1;
        }
      }
      if (rowIdx < boardWidth - 1) {
        if (board[colIdx][rowIdx + 1].value === STATE.bomb) {
          element.around += 1;
        }
      }
    });
  });
}
