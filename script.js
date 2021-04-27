addPlayer();
addPlayer();
addEditingEventListeners();

document.querySelector(".add-player").addEventListener("click", addPlayer);

document.querySelector("a#click-to-roll").addEventListener("click",(e) => {
    e.preventDefault();
    roll();
    return false;
});

// dice rolling logic

function roll() {
    let rand = () => Math.floor(Math.random() * 6) + 1;
    let playerRolls = []
    document.querySelectorAll("#dice .player img").forEach(
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
    let playerNames =
        Array.from(document.querySelectorAll("#dice .player-name").values(), e => e.textContent);
    if(winnerIndices.length == 1){
        text = `${playerNames[winnerIndices[0]]} wins`;
    }else{
        text = `It's a draw between ` + winnerIndices.map(ind => playerNames[ind]).join(", ")
    }

    document.querySelector(("#result #winners")).textContent = text;
}

function putFlags(winnerIndices){
    let flagDivs = document.querySelectorAll(".flag");
    flagDivs.forEach(div => div.innerHTML = "");
    winnerIndices.forEach(ind => flagDivs[ind].innerHTML = "🚩");
}


// name editing

function nameClicked(event){
    let form = event.target.parentNode.querySelector("form");
    let textInput = form.querySelector("input[type='text']");
    textInput.value = event.target.textContent;
    toggleEdit(event.target.parentElement);
    textInput.focus();
}

function nameEditFormSubmit(event){
    event.preventDefault();
    let form = event.target;
    let nameElem = form.closest(".player").querySelector(".player-name");
    nameElem.innerHTML = form.firstElementChild.value;
    toggleEdit(form.parentElement);
}

function nameEditInputBoxBlur(event){
    let inputBox = event.target;
    if (! inputBox.parentElement.classList.contains("hidden"))
        toggleEdit(inputBox.parentElement.parentElement);
}

function nameEditInputBoxKeydown(event){
    let inputBox = event.target;
    var x = event.keyCode;
    if (x == 27) {
        toggleEdit(inputBox.parentElement.parentElement);
    }
}

function addEditingEventListeners(){
    document.querySelectorAll(".player-name").forEach(elem => elem.addEventListener("click", nameClicked));

    let forms = document.querySelectorAll(".player form");
    forms.forEach(form => form.addEventListener("submit", nameEditFormSubmit));

    document.querySelectorAll(".player input[type='text']")
        .forEach(textIntput => textIntput.addEventListener("blur", nameEditInputBoxBlur));

    document.querySelectorAll(".player input[type='text']")
        .forEach(textIntput => textIntput.addEventListener("keydown", nameEditInputBoxKeydown));
}

function toggleEdit(playerH2){
    playerH2.querySelector("form").classList.toggle("hidden");
    playerH2.querySelector(".player-name").classList.toggle("hidden");
}

// adding new player

function addPlayer(){
    let newPlayerElement =
        document.querySelector("#player-template").firstElementChild.cloneNode(true);
    newPlayerElement.querySelector(".player-name").innerHTML =
        "Player " + (document.querySelectorAll("#dice .player-name").length + 1);
    document.querySelector("#dice").appendChild(newPlayerElement);
    addEditingEventListeners();
}

function deletePlayer(playerDiv){
    playerDiv.parentElement.removeChild(playerDiv);
}