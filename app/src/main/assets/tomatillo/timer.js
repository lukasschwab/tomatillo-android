var CLOCK_ID = 'clockdiv'
var COLORS = {
  "red": "#FF4136",
  "redtext": "#001F3F",
  "lime": "#01FF70",
  "limetext": "#001F3F"
}

function notify(intoWork) {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    if (intoWork) {
      var notification = new Notification("Tomatillo", {
        "body": "Start working!",
      })
    } else {
      var notification = new Notification("Tomatillo", {
        "body": "Take a break!",
      })
    }
    // NOTE: I comment this out when testing locally because notifications break.
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (p) {
      if (p === "granted") {
        if (intoWork) {
          var notification = new Notification("Tomatillo", {
            "body": "Start working!",
          })
        } else {
          var notification = new Notification("Tomatillo", {
            "body": "Take a break!",
          })
        }
      }
    })
  }
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor(t / 1000 / 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeWorkClock(endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime);

    if (t.minutes < 10) {
      minutesSpan.innerHTML = ('0' + t.minutes);
    } else {
      minutesSpan.innerHTML = (t.minutes);
    }
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      // clearInterval(timeinterval);
      switchToBreak();
    }
  }
  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

// Trigger UI for switch to break timer
function switchToBreak() {
  clearInterval(timeinterval)
  modeTitle.innerHTML = "break";
  document.body.style.backgroundColor = COLORS.lime;
  document.body.style.color = COLORS.limetext;
  workSetting.style.background = COLORS.limetext;
  workSetting.style.color = COLORS.lime;
  breakSetting.style.background = COLORS.limetext;
  breakSetting.style.color = COLORS.lime;
  favicon.setAttribute("href", "favicon-green.ico");
  notify(false)
  // Set the new timer
  var duration;
  if (parseInt(breakSetting.value)) {
    duration = parseInt(breakSetting.value) * 60 * 1000;
  } else {
    duration = DEFAULT_TIMES.break * 60 * 1000;
  }
  initializeBreakClock(new Date(Date.parse(new Date()) + duration))
}

function initializeBreakClock(endtime) {
  function updateClock() {
    var t = getTimeRemaining(endtime)

    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      switchToWork();
    }
  }
  updateClock();
  timeinterval = setInterval(updateClock, 1000);
}

// Trigger UI for switch to work timer
function switchToWork() {
  clearInterval(timeinterval)
  modeTitle.innerHTML = "work";
  document.body.style.backgroundColor = COLORS.red;
  document.body.style.color = COLORS.redtext;
  workSetting.style.background = COLORS.redtext;
  workSetting.style.color = COLORS.red;
  breakSetting.style.background = COLORS.redtext;
  breakSetting.style.color = COLORS.red;
  favicon.setAttribute("href", "favicon-red.ico");
  notify(true);
  // Calculate next work duration, initialize clock
  var duration;
  if (parseInt(workSetting.value)) {
    duration = parseInt(workSetting.value) * 60 * 1000;
  } else {
    duration = DEFAULT_TIMES.work * 60 * 1000;
  }
  initializeWorkClock(new Date(Date.parse(new Date()) + duration))
}

var timeinterval;
// Pull elements from document
var favicon = document.getElementById("favicon");
var modeTitle = document.getElementById("modeTitle");
var clock = document.getElementById(CLOCK_ID);
var minutesSpan = clock.querySelector('.minutes');
var secondsSpan = clock.querySelector('.seconds');
var workSetting = document.getElementById("workMinutes");
workSetting.value = DEFAULT_TIMES.work;
var breakSetting = document.getElementById("breakMinutes");
breakSetting.value = DEFAULT_TIMES.break;
// Start with work
switchToWork();
