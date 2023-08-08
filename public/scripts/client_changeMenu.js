currentMenuPoint = "mainMenu";
async function changeMenuPoint(menuPoint) {
    currentMenuPoint = menuPoint;
    clearInterval(periodicClientUpdate);
    clearInterval(periodicInputMessage);
    await clientUpdate();

    let menuPointDiv = document.getElementById(menuPoint);

    document.getElementById("player").style.display = "none";
    document.getElementById("game").style.display = "none";
    document.getElementById("mainMenu").style.display = "none";



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
    changeTo[menuPoint]();
    document.getElementById(menuPoint).style.display = "block";
    
}


let changeTo = {
    "mainMenu": ()=>{
        
    },
    "gameMainMenu": ()=>{

    },
    "createGame": ()=>{
        console.log("test")
        if (currentGame) {
            return changeMenuPoint("watchGame");
        } else {
            updatePlayerList();
        }
    },
    "inputGame": ()=>{
        if (!currentGame) {
            return changeMenuPoint("createGame");
        } else {
            document.getElementById("inputGameBlock").style.display = "block";
            displayTurnOrder();
            periodicInputMessage = setInterval("sendInputMessage()", 1000);
        }
    },
    "watchGame": ()=>{
        periodicClientUpdate = setInterval("clientUpdate()", 1000);
    },
    "gameStats": ()=>{

    },
    "playerMainMenu": ()=>{

    },
    "playerStats": ()=>{

    }
}