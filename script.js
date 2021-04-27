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
    document.querySelectorAll("#players .player img").forEach(
        (elem, ind) => {
            let roll = rand()
            playerRolls.push(roll);
            elem.setAttribute("src", `img/dice/${roll}.svg`);
            elem.style.transform = `rotate(${(Math.random()-0.5)*50}deg)`
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
        Array.from(document.querySelectorAll("#players .player-name").values(), e => e.textContent);
    if(winnerIndices.length == 1){
        text = `${playerNames[winnerIndices[0]]} wins`;
    }else{
        let winnerNames = winnerIndices.map(ind => playerNames[ind]);
        text = `It's a draw between ${winnerNames.slice(0, -1).join(", ")} and ${winnerNames[winnerNames.length-1]}`;
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
    let target = event.target;
    let playerDiv = target.closest(".player");
    let form = playerDiv.querySelector("form");
    let textInput = form.querySelector("input[type='text']");
    let playerNameDisp = playerDiv.querySelector(".player-name");
    textInput.value = playerNameDisp.textContent;
    toggleEditVisibility(playerNameDisp.parentElement);
    textInput.focus();
}

function nameEditFormSubmit(event){
    event.preventDefault();
    let form = event.target;
    let nameElem = form.closest(".player").querySelector(".player-name");
    nameElem.innerHTML = form.firstElementChild.value;
    toggleEditVisibility(form.parentElement);
}

function nameEditInputBoxBlur(event){
    let inputBox = event.target;
    if (! inputBox.parentElement.classList.contains("hidden"))
        toggleEditVisibility(inputBox.parentElement.parentElement);
}

function nameEditInputBoxKeydown(event){
    let inputBox = event.target;
    var x = event.keyCode;
    if (x == 27) {
        toggleEditVisibility(inputBox.parentElement.parentElement);
    }
}

function addEditingEventListeners(){
    document.querySelectorAll(".player-name").forEach(elem => elem.addEventListener("click", nameClicked));
    document.querySelectorAll(".pencil-icon").forEach(elem => elem.addEventListener("click", nameClicked));
    document.querySelectorAll(".delete-icon").forEach(elem => elem.addEventListener("click", deleteIconClicked));

    let forms = document.querySelectorAll(".player form");
    forms.forEach(form => form.addEventListener("submit", nameEditFormSubmit));

    document.querySelectorAll(".player input[type='text']")
        .forEach(textIntput => textIntput.addEventListener("blur", nameEditInputBoxBlur));

    document.querySelectorAll(".player input[type='text']")
        .forEach(textIntput => textIntput.addEventListener("keydown", nameEditInputBoxKeydown));
}

function toggleEditVisibility(playerH2){
    playerH2.querySelector("form").classList.toggle("hidden");
    playerH2.querySelector(".player-name").classList.toggle("hidden");
}

// adding new player

function addPlayer(){
    let newPlayerElement =
        document.querySelector("#player-template").firstElementChild.cloneNode(true);
    newPlayerElement.querySelector(".player-name").innerHTML =
        "New Player";
    document.querySelector("#players").appendChild(newPlayerElement);
    addEditingEventListeners();
}

function deleteIconClicked(event){
    if(document.querySelectorAll("#players .player").length > 2){
        let playerDiv = event.target.closest(".player");
        playerDiv.parentElement.removeChild(playerDiv);
    }
}