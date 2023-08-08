async function transferData(url, type, bodyData) {
    if (type == "get") {
        const response = await fetch(url, { method: type })
        const data = await response.json()
        return data
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
async function clientUpdate() {
    await transferData("/clientUpdate", "get")
        .then((data) => {
            if (data.activeGame) {
                currentGame = data.game;
                console.log(currentGame)
                currentScores = currentGame.scores[currentGame.currentTurn].tempScore;
                if (currentMenuPoint == "inputGame") {
                    displayTurnOrder();
                    displayCurrentTurn();

                    selectedScore = undefined;
                    if (!currentScores["throw1"]) {
                        selectedScore = 1
                    } else if (!currentScores["throw2"]) {
                        selectedScore = 2
                    } else if (!currentScores["throw3"]) {
                        selectedScore = 3
                    }
                }
            } else {
                if(currentMenuPoint == "watchGame" && currentGame){
                    drawGameStatistic(data.lastGame);
                }
                currentGame = undefined;
            }
        })
}

async function getAccountData(){
    await transferData("/getAccountData", "get")
    .then((data)=>{
        accountData = data.account;
    })
}

let periodicInputMessage;
function sendInputMessage() {
    transferData("/currentlyEditing", "post", { "clientID": clientID })
        .then((data) => {
            if(data.error){
                console.log(data.error);
                clearInterval(periodicInputMessage);
                changeMenuPoint("createGame");
            } else {
                console.log(data.currentEditor, clientID);
                if (data.currentEditor != clientID) {
                    clearInterval(periodicInputMessage);
                    changeMenuPoint("watchGame");
                } else {
                    document.getElementById("inputGameBlock").style.display = "none";
                }
            }
        })
        .catch((error) => { console.log(error); });
}