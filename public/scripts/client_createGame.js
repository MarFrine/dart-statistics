const creationForm = document.getElementById("createGameForm");
let newGameRules = {
    type: "xThrows",
    subtype: "10",
    specifications: [],
    players: []
}

resetCreationForm();


creationForm.addEventListener("input", (change)=>{

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

            document.getElementById("doubleOut").disabled = false;
            document.getElementById("doubleIn").disabled = false;
            document.getElementById("double").disabled = true;
            document.getElementById("double").checked = false;

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

            document.getElementById("doubleOut").disabled = true;
            document.getElementById("doubleOut").checked = false;
            document.getElementById("doubleIn").disabled = true;
            document.getElementById("doubleIn").checked = false;
            document.getElementById("double").disabled = false;
            const index = newGameRules.specifications.indexOf("doubleOut");
            if(index > -1){
                newGameRules.specifications.splice(index, 1);
            }

            newGameRules.subtype = document.getElementById("throwSlider").value;
        }
    } else if(change.target.name == "gameTypeExtra"){
        newGameRules.subtype = change.target.value;
        if(newGameRules.type == "xThrows"){
            document.getElementById("throwSliderLabel").innerHTML = newGameRules.subtype + " Würfe";
        }
    } else if(change.target.name == "gameRules"){
        if(change.target.checked){
            newGameRules.specifications.push(change.target.value);
        } else {
            const index = newGameRules.specifications.indexOf(change.target.value);
            if(index > -1){
                newGameRules.specifications.splice(index, 1);
            }
        }

        if((newGameRules.specifications.find((thisSpecification)=>{return thisSpecification == "double"}) && newGameRules.players.length%2 == 0 && newGameRules.players.length > 0) || !newGameRules.specifications.find((thisSpecification)=>{return thisSpecification == "double"}) && newGameRules.players.length > 0){
            document.getElementById("createGameButton").disabled = false;
        } else {
            document.getElementById("createGameButton").disabled = true;
        }
    }

});

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
    document.getElementById("throwSliderLabel").innerHTML = "10 Würfe";

    document.getElementById("createGameButton").disabled = true;

    document.getElementById("doubleIn").disabled = true;
    document.getElementById("doubleOut").disabled = true;

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
    console.log(accountData)
    if(newGameRules.players.length == 0){
        document.getElementById("createGameButton").disabled = true;
    } else {
        if((newGameRules.specifications.find((thisSpecification)=>{return thisSpecification == "double"}) && newGameRules.players.length%2 == 0) || !newGameRules.specifications.find((thisSpecification)=>{return thisSpecification == "double"})){
            document.getElementById("createGameButton").disabled = false;
        } else {
            document.getElementById("createGameButton").disabled = true;
        }
    }

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

let currentGame = undefined;
function createNewGame(event){
    event.preventDefault();

    transferData("/createGame", "post", {"type": newGameRules.type, "subtype": newGameRules.subtype, "players": newGameRules.players, "specifications":newGameRules.specifications, "clientID": clientID})
    .then((data)=>{
        currentGame = data;
        changeMenuPoint('inputGame');
    });

    resetCreationForm();
    updatePlayerList();
}