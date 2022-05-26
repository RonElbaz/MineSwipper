//start the timer
function startTimer() {
  gStartTime = Date.now();
  gIntervalId = setInterval(updateTime, 80);
}

//update the timer
function updateTime() {
  var now = Date.now();
  var diff = now - gStartTime;
  var secondsPast = diff / 1000;
  var elTimerSpan = document.querySelector(".timer span");
  elTimerSpan.innerText = secondsPast.toFixed(3);
}

//restart timer
function recoilTimer() {
  var elTimerSpan = document.querySelector(".timer span");
  elTimerSpan.innerText = "";
  if(gIntervalId)clearInterval(gIntervalId)
  gIntervalId = 0;
  gStartTime = 0;
}
