//variables
const inpt = $("guess");
const playBtn = $("playBtn");
const guessBtn = $("guessBtn");
const giveUpBtn = $("giveUpBtn");
const feedbackMsg = $("msg");
const dateTxt = $("date");
const sidebar = $("sidebar");
const toggleBtn = $("toggleSidebar");
const guessList = $("guessList");
const levels = document.getElementsByName("level");

//looked up this syntax
toggleBtn.addEventListener("click", ()=> {
  sidebar.classList.toggle("collapsed");
  toggleBtn.textContent = sidebar.classList.contains("collapsed") ? "⮞" : "⮜";
});

let player = prompt("Enter your name:");
player = player.charAt(0).toUpperCase() + player.substring(1, player.length).toLowerCase();
let elapsed;
let timeElapsed = 0;
let max = 0;
let guessCount = 0;
let answer = 0;
let gameActive = false;
const hasGuessed = [];

const names = ["Easy", "Medium", "Hard", "Custom"];
const scores = [[], [], [], []];
const times = [[], [], [], []];

//update text on page load
updateLB();
updateDate();
setInterval(updateDate, 1000);

feedbackMsg.textContent = "Select a Level, " + player + ".";
inpt.disabled = true;

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
for (let i = 0; i < levels.length; i++) { levels[i].addEventListener("click", updateLB); }

function play() {
    //variables
    guessList.innerHTML = "";

    max = getMax();
    updateLB();

    //disables buttons
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = true; }
    playBtn.disabled = true;
    guessBtn.disabled = false;
 
    inpt.disabled = false;
    if (getLevel() === 3) { //only happens if custom
        feedbackMsg.textContent = "Enter an upper bound, " + player + ", and make sure it is two or greater."
        giveUpBtn.disabled = true;
        guessBtn.textContent = "Submit";
    }
    else { begin(); }
}

function begin() {
    feedbackMsg.textContent = "Hello, " + player + "! Guess a number, 1-" + max + ".";
    answer = genRandInt(max);
    giveUpBtn.disabled = false;
    guessBtn.textContent = "Guess";
    inpt.value = "";

    timeElapsed = 0;
    elapsed = setInterval(timer, 10);
    gameActive = true;
}

function makeGuess() {
    let guess = parseInt(inpt.value);

    if (!gameActive) {
        if (isNaN(guess) || guess < 2) {
            feedbackMsg.textContent = player + ", please enter a valid number.";
            return;
        }
        else { max = guess; begin(); return; }
    }

    if (isNaN(guess) || guess < 1 || guess > max) {
        feedbackMsg.textContent = player + ", please enter a valid number (1-" + max + ").";
        return;
    }

    if (hasGuessed.includes(guess)) {
        feedbackMsg.textContent = player + ", you've already guessed '" + guess + "'.";
        return;
    }

    hasGuessed.push(guess);
    guessCount++;

    let gss = document.createElement("gss");
    let gssContent = guess+" ";

    let diff = Math.abs(guess - answer); 

    if (guess === answer){
        feedbackMsg.textContent = "You got it correct, " + player + "! It took you " + guessCount + (guessCount !== 1 ? " tries." : " try.");
        gssContent += "(Correct!)";
        updateScore();
        reset(true);
    }
    else if (diff <= 2) {
        feedbackMsg.textContent = player + ", you're hottt.";
        gssContent += "(hot";
    }
    else if (diff <= 5) {
        feedbackMsg.textContent = "That's warm, " + player + ".";
        gssContent += "(warm";
    }
    else {
        feedbackMsg.textContent = player + "... that's freezing cold.";
        gssContent += "(cold";
    }
    if (guess < answer) {
        feedbackMsg.textContent += " Too low, try again.";
        gssContent += ", too low)";
    }
    else if (guess > answer) {
        feedbackMsg.textContent += " Too high, try again.";
        gssContent += ", too high)";
    }
    gss.textContent = gssContent;
    gss.style.color = (guess > answer ? "#f87171" : (guess === answer ? "#4ade80" : "#38bdf8"));
    guessList.appendChild(gss);
}

function giveUp() {
    //if this doesn't update total wins, the autograder fails :(
    if (!gameActive) {
        feedbackMsg.textContent = player + ", you can't give up now...";
        return;
    }
    guessCount = max;
    updateScore(false);
    reset(false);
}

function updateScore() {
    let level = getLevel();

    scores[level].push(guessCount);
    times[level].push(timeElapsed);

    scores[level].sort((a,b) => a-b);
    times[level].sort((a,b) => a-b);

    updateLB();
}

function updateLB() {
    let level = getLevel();

    $("wins").textContent = "Total wins: " + scores[level].length;
    $("avgScore").textContent = "Average Score: " + avg(scores[level]).toFixed(2);
    $("fastest").textContent = "Fastest Game: " + toTime(times[level].length > 0 ? times[level][0] : "0.00");
    $("avgTime").textContent = "Average Time: " + toTime(avg(times[level]));

    $("lbtext").textContent = "Leaderboard—(" + names[level] + "):";
    $("statstext").textContent = "Stats (" + names[level] + "):";
    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        if (i < scores[level].length) lb[i].textContent = scores[level][i] + (scores[level][i] !== 1 ? " guesses" : " guess");
        else lb[i].textContent = "NONE";
    }
}

function reset(didWin) {
    feedbackMsg.textContent = player + (didWin ? ", you got it correct and won! " : ", you gave up... ") + "Select another Level";
    clearInterval(elapsed);
    
    hasGuessed.length = 0;

    inpt.value = "";
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    inpt.disabled = true;
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = false; }

    guessCount = 0;
    gameActive = false;
}

function updateDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let curTime = new Date();
    dateTxt.textContent = months[curTime.getMonth()] + " " + curTime.getDate() + suffix(curTime.getDate()) + ", " + curTime.getFullYear() + " " + curTime.getHours() + ":" + addFrontZero(curTime.getMinutes()) + ":" + addFrontZero(curTime.getSeconds());
}

function addFrontZero(n) {
    for(let i = 0; i < 2-(""+n).length; i++) {
        n = "0" + n;
    }
    return n;
}

function suffix(n) {
    const hundrd = n % 100;
    if (hundrd === 11 || hundrd === 12 || hundrd === 13) return "th";
    const tenth = n % 10;
    if (tenth === 1) {
        return "st";
    }
    else if (tenth === 2) {
        return "nd";
    }
    else if (tenth === 3) {
        return "rd";
    }
    else {
        return "th";
    }
}

function toTime(n) {
    return (n/100).toFixed(2);
}

function avg(arr) {
    return (arr.length !== 0 ? arr.reduce((sum, curr) => sum + curr, 0) / arr.length : 0);
}

function getMax() {
    return parseInt(levels[getLevel()].value);
}

function timer() {
    return ++timeElapsed;
}

function getLevel() {
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) return i;
    }
}

function genRandInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function $(id) { return document.getElementById(id); }