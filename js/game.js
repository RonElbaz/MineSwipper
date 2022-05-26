var gBoard;
var gLevel;
var gIsVictorious = false;
var isGameOn = true;
var gStartTime;
var gIntervalId;
var gLives;
var gSafeClicks;
var gSafeClicksInterval;
var gMines;
var gFirstClick;
var gUndo;
var gHints;
var gClickedHint;
var gScore = 0;

const MINE = "🔮";
const FLAG = "⛳";
const SMILEY = "😀";
const SUNGLASSES = "😎";
const LOST = "🤯";

function initGame() {
  gLevel = { SIZE: 4, MINES: 2 };
  startGame();
}

function startGame() {
  isGameOn = true;
  gLives = 3;
  gSafeClicks = 3;
  gHints = 3;
  gClickedHint = false;
  gFirstClick = true;
  gUndo = [];
  gBoard = buildBoard();

  // gBoard[1][1].isMine = true;
  // gBoard[1][1].MinesAroundCount = "*";
  // gBoard[2][2].isMine = true;
  // gBoard[2][2].MinesAroundCount = "*";
  //console.table(gBoard)
  clearModal();
  renderBoard(gBoard);
  recoilTimer();
  gMines = randomMines();
  placeMines(gMines);
  setMinesNegsCount(gBoard);
  updateScore()
  getHighestScore()
  console.log(gBoard);
}

function buildBoard() {
  var mat = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    var row = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      row.push({
        MinesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      });
    }
    mat.push(row);
  }
  return mat;
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];

      var cellClass = getClassName({ i: i, j: j });
      strHTML += `\t<td class="cell ${cellClass}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">\n`;

      if (currCell.isShown) {
        if (currCell.MinesAroundCount !== "0")
          strHTML += currCell.MinesAroundCount;
        else strHTML += " ";
      }
      strHTML += "\t</td>\n";
    }
    strHTML += "</tr>\n";
  }
  var elBoard = document.querySelector("tbody.board");
  elBoard.innerHTML = strHTML;

  var elLivesSpan = document.querySelector(".lives span");
  elLivesSpan.innerText = gLives;

  var elSmileySpan = document.querySelector(".smiley span");
  elSmileySpan.innerText = SMILEY;

  var elHintsSpan = document.querySelector(".hints_button span");
  elHintsSpan.innerText = gSafeClicks;

  var elSafeSpan = document.querySelector(".safe_button span");
  elSafeSpan.innerText = gSafeClicks;
}

function cellClicked(elCell, i, j) {
  if (isGameOn) {
    if (!gIntervalId) startTimer();
    if (gClickedHint) {
      showHint(i, j);
      gClickedHint = false;
    }
    if (gFirstClick) {
      if (gBoard[i][j].isMine) {
        console.log("first clicked mine, restarting...");
        startGame();
        startTimer();
      }
      gFirstClick = false;
    }
    currCell = gBoard[i][j];
    if (currCell.isMarked) return;
    if (currCell.isShown) return;
    if (currCell.MinesAroundCount === 0) {
      currCell.isShown = true;
      renderCell({ i, j }, gBoard[i][j].MinesAroundCount);
      expandShown(gBoard, i, j);
      gUndo.push({ i, j, action: "expandClick" });
      checkVictory();
      return;
    }
    currCell.isShown = true;
    renderCell({ i, j }, gBoard[i][j].MinesAroundCount);
    gUndo.push({ i, j, action: "click" });
    if (currCell.isMine) {
      gLives--;
      var elLivesSpan = document.querySelector(".lives span");
      elLivesSpan.innerText = gLives;
      if (gLives === 0) gameOver();
    } else {
      checkVictory();
    }
  }
}

function cellMarked(elCell, i, j) {
  if (isGameOn) {
    if (!gIntervalId) startTimer();
    gFirstClick = false;
    if (gClickedHint) return;
    console.log("right clicked");
    if (gBoard[i][j].isShown) return;
    if (gBoard[i][j].isMarked) {
      gBoard[i][j].isMarked = false;
      elCell.innerText = " ";
      renderCell({ i, j }, " ");
      gUndo.push({ i, j, action: "unmark" });
    } else {
      gBoard[i][j].isMarked = true;
      elCell.innerText = FLAG;
      renderCell({ i, j }, FLAG);
      gUndo.push({ i, j, action: "mark" });
    }
    checkVictory();
  }
}

