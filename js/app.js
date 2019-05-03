/*----- constants -----*/

const STATE = {
  bomb: 1,
  blank: 0,
  flag: "F",
  "question mark": "Q",
}

/*----- app's state (variables) -----*/

var initialSquare,
  visibleBoard,
  hiddenBoard,
  boardWidth,
  boardHeight,
  exploded,
  numBombs,
  difficulty;

/*----- cached element references -----*/

/*----- event listeners -----*/

/*----- functions -----*/
init();

function init() {
  boardWidth = 5; //TODO: update with dynamic sizing
  boardHeight = 5;
  visibleBoard = [];
  hiddenBoard = [];
  difficulty = "";
  numBombs = 5; //TODO: will be calculated from difficulty or input from user

  // Initialize boards with blank squares

  for (let i = 0; i < boardWidth; i++) {
    visibleBoard[i] = [];
    hiddenBoard[i] = [];
    for (let j = 0; j < boardHeight; j++) {
      visibleBoard[i][j] = {
        value: 0,
        around: 0
      };
      hiddenBoard[i][j] = {
        value: 0,
        around: 0
      };
    }
  }

  console.log("Initialized: ", visibleBoard, hiddenBoard);

  //Place bombs on hidden board
  //Use randomizer on size of hiddenBoard to find bomb positions, limited by numBombs
  for (let i = numBombs; i > 0; i--) {
    let bombX = Math.floor(Math.random() * boardWidth);
    let bombY = Math.floor(Math.random() * boardHeight);
    console.log(`bomb values: X - ${bombX} Y - ${bombY}`);
    hiddenBoard[bombX][bombY].value = STATE.bomb;
  }
  console.log("Trying to insert bombs in random spots: ", hiddenBoard);
  //TODO: separate board population stuff into separate function
  //Update hidden array with around values, oh boi

  //top = [nestIdx][arrayIdx - 1]
  //topRight = [nestIdx + 1][arrayIdx - 1]
  //right = [nestIdx + 1][arrayIdx]
  //bottomRight = [nestIdx + 1][arrayIdx + 1]
  //bottom = [nestIdx][arrayIdx + 1]
  //bottomLeft = [nestIdx - 1][arrayIdx + 1]
  //left = [nestIdx - 1][arrayIdx]
  //topLeft = [nestIdx - 1][arrayIdx - 1]

  hiddenBoard.forEach(function (array, colIdx) {
    array.forEach(function (element, rowIdx) {
      //if each position around said element exists
      //start with top, go around clockwise i guess
      //TODO: definitely split this into a function, shit's bout to get messy
      // rewrite with nested ifs

      if(colIdx  > 0){
        if(rowIdx > 0){
          if(hiddenBoard[(colIdx - 1)][(rowIdx - 1)].value === STATE.bomb) {
            element.around += 1;
          }
        }
        if (rowIdx < 4){
          if(hiddenBoard[(colIdx - 1)][(rowIdx + 1)].value === STATE.bomb) {
            element.around += 1;
          }
        }
        if(hiddenBoard[(colIdx - 1)][rowIdx].value === STATE.bomb){
          element.around += 1;
        }
      }
      if(colIdx < 4){
        if(rowIdx > 0){
          if(hiddenBoard[(colIdx + 1)][(rowIdx - 1)].value === STATE.bomb){
            element.around += 1;
          }
        }
        if(rowIdx < 4){
          if(hiddenBoard[(colIdx + 1)][(rowIdx + 1)].value === STATE.bomb){
            element.around += 1;
          }
        }
        if(hiddenBoard[(colIdx + 1)][rowIdx].value === STATE.bomb){
          element.around += 1;
        }
      }
      if(rowIdx > 0){
        if(hiddenBoard[colIdx][(rowIdx - 1)].value === STATE.bomb){
          element.around += 1;
        }
      }
      if(rowIdx < 4){
        if(hiddenBoard[colIdx][(rowIdx + 1)].value === STATE.bomb){
          element.around += 1;
        }
      }

    });
  });

  console.table(hiddenBoard);

  console.log(`Checking if around values are updated : `);
  let bombImage = '';

  hiddenBoard.forEach(function (array, colIdx) {
    array.forEach(function (element, rowIdx) {
      // console.log('X: ', colIdx, ' Y: ', rowIdx, ' ', ' Value: ', element.value, ' Around: ', element.around);
      bombImage += `${element.value } `;
    });
    bombImage += `\n`;
  });
  console.log(bombImage);

  let aroundImage = '';

  hiddenBoard.forEach(function (array, colIdx) {
    array.forEach(function (element, rowIdx) {
      // console.log('X: ', colIdx, ' Y: ', rowIdx, ' ', ' Value: ', element.value, ' Around: ', element.around);
      aroundImage += `${element.around } `;
    });
    aroundImage += `\n`;
  });
  console.log(aroundImage);
}

function render() {}