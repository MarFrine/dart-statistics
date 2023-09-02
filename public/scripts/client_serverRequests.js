async function transferData(url, type, bodyData) {
    if (type == "get") {
        const response = await fetch(url, { method: type })
        if(url != "stopGame"){
            const data = await response.json()
            return data
        }
    } else if (type == "post" || type == "put") {
        const response = await fetch(url, {
            method: type,
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(bodyData)
        })
        const data = await response.json()
        return data
    }
}

let periodicClientUpdate;
async function clientUpdate(stopMenuUpdate) {
    await transferData("/clientUpdate", "get")
        .then((data) => {
            if (data.activeGame) {
                currentGame = data.game;
                console.log(currentGame)
                currentScores = currentGame.scores[currentGame.currentTurn].tempScore;
                if(currentGame.specifications.double){
                    currentDoubleScores = currentGame.scores[currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentGame.currentTurn].double && currentGame.scores[thisPlayer].leadDouble})].tempScore.doubleScore;
                }
                if (currentMenuPoint == "inputGame") {
                    displayTurnOrder();
                    displayCurrentTurn();

                    selectedScore = undefined;
                    console.log(currentScores);
                    if (!currentScores["throw1"]) {
                        selectedScore = 1
                    } else if (!currentScores["throw2"]) {
                        selectedScore = 2
                    } else if (!currentScores["throw3"]) {
                        selectedScore = 3
                    }
                } else if(currentMenuPoint == "watchGame"){
                    updateWatchGameMenu();
                }
            } else {
                if(currentMenuPoint == "watchGame" && currentGame){
                    if(data.lastGame){
                        showGameStatistic(data.lastGame);
                    } else {
                        changeMenuPoint("mainMenu");
                    }
                } else if(currentMenuPoint == "watchGame"){
                    changeMenuPoint("mainMenu");
                }
                currentGame = undefined;
            }
            if(!stopMenuUpdate){
                updateMenu[currentMenuPoint]();
            }
        })
}

async function getAccountData(){
    await transferData("/getAccountData", "get")
    .then((data)=>{
        accountData = data.account;
        oldRecordList = data.oldRecords;
        console.log(oldRecordList)
    })
    return
}

let periodicInputMessage;
async function sendInputMessage() {
    return await transferData("/currentlyEditing", "post", { "clientID": clientID })
        .then((data) => {
            if(data.error){
                console.log(data.error);
                clearInterval(periodicInputMessage);
                changeMenuPoint("createGame");
                return false;
            } else {
                console.log(data.currentEditor, clientID);
                if (data.currentEditor != clientID) {
                    clearInterval(periodicInputMessage);
                    return false;
                } else {
                    return true;
                }
            }
        })
        .catch((error) => { console.log(error); });
}