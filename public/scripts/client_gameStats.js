const gameStatisticDiv = document.getElementById("gameStatisticDiv");
const gameResultsDiv = document.getElementById("gameResultsDiv");

function showGameStatisticById(gameID) {
    let gameIndex = accountData.games.findIndex((thisGame) => { return thisGame.id == gameID });
    showGameStatistic(accountData.games[gameIndex]);
}

function showDoubleStatisticById(gameID, double) {
    let gameIndex = accountData.games.findIndex((thisGame) => { return thisGame.id == gameID });
    console.log(gameID, gameIndex, accountData.games[gameIndex])
    showDoubleStatistic(accountData.games[gameIndex], double);
}

function showGameStatistic(game) {
    changeMenuPoint("gameStats", game);
    gameStatisticDiv.innerHTML = "";

    if (game.specifications.double) {
        drawDoubleGameStatistic(game);
        showGameResults(game);
    } else {
        drawGameStatistic(game);
        showGameResults(game);
    }
}

function showDoubleStatistic(game, double) {
    changeMenuPoint("gameStats", game);
    gameStatisticDiv.innerHTML = "";

    drawDoubleGameStatistic(game, true, double);
    showGameResults(game, true, double);
    console.log(game.id, double);
}

function drawGameStatistic(game) {
    let playerScoreArrays = [];
    let highestScore = 0;
    let mostThrows = 0;
    for (let i = 0; i < game.playerCount; i++) {
        let thisPlayerScoreArray = playerScoresToArray(game.scores[game.playerList[i]], game.type, game.subtype)
        playerScoreArrays.push(thisPlayerScoreArray);
        if (game.type == "xThrows" && thisPlayerScoreArray[thisPlayerScoreArray.length - 1].totalScore > highestScore) {
            highestScore = thisPlayerScoreArray[thisPlayerScoreArray.length - 1].totalScore;
        } else if (game.type == "firstToX") {
            highestScore = game.subtype;
        }
        if (thisPlayerScoreArray.length > mostThrows) {
            mostThrows = thisPlayerScoreArray.length - 1;
        }
    }

    const gameChartWidth = 1400;
    const gameChartHeight = 800;
    const gameChartMarginRight = 50;
    const gameChartMarginTop = 120;
    const gameChartMarginBottom = 50;
    const gameChartMarginLeft = 50;


    const gameChartXAxis = d3.scaleLinear()
        .domain([0, mostThrows])
        .range([gameChartMarginLeft, gameChartWidth - gameChartMarginRight]);

    console.log(mostThrows)

    let gameChartYAxis
    if (game.type == "firstToX") {
        gameChartYAxis = d3.scaleLinear()
            .domain([0, game.subtype])
            .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);
    } else if (game.type == "xThrows") {
        gameChartYAxis = d3.scaleLinear()
            .domain([0, highestScore])
            .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);
    }



    const gameChartsvg = d3.create("svg")
        .attr("width", gameChartWidth)
        .attr("height", gameChartHeight);

    gameChartsvg.append("g")
        .attr("transform", "translate(0," + (gameChartHeight - gameChartMarginBottom) + ")")
        .attr("id", "gameChartXAxisElement")
        .call(d3.axisBottom(gameChartXAxis).ticks(mostThrows));

    let ticks = Math.ceil(highestScore / 100);

    gameChartsvg.append("g")
        .attr("transform", "translate(" + gameChartMarginLeft + ", 0)")
        .attr("id", "gameChartYAxisElement")
        .call(d3.axisLeft(gameChartYAxis).ticks(ticks));

    //line generator
    const line = d3.line()
        .x(dataPoint => gameChartXAxis(dataPoint.throw))
        .y(dataPoint => gameChartYAxis(dataPoint.totalScore));

    for (let i = 0; i < game.playerCount; i++) {

        gameChartsvg.append("path")
            .attr("fill", "none")
            .attr("stroke", ("hsl(" + (40 * i) + ",100%,50%)"))
            .attr("stroke-width", 4)
            .attr("d", line(playerScoreArrays[i]))
            .attr("onmousemove", "highlightLine(this)")
            .attr("onmouseout", "unhighlightLine(this)");


        if (game.playerCount <= 5) {
            gameChartsvg.append("text")
                .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / game.playerCount) * i + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / game.playerCount) / 2) + gameChartMarginLeft) + "," + 60 + ")")
                .attr("font-size", "4em")
                .attr("text-anchor", "middle")
                .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                .text(game.playerList[i]);
        } else if (game.playerCount <= 10) {
            if (i < 5) {
                gameChartsvg.append("text")
                    .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 5) * i + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 5) / 2) + gameChartMarginLeft) + "," + 40 + ")")
                    .attr("font-size", "3em")
                    .attr("text-anchor", "middle")
                    .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                    .text(game.playerList[i]);
            } else {
                gameChartsvg.append("text")
                    .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / (game.playerCount - 5)) * (i - 5) + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / (game.playerCount - 5)) / 2) + gameChartMarginLeft) + "," + 90 + ")")
                    .attr("font-size", "3em")
                    .attr("text-anchor", "middle")
                    .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                    .text(game.playerList[i]);
            }

        }

    }   //gameChartYAxis(playerScoreArrays[i][playerScoreArrays[i].length-1].totalScore)

    gameStatisticDiv.append(gameChartsvg.node());   
    document.getElementById("gameChartXAxisElement").style.fontSize = "20px"
    document.getElementById("gameChartYAxisElement").style.fontSize = "20px"
}