function checkVictory() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      currCell = gBoard[i][j];
      if (!currCell.isMine && currCell.isShown === false) return;
      if (currCell.isMine && !currCell.isShown && !currCell.isMarked) return;
    }
  }
  gIsVictorious = true;
  gameOver();
}

function expandShown(board, cI, cJ) {
  for (var i = cI - 1; i <= cI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cJ - 1; j <= cJ + 1; j++) {
      if (i === cI && j === cJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      currCell = gBoard[i][j];
      renderCell({ i, j }, currCell.MinesAroundCount);
      currCell.isShown = true;
    }
  }
}

function gameOver() {
  var smiley = gIsVictorious ? SUNGLASSES : LOST;
  var elSmileySpan = document.querySelector(".smiley span");
  elSmileySpan.innerText = smiley;
  isGameOn = false;
  clearInterval(gIntervalId);
  if (!gIsVictorious) {
    revealMines(gMines);
    return;
  }
  updateScore();
}



function chooseDifficulty(level) {
  gLevel.SIZE = level;
  switch (level) {
    case 4:
      gLevel.MINES = 2;
      break;
    case 8:
      gLevel.MINES = 12;
      break;
    case 12:
      gLevel.MINES = 30;
      break;
  }
  console.log();
  startGame();
}

function getSafeClick() {
  if (gSafeClicks === 0) return;
  var location = findFreeCell(gBoard);
  var currCell = gBoard[location.i][location.j];
  console.log("gethint:", currCell);
  if (location) {
    currCell.isShown = true;
    isGameOn = false;
    renderCell({ i: location.i, j: location.j }, currCell.MinesAroundCount);
    setTimeout(revealCell, 1000, location);
    gSafeClicks--;
    var elSafeSpan = document.querySelector(".safe_button span");
    elSafeSpan.innerText = gSafeClicks;
  }
}

function showHint(cI, cJ) {
  for (var i = cI - 1; i <= cI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cJ - 1; j <= cJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      var currCell = gBoard[i][j];
      if (currCell.isShown) continue;
      currCell.isShown = true;
      isGameOn = false;
      renderCell({ i, j }, currCell.MinesAroundCount);
      setTimeout(revealCell, 1000, { i, j });
    }
  }
  gHints--;
  var elHintsSpan = document.querySelector(".hints_button span");
  elHintsSpan.innerText = gHints;
}

function notHint() {
  if (isGameOn) {
    if (gHints > 0) gClickedHint = !gClickedHint;
    else console.log("no hints left");
  }
}

function revealCell(location) {
  var currCell = gBoard[location.i][location.j];
  console.log(currCell.MinesAroundCount);
  renderCell({ i: location.i, j: location.j }, " ");
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  elCell.style.backgroundColor = "lightblue";
  currCell.isShown = false;
  isGameOn = true;
}

function undo() {
  if (!isGameOn) return;
  if (!gUndo.length) {
    console.log("no moves to undo");
    return;
  }
  var lastMove = gUndo.pop();
  switch (lastMove.action) {
    case "unmark":
      gBoard[lastMove.i][lastMove.j].isMarked = true;
      renderCell({ i: lastMove.i, j: lastMove.j }, FLAG);
      break;
    case "mark":
      gBoard[lastMove.i][lastMove.j].isMarked = false;
      renderCell({ i: lastMove.i, j: lastMove.j }, FLAG);
      break;
    case "click":
      gBoard[lastMove.i][lastMove.j].isShown = false;
      renderCell({ i: lastMove.i, j: lastMove.j }, "");
      if (gBoard[lastMove.i][lastMove.j].isMine) {
        gLives++;
        var elLivesSpan = document.querySelector(".lives span");
        elLivesSpan.innerText = gLives;
      }
      break;
    case "expandClick":
      for (var i = lastMove.i - 1; i <= lastMove.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = lastMove.j - 1; j <= lastMove.j + 1; j++) {
          if (j < 0 || j >= gBoard[i].length) continue;
          gBoard[i][j].isShown = false;
          renderCell({ i, j }, "");
        }
      }
      break;
  }
}
