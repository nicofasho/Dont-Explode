/*----- constants -----*/
const STATE = {
  bomb: 1,
  safe: 0,
  flag: "F",
  "question mark": "Q"
};

/*----- app's state (variables) -----*/
var initialCell,
  board,
  boardWidth,
  boardHeight,
  exploded,
  numBombs,
  difficulty,
  bombX,
  bombY;

/*----- cached element references -----*/
const container = document.getElementById('container');


/*----- event listeners -----*/
container.addEventListener('mousedown', handleClick);



/*----- functions -----*/
init();

function handleClick(evt) {
  //get value of clicked cell
  //add logic to differentiate between left and right clicks
  //cells should be id'd 'i-j' in nested for loops that generate them in the html
  let cellId = evt.target.id.split("-");
  let colIdx = cellId[0];
  let rowIdx = cellId[1];
  exploded = board[cellId[0]][cellId[1]].value;
  //if 0
  console.log(`${evt.target.id} clicked!`);
  if (exploded === 0) {
    reveal(colIdx, rowIdx);
  } else {
    explode(evt);
  }
}

function render() {}

function drawBoard(){
  var div = document.createElement('div');
  for(let i = 0; i < boardHeight; i++){
    for(let j = 0; j < boardWidth; j++){
      div = document.createElement('div');
      div.id = `${j}-${i}`;
      container.appendChild(div);
    }
  }
}

function explode(evt){
  let bombs = board.forEach((array,colIdx) => {
    array.filter((element,rowIdx) => {
      return element.value === STATE.bomb;
    });
    evt.target.style.background = 'red';
  });

  // bombs.forEach((element) => element.revealed = true);
  console.log('you exploded :/');
}

function reveal(colIdx, rowIdx) {
  if (board[colIdx][rowIdx].around === 0) {
    if(colIdx > 0){
      if(rowIdx > 0){
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx - 1),(rowIdx - 1));
      }
      if(rowIdx < boardWidth - 1){
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx - 1),(rowIdx + 1));
      }
      board[colIdx][rowIdx].revealed = true;
      reveal((colIdx - 1),rowIdx);
    }
    if(colIdx < boardHeight - 1){
      if(rowIdx > 0){
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx + 1),(rowIdx - 1));
      }
      if(rowIdx < boardWidth - 1){
        board[colIdx][rowIdx].revealed = true;
        reveal((colIdx + 1),(rowIdx + 1));
      }
      board[colIdx][rowIdx].revealed = true;
      reveal((colIdx + 1),rowIdx);
    }
    if(rowIdx > 0){
      board[colIdx][rowIdx].revealed = true;
      reveal(colIdx,(rowIdx  - 1));
    }
    if(rowIdx < boardWidth - 1){
      board[colIdx][rowIdx].revealed = true;
      reveal(colIdx,(rowIdx + 1));
    }
  } else {
    board[colIdx][rowIdx].revealed = true;
  }
}

function init() {
  boardWidth = 10; //TODO: update with dynamic sizing
  boardHeight = 10;
  board = [];
  difficulty = "";
  numBombs = 10;
  //TODO: will be calculated from difficulty or input from user

  //TODO: get initial cell from click here

  initBoards(boardWidth, boardHeight);

  render();

  setBombs(numBombs);

  showBoards();
  drawBoard();
}

function showBoards() {
  console.log(`Checking if around values are updated : `);
  let bombLog = "";

  board.forEach(function(array, colIdx) {
    array.forEach(function(element, rowIdx) {
      bombLog += `${element.value} `;
    });
    bombLog += `\n`;
  });
  console.log(bombLog);

  let aroundLog = "";

  board.forEach(function(array, colIdx) {
    array.forEach(function(element, rowIdx) {
      aroundLog += `${element.around} `;
    });
    aroundLog += `\n`;
  });
  console.log(aroundLog);
}

function initBoards(boardWidth, boardHeight) {
  for (let i = 0; i < boardHeight; i++) {
    board[i] = [];
    for (let j = 0; j < boardWidth; j++) {
      board[i][j] = {
        value: 0,
        around: 0,
        revealed: false
      };
    }
  }
}

function setBombs(numBombs) {
  //Place bombs on hidden board
  //Use randomizer on size of board to find bomb positions, limited by numBombs

  for (let i = numBombs; i > 0; i--) {
    bombX = Math.floor(Math.random() * boardWidth);
    bombY = Math.floor(Math.random() * boardHeight);

    //TODO: add OR  board[initialCell.x][initialCell.y].value === STATE.bomb
    while (board[bombX][bombY].value === STATE.bomb) {
      bombX = Math.floor(Math.random() * boardWidth);
      bombY = Math.floor(Math.random() * boardHeight);
    }

    board[bombX][bombY].value = STATE.bomb;
    console.log(`bomb values: X - ${bombY} Y - ${bombX}`);
  }

  setArounds();
}

function setArounds() {
  board.forEach(function(array, colIdx) {
    array.forEach(function(element, rowIdx) {

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
