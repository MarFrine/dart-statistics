let newGameRules = {
    type: "xThrows",
    subtype: "10",
    specifications: [],
    players: []
}

let otherSubtype = "301";
let otherSpecifications = [];

const throwSlider = document.getElementById("throwSlider")

const playerSearch = document.getElementById("inactivePlayerListSearch")
let searchString = ""

throwSlider.addEventListener("input", (change) => {
    document.getElementById("xThrows").innerHTML = change.target.value + " Würfe"
    if (newGameRules.type == "xThrows") {
        newGameRules.subtype = change.target.value;
    } else {
        otherSubtype = change.target.value;
    }
})

resetGameCreation();

function changeGameRules(buttonObject) {
    if (buttonObject.id == "xThrows") {
        console.log("test")
        document.getElementById("xThrows").style.outline = "5px solid var(--color_highlights_bright)";
        if (newGameRules.type != buttonObject.id) {
            let tempSubtype = newGameRules.subtype
            newGameRules.subtype = otherSubtype;
            otherSubtype = tempSubtype;

            let tempSpecifications = newGameRules.specifications
            newGameRules.specifications = otherSpecifications;
            otherSpecifications = tempSpecifications;
        }
        newGameRules.type = "xThrows";
        document.getElementById("firstToX").style.outline = "none";
        document.getElementById("double").disabled = false;
        if (document.getElementById("double").style.outline != "none") {
            document.getElementById("double").style.outline = "5px solid var(--color_highlights_bright)"
        }

        document.getElementById("firstTo301").disabled = true;
        if (document.getElementById("firstTo301").style.outline != "none") {
            document.getElementById("firstTo301").style.outline = "5px solid var(--color_highlights_dark)"
        }
        document.getElementById("firstTo501").disabled = true;
        if (document.getElementById("firstTo501").style.outline != "none") {
            document.getElementById("firstTo501").style.outline = "5px solid var(--color_highlights_dark)"
        }
        document.getElementById("firstTo701").disabled = true;
        if (document.getElementById("firstTo701").style.outline != "none") {
            document.getElementById("firstTo701").style.outline = "5px solid var(--color_highlights_dark)"
        }

        document.getElementById("doubleIn").disabled = true;
        if (document.getElementById("doubleIn").style.outline != "none") {
            document.getElementById("doubleIn").style.outline = "5px solid var(--color_highlights_dark)"
        }
        document.getElementById("doubleOut").disabled = true;
        if (document.getElementById("doubleOut").style.outline != "none") {
            document.getElementById("doubleOut").style.outline = "5px solid var(--color_highlights_dark)"
        }

    } else if (buttonObject.id == "firstToX") {
        document.getElementById("firstToX").style.outline = "5px solid var(--color_highlights_bright)";

        if (newGameRules.type != buttonObject.id) {
            newGameRules.subtype = otherSubtype;
            otherSubtype = throwSlider.value;
            let tempSpecifications = newGameRules.specifications
            newGameRules.specifications = otherSpecifications;
            otherSpecifications = tempSpecifications;
        }
        newGameRules.type = "firstToX";
        document.getElementById("xThrows").style.outline = "none";

        document.getElementById("double").disabled = true;
        if (document.getElementById("double").style.outline != "none") {
            document.getElementById("double").style.outline = "5px solid var(--color_highlights_dark)"
        }

        document.getElementById("firstTo301").disabled = false;
        if (document.getElementById("firstTo301").style.outline != "none") {
            document.getElementById("firstTo301").style.outline = "5px solid var(--color_highlights_bright)"
        }
        document.getElementById("firstTo501").disabled = false;
        if (document.getElementById("firstTo501").style.outline != "none") {
            document.getElementById("firstTo501").style.outline = "5px solid var(--color_highlights_bright)"
        }
        document.getElementById("firstTo701").disabled = false;
        if (document.getElementById("firstTo701").style.outline != "none") {
            document.getElementById("firstTo701").style.outline = "5px solid var(--color_highlights_bright)"
        }

        document.getElementById("doubleIn").disabled = false;
        if (document.getElementById("doubleIn").style.outline != "none") {
            document.getElementById("doubleIn").style.outline = "5px solid var(--color_highlights_bright)"
        }
        document.getElementById("doubleOut").disabled = false;
        if (document.getElementById("doubleOut").style.outline != "none") {
            document.getElementById("doubleOut").style.outline = "5px solid var(--color_highlights_bright)"
        }
    } else if(buttonObject.id == "double"){
        if(newGameRules.specifications.indexOf("double") < 0){
            document.getElementById("double").style.outline = "5px solid var(--color_highlights_bright)";
            newGameRules.specifications.push("double");
        } else {
            let index = newGameRules.specifications.indexOf("double");
            newGameRules.specifications.splice(index, 1);
            document.getElementById("double").style.outline = "none";
        }
    } else if(buttonObject.id == "doubleIn"){
        if(newGameRules.specifications.indexOf("doubleIn") < 0){
            document.getElementById("doubleIn").style.outline = "5px solid var(--color_highlights_bright)";
            newGameRules.specifications.push("doubleIn");
        } else {
            let index = newGameRules.specifications.indexOf("doubleIn");
            newGameRules.specifications.splice(index, 1);
            document.getElementById("doubleIn").style.outline = "none";
        }
    } else if(buttonObject.id == "doubleOut"){
        if(newGameRules.specifications.indexOf("doubleOut") < 0){
            document.getElementById("doubleOut").style.outline = "5px solid var(--color_highlights_bright)";
            newGameRules.specifications.push("doubleOut");
        } else {
            let index = newGameRules.specifications.indexOf("doubleOut");
            newGameRules.specifications.splice(index, 1);
            document.getElementById("doubleOut").style.outline = "none";
        }
    } else if(buttonObject.id == "firstTo301" || buttonObject.id == "firstTo501" || buttonObject.id == "firstTo701"){
        if(newGameRules.subtype != buttonObject.id){
            document.getElementById("firstTo301").style.outline = "none";
            document.getElementById("firstTo501").style.outline = "none";
            document.getElementById("firstTo701").style.outline = "none";
            document.getElementById(buttonObject.id).style.outline = "5px solid var(--color_highlights_bright)";
            newGameRules.subtype = buttonObject.id.slice(7);
        }
    }
    
    if(newGameRules.players.length == 0 || (newGameRules.specifications.indexOf("double") >= 0 && newGameRules.players.length % 2 == 1)){
        document.getElementById("createGameButton").disabled = true;
    } else {
        document.getElementById("createGameButton").disabled = false;
    }
    
}



