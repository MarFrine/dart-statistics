function updateWatchGameMenu(){
    console.log(document.getElementById("watchGameTitle").innerText);

    let currentPlayer = {...accountData.people.find((thisPerson)=>{return currentGame.currentTurn == thisPerson.name})};
    let playerListIndex = currentGame.playerList.findIndex((thisPlayer)=>{return thisPlayer == currentGame.currentTurn});
    let currentPlayerName = currentGame.currentTurn;

    const progressBarCanvas = document.getElementById("watchGameProgress");
    const progressCtx = progressBarCanvas.getContext("2d");
    progressCtx.clearRect(0,0,350,50);
    let gradient = progressCtx.createLinearGradient(0,0,350,0);
        gradient.addColorStop(0, "blue");
        gradient.addColorStop(1, "red");
    progressCtx.fillStyle = gradient;
    let progress = 0;

    if(currentGame.type == "xThrows"){
        document.getElementById("watchGameTitle").innerHTML = "<font size='+7'><b>" + currentGame.subtype + " Würfe</b></font>";
        document.getElementById("watchGameRoundDisplay").innerHTML = "<br><font size='+3'><b>Runde " + currentGame.currentRound + " von " + currentGame.subtype + "</b></font>";

        progress = currentGame.throws / currentGame.maxThrows;
    } else if(currentGame.type == "firstToX"){
        document.getElementById("watchGameTitle").innerHTML = "<font size='+7'><b>" + currentGame.subtype + "</b></font>";
        document.getElementById("watchGameRoundDisplay").innerHTML = "<br><font size='+3'><b>Runde " + currentGame.currentRound + "</b></font>";
        let maxValue = 0;
        let currentValue = 0;
        for(let i = 0; i < currentGame.playerCount; i++){
            maxValue += parseInt(currentGame.subtype);
            currentValue += parseInt(currentGame.scores[currentGame.playerList[i]].tempScore.totalScore);
        }
        console.log(maxValue,currentValue);
        progress = 1 - (currentValue / maxValue);
    }

    progressCtx.fillRect(0, 0, 350 * progress, 50);
    
    if(currentGame.specifications.double){
        document.getElementById("watchGameSubtitle").innerHTML = "<font size='+2'>Doppel</font>";
    } else if(currentGame.specifications.doubleIn && currentGame.specifications.doubleOut){
        document.getElementById("watchGameSubtitle").innerHTML = "<font size='+2'>DoubleIn -- DoubleOut</font>";
    } else if(!currentGame.specifications.doubleIn && currentGame.specifications.doubleOut){
        document.getElementById("watchGameSubtitle").innerHTML = "<font size='+2'>DoubleOut</font>";
    } else if(currentGame.specifications.doubleIn && !currentGame.specifications.doubleOut){
        document.getElementById("watchGameSubtitle").innerHTML = "<font size='+2'>DoubleIn</font>";
    } else {
        document.getElementById("watchGameSubtitle").innerHTML = "";
    }
    
    if(!currentGame.specifications.double){
        document.getElementById("watchGameCurrentThrowDouble").style.display = "none";
        document.getElementById("watchGameCurrentThrowSingle").style.display = "block";

        for(let i = 1; i <= 3; i++){
            if(currentGame.scores[currentPlayerName].tempScore["throw" + i]){
                document.getElementById("watchGameCurrentThrowSingleThrow" + i + "Text").innerHTML = "<h1>" + currentGame.scores[currentPlayerName].tempScore["throw" + i].value + "</h1>"
                if(currentGame.scores[currentPlayerName].tempScore["throw" + i].field == "miss" || currentGame.scores[currentPlayerName].tempScore["throw" + i].locked){
                    document.getElementById("watchGameCurrentThrowSingleThrow" + i + "Image").src = "./img/dart_miss.png";
                } else {
                    document.getElementById("watchGameCurrentThrowSingleThrow" + i + "Image").src = "./img/dart_shot.png";
                }
            } else {
                document.getElementById("watchGameCurrentThrowSingleThrow" + i + "Text").innerHTML = "";
                document.getElementById("watchGameCurrentThrowSingleThrow" + i + "Image").src = "./img/dart_empty.png";
            }
        }

        let currentPlayerIndex = currentGame.playerList.findIndex((thisPlayer)=>{return thisPlayer == currentGame.currentTurn});

        let turnOrderString = "<h1>als nächstes:</h1><br>";
        let iMax = 5
        for(let i = 0; i < iMax; i++){
            let thisPlayerIndex
            if(currentPlayerIndex + i >= currentGame.playerList.length){
                if(currentGame.type == "xThrows" && currentGame.currentRound + 1 > currentGame.subtype){
                    break;
                }
                thisPlayerIndex = (currentPlayerIndex + i)%currentGame.playerList.length;
            } else {
                thisPlayerIndex = currentPlayerIndex + i;
            }
            if(i != 0 && currentGame.playerList[thisPlayerIndex] == currentGame.currentTurn){
                break;
            }
            if(!currentGame.scores[currentGame.playerList[thisPlayerIndex]].finished){
                turnOrderString = turnOrderString + "<h2>" + currentGame.playerList[thisPlayerIndex] + "</h2><br>";
            } else {
                iMax += 1;
            }
            
        }
        document.getElementById("watchGameTurnOrder").innerHTML = turnOrderString;
    } else {
        document.getElementById("watchGameCurrentThrowDouble").style.display = "block";
        document.getElementById("watchGameCurrentThrowSingle").style.display = "none";

        if(currentGame.currentRound % 2 == 1){
            let firstPlayer = currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentPlayerName].double})
            document.getElementById("watchGameCurrentThrowDoublePlayer1").innerHTML = "<h1>" + firstPlayer + "</h1>"
            document.getElementById("watchGameCurrentThrowDoublePlayer2").innerHTML = "<h1>" + currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentPlayerName].double && thisPlayer != firstPlayer}) + "</h1>"
        } else {
            let firstPlayer = currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentPlayerName].double})
            document.getElementById("watchGameCurrentThrowDoublePlayer2").innerHTML = "<h1>" + firstPlayer + "</h1>"
            document.getElementById("watchGameCurrentThrowDoublePlayer1").innerHTML = "<h1>" + currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentPlayerName].double && thisPlayer != firstPlayer}) + "</h1>"
        }

        let doubleLead = currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentPlayerName].double && currentGame.scores[thisPlayer].leadDouble});

        for(let i = 1; i <= 6; i++){
            if(currentGame.scores[doubleLead].tempScore.doubleScore["throw" + i]){
                document.getElementById("watchGameCurrentThrowDoubleThrow" + i + "Text").innerHTML = "<h1>" + currentGame.scores[doubleLead].tempScore.doubleScore["throw" + i].value + "</h1>"
                if(currentGame.scores[doubleLead].tempScore.doubleScore["throw" + i].field == "miss" || currentGame.scores[doubleLead].tempScore.doubleScore["throw" + i].locked){
                    document.getElementById("watchGameCurrentThrowDoubleThrow" + i + "Image").src = "./img/dart_miss.png";
                } else {
                    document.getElementById("watchGameCurrentThrowDoubleThrow" + i + "Image").src = "./img/dart_shot.png";
                }
            } else {
                document.getElementById("watchGameCurrentThrowDoubleThrow" + i + "Text").innerHTML = "";
                document.getElementById("watchGameCurrentThrowDoubleThrow" + i + "Image").src = "./img/dart_empty.png";
            }
        }

        let currentPlayerIndex = currentGame.playerList.findIndex((thisPlayer)=>{return thisPlayer == currentGame.currentTurn});
        let nextPlayers = [{"player":currentGame.currentTurn, "index": currentPlayerIndex, "round": currentGame.currentRound}]
        let turnOrderString = "<h1>als nächstes:</h1><br>";
        for(let i = 0; i <= 4; i++){
            turnOrderString = turnOrderString + "<h2>" + nextPlayers[i].player + "</h2>";
            if((nextPlayers[i].index % 2 == 0 && nextPlayers[i].round % 2 == 0) || (nextPlayers[i].index % 2 == 1 && nextPlayers[i].round % 2 == 1)){
                turnOrderString = turnOrderString + "<br>"
            }
            nextPlayers.push(getNextDoubleTurn(nextPlayers[i].player, currentGame.playerList, nextPlayers[i].round, currentGame.subtype))
            if(nextPlayers[i+1].index == -1){
                break;
            }
        }
        document.getElementById("watchGameTurnOrder").innerHTML = turnOrderString;
    }
    if(currentPlayer.image){
        document.getElementById("watchGamePlayerPic").src = "playerPictures/" + currentPlayer.imageFilename;
    }
    document.getElementById("watchGamePlayerName").innerHTML = "<font size='+5'><b>" + currentPlayer.name + "</b></font><br><font size='+4'>----<br><b>" + currentPlayer.nickname + "</b></font>"
    console.log(currentPlayer)
    if(!currentGame.specifications.double){
        document.getElementById("watchGameCurrentPlayerTotalScore").innerHTML = "<br><h1>Gesamt: " + currentGame.scores[currentPlayerName].tempScore.totalScore + "</h1>";
    } else {
        let doubleTotalScore = currentGame.scores[currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentGame.currentTurn].double && currentGame.scores[thisPlayer].leadDouble})].tempScore.doubleScore.totalScore;
        document.getElementById("watchGameCurrentPlayerTotalScore").innerHTML = "<h1>Doppel " + (currentGame.scores[currentGame.currentTurn].double + 1) + "</h1><h2>Gesamt: " + doubleTotalScore + "</h2>";
    }
    
    document.getElementById("watchGameCurrentPlayerThrowsMade").innerHTML = "<h4>  Würfe geworfen: " + currentGame.scores[currentPlayerName].throws + "  </h4>";
    if(currentGame.type == "xThrows"){
        document.getElementById("watchGameCurrentPlayerThrowsLeft").innerHTML = "<h4>  Würfe übrig: " + (currentGame.subtype * 3 - currentGame.scores[currentPlayerName].throws) + "  </h4>";
    } else {
        document.getElementById("watchGameCurrentPlayerThrowsLeft").innerHTML = "";
    }

    drawCurrentTurnGameStatistic(currentPlayerName);

}