function playerScoresToArray(playerScores, gameType, gameSubtype) {
    let scoreArray = [];
    let round = 1;

    let totalScore = 0

    if (gameType == "firstToX") {
        totalScore = gameSubtype;
    }

    scoreArray.push({ "throw": 0, "score": 0, "totalScore": totalScore });

    while (round >= 1) {
        for (let i = 1; i <= 3; i++) {
            if (playerScores["round" + round]["throw" + i]) {
                if (gameType == "xThrows") {
                    totalScore += playerScores["round" + round]["throw" + i].value;
                } else {
                    if (!playerScores["round" + round]["throw" + i].locked) {
                        totalScore -= playerScores["round" + round]["throw" + i].value;
                    }
                }
                scoreArray.push({ "throw": 3 * round + (i - 3), "score": playerScores["round" + round]["throw" + i].value, "totalScore": totalScore });
            } else if (gameType == "firstToX" && totalScore != 0) {
                scoreArray.push({ "throw": 3 * round + (i - 3), "score": 0, "totalScore": totalScore });
            }
        }

        if (playerScores["round" + (round + 1)]) {
            round += 1;
        } else {
            round = 0;
        }
    }
    console.log(scoreArray)
    return scoreArray;
}

//https://observablehq.com/@d3/line-chart/2?intent=fork
//https://d3js.org/getting-started

function highlightLine(lineObject) {
    lineObject.attributes["stroke-width"].value = 10;
}
function unhighlightLine(lineObject) {
    lineObject.attributes["stroke-width"].value = 4;
}


