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
var cellArray;

/* ----- cached element references -----*/
// eslint-disable-next-line no-undef
const container = document.getElementById('container');
// going to cache all squares - there could be a more elegant solution, but this will work for now

function cacheCells() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      cellArray[colIdx][rowIdx] = document.getElementById(`${colIdx}-${rowIdx}`);
    });
  });
}


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
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);
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
  render();
}

function render() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      if (element.revealed === false) {
        cellArray[colIdx][rowIdx].style.background = 'black';
      } else {
        cellArray[colIdx][rowIdx].style.background = 'white';
      }
    });
  });
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

function explode(evt) {
  const bombs = board.forEach((array, colIdx) => {
    array.filter((element, rowIdx) => element.value === STATE.bomb);
    evt.target.style.background = 'red';
  });

  // bombs.forEach((element) => element.revealed = true);
  console.log('you exploded :/');
}

function reveal(colIdx, rowIdx) {
  if (board[colIdx][rowIdx].revealed === true) {
    return;
  }
  board[colIdx][rowIdx].revealed = true;
  if (board[colIdx][rowIdx].around === 0) {
    if (colIdx > 0) {
      if (rowIdx > 0) {
        if (board[colIdx - 1][rowIdx - 1].around === 0) {
          reveal((colIdx - 1), (rowIdx - 1));
        }
      }
      if (rowIdx < boardWidth - 2) {
        if (board[(colIdx - 1)][rowIdx + 1].around === 0) {
          reveal((colIdx - 1), (rowIdx + 1));
        }
      }
      if (board[(colIdx - 1)][rowIdx].around === 0) {
        reveal((colIdx - 1), (rowIdx));
      }
    }
    if (colIdx < boardHeight - 2) {
      if (rowIdx > 0) {
        if (board[(colIdx + 1)][rowIdx - 1].around === 0) {
          reveal((colIdx + 1), (rowIdx - 1));
        }
      }
      if (rowIdx < boardWidth - 2) {
        if (board[(colIdx + 1)][rowIdx + 1].around === 0) {
          reveal((colIdx + 1), (rowIdx + 1));
        }
      }
      if (board[(colIdx + 1)][rowIdx].around === 0) {
        reveal((colIdx + 1), (rowIdx));
      }
    }
    if (rowIdx > 0) {
      if (board[(colIdx)][rowIdx - 1].around === 0) {
        reveal((colIdx), (rowIdx - 1));
      }
    }
    if (rowIdx < boardWidth - 2) {
      if (board[(colIdx)][rowIdx + 1].around === 0) {
        reveal((colIdx), (rowIdx + 1));
      }
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
  cellArray = [];
  // TODO: will be calculated from difficulty or input from user

  // TODO: get initial cell from click here

  // eslint-disable-next-line no-use-before-define
  initBoards(boardWidth, boardHeight);


  setBombs(numBombs);

  // eslint-disable-next-line no-use-before-define
  logBoards();
  drawBoard();
  cacheCells();
  render();
}

function logBoards() {
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

function setBombs(bombs) {
  // Place bombs on hidden board
  // Use randomizer on size of board to find bomb positions, limited by numBombs

  for (let i = bombs; i > 0; i -= 1) {
    bombY = Math.floor(Math.random() * boardWidth);
    bombX = Math.floor(Math.random() * boardHeight);

    // TODO: add OR  board[initialCell.x][initialCell.y].value === STATE.bomb
    while (board[bombX][bombY].value === STATE.bomb) {
      bombY = Math.floor(Math.random() * boardWidth);
      bombX = Math.floor(Math.random() * boardHeight);
    }

    board[bombX][bombY].value = STATE.bomb;
    console.log(`bomb values: X - ${bombX} Y - ${bombY}`);
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