function getNextDoubleTurn(thisTurn, playerList, round, maxRound){
    let currentTurnIndex = playerList.findIndex((thisPlayer)=>{return thisPlayer == thisTurn;});
    let nextTurnIndex;
    let newRound = round;
    console.log(thisTurn, playerList, round, maxRound);
    if(round%2 == 1){
        if(currentTurnIndex + 1 >= playerList.length){
            if(round + 1 > maxRound){
                nextTurnIndex = -1;
            } else {
                nextTurnIndex = 1;
                newRound += 1;
            }
        } else {
            nextTurnIndex = currentTurnIndex + 1
        }
    } else {
        if(currentTurnIndex % 2 == 0){
            if(currentTurnIndex + 3 >= playerList.length){
                if(round + 1 > maxRound){
                    nextTurnIndex = -1;
                } else {
                    nextTurnIndex = 0;
                    newRound += 1;
                }
            } else {
                nextTurnIndex = currentTurnIndex + 3;
            }
        } else {
            nextTurnIndex = currentTurnIndex - 1;
        }
    }
    console.log(nextTurnIndex)

    if(nextTurnIndex == -1){
        return {"player": undefined, "index": -1};
    } else {
        let playerName = playerList[nextTurnIndex];
        return {"player": playerName, "index": nextTurnIndex, "round": newRound};
    }
}

