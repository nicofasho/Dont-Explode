/*----- constants -----*/
const STATE = {
  bomb: 1,
  blank: 0,
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

/*----- event listeners -----*/

/*----- functions -----*/
init();

function handleClick(evt) {
  //fetch value of clicked cell

  //cells should be id'd 'i-j' in nested for loops that generate them in the html
  let cellId = evt.target.id.split("-");
  let colIdx = cellId[0];
  let rowIdx = cellId[1];
  let cell = board[cellId[0]][cellId[1]];
  exploded = hiddenCell.value;
  //if 0
  if (exploded === 0) {
    //if around === 0 then reveal all 8
    //call function on that cell, make it recursive somehow.... somehow
    //if around > 0 then only reveal self
    reveal(cell, colIdx, rowIdx);
  }
  //repeat recursively
  //AND around === 0, then reveal all 8 squares around it
  //check if all 8 cells exist first
  //then call said function, oh boi
  //otherwise just reveal self
}

function render() {}

function reveal(cell, colIdx, rowIdx) {
  if (cell.around === 0) {
    if(colIdx > 0){
      if(rowIdx > 0){
        cell.revealed = true;
        return reveal(board[colIdx - 1][rowIdx - 1],(colIdx - 1),(rowIdx - 1));
      }
      if(rowIdx < boardWidth - 1){
        cell.revealed = true;
        return reveal(board[colIdx - 1][rowIdx + 1],(colIdx - 1),(rowIdx + 1));
      }
      cell.revealed = true;
      return reveal(board[colIdx - 1][rowIdx],(colIdx - 1),rowIdx);
    }
    if(colIdx < boardHeight - 1){
      if(rowIdx > 0){
        cell.revealed = true;
        return reveal(board[colIdx + 1][rowIdx - 1],(colIdx + 1),(rowIdx - 1));
      }
      if(rowIdx < boardWidth - 1){
        cell.revealed = true;
        return reveal(board[colIdx + 1][rowIdx + 1],(colIdx + 1),(rowIdx + 1));
      }
      cell.revealed = true;
      return reveal(board[colIdx + 1][rowIdx],(colIdx + 1),rowIdx);
    }
    if(rowIdx > 0){
      cell.revealed = true;
      return reveal(board[colIdx][rowIdx - 1],colIdx,(rowIdx  - 1));
    }
    if(rowIdx < boardWidth - 1){
      cell.revealed = true;
      return reveal(board[colIdx][rowIdx + 1],colIdx,(rowIdx + 1));
    }
  } else {
    cell.revealed = true;
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
}

function showBoards() {
  console.log(`Checking if around values are updated : `);
  let bombImage = "";

  board.forEach(function(array, colIdx) {
    array.forEach(function(element, rowIdx) {
      bombImage += `${element.value} `;
    });
    bombImage += `\n`;
  });
  console.log(bombImage);

  let aroundImage = "";

  board.forEach(function(array, colIdx) {
    array.forEach(function(element, rowIdx) {
      aroundImage += `${element.around} `;
    });
    aroundImage += `\n`;
  });
  console.log(aroundImage);
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
      //if each position around said element exists
      //start with top, go around clockwise i guess
      //TODO: definitely split this into a function, shit's bout to get messy
      // rewrite with nested ifs

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