function showGameResults(game, oneDouble, double) {
    let playerListCopy = [...game.playerList];
    let playerResultString = "<font size='+4'>Ranking:</font><br>";

    if (game.type == "xThrows") {
        
        if (game.specifications.double) {
            
            if (oneDouble) {
                document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+6'>" + game.subtype + " Würfe</font></u></b><br><h2>Doppel " + (double + 1) + "</h2>";
                let playerList = [
                    {
                        "name": game.playerList[double*2],
                        "totalScore": game.scores[game.playerList[double*2]].totalScore
                    },{
                        "name": game.playerList[double*2+1],
                        "totalScore": game.scores[game.playerList[double*2+1]].totalScore
                    }
                ];

                playerList.sort((player1, player2) => {
                    return player2.totalScore - player1.totalScore;
                });
                for (let i = 0; i < playerList.length; i++) {
                    playerResultString = playerResultString + "<br><br><font size='+4'>" + (i + 1) + ": " + playerList[i].name + "</a></font><font size='+3'> -- " + playerList[i].totalScore + "</font>"
                }
                playerResultString = playerResultString + "<br><br><br><br><br><br><button onclick='showGameStatisticById(" + game.id + ")'>zurück zum Spiel</button>";
            } else {
                document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+6'>" + game.subtype + " Würfe</font></u></b><br><h2>Doppel</h2>";
                let doubleList = []
                for (let i = 0; i < playerListCopy.length / 2; i++) {
                    doubleList.push({
                        "name": "Doppel " + (i + 1),
                        "double": i,
                        "totalScore": game.scores[playerListCopy[i * 2]].doubleScore.totalScore
                    })
                }
                doubleList.sort((double1, double2) => {
                    return double2.totalScore - double1.totalScore;
                });
                for (let i = 0; i < doubleList.length; i++) {
                    playerResultString = playerResultString + "<br><br><font size='+4'>" + (i + 1) + ": <a onclick='showDoubleStatisticById(" + game.id + "," + doubleList[i].double + ")' class='clickableText'>" + doubleList[i].name + "</a></font><font size='+3'> -- " + doubleList[i].totalScore + "</font>"
                }
            }
        } else {
            document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+6'>" + game.subtype + " Würfe</font></u></b>"
            playerListCopy.sort((player1, player2) => {
                return game.scores[player2].totalScore - game.scores[player1].totalScore;
            });

            for (let i = 0; i < game.playerCount; i++) {
                console.log(playerListCopy[i])
                playerResultString = playerResultString + "<br><br><font size='+4'>" + (i + 1) + ": <a onclick='showPlayerStatistics("
                playerResultString = playerResultString + '"' + playerListCopy[i] + '"';
                playerResultString = playerResultString + ", [" + game.id + "])' class='clickableText'>" + playerListCopy[i] + "</a></font><font size='+3'> -- " + game.scores[playerListCopy[i]].totalScore + "</font>";
            }
            playerResultString = playerResultString + "<br><br><br><br><br><br><button onclick='showPlayerStatistics(";
            playerResultString = playerResultString + '"all", ';
            playerResultString = playerResultString + "[" + game.id + "])'>Heatmap aller Würfe</button>"
        }
    } else if (game.type == "firstToX") {
        if (game.specifications.doubleIn && !game.specifications.doubleOut) {
            document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+6'>" + game.subtype + "</font></u></b><br><h3>Double In</h3>"
        } else if (!game.specifications.doubleIn && game.specifications.doubleOut) {
            document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+5'>" + game.subtype + "</font></u></b><br><h3>Double Out</h3>"
        } else if (game.specifications.doubleIn && game.specifications.doubleOut) {
            document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+5'>" + game.subtype + "</font></u></b><br><h3>Double In -- Double Out</h3>"
        } else {
            document.getElementById("gameResultsTitle").innerHTML = "<b><u><font size='+5'>" + game.subtype + "</font></u></b>";
        }

        playerListCopy.sort((player1, player2) => {
            return ((3 * (game.scores[player1].finishRound - 1)) - (3 * (game.scores[player2].finishRound - 1)));
        });

        for (let i = 0; i < game.playerCount; i++) {
            playerResultString = playerResultString + "<br><br><font size='+4'>" + (i + 1) + ": " + playerListCopy[i] + "</font><br><font size='+3'>Wurf " + game.scores[playerListCopy[i]].finishRound + "</font>";
        }

    }


    document.getElementById("gameResultsRanking").innerHTML = playerResultString;
}

function test() {
    console.log("test")
}