function resetGameCreation() {

    document.getElementById("xThrows").style.outline = "5px solid var(--color_highlights_bright)";
    document.getElementById("firstToX").style.outline = "none"

    document.getElementById("throwSlider").value = 10;

    document.getElementById("createGameButton").disabled = true;

    document.getElementById("firstTo301").disabled = true;
    document.getElementById("firstTo301").style.outline = "5px solid var(--color_highlights_dark)";
    document.getElementById("firstTo501").disabled = true;
    document.getElementById("firstTo501").style.outline = "none";
    document.getElementById("firstTo701").disabled = true;
    document.getElementById("firstTo701").style.outline = "none";

    document.getElementById("doubleIn").disabled = true;
    document.getElementById("doubleIn").style.outline = "none";
    document.getElementById("doubleOut").disabled = true;
    document.getElementById("doubleOut").style.outline = "none";
    document.getElementById("double").disabled = false;
    document.getElementById("double").style.outline = "none";

    newGameRules = {
        type: "xThrows",
        subtype: 10,
        specifications: [],
        players: []
    }

    playerSearch.value = "";
    searchString = "";
    if(accountData){
        updatePlayerList();
    }
}


function addPlayer(buttonObject) {
    let playername = buttonObject.innerText;
    newGameRules.players.push(playername);
    playerSearch.value = "";
    searchString = "";
    updatePlayerList();

}

function removePlayer(buttonObject) {
    let playername = buttonObject.innerText;
    newGameRules.players = newGameRules.players.filter((thisPlayer) => { return thisPlayer != playername });
    updatePlayerList();
}

function updatePlayerList() {
    console.log(accountData)
    if (newGameRules.players.length == 0) {
        document.getElementById("createGameButton").disabled = true;
    } else {
        if ((newGameRules.specifications.find((thisSpecification) => { return thisSpecification == "double" }) && newGameRules.players.length % 2 == 0) || !newGameRules.specifications.find((thisSpecification) => { return thisSpecification == "double" })) {
            document.getElementById("createGameButton").disabled = false;
        } else {
            document.getElementById("createGameButton").disabled = true;
        }
    }

    let activePlayerListString = "<br>"
    for (let i = 0; i < newGameRules.players.length; i++) {
        activePlayerListString = activePlayerListString + "<button class='playerListButton' onclick='removePlayer(this)'>" + newGameRules.players[i] + "</button><br>";
    }
    document.getElementById("activePlayerListList").innerHTML = activePlayerListString;

    let inactivePlayerListString = "<br>";
    let inactivePlayers = [];
    let completePlayerListCopy = [...accountData.people]
    let filteredPlayerList = completePlayerListCopy.filter((thisPlayer) => { return thisPlayer.name.toLowerCase().includes(searchString.toLowerCase()) })
    filteredPlayerList.sort((player1, player2) => { return player2.gamesPlayed - player1.gamesPlayed });
    for (let i = 0; i < filteredPlayerList.length; i++) {
        if (newGameRules.players.findIndex((thisPlayer) => { return thisPlayer == filteredPlayerList[i].name }) < 0) {
            inactivePlayers.push(filteredPlayerList[i].name);
        }
    }
    for (let i = 0; i < inactivePlayers.length; i++) {
        inactivePlayerListString = inactivePlayerListString + "<button class='playerListButton' onclick='addPlayer(this)'>" + inactivePlayers[i] + "</button><br>";
    }
    document.getElementById("inactivePlayerListList").innerHTML = inactivePlayerListString;
}

playerSearch.addEventListener("input", (change) => {
    searchString = change.target.value;
    updatePlayerList();
})


let currentGame = undefined;
function createNewGame() {

    transferData("/createGame", "post", { "type": newGameRules.type, "subtype": newGameRules.subtype, "players": newGameRules.players, "specifications": newGameRules.specifications, "clientID": clientID })
        .then((data) => {
            currentGame = data;
            changeMenuPoint('inputGame');
        });

    resetGameCreation();
    updatePlayerList();
}