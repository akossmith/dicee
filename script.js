document.querySelector("a#click-to-roll").addEventListener("click",(e) => {
    e.preventDefault();
    roll();
    return false;
})

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
    winnerIndices.forEach(ind => flagDivs[ind].innerHTML = "🚩")
}