function drawDoubleGameStatistic(game, doubleOverview, double) {
    let doubleScoreArrays = [];
    let highestScore = 0;
    let mostThrows = game.subtype * 3;
    if (doubleOverview) {
        doubleScoreArrays.push(oneDoubleScoreToArray(game.scores[game.playerList[double * 2]], game.subtype, 0));
        doubleScoreArrays.push(oneDoubleScoreToArray(game.scores[game.playerList[double * 2 + 1]], game.subtype, 1));
        highestScore = doubleScoreArrays[0][mostThrows].totalScore + doubleScoreArrays[1][mostThrows].totalScore;

    } else {
        for (let i = 0; i < game.playerCount / 2; i++) {
            let thisDoubleScoreArray = doubleScoresToArray(game.scores[game.playerList[i * 2]].doubleScore, game.subtype);
            doubleScoreArrays.push(thisDoubleScoreArray);
            if (thisDoubleScoreArray[thisDoubleScoreArray.length - 1].totalScore > highestScore) {
                highestScore = thisDoubleScoreArray[thisDoubleScoreArray.length - 1].totalScore;
            }
        }
    }

    const gameChartWidth = 1400;
    const gameChartHeight = 800;
    const gameChartMarginRight = 50;
    const gameChartMarginTop = 120;
    const gameChartMarginBottom = 50;
    const gameChartMarginLeft = 50;


    const gameChartXAxis = d3.scaleLinear()
        .domain([0, mostThrows])
        .range([gameChartMarginLeft, gameChartWidth - gameChartMarginRight]);


    const gameChartYAxis = d3.scaleLinear()
        .domain([0, highestScore])
        .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);


    const gameChartsvg = d3.create("svg")
        .attr("width", gameChartWidth)
        .attr("height", gameChartHeight);

    gameChartsvg.append("g")
        .attr("transform", "translate(0," + (gameChartHeight - gameChartMarginBottom) + ")")
        .attr("id", "gameChartXAxisElement")
        .call(d3.axisBottom(gameChartXAxis).ticks(mostThrows));


        let ticks = Math.ceil(highestScore / 100);

    gameChartsvg.append("g")
        .attr("transform", "translate(" + gameChartMarginLeft + ", 0)")
        .attr("id", "gameChartYAxisElement")
        .call(d3.axisLeft(gameChartYAxis).ticks(ticks));

    //line generator
    const line = d3.line()
        .x(dataPoint => gameChartXAxis(dataPoint.throw))
        .y(dataPoint => gameChartYAxis(dataPoint.totalScore));

    //area generator
    const area = d3.area()
        .x(dataPoint => gameChartXAxis(dataPoint.throw))
        .y0(dataPoint => { if (dataPoint.playerIndex == 0) { return gameChartYAxis(0) } else { return gameChartYAxis(doubleScoreArrays[dataPoint.playerIndex - 1][dataPoint.throw].totalScore) } })
        .y1(dataPoint => { if (dataPoint.playerIndex == 0) { return gameChartYAxis(dataPoint.totalScore) } else { return gameChartYAxis(doubleScoreArrays[dataPoint.playerIndex - 1][dataPoint.throw].totalScore + dataPoint.totalScore) } });

    if (doubleOverview) {
        for (let i = 0; i < 2; i++) {
            console.log(doubleScoreArrays[i])
            gameChartsvg.append("path")
                .attr("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                .attr("stroke", ("hsl(" + (40 * i) + ",100%,50%)"))
                .attr("stroke-width", 4)
                .attr("d", area(doubleScoreArrays[i], i))
                .attr("onmousemove", "highlightLine(this)")
                .attr("onmouseout", "unhighlightLine(this)");


            gameChartsvg.append("text")
                .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 2) * i + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 2) / 2) + gameChartMarginLeft) + "," + 60 + ")")
                .attr("font-size", "4em")
                .attr("text-anchor", "middle")
                .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                .text(game.playerList[i + (2 * double)]);
        }
    } else {
        for (let i = 0; i < game.playerCount / 2; i++) {
            gameChartsvg.append("path")
                .attr("fill", "none")
                .attr("stroke", ("hsl(" + (40 * i) + ",100%,50%)"))
                .attr("stroke-width", 4)
                .attr("d", line(doubleScoreArrays[i]))
                .attr("onmousemove", "highlightLine(this)")
                .attr("onmouseout", "unhighlightLine(this)");


            if (game.playerCount / 2 <= 5) {
                gameChartsvg.append("text")
                    .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / (game.playerCount / 2)) * i + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / (game.playerCount / 2)) / 2) + gameChartMarginLeft) + "," + 60 + ")")
                    .attr("font-size", "4em")
                    .attr("text-anchor", "middle")
                    .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                    .text("Doppel " + (i + 1));
            } else if (game.playerCount / 2 <= 10) {
                if (i < 5) {
                    gameChartsvg.append("text")
                        .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 5) * i + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / 5) / 2) + gameChartMarginLeft) + "," + 40 + ")")
                        .attr("font-size", "3em")
                        .attr("text-anchor", "middle")
                        .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                        .text("Doppel " + (i + 1));
                } else {
                    gameChartsvg.append("text")
                        .attr("transform", "translate(" + ((((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / ((game.playerCount / 2) - 5)) * (i - 5) + ((gameChartWidth - (gameChartMarginLeft + gameChartMarginRight)) / ((game.playerCount / 2) - 5)) / 2) + gameChartMarginLeft) + "," + 90 + ")")
                        .attr("font-size", "3em")
                        .attr("text-anchor", "middle")
                        .style("fill", ("hsl(" + (40 * i) + ",100%,50%)"))
                        .text("Doppel " + (i + 1));
                }
            }
        }   //gameChartYAxis(playerScoreArrays[i][playerScoreArrays[i].length-1].totalScore)
    }

    gameStatisticDiv.append(gameChartsvg.node());
    document.getElementById("gameChartXAxisElement").style.fontSize = "20px"
    document.getElementById("gameChartYAxisElement").style.fontSize = "20px"
}


