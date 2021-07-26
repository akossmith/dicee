'use strict';

class Player{
    name;
    wins = 0;
    currentRoll = 6;

    constructor(name) {
        this.name = name;
    }

    htmlElem() {
        let newPlayerElement =
            document.querySelector("#player-template").firstElementChild.cloneNode(true);
        newPlayerElement.querySelector(".player-name").innerHTML = this.name;
        return newPlayerElement;
    }
}

class Game {
    players = [];

    get currWinnerIndices(){
        return Game._calcWinnerIndices(this.players.map(pl => pl.currentRoll));
    }

    get playerNames(){
        return this.players.map(pl => pl.name);
    }

    constructor(color, number) {
        this.color = color;
        this.number = number;
    }

    roll(){
        let randomRoll = () => Math.floor(Math.random() * 6) + 1;
        this.players.forEach((player => {
            player.currentRoll = randomRoll();
        }));

        this._updateStats();
    }

    addPlayer(name = "New Player"){
        this.players.push(new Player(name));
    }

    removePlayer(idx){
        this.players.splice(idx,1);
    }

    _updateStats(){
        this.currWinnerIndices.forEach(i => this.players[i].wins++);
    }

    static _calcWinnerIndices(playerRolls){
        let maxRoll = Math.max(...playerRolls);
        let winnerIndices = []
        playerRolls.forEach((elem, ind) => {
            if(elem == maxRoll){
                winnerIndices.push(ind);
            }
        });
        return winnerIndices;
    }
}
class HtmlHandler {
    game;
    rotations = [];

    constructor(game) {
        this.game = game;
    }

    roll(){
        this.game.roll();
        this.game.players.forEach((_, idx) => this.rotations[idx] = (Math.random()-0.5)*50);

        this.render();
    }

    render() {
        document.querySelectorAll("#players .player").forEach(playerDiv => playerDiv.remove());

        this.game.players.forEach((player,idx) => {
            let newPlayerElement = player.htmlElem();
            newPlayerElement.querySelector("input[name='playerIdx']").value = idx;

            let canvas = newPlayerElement.querySelector("canvas");
            let ctx = canvas.getContext('2d');
            ctx.drawImage(cachedImages[this.game.players[idx].currentRoll], 0, 0, 100, 100);
            canvas.style.transform = `rotate(${this.rotations[idx]}deg)`;

            document.querySelector("#players").appendChild(newPlayerElement);
        });

        document.querySelectorAll(".player-name").forEach(elem => elem.addEventListener("click", this.nameClicked));
        document.querySelectorAll(".pencil-icon").forEach(elem => elem.addEventListener("click", this.nameClicked));
        document.querySelectorAll(".delete-icon").forEach(elem => elem.addEventListener("click", this.deleteIconClicked));
    
        let forms = document.querySelectorAll(".player form");
        forms.forEach(form => form.addEventListener("submit", this.nameEditFormSubmit));
    
        document.querySelectorAll(".player input[type='text']")
            .forEach(textIntput => textIntput.addEventListener("blur", this.nameEditInputBoxBlur));
    
        document.querySelectorAll(".player input[type='text']")
            .forEach(textIntput => textIntput.addEventListener("keydown", this.nameEditInputBoxKeydown));

        this._renderWinnerMarkers();
        this._displayWinners();
        this._renderStats();
    }
    
    addPlayer = () => {
        this.game.addPlayer();
        this.render();
    }

    _renderWinnerMarkers(){
        let flagDivs = document.querySelectorAll(".flag");
        flagDivs.forEach(div => div.style.visibility = "hidden");
        this.game.currWinnerIndices.forEach(ind => flagDivs[ind].style.visibility = "visible");
    }

    _displayWinners(){
        let text;
        let winnerNames = this.game.currWinnerIndices.map(ind => this.game.playerNames[ind]);
        if(winnerNames.length == 1){
            text = `<em>${winnerNames[0]}</em> wins this round`;
        }else{
            text = `This round is a draw between
                ${winnerNames.slice(0, -1).map(s => '<em>'+s+'</em>').join(", ")}
                and <em>${winnerNames[winnerNames.length-1]}<em>`;
        }
    
        document.querySelector(("#result #winners")).innerHTML = text;
    }

    _renderStats(){
        let statsDiv = document.querySelector("#stats");
    
        let playerNames = this.game.playerNames;
    
        function flags(num){
            let a = new Array(num);
            a.fill('<span class="flag">&#11044;</span>',0,num);
            return a.join("");
        }
    
        let html = "<table>"
        html += playerNames.map((name, ind) => `<tr><td>${name} ` +
             '</td><td>' + flags(this.game.players[ind].wins) + this.game.players[ind].wins + "</td></tr>").join("");
        html += "</table>"
    
        statsDiv.innerHTML = html;
    }

    getPlayerIdx(htmlElem){
        return Number(htmlElem.closest(".player").querySelector("input[name='playerIdx']").value);
    }

    // ----------- name editing --------------

    nameClicked = (event) => {
        let target = event.target;
        let playerDiv = target.closest(".player");
        let form = playerDiv.querySelector("form");
        let textInput = form.querySelector("input[type='text']");
        let playerNameDisp = playerDiv.querySelector(".player-name");
        textInput.value = playerNameDisp.textContent;
        this.toggleEditVisibility(playerNameDisp.parentElement);
        textInput.focus();
    }

    deleteIconClicked = (event) => {
        let numPlayers = this.game.players.length;
        if(numPlayers > 2){
            this.game.removePlayer( this.getPlayerIdx(event.target));
            this.render();
        }
    }

    nameEditFormSubmit = (event) => {
        event.preventDefault();
        let form = event.target;
        this.game.players[this.getPlayerIdx(form)].name = form.firstElementChild.value;

        this.render();
    }

    nameEditInputBoxBlur = (event) => {
        let inputBox = event.target;
        if (! inputBox.parentElement.classList.contains("hidden"))
            this.toggleEditVisibility(inputBox.parentElement.parentElement);
    }

    nameEditInputBoxKeydown = (event) => {
        let inputBox = event.target;
        var x = event.keyCode;
        if (x == 27) {
            this.toggleEditVisibility(inputBox.parentElement.parentElement);
        }
    }

    toggleEditVisibility(playerH2){
        playerH2.querySelector("form").classList.toggle("hidden");
        playerH2.querySelector(".player-name").classList.toggle("hidden");
    }
}

let game = new Game();
let htmlHandler = new HtmlHandler(game);

let cachedImages = [];
for(let i = 6; i >= 1; i--){
    cachedImages[i] = new Image(100, 100);
    cachedImages[i].src = `img/dice/${i}.svg`;
}
cachedImages[6].addEventListener("load", () => {
 
    game.addPlayer("Player 1");
    game.addPlayer("Player 2");
    htmlHandler.render();
});


// dice roll click
document.querySelector("a#click-to-roll").addEventListener("click",(e) => {
    e.preventDefault();
    htmlHandler.roll();
    return false;
});

// add player click
document.querySelector(".add-player").addEventListener("click", () => htmlHandler.addPlayer());