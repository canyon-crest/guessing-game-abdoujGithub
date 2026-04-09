//variables
const inpt = $("guess");
const playBtn = $("playBtn");
const guessBtn = $("guessBtn");
const giveUpBtn = $("giveUpBtn");
const feedbackMsg = $("msg");
const levels = document.getElementsByName("level");

let name = prompt("Enter your name:");
let elapsed;
let timeElapsed = 0;
let max = 0;
let guessCount = 0;
let answer = 0;

const scores = [[], [], []];
const times = [[], [], []];
updateLB();

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);
$("e").addEventListener("click", updateLB);
$("m").addEventListener("click", updateLB);
$("h").addEventListener("click", updateLB);

function play() {
    //variables
    max = getMax();
    updateLB();

    //disables buttons
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = true; }
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;

    //actual stuff
    feedbackMsg.textContent = "Guess a number, 1-" + max;
    answer = genRandInt(max);

    timeElapsed = 0;
    elapsed = setInterval(timer, 10);
}

function makeGuess() {
    // For more above and beyond i can check whether they put in a float vs an integer
    // and i can punish them if they put like 2.3 for being a nuissance :)
    let guess = parseInt(inpt.value);
    // above and beyond apparently (if not less than 1 or above max)
    if (isNaN(guess) || guess < 1 || guess > max) {
        feedbackMsg.textContent = "Please enter a valid number";
        return;
    }

    guessCount++;

    let diff = Math.abs(guess - answer); 

    if (guess === answer){
        feedbackMsg.textContent = "Correct! It took " + guessCount + (guessCount !== 1 ? " tries." : " try.");
        updateScore();
        reset(true);
    }
    else if (diff <= 2) {
        feedbackMsg.textContent = "you're hottttt.";
    }
    else if (diff <= 5) {
        feedbackMsg.textContent = "warmmmmmm";
    }
    else {
        feedbackMsg.textContent = "freeezing cold-";
    }
}

function giveUp() {

    // make it add the worst possibility to scores; i.e. if they had already guessed 1 and 2 but gave up before guessing 3, add 1 because there was 1 more number they hadn't guessed
    // tl;dr add the size of the numbers they didn't guess (between 1 and max)
    reset(false);
    updateScore();
}

function updateScore() {
    let level = getLevel();

    scores[level].push(guessCount);
    times[level].push(timeElapsed);

    scores[level].sort((a,b) => a-b);
    times[level].sort((a,b) => a-b);

    updateLB();
}

function reset(didWin) {
    //feedbackMsg.textContent = (didWin ? "You win! " : "You gave up... ") + "Select another Level";
    //clearInterval(elapsed);
    
    inpt.value = "";
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = false; }

    guessCount = 0;

    
}

function timer() {
    return ++timeElapsed;
}

const dateTxt = $("date");
updateDate();
function updateDate() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let curTime = new Date();
    dateTxt.textContent = months[curTime.getMonth()] + " " + curTime.getDate() + suffix(curTime.getDate()) + ", " + curTime.getFullYear() + " " + curTime.getHours() + ":" + addFrontZero(curTime.getMinutes()) + ":" + addFrontZero(curTime.getSeconds());
}

setInterval(updateDate, 1000);

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

function updateLB() {
    let level = getLevel();

    $("wins").textContent = "Total wins: " + scores[level].length;
    $("avgScore").textContent = "Average Score: " + avg(scores[level]).toFixed(2);
    $("fastest").textContent = "Fastest Game: " + toTime(times[level].length > 0 ? times[level][0] : "0.00");
    $("avgTime").textContent = "Average Time: " + toTime(avg(times[level]));

    $("lbtext").textContent = "Leaderboard—(" + ["Easy", "Medium", "Hard"][level] + "):";
    $("statstext").textContent = "Stats (" + ["Easy", "Medium", "Hard"][level] + "):";
    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        if (i < scores[level].length) lb[i].textContent = scores[level][i];
        else lb[i].textContent = "NONE";
    }
}

function avg(arr) {
    return (arr.length !== 0 ? arr.reduce((sum, curr) => sum + curr, 0) / arr.length : 0);
}

function getMax() {
    return parseInt(levels[getLevel()].value);
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