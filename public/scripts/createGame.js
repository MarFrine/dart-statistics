const creationForm = document.getElementById("createGameForm");
creationForm.reset();

let newGameRules = {
    type: "xThrows",
    specifications: [],
    players: []
}

creationForm.onchange = (change)=>{

    if(change.target.name == "gameType"){
        newGameRules.type = change.target.value;
    } else if(change.target.name == "gameRules"){
        if(change.target.checked){
            newGameRules.specifications.push(change.target.value);
        } else {
            const index = newGameRules.specifications.indexOf(change.target.value)
            if(index > -1){
                newGameRules.specifications.splice(index, 1);
            }
        }
    }

}


function addPlayer(buttonObject){
    let playername = buttonObject.innerText;
    newGameRules.players.push(playername);
    updatePlayerList();

}

function removePlayer(buttonObject){
    let playername = buttonObject.innerText;
    newGameRules.players = newGameRules.players.filter((thisPlayer)=>{return thisPlayer != playername});
    updatePlayerList();
}

function updatePlayerList(){
    let activePlayerListString = "<h3>aktive Spieler</h3><br><br>"
    for(let i = 0; i < newGameRules.players.length; i++){
        activePlayerListString = activePlayerListString + "<button class='playerListButton' onclick='removePlayer(this)'>" + newGameRules.players[i] + "</button><br>";
    }
    document.getElementById("activePlayerList").innerHTML = activePlayerListString;

    let inactivePlayerListString = "<h3>Spieler hinzufügen</h3><br><br>";
    let inactivePlayers = [];
    for(let i = 0; i < accountData.people.length; i++){
        if(newGameRules.players.findIndex((thisPlayer)=>{return thisPlayer == accountData.people[i].name}) < 0){
            inactivePlayers.push(accountData.people[i].name);
        }
    }
    for(let i = 0; i < inactivePlayers.length; i++){
        inactivePlayerListString = inactivePlayerListString + "<button class='playerListButton' onclick='addPlayer(this)'>" + inactivePlayers[i] + "</button><br>";
    }
    document.getElementById("inactivePlayerList").innerHTML = inactivePlayerListString;
}


function createNewGame(event, formElement){
    event.preventDefault();

    newGame = new Game(newGameRules.type, newGameRules.players, newGameRules.specifications);

    newGameRules = {
        type: "xThrows",
        specifications: [],
        players: []
    }
}