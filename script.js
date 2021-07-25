let wins = []
let cachedImages = []

for(let i = 6; i >= 1; i--){
    cachedImages[i] = new Image(100, 100);
    cachedImages[i].src = `img/dice/${i}.svg`;
}

cachedImages[6].addEventListener("load", () => {
    addPlayer("Player 1");
    addPlayer("Player 2");
});

// dice rolling logic

document.querySelector("a#click-to-roll").addEventListener("click",(e) => {
    e.preventDefault();
    roll();
    return false;
});

function roll() {
    let rand = () => Math.floor(Math.random() * 6) + 1;
    let playerRolls = []
    document.querySelectorAll("#players .player canvas").forEach(
        (elem, ind) => {
            let roll = rand()
            playerRolls.push(roll);

            ctx = elem.getContext('2d');
            ctx.drawImage(cachedImages[roll], 0, 0);
            elem.style.transform = `rotate(${(Math.random()-0.5)*50}deg)`;
        }
    );
    let winnerIndices = calcWinnerIndices(playerRolls);
    displayWinner(winnerIndices);
    putWinnerMarkers(winnerIndices);

    updateStats(winnerIndices);
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

function calcPlayerNames(){
    return Array.from(document.querySelectorAll("#players .player-name").values(), e => e.textContent);
}

function calcWinnerNames(winnerIndices){
    let playerNames = calcPlayerNames();
    let winnerNames = winnerIndices.map(ind => playerNames[ind]);
    return winnerNames;
}

function displayWinner(winnerIndices){
    let text;
    let winnerNames = calcWinnerNames(winnerIndices);
    if(winnerNames.length == 1){
        text = `<em>${winnerNames[0]}</em> wins this round`;
    }else{
        text = `This round is a draw between
            ${winnerNames.slice(0, -1).map(s => '<em>'+s+'</em>').join(", ")}
            and <em>${winnerNames[winnerNames.length-1]}<em>`;
    }

    document.querySelector(("#result #winners")).innerHTML = text;
}

function putWinnerMarkers(winnerIndices){
    let flagDivs = document.querySelectorAll(".flag");
    flagDivs.forEach(div => div.style.visibility = "hidden");
    winnerIndices.forEach(ind => flagDivs[ind].style.visibility = "visible");
}

// name editing

addEditingEventListeners();

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

// adding/deleting player

document.querySelector(".add-player").addEventListener("click", addPlayerClicked);

function addPlayerClicked(){
    addPlayer();
}

function addPlayer(name = "New Player"){
    let newPlayerElement =
        document.querySelector("#player-template").firstElementChild.cloneNode(true);
    newPlayerElement.querySelector(".player-name").innerHTML = name;
    document.querySelector("#players").appendChild(newPlayerElement);

    ctx = newPlayerElement.querySelector(".dice-image-container canvas").getContext('2d');
    ctx.drawImage(cachedImages[6], 0, 0);

    addEditingEventListeners();

    wins.push(0);
}

function deleteIconClicked(event){
    let numPlayers = document.querySelectorAll("#players .player").length;
    if(numPlayers > 2){
        let playerDiv = event.target.closest(".player");
        playerDiv.parentElement.removeChild(playerDiv);

        let currPlayerInd = Array.from(document.querySelectorAll("#players .player")).indexOf(playerDiv);
        wins.splice(currPlayerInd,1);
    }
}

// stats

function updateStats(winnerIndices){
    winnerIndices.forEach(i => wins[i]++);

    let statsDiv = document.querySelector("#stats");

    let playerNames = calcPlayerNames();

    function flags(num){
        let a = new Array(num);
        a.fill('<span class="flag">&#11044;</span>',0,num);
        return a.join("");
    }

    let html = "<table>"
    html += playerNames.map((name, ind) => `<tr><td>${name} ` + '</td><td>' + flags(wins[ind]) + wins[ind] + "</td></tr>").join("");
    html += "</table>"

    statsDiv.innerHTML = html;
}