function drawCurrentTurnGameStatistic(currentPlayerName){
    const statisticDiv = document.getElementById("watchGameCurrentGameStatistic");
    const gameChartWidth = 900;
    const gameChartHeight = 400;
    const gameChartMarginRight = 50;
    const gameChartMarginTop = 50;
    const gameChartMarginBottom = 50;
    const gameChartMarginLeft = 50;

    const currentTotalThrows = currentGame.scores[currentPlayerName].throws;
    console.log(currentTotalThrows);

    const gameChartXAxis = d3.scaleLinear()
        .domain([1, currentTotalThrows])
        .range([gameChartMarginLeft, gameChartWidth - gameChartMarginRight]);

    const gameChartYAxis = d3.scaleLinear()
        .domain([0, 60])
        .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);

    const gameChartsvg = d3.create("svg")
        .attr("width", gameChartWidth)
        .attr("height", gameChartHeight);


    
    gameChartsvg.append("g")
        .attr("transform", "translate(0," + (gameChartHeight - gameChartMarginBottom) + ")")
        .call(d3.axisBottom(gameChartXAxis).ticks(currentTotalThrows));

    gameChartsvg.append("g")
        .attr("transform", "translate(" + gameChartMarginLeft + ", 0)")
        .call(d3.axisLeft(gameChartYAxis).ticks(10));

    //line generator
    const line = d3.line()
        .x(dataPoint => gameChartXAxis(dataPoint.throw))
        .y(dataPoint => gameChartYAxis(dataPoint.score));

    let playerScoreArray = [];
    let countedThrows = 0
    for(let i = 1; i <= currentGame.currentRound; i++){
        for(let j = 1; j <= 3; j++){
            if(i < currentGame.currentRound){
                if(currentGame.scores[currentPlayerName]["round" + i]["throw" + j]){
                    countedThrows += 1
                    playerScoreArray.push({"throw": countedThrows, "score":currentGame.scores[currentPlayerName]["round" + i]["throw" + j].value});
                }
            } else {
                if(countedThrows < currentTotalThrows){
                    countedThrows += 1
                    playerScoreArray.push({"throw": countedThrows, "score":currentGame.scores[currentPlayerName].tempScore["throw" + j].value});
                }
            }
        }
    }

    gameChartsvg.append("path")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("d", line(playerScoreArray));


    statisticDiv.innerHTML = "";
    statisticDiv.append(gameChartsvg.node());

}