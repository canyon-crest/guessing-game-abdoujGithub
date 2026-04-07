//variables
const inpt = $("guess");
const playBtn = $("playBtn");
const guessBtn = $("guessBtn");
const giveUpBtn = $("giveUpBtn");
const levels = document.getElementsByName("level");

let guess = 0;
let answer = 0;
let max = 0;

let wins = 0;
const scores = [];

playBtn.addEventListener("click", play);
//guessBtn.addEventListener("click", guess);
//giveUpBtn.addEventListener("click", giveUp);

function play(){
    //variables
    let guessCount = 0;
    max = getMax();

    //disables buttons
    for (let i = 0; i < levels.length; i++) { levels[i].disabled = true; }
    playBtn.disabled = true;
    guessBtn.disabled = false;
    giveUpBtn.disabled = false;

    //actual stuff
    $("msg").textContent = "Guess a number, 1-" + max;
    answer = genRandInt(max);
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