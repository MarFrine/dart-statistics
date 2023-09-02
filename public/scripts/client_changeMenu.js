
currentMenuPoint = "mainMenu";
let changeMenuPointError = "";
async function changeMenuPoint(menuPoint, menuPointParameter) {
    currentMenuPoint = menuPoint;
    clearInterval(periodicClientUpdate);
    clearInterval(periodicInputMessage);
    await getAccountData();
    await clientUpdate(true);


    



    console.log(menuPoint)
    if (await updateMenu[menuPoint](menuPointParameter)) {
        let menuPointDiv = document.getElementById(menuPoint);

        let affectedDivs = document.getElementsByClassName("mainMenuPoint")

        for (let i = 0; i < affectedDivs.length; i++) {
            affectedDivs[i].style.display = "none";
        }

        menuPointDiv.style.display = "block";
    } else {
        document.getElementById("redirectMessage").innerHTML = "<h3>" + changeMenuPointError + "</h3>";
        document.getElementById("redirectMessage").style.display = "block";
        setTimeout(()=>{document.getElementById("redirectMessage").style.display = "none";}, 5000);
    }
}


let updateMenu = {
    "mainMenu": () => {
        let gameListString = "<br><font size='+2'><b>Spielverlauf:</b></font><br><br>";
        for (let i = accountData.games.length - 1; i >= 0; i--) {
            if(!accountData.games[i].winner){
                gameListString = gameListString + "<a onclick='showGameStatisticById(" + accountData.games[i].id + ")' class='clickableText'>" + accountData.games[i].type + " - " + accountData.games[i].subtype + "</a><br><br><div class='completeLine'></div><br>";
            } else if(accountData.games[i].type == "xThrows"){
                if(accountData.games[i].specifications.double){
                    gameListString = gameListString + "<a onclick='showGameStatisticById(" + accountData.games[i].id + ")' class='clickableText'>" + accountData.games[i].subtype + " Würfe - " + accountData.games[i].winner + " & " + accountData.games[i].playerList.find((thisPlayer)=>{return accountData.games[i].scores[thisPlayer].double == accountData.games[i].scores[accountData.games[i].winner].double && thisPlayer != accountData.games[i].winner}) + ": " + accountData.games[i].winningScore + "</a><br><br><div class='completeLine'></div><br>";
                } else {
                    gameListString = gameListString + "<a onclick='showGameStatisticById(" + accountData.games[i].id + ")' class='clickableText'>" + accountData.games[i].subtype + " Würfe - " + accountData.games[i].winner + ": " + accountData.games[i].winningScore + "</a><br><br><div class='completeLine'></div><br>";
                }
            } else if(accountData.games[i].type == "firstToX"){
                gameListString = gameListString + "<a onclick='showGameStatisticById(" + accountData.games[i].id + ")' class='clickableText'>" + accountData.games[i].subtype + " - " + accountData.games[i].winner + "</a><br><br><div class='completeLine'></div><br>";
            }
        }
        document.getElementById("allGamesGameListDiv").innerHTML = gameListString;

        playerListSearchString = "";
        document.getElementById("allPlayersListSearch").value = "";
        refreshMainMenuPlayerList();

        return true;
    },
    "createGame": () => {
        console.log("test")
        if (currentGame) {
            changeMenuPointError = "Spiel läuft bereits";
            return false;
        } else if(!loggedIn){
            changeMenuPointError = "keine Berechtigung ohne Login";
            return false;
        } else {
            updatePlayerList();
            return true;
        }
    },
    "inputGame": async () => {
        if (!currentGame) {
            changeMenuPoint("createGame");
            changeMenuPointError = "kein laufendes Spiel";
            return false;
        } else {
            if(!loggedIn){
                changeMenuPointError = "keine Berechtigung ohne Login";
                return false;
            } else if (!await sendInputMessage()) {
                changeMenuPointError = "ein anderer Benutzer gibt die Ergebnisse bereits ein";
                return false;
            }
            if ((currentScores.throw1 && currentScores.throw2 && currentScores.throw3) || currentScores.overshoot || currentScores.finished) {
                document.getElementById("confirmTurn").style.display = "block";
                selectedScore = undefined;
            } else {
                document.getElementById("confirmTurn").style.display = "none";
            }
            displayTurnOrder();
            clearInterval(periodicInputMessage);
            periodicInputMessage = setInterval("sendInputMessage()", 1000);
            return true;
        }
    },
    "watchGame": () => {
        clearInterval(periodicClientUpdate);
        if (currentGame) {
            periodicClientUpdate = setInterval("clientUpdate()", 1000);
            return true;
        } else {
            changeMenuPointError = "kein laufendes Spiel";
            return false;
        }


    },
    "gameStats": (game) => {
        if(!game){
            changeMenuPointError = "ausgewähltes Spiel existiert nicht!";
            return false;
        }
        return true;
    },
    "playerStats": () => {

        return true;
    },
    "newPlayer": () => {
        if(!loggedIn){
            changeMenuPointError = "keine Berechtigung ohne Login";
            return false;
        }
        resetPlayerCreationForm();
        return true;
    },
    "editPlayer": (player) => {
        if(!loggedIn){
            changeMenuPointError = "keine Berechtigung ohne Login";
            return false;
        }

        resetPlayerEditForm(player);
        return true;
    },
    "alltimeStats": ()=>{
        createX01RecordList("allResults", "allResults", "allResults")
        createSingleRecordList();
        createDoubleRecordList();
        return true;
    }
}


async function syncServer() {
    clearInterval(periodicClientUpdate);
    clearInterval(periodicInputMessage);
    await getAccountData();
    await clientUpdate();
}