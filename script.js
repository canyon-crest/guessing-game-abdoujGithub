//variables
const inpt = $("guess");
const playBtn = $("playBtn");
const guessBtn = $("guessBtn");
const giveUpBtn = $("giveUpBtn");
const feedbackMsg = $("msg");
const levels = document.getElementsByName("level");

let max = 0;
let guessCount = 0;
let answer = 0;

const scores = [];

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
giveUpBtn.addEventListener("click", giveUp);

function play() {
    //variables
    max = getMax();

    //disables buttons
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = true; }
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;

    //actual stuff
    feedbackMsg.textContent = "Guess a number, 1-" + max;
    answer = genRandInt(max);
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

    if (guess === answer){
        feedbackMsg.textContent = "Correct! It took " + guessCount + (guessCount !== 1 ? " tries." : " try.");
        updateScore();
        reset(true);
    }
    else if (guess < answer) {
        feedbackMsg.textContent = "Too low, try again.";
    }
    else {
        feedbackMsg.textContent = "Too high, try again.";
    }
}

function giveUp() {

    // make it add the worst possibility to scores; i.e. if they had already guessed 1 and 2 but gave up before guessing 3, add 1 because there was 1 more number they hadn't guessed
    // tl;dr add the size of the numbers they didn't guess (between 1 and max)
    reset(false);
    updateScore();
}

function updateScore() {
    scores.push(guessCount);
    $("wins").textContent = "Total wins: " + scores.length;
    $("avgScore").textContent = "Average Score: " + avg(scores).toFixed(2);

    scores.sort((a,b) => a-b);

    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        if (i < scores.length) lb[i].textContent = scores[i];
        else break;
    }

}

function reset(didWin) {
    feedbackMsg.textContent = (didWin ? "You win! " : "You gave up... ") + "Select another Level";
    inpt.value = "";
    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = false; }

    guessCount = 0;

    
}











function avg(arr) {
    return (arr.length !== 0 ? arr.reduce((sum, curr) => sum + curr, 0) / arr.length : 0);
}

function getMax() {
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) return parseInt(levels[i].value);
    }
}

function genRandInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function $(id) { return document.getElementById(id); }