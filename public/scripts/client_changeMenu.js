currentMenuPoint = "gameMainMenu";
async function changeMenuPoint(menuPoint) {
    currentMenuPoint = menuPoint;
    clearInterval(periodicClientUpdate);
    clearInterval(periodicInputMessage);
    await getAccountData();
    await clientUpdate(true);
    

    let menuPointDiv = document.getElementById(menuPoint);

    document.getElementById("player").style.display = "none";
    document.getElementById("game").style.display = "none";



    if(menuPointDiv.classList.contains("gameSubpoint")){
        let affectedDivs = document.getElementsByClassName("gameSubpoint")
        for (let i = 0; i < affectedDivs.length; i++) {
            affectedDivs[i].style.display = "none";
        }
        document.getElementById("game").style.display = "block";
    } else if(menuPointDiv.classList.contains("playerSubpoint")){
        let affectedDivs = document.getElementsByClassName("playerSubpoint")
        for (let i = 0; i < affectedDivs.length; i++) {
            affectedDivs[i].style.display = "none";
        }
        document.getElementById("player").style.display = "block";
    }

    console.log(menuPoint)
    if(await updateMenu[menuPoint]()){
        document.getElementById(menuPoint).style.display = "block";
    }
}


let updateMenu = {
    "gameMainMenu": ()=>{
        let gameListString = "";
        for(let i = accountData.games.length-1; i >= 0; i--){
            gameListString = gameListString + "<a onclick='showGameStatisticById(" + accountData.games[i].id + ")' class='clickableText'>" + accountData.games[i].type + " - " + accountData.games[i].date + "</a><br>";
        }
        document.getElementById("allGamesGameListDiv").innerHTML = gameListString;
        return true;
    },
    "createGame": ()=>{
        console.log("test")
        if (currentGame) {
            changeMenuPoint("watchGame")
            return false;
        } else {
            updatePlayerList();
            return true;
        }
    },
    "inputGame": async ()=>{
        if (!currentGame) {
            changeMenuPoint("createGame");
            return false;
        } else {
            if(!await sendInputMessage()){
                return false;
            }
            displayTurnOrder();
            clearInterval(periodicInputMessage);
            periodicInputMessage = setInterval("sendInputMessage()", 1000);
            return true;
        }
    },
    "watchGame": ()=>{
        clearInterval(periodicClientUpdate);
        periodicClientUpdate = setInterval("clientUpdate()", 1000);
        return true;
    },
    "gameStats": ()=>{

        return true;
    },
    "playerMainMenu": ()=>{

        return true;
    },
    "playerStats": ()=>{

        return true;
    }
}


async function syncServer(){
    clearInterval(periodicClientUpdate);
    clearInterval(periodicInputMessage);
    await getAccountData();
    await clientUpdate();
}