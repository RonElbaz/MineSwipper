//counting mines around the requested cell
function countMines(board, cI, cJ) {
  var neighborsCount = 0;
  for (var i = cI - 1; i <= cI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cJ - 1; j <= cJ + 1; j++) {
      if (i === cI && j === cJ) continue;
      if (j < 0 || j >= board[i].length) continue;

      if (board[i][j].isMine) neighborsCount++;
    }
  }
  return neighborsCount;
}

//return an array of random unique cordinates of mins
function randomMines() {
  var minesArr = [];
  for (var i = 0; i < gLevel.MINES; i++) {
    var currMine = {
      i: getRandomNumber(gLevel.SIZE),
      j: getRandomNumber(gLevel.SIZE),
    };
    while (mineInArray(currMine, minesArr)) {
      currMine = {
        i: getRandomNumber(gLevel.SIZE),
        j: getRandomNumber(gLevel.SIZE),
      };
    }
    console.log(currMine);
    minesArr.push(currMine);
  }
  return minesArr;
}

//placing the mines inside the board game
function placeMines(minesArr) {
  for (var i = 0; i < minesArr.length; i++) {
    var currMine = minesArr[i];
    //console.log(currMine)
    gBoard[currMine.i][currMine.j].MinesAroundCount = "*";
    gBoard[currMine.i][currMine.j].isMine = true;
  }
}

//check if mine location already exists
function mineInArray(mine, minesArr) {
  if (minesArr.length === 0) return false;
  for (var i = 0; i < minesArr.length; i++) {
    var currMine = minesArr[i];
    if (currMine.i === mine.i && currMine.j === mine.j) return true;
  }
  return false;
}

//set value according to the mines
function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (!board[i][j].isMine) {
        board[i][j].MinesAroundCount = countMines(board, i, j);
      }
    }
  }
}

function revealMines(mines){
  for(var i =0;i<mines.length;i++){
    currMine = mines[i]
    gBoard[currMine.i][currMine.j].isShown=true
    if(gBoard[currMine.i][currMine.j].isMarked) gBoard[currMine.i][currMine.j].isMarked = false;
    renderCell({i:currMine.i, j:currMine.j}, "*")
  }
}