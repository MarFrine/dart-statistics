const creationForm = document.getElementById("createGameForm");
let newGameRules = {
    type: "xThrows",
    subtype: "10",
    specifications: [],
    players: []
}

resetCreationForm();



creationForm.onchange = (change)=>{

    if(change.target.name == "gameType"){
        newGameRules.type = change.target.value;

        if(change.target.value == "firstToX"){
            document.getElementById("throwSlider").style.display = "none";
            document.getElementById("throwSliderLabel").style.display = "none";

            document.getElementById("firstTo301").style.display = "block";
            document.getElementById("firstTo301Label").style.display = "block";
            document.getElementById("firstTo501").style.display = "block";
            document.getElementById("firstTo501Label").style.display = "block";
            document.getElementById("firstTo701").style.display = "block";
            document.getElementById("firstTo701Label").style.display = "block";

            if(document.getElementById("firstTo301").checked){
                newGameRules.subtype = "301";
            } else if(document.getElementById("firstTo501").checked){
                newGameRules.subtype = "501";
            } else if(document.getElementById("firstTo701").checked){
                newGameRules.subtype = "701";
            }

        } else if(change.target.value == "xThrows"){
            document.getElementById("firstTo301").style.display = "none";
            document.getElementById("firstTo301Label").style.display = "none";
            document.getElementById("firstTo501").style.display = "none";
            document.getElementById("firstTo501Label").style.display = "none";
            document.getElementById("firstTo701").style.display = "none";
            document.getElementById("firstTo701Label").style.display = "none";

            document.getElementById("throwSlider").style.display = "block";
            document.getElementById("throwSliderLabel").style.display = "block";

            newGameRules.subtype = document.getElementById("throwSlider").value;
        }
    } else if(change.target.name == "gameTypeExtra"){
        newGameRules.subtype = change.target.value;

    } else if(change.target.name == "gameRules"){
        if(change.target.checked){
            newGameRules.specifications.push(change.target.value);
        } else {
            const index = newGameRules.specifications.indexOf(change.target.value);
            if(index > -1){
                newGameRules.specifications.splice(index, 1);
            }
        }
    }

}

function resetCreationForm(){
    creationForm.reset();
    document.getElementById("firstTo301").style.display = "none";
    document.getElementById("firstTo301Label").style.display = "none";
    document.getElementById("firstTo501").style.display = "none";
    document.getElementById("firstTo501Label").style.display = "none";
    document.getElementById("firstTo701").style.display = "none";
    document.getElementById("firstTo701Label").style.display = "none";

    document.getElementById("throwSlider").style.display = "block";
    document.getElementById("throwSliderLabel").style.display = "block";

    newGameRules = {
        type: "xThrows",
        subtype: 10,
        specifications: [],
        players: []
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

    newGame = new Game(newGameRules.type, newGameRules.subtype, newGameRules.players, newGameRules.specifications);

    resetCreationForm();
    updatePlayerList();
    changeMenuPoint('inputGame');
    
}