const gameStatisticDiv = document.getElementById("gameStatisticDiv");


function drawGameStatistic(game) {

    changeMenuPoint("gameStats");

    let playerScoreArrays = [];
    let highestScore = 0;
    let mostThrows = 0;
    for(let i = 0; i < game.playerCount; i++){
        let thisPlayerScoreArray = playerScoresToArray(game.scores[game.playerList[i]], game.type, game.subtype)
        playerScoreArrays.push(thisPlayerScoreArray);
        if(game.type == "xThrows" && thisPlayerScoreArray[thisPlayerScoreArray.length-1].totalScore > highestScore){
            highestScore = thisPlayerScoreArray[thisPlayerScoreArray.length-1].totalScore;
        } else if(game.type == "firstToX"){
            highestScore = game.subtype;
        }
        if(thisPlayerScoreArray.length > mostThrows){
            mostThrows = thisPlayerScoreArray.length - 1;
        }
    }

    console.log(mostThrows, highestScore, playerScoreArrays);

    const gameChartWidth = 1400;
    const gameChartHeight = 800;
    const gameChartMarginRight = 50;
    const gameChartMarginTop = 100;
    const gameChartMarginBottom = 50;
    const gameChartMarginLeft = 50;


    const gameChartXAxis = d3.scaleLinear()
        .domain([0, mostThrows])
        .range([gameChartMarginLeft, gameChartWidth - gameChartMarginRight]);

        console.log(mostThrows)

    let gameChartYAxis
    if(game.type == "firstToX"){
        gameChartYAxis = d3.scaleLinear()
            .domain([0, game.subtype])
            .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);
    } else if(game.type == "xThrows"){
        gameChartYAxis = d3.scaleLinear()
            .domain([0, highestScore])
            .range([gameChartHeight - gameChartMarginBottom, gameChartMarginTop]);
    }
    


    const gameChartsvg = d3.create("svg")
        .attr("width", gameChartWidth)
        .attr("height", gameChartHeight);

    gameChartsvg.append("g")
        .attr("transform", "translate(0," + (gameChartHeight - gameChartMarginBottom) + ")")
        .call(d3.axisBottom(gameChartXAxis).ticks(mostThrows));

    gameChartsvg.append("g")
        .attr("transform", "translate(" + gameChartMarginLeft + ", 0)")
        .call(d3.axisLeft(gameChartYAxis).ticks(highestScore/10));

    //line generator
    const line = d3.line()
      .x(dataPoint => gameChartXAxis(dataPoint.throw))
      .y(dataPoint => gameChartYAxis(dataPoint.totalScore));
    
    for(let i = 0; i < game.playerCount; i++){

        gameChartsvg.append("path")
        .attr("fill", "none")
        .attr("stroke", ("hsl(" + (40*i) + ",100%,50%)"))
        .attr("stroke-width", 4)
        .attr("d", line(playerScoreArrays[i]))
        .attr("onmousemove", "highlightLine(this)")
        .attr("onmouseout", "unhighlightLine(this)");


        if(game.playerCount <= 5){
            gameChartsvg.append("text")
		        .attr("transform", "translate(" + ((((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/game.playerCount)*i + ((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/game.playerCount)/2) + gameChartMarginLeft) + "," + 60 + ")")
		        .attr("font-size", "4em")
		        .attr("text-anchor", "middle")
		        .style("fill", ("hsl(" + (40*i) + ",100%,50%)"))
		        .text(game.playerList[i]);
        } else if(game.playerCount <= 10){
            if(i < 5){
                gameChartsvg.append("text")
		            .attr("transform", "translate(" + ((((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/5)*i + ((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/5)/2) + gameChartMarginLeft) + "," + 40 + ")")
		            .attr("font-size", "3em")
		            .attr("text-anchor", "middle")
		            .style("fill", ("hsl(" + (40*i) + ",100%,50%)"))
		            .text(game.playerList[i]);
            } else {
                gameChartsvg.append("text")
		            .attr("transform", "translate(" + ((((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/(game.playerCount-5))*(i-5) + ((gameChartWidth-(gameChartMarginLeft+gameChartMarginRight))/(game.playerCount-5))/2) + gameChartMarginLeft) + "," + 90 + ")")
		            .attr("font-size", "3em")
		            .attr("text-anchor", "middle")
		            .style("fill", ("hsl(" + (40*i) + ",100%,50%)"))
		            .text(game.playerList[i]);
            }
            
        }
        
    }   //gameChartYAxis(playerScoreArrays[i][playerScoreArrays[i].length-1].totalScore)
    
    gameStatisticDiv.prepend(gameChartsvg.node())
    gameStatisticDiv.append(gameChartsvg.node());

}




function playerScoresToArray(playerScores, gameType, gameSubtype){
    let scoreArray = [];
    let round = 1;

    let totalScore = 0

    if(gameType == "firstToX"){
        totalScore = gameSubtype;
    }

    scoreArray.push({"throw": 0, "score": 0, "totalScore": totalScore});

    while(round >= 1){
        for(let i = 1; i <= 3; i++){
            if(playerScores["round" + round]["throw" + i]){
                if(gameType == "xThrows"){
                    totalScore += playerScores["round" + round]["throw" + i].value;
                } else {
                    if(!playerScores["round" + round]["throw" + i].locked){
                        totalScore -= playerScores["round" + round]["throw" + i].value;
                    }
                }
                scoreArray.push({"throw": 3 * round + (i - 3), "score": playerScores["round" + round]["throw" + i].value, "totalScore": totalScore});
            } else if(gameType == "firstToX" && totalScore != 0){
                scoreArray.push({"throw": 3 * round + (i - 3), "score": 0, "totalScore": totalScore});
            }
        }

        if(playerScores["round" + (round + 1)]){
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

function highlightLine(lineObject){
    lineObject.attributes["stroke-width"].value = 10;
}
function unhighlightLine(lineObject){
    lineObject.attributes["stroke-width"].value = 4;
}