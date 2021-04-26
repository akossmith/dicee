document.querySelector("a#click-to-roll").addEventListener("click",(e) => {
    e.preventDefault();
    roll();
    return false;
});

// let players = ["Player 1", "Player 2"];

function roll() {
    let rand = () => Math.floor(Math.random() * 6) + 1;
    let playerRolls = []
    document.querySelectorAll(".player img").forEach(
        (elem, ind) => {
            let roll = rand()
            playerRolls.push(roll);
            elem.setAttribute("src", `img/dice${roll}.svg`);
        }
    );
    let winnerIndices = calcWinnerIndices(playerRolls);
    displayWinner(winnerIndices);
    putFlags(winnerIndices);
}

function calcWinnerIndices(playerRolls){
    let maxRoll = Math.max(...playerRolls);
    let winnerIndices = []
    playerRolls.forEach((elem, ind) => {
        if(elem == maxRoll){
            winnerIndices.push(ind);
        }
    });
    return winnerIndices;
}

function displayWinner(winnerIndices){
    let text;
    if(winnerIndices.length == 1){
        text = `Player ${winnerIndices[0]} wins.`;
    }else{
        text = `It's a draw between ` + winnerIndices.map(ind => `Player ${ind}`).join(", ")
    }

    document.querySelector(("#result #winners")).textContent = text;
}

function putFlags(winnerIndices){
    let flagDivs = document.querySelectorAll(".flag");
    flagDivs.forEach(div => div.innerHTML = "");
    winnerIndices.forEach(ind => flagDivs[ind].innerHTML = "🚩");
}


// name editing

document.querySelectorAll(".player-name").forEach(elem => elem.addEventListener("click", (event) => {
    let form = elem.parentNode.querySelector("form");
    let textInput = form.querySelector("input[type='text'");
    textInput.value = elem.textContent;
    toggleEdit(elem.parentElement);
    textInput.focus();
}));

let forms = document.querySelectorAll("form");
forms.forEach(form => form.addEventListener("submit", () => {
    let nameElem = form.closest(".player").querySelector(".player-name");
    nameElem.innerHTML = form.firstElementChild.value;
    toggleEdit(form.parentElement);
}));

document.querySelectorAll("input[type='text']").forEach(textIntput => textIntput.addEventListener("blur", () => {
    if (! textIntput.parentElement.classList.contains("hidden"))
        toggleEdit(textIntput.parentElement.parentElement);
    //event.target ?????????
}));

document.querySelectorAll("input[type='text']").forEach(textIntput => textIntput.addEventListener("keydown", (event) => {
    var x = event.keyCode;
    if (x == 27) {
        toggleEdit(textIntput.parentElement.parentElement);
    }
}));

function toggleEdit(playerH2){
    playerH2.children[0].classList.toggle("hidden");
    playerH2.children[1].classList.toggle("hidden");
}

// adding new player
