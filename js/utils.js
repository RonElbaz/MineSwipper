//render spesific cell
function renderCell(location, value) {
  var cellSelector = "." + getClassName(location);
  var elCell = document.querySelector(cellSelector);
  if (gBoard[location.i][location.j].isMarked) return;
  if (value === "*") {
    elCell.innerText = MINE;
    elCell.style.backgroundColor = "red";
  } else if (value !== 0) {
    elCell.innerText = value;
    elCell.style.backgroundColor = "lightblue";
  }
   else {
    elCell.innerText = " ";
    elCell.style.backgroundColor = "grey";
  }
  //console.log(elCell)
}

//get classname
function getClassName(location) {
  var cellClass = "cell-" + location.i + "-" + location.j;
  return cellClass;
}

//get random number
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

//clear win/lose modal
function clearModal() {
  var elSmiley = document.querySelector(".smiley span");
  elSmiley = SMILEY;
  gIsVictorious = false;
}

function findFreeCell(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      var currCell = board[i][j];
      if (!currCell.isMarked && !currCell.isShown && !currCell.isMine) return { i, j };
    }
  }
  return false;
}

function calculateScore(){
  var score = 0;
  var elTimerSpan = document.querySelector(".timer span");
  var time = +elTimerSpan.innerText
  console.log("time", time)
  console.log(gLevel.SIZE)
  console.log(gHints)
  console.log(gSafeClicks)
  score = gLevel.SIZE*gLevel.SIZE +(100/time)+gHints+gSafeClicks;
  console.log(score)
  return score
}

function updateScore(){
  if(!gFirstClick)gScore = calculateScore();
  switch (gLevel.SIZE) {
    case 4:
      if (!localStorage.easy) localStorage.easy = gScore;
      else {
        if (localStorage.easy < gScore) localStorage.easy = gScore;
      }
      break;
      case 5:
      if (!localStorage.medium) localStorage.medium = gScore;
      else {
        if (localStorage.medium < gScore) localStorage.medium = gScore;
      }
      break;
      case 6:
      if (!localStorage.hard) localStorage.hard = gScore;
      else {
        if (localStorage.hard < gScore) localStorage.hard = gScore;
      }
      break;
  }
}

function getHighestScore(){
  var elScoreSpan = document.querySelector(".score span");
  console.log(elScoreSpan)
  var innerSTR = ""
  switch (gLevel.SIZE) {
    case 4:
      if(!localStorage.easy) innerSTR = "no highest score yet"
      else innerSTR = localStorage.easy.split('.')[0]
      break;
      case 5:
        if(!localStorage.medium) innerSTR = "no highest score yet"
      else innerSTR = localStorage.medium.split('.')[0]
      break;
      case 6:
        if(!localStorage.hard) innerSTR = "no highest score yet"
      else innerSTR = localStorage.hard.split('.')[0]
      break;
  }
  elScoreSpan.innerText = innerSTR
}