function doubleScoresToArray(playerScores, gameSubtype) {
    console.log(playerScores);
    let thisDoubleScoreArray = [];

    let totalScore = 0;

    thisDoubleScoreArray.push({
        "throw": 0,
        "score": 0,
        "totalScore": 0
    });

    for (let i = 1; i <= gameSubtype; i++) {
        let countedThrows = 0;
        for (let j = 1; j <= 6; j++) {
            if (!playerScores["round" + i]["throw" + j].locked) {
                totalScore += playerScores["round" + i]["throw" + j].value;
                countedThrows += 1;
                thisDoubleScoreArray.push({
                    "throw": (i - 1) * 3 + countedThrows,
                    "score": playerScores["round" + i]["throw" + j].value,
                    "totalScore": totalScore
                });
            }
        }
        countedThrows = 0;
    }
    console.log(thisDoubleScoreArray);
    return thisDoubleScoreArray;
}

function oneDoubleScoreToArray(playerScores, gameSubtype, playerIndex) {
    console.log(playerScores);
    let thisPlayerScoreArray = [];
    let totalScore = 0;

    thisPlayerScoreArray.push({
        "throw": 0,
        "score": 0,
        "totalScore": 0,
        "playerIndex": playerIndex
    });

    for (let i = 1; i <= gameSubtype; i++) {
        for (let j = 1; j <= 3; j++) {
            if (!playerScores["round" + i]["throw" + j].locked) {
                totalScore += playerScores["round" + i]["throw" + j].value;
            }
            thisPlayerScoreArray.push({
                "throw": (i - 1) * 3 + j,
                "score": playerScores["round" + i]["throw" + j].value,
                "totalScore": totalScore,
                "playerIndex": playerIndex
            });
        }
    }
    console.log(thisPlayerScoreArray);
    return thisPlayerScoreArray;
}

//https://observablehq.com/@d3/stacked-area-chart/2?intent=fork