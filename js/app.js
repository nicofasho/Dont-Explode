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

/* ----- cached element references -----*/
// eslint-disable-next-line no-undef
const container = document.getElementById('container');


/* ----- event listeners -----*/
// eslint-disable-next-line no-use-before-define
container.addEventListener('mousedown', handleClick);


/* ----- functions -----*/
// eslint-disable-next-line no-use-before-define
init();

function handleClick(evt) {
  // get value of clicked cell
  // add logic to differentiate between left and right clicks
  // cells should be id'd 'i-j' in nested for loops that generate them in the html
  const cellId = evt.target.id.split('-');
  const colIdx = cellId[0];
  const rowIdx = cellId[1];
  exploded = board[cellId[0]][cellId[1]].value;
  // if 0
  console.log(`${evt.target.id} clicked!`);
  if (exploded === 0) {
    // eslint-disable-next-line no-use-before-define
    reveal(colIdx, rowIdx);
  } else {
    // eslint-disable-next-line no-use-before-define
    explode(evt);
  }
}

function render() {}

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

function explode(evt) {
  const bombs = board.forEach((array, colIdx) => {
    array.filter((element, rowIdx) => element.value === STATE.bomb);
    evt.target.style.background = 'red';
  });

  // bombs.forEach((element) => element.revealed = true);
  console.log('you exploded :/');
}

function reveal(colIdx, rowIdx) {
  if (board[colIdx][rowIdx].around === 0) {
    if (colIdx > 0) {
      if (rowIdx > 0) {
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx - 1), (rowIdx - 1));
      }
      if (rowIdx < boardWidth - 1) {
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx - 1), (rowIdx + 1));
      }
      board[colIdx][rowIdx].revealed = true;
      reveal((colIdx - 1), rowIdx);
    }
    if (colIdx < boardHeight - 1) {
      if (rowIdx > 0) {
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx + 1), (rowIdx - 1));
      }
      if (rowIdx < boardWidth - 1) {
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx + 1), (rowIdx + 1));
      }
      board[colIdx][rowIdx].revealed = true;
      reveal((colIdx + 1), rowIdx);
    }
    if (rowIdx > 0) {
      board[colIdx][rowIdx].revealed = true;
      reveal(colIdx, (rowIdx - 1));
    }
    if (rowIdx < boardWidth - 1) {
      board[colIdx][rowIdx].revealed = true;
      reveal(colIdx, (rowIdx + 1));
    }
  } else {
    board[colIdx][rowIdx].revealed = true;
  }
}

function init() {
  boardWidth = 10; // TODO: update with dynamic sizing
  boardHeight = 10;
  board = [];
  difficulty = '';
  numBombs = 10;
  // TODO: will be calculated from difficulty or input from user

  // TODO: get initial cell from click here

  // eslint-disable-next-line no-use-before-define
  initBoards(boardWidth, boardHeight);

  render();

  setBombs(numBombs);

  // eslint-disable-next-line no-use-before-define
  showBoards();
  drawBoard();
}

function showBoards() {
  console.log('Checking if around values are updated : ');
  let bombLog = '';

  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      bombLog += `${element.value} `;
    });
    bombLog += '\n';
  });
  console.log(bombLog);

  let aroundLog = '';

  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      aroundLog += `${element.around} `;
    });
    aroundLog += '\n';
  });
  console.log(aroundLog);
}

function initBoards(width, height) {
  for (let i = 0; i < height; i += 1) {
    board[i] = [];
    for (let j = 0; j < board; j += 1) {
      board[i][j] = {
        value: 0,
        around: 0,
        revealed: false,
      };
    }
  }
}

function setBombs(bombs) {
  // Place bombs on hidden board
  // Use randomizer on size of board to find bomb positions, limited by numBombs

  for (let i = bombs; i > 0; i -= 1) {
    bombX = Math.floor(Math.random() * boardWidth);
    bombY = Math.floor(Math.random() * boardHeight);

    // TODO: add OR  board[initialCell.x][initialCell.y].value === STATE.bomb
    while (board[bombX][bombY].value === STATE.bomb) {
      bombX = Math.floor(Math.random() * boardWidth);
      bombY = Math.floor(Math.random() * boardHeight);
    }

    board[bombX][bombY].value = STATE.bomb;
    console.log(`bomb values: X - ${bombY} Y - ${bombX}`);
  }

  // eslint-disable-next-line no-use-before-define
  setArounds();
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
