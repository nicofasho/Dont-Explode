/* eslint-disable quotes */
/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* ----- constants -----*/
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
// let exploded;
let numBombs;
let bombX;
let bombY;
let cellArray;
let bombsArray;
let victory;

/* ----- cached element references -----*/
// eslint-disable-next-line no-undef
const container = document.getElementById('container');
// eslint-disable-next-line no-undef
const message = document.getElementById('message');
// going to cache all squares - there could be a more elegant solution, but this will work for now

function cacheCells() {
  board.forEach((array, colIdx) => {
    array.forEach((element, rowIdx) => {
      // eslint-disable-next-line no-undef
      element.cell = document.getElementById(`${colIdx}-${rowIdx}`);
    });
  });
}

// eslint-disable-next-line no-undef
const easyButton = document.getElementById('easy');
// eslint-disable-next-line no-undef
const mediumButton = document.getElementById('medium');
// eslint-disable-next-line no-undef
const hardButton = document.getElementById('hard');
// eslint-disable-next-line no-undef
const form = document.getElementById('form');
// eslint-disable-next-line no-undef
const resetButton = document.getElementById('reset');


/* ----- event listeners -----*/
// eslint-disable-next-line no-use-before-define
container.addEventListener('click', handleLeftClick);
container.addEventListener('contextmenu', handleRightClick);
easyButton.addEventListener('click', init);
mediumButton.addEventListener('click', init);
hardButton.addEventListener('click', init);
resetButton.addEventListener('click', reset);


/* ----- functions -----*/
// eslint-disable-next-line no-use-before-define

function reset() {
  container.innerHTML = '';
  container.style.display = 'none';
  message.style.display = 'none';
  form.style.display = 'block';
  form.style.marginTop = '70';
  // message.style.color = 'white';
  resetButton.style.display = 'none';
  initialCell = undefined;
}

function getInitialClick(colIdx, rowIdx) {
  initialCell = [colIdx, rowIdx];

  setBombs(numBombs, colIdx, rowIdx);
  reveal(colIdx, rowIdx);
  logBoards();
  // render();
}


function handleRightClick(evt) {
  evt.preventDefault();
  const cellId = evt.target.id.split('-');
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);
  if (typeof initialCell !== 'undefined') {
    if (board[colIdx][rowIdx].symbol === '') {
      board[colIdx][rowIdx].symbol = STATE.flag;
    } else if (board[colIdx][rowIdx].symbol === STATE.flag) {
      board[colIdx][rowIdx].symbol = STATE['question mark'];
    } else if (board[colIdx][rowIdx].symbol === STATE['question mark']) {
      board[colIdx][rowIdx].symbol = '';
    }

    console.log(`you right clicked ${colIdx}-${rowIdx}`);
  }


  render();
}

function handleLeftClick(evt) {
  // add logic to differentiate between left and right clicks
  const cellId = evt.target.id.split('-');
  const colIdx = parseInt(cellId[0], 10);
  const rowIdx = parseInt(cellId[1], 10);
  // exploded = board[colIdx][rowIdx].value;

  // if left click
  // proceed as normal
  // if right click
  // and initialcell exists
  // then cycle through flag, question mark, and blank again
  // if statements?

  if (typeof initialCell === 'undefined') {
    getInitialClick(colIdx, rowIdx);
  } else if (board[colIdx][rowIdx].value === 0) {
    // eslint-disable-next-line no-use-before-define
    reveal(colIdx, rowIdx);
  } else if (board[colIdx][rowIdx].value === 1) {
    // eslint-disable-next-line no-use-before-define
    explode();
    return;
  }

  console.log(`${evt.target.id} clicked!`);

  render();
}

function render() {
  board.forEach((array) => {
    array.forEach((element) => {
      // if not revealed, then blank
      // if revealed, then white, red, flag, or question mark
      // if value === 0 then white
      // if value === 0 and around > 0, then show around
      // if value === f, then show flag or F for now
      // if value === q, then show question mark or Q for now
      // if value === 1, then exploded, game ends, let's do game end logic here

      if (element.revealed === false) {
        element.cell.style.background = '#d0d4db';
        element.cell.textContent = element.symbol;
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
  // evt.target.style.background = 'red';
  console.log('You won! :D');
}

function explode() {
  // user clicked a bomb
  // find all bomb cells
  // change color to red


  // bombs.forEach((element) => element.revealed = true);
  bombsArray.forEach((element) => {
    element.style.background = 'red';
    element.textContent = '💣';
  });
  container.removeEventListener('click', handleLeftClick);
  container.removeEventListener('contextmenu', handleRightClick);
  message.textContent = SPOILERS[Math.floor(Math.random() * SPOILERS.length)];

  message.style.display = 'block';
  resetButton.style.display = 'block';

  // evt.target.style.background = 'red';
  console.log('you exploded :/');
}

// eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-undef
  let div = document.createElement('div');
  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      // eslint-disable-next-line no-undef
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

function init(evt) {
  evt.preventDefault();
  boardWidth = DIFFICULTIES[evt.target.id].width;
  boardHeight = DIFFICULTIES[evt.target.id].height;
  numBombs = DIFFICULTIES[evt.target.id].bombs;
  board = [];
  cellArray = [];
  bombsArray = [];

  container.addEventListener('click', handleLeftClick);
  container.addEventListener('contextmenu', handleRightClick);

  // container.style.gridTemplateColumns = `repeat(${boardWidth}, ${50 / boardWidth}vw)`;
  // container.style.gridTemplateRows = `repeat(${boardHeight}, ${70 / boardHeight}vh)`;

  // eslint-disable-next-line no-undef
  if (document.documentElement.clientWidth > 768) {
    container.style.gridTemplateColumns = `repeat(${boardWidth}, 25px)`;
    container.style.gridTemplateRows = `repeat(${boardHeight}, 25px)`;
  } else {
    container.style.gridTemplateColumns = `repeat(${boardWidth}, 20px)`;
    container.style.gridTemplateRows = `repeat(${boardHeight}, 20px)`;
  }

  container.style.display = 'grid';


  // TODO: will be calculated from difficulty or input from user

  // TODO: get initial cell from click here

  // eslint-disable-next-line no-use-before-define
  initBoards(boardWidth, boardHeight);
  drawBoard();
  cacheCells();


  // eslint-disable-next-line no-use-before-define
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
  // Place bombs on hidden board
  // Use randomizer on size of board to find bomb positions, limited by numBombs

  for (let i = bombs; i > 0; i -= 1) {
    bombY = Math.floor(Math.random() * boardHeight);
    bombX = Math.floor(Math.random() * boardWidth);

    // TODO: add OR  board[initialCell.x][initialCell.y].value === STATE.bomb
    // eslint-disable-next-line max-len
    while (board[bombY][bombX].value === STATE.bomb || board[colIdx][rowIdx] === board[bombY][bombX]) {
      bombY = Math.floor(Math.random() * boardHeight);
      bombX = Math.floor(Math.random() * boardWidth);
    }
    // eslint-disable-next-line no-undef
    bombsArray.push(document.getElementById(`${bombY}-${bombX}`));
    board[bombY][bombX].value = STATE.bomb;
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
      bombLog += `${board[i][j].value} `;
    }
    bombLog += '\n';
  }
  console.log(bombLog);

  let aroundLog = '';

  for (let i = 0; i < boardHeight; i += 1) {
    for (let j = 0; j < boardWidth; j += 1) {
      aroundLog += `${board[i][j].around} `;
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
