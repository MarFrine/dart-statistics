// Dartboard

let dartboardButtons = document.getElementsByClassName("dartboardButton");
for (let i = 0; i < dartboardButtons.length; i++) {
    dartboardButtons[i].addEventListener("click", () => {
        if (dartboardButtons[i].classList.contains("tableInputTypeButton")) {
            clickTypeField(dartboardButtons[i].id);
        } else {
            clickField(dartboardButtons[i].id);
        }
    })

    dartboardButtons[i].addEventListener("mousemove", () => {
        if (!inputDisabled) {
            highlightDartField(dartboardButtons[i].id);
        }
    })
    dartboardButtons[i].addEventListener("mouseleave", () => {
        unhighlightDartField(dartboardButtons[i].id);
    })
}

let inputTableNumberButtons = document.getElementsByClassName("inputTableNumberButton");
for (let i = 0; i < inputTableNumberButtons.length; i++) {
    inputTableNumberButtons[i].addEventListener("click", () => {
        clickNumberField(inputTableNumberButtons[i].id);
    })
}
let tableInputTypeButtons = document.getElementsByClassName("tableInputTypeButton");


let dartColors = [
    "#9E170D",
    "#000000",
    "#1D7502",
    "#f5deb3"
]

let highlightedDartColors = [
    "#E82113",
    "#424242",
    "#1DA81D",
    "#fff0d5"
]

function highlightDartField(fieldID) {
    let currentColor
    if (fieldID != "field_25" && fieldID != "field_50" && fieldID != "field_ring" && fieldID != "field_dot") {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-17, -10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-19, -12);
    }
    let colorIndex = dartColors.findIndex((thisColor) => { return thisColor == currentColor });
    if (colorIndex >= 0) {
        if (fieldID != "field_ring") {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + highlightedDartColors[colorIndex]);
        } else {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("stroke: " + currentColor, "stroke: " + highlightedDartColors[colorIndex]);
        }

    }
}

function unhighlightDartField(fieldID) {
    if (document.getElementById(fieldID).locked) {
        return;
    }
    let currentColor
    if (fieldID != "field_25" && fieldID != "field_50" && fieldID != "field_ring" && fieldID != "field_dot") {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-17, -10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-19, -12);
    }

    let colorIndex = highlightedDartColors.findIndex((thisColor) => { return thisColor == currentColor });
    if (colorIndex >= 0) {
        if (fieldID != "field_ring") {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + dartColors[colorIndex]);
        } else {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("stroke: " + currentColor, "stroke: " + dartColors[colorIndex]);
        }
    }
}


function displayTurnOrder() {
    let turnOrderString = "";
    for (let i = 0; i < currentGame.playerCount; i++) {
        if (currentGame.currentTurn != currentGame.playerList[i]) {
            if (currentGame.scores[currentGame.playerList[i]].finished) {
                turnOrderString = turnOrderString + "<font color='blue'>" + currentGame.playerList[i] + " -- " + currentGame.scores[currentGame.playerList[i]].totalScore + "</font><br>";
            } else {
                turnOrderString = turnOrderString + currentGame.playerList[i] + " -- " + currentGame.scores[currentGame.playerList[i]].totalScore + "<br>";
            }
        } else {
            turnOrderString = turnOrderString + "<font size='+3' color='gold'>" + currentGame.playerList[i] + " -- " + currentGame.scores[currentGame.playerList[i]].totalScore + "</font><br>";
        }

    }
    console.log(turnOrderString);
    document.getElementById("inputTurnOrderDiv").innerHTML = turnOrderString;
    if (currentGame.type == "xThrows") {
        let turnInfoString = "Round: " + currentGame.currentRound + "/" + currentGame.subtype;
        document.getElementById("inputTurnInfo").innerHTML = turnInfoString;
    } else if (currentGame.type == "firstToX") {
        let turnInfoString = "Round: " + currentGame.currentRound;
        document.getElementById("inputTurnInfo").innerHTML = turnInfoString;
    }

}

function displayCurrentTurn() {
    if (currentGame.specifications.double) {
        document.getElementById("inputCurrentTurnDouble").style.display = "block";
        document.getElementById("inputCurrentTurnName").innerHTML = "<h1>Doppel " + (currentGame.scores[currentGame.currentTurn].double + 1) + "</h1>";
        document.getElementById("inputCurrentTurnTotalScore").innerHTML = "<h2>" + currentDoubleScores.totalScore + "</h2>";
        for(let i = 1; i <= 2; i++){
            let currentPlayer = false;
            console.log(currentDoubleScores)
            if((!currentDoubleScores.throw1 || currentDoubleScores.throw1.thrownBy == currentGame.currentTurn) && i == 1){
                currentPlayer = true
            } else if(currentDoubleScores.throw1 && (currentDoubleScores.throw1.thrownBy != currentGame.currentTurn && i == 2)){
                currentPlayer = true
            }

            if(currentPlayer){
                document.getElementById("double" + i + "Name").innerHTML = "<h2>" + currentGame.currentTurn + "</h2>";
            } else {
                document.getElementById("double" + i + "Name").innerHTML = "<h2>" + currentGame.playerList.find((thisPlayer)=>{return currentGame.scores[thisPlayer].double == currentGame.scores[currentGame.currentTurn].double && thisPlayer != currentGame.currentTurn}) + "</h2>";
            }
            for (let j = 1; j <= 3; j++) {
                let color = "white";
                if (j == selectedScore && currentPlayer) {
                    color = "yellow";
                }
                document.getElementById("double" + i + "editThrow" + j).style.display = "none";
                if (currentDoubleScores["throw" + (j + ((i-1)*3))]) {
                    let thisThrow = currentDoubleScores["throw" + (j + ((i-1)*3))];
                    if ((thisThrow.locked || thisThrow.field == "miss") && (j != selectedScore || !currentPlayer)) {
                        color = "red";
                    }
                    document.getElementById("double" + i + "throw" + j + "Text").innerHTML = "<font color='" + color + "' ><h2>Wurf " + j + ": " + thisThrow.value + "</h2></font>";
                    if(currentPlayer){
                        document.getElementById("double" + i + "editThrow" + j).style.display = "block";
                    }
                } else {
                    document.getElementById("double" + i + "throw" + j + "Text").innerHTML = "<font color='" + color + "' ><h2>Wurf " + j + ": </h2></font>";
                }
            }
        }
    } else {
        document.getElementById("inputCurrentTurnDouble").style.display = "none";
        document.getElementById("inputCurrentTurnName").innerHTML = "<h1>" + currentGame.currentTurn + "</h1>";
        document.getElementById("inputCurrentTurnTotalScore").innerHTML = "<h2>" + currentScores.totalScore + "</h2>";
        console.log(currentScores)
        let currentScore = 0;
        for (let i = 1; i <= 3; i++) {
            let color = "white";
            if (i == selectedScore) {
                color = "yellow";
            }
            if (currentScores["throw" + i]) {
                if ((currentScores["throw" + i].locked || currentScores["throw" + i].field == "miss") && i != selectedScore) {
                    color = "red";
                }
                document.getElementById("throw" + i + "Text").innerHTML = "<font color='" + color + "' ><h2>Wurf " + i + ": " + currentScores["throw" + i].value + "</h2></font>";
                document.getElementById("editThrow" + i).style.display = "block";
                if (!currentScores["throw" + i].locked) {
                    currentScore += currentScores["throw" + i].value;
                }
            } else {
                document.getElementById("throw" + i + "Text").innerHTML = "<font color='" + color + "' ><h2>Wurf " + i + ": </h2></font>";
                document.getElementById("editThrow" + i).style.display = "none";
            }
        }
    }

}


function clickMissField() {
    if (!selectedScore || inputDisabled) {
        return;
    }

    setScore("miss");
}

// Dartboard

function clickField(fieldID) {
    console.log("selectedScore: ", selectedScore, fieldID)
    let field = fieldID.slice(6);
    if (!selectedScore) {
        return;
    }

    if (!inputDisabled) {
        setScore(field);
    }
}




// Table
let tableFieldType = undefined;
let tableFieldNumber = undefined;
function clickTypeField(fieldID) {
    if ((inputDisabled || !selectedScore) && fieldID) {
        return;
    }

    for (let i = 0; i < tableInputTypeButtons.length; i++) {
        tableInputTypeButtons[i].locked = false;
    }

    if (fieldID) {
        tableFieldType = fieldID.slice(6);
        document.getElementById(fieldID).locked = true;
        setTableFieldScore();
    }

    for (let i = 0; i < tableInputTypeButtons.length; i++) {
        unhighlightDartField(tableInputTypeButtons[i].id);
    }
}


function clickNumberField(fieldID) {
    if ((inputDisabled || !selectedScore) && fieldID) {
        return;
    }


    for (let i = 0; i < inputTableNumberButtons.length; i++) {
        inputTableNumberButtons[i].style.backgroundColor = "var(--color_interface_light)";
    }
    if (fieldID) {
        tableFieldNumber = document.getElementById(fieldID).value;
        document.getElementById(fieldID).style.backgroundColor = "var(--color_interface_dark)";
        setTableFieldScore();
    }
}


function setTableFieldScore() {
    console.log(tableFieldNumber, tableFieldType)
    if ((!tableFieldNumber || !tableFieldType) && (tableFieldType != "ring" && tableFieldType != "dot")) {
        return;
    }
    let field = ""
    if (tableFieldType == "2x" || tableFieldType == "3x") {
        field = tableFieldType + tableFieldNumber;
    } else if (tableFieldType == "inner" || tableFieldType == "outer") {
        field = "1x" + tableFieldNumber + "_" + tableFieldType
    } else if (tableFieldType == "ring") {
        field = "25";
    } else if (tableFieldType == "dot") {
        field = "50";
    }
    tableFieldType = undefined;
    tableFieldNumber = undefined;
    clickTypeField(false);
    clickNumberField(false);
    setScore(field);

}




let currentlyChanging = false;
let selectedScore = 1;
let currentScores = {};
let currentDoubleScores = {};
let inputDisabled = false;
function setScore(field) {

    console.log("test", field)
    transferData("/setScore", "post", ({ "scoreToSet": selectedScore, "field": field }))
        .then((data) => {
            currentScores = data.turn;
            if (data.doubleTurn) {
                currentDoubleScores = data.doubleTurn;
                console.log(currentDoubleScores);
            }

            console.log(currentScores);

            if (!currentlyChanging && selectedScore < 3) {
                selectedScore++;
            } else if (!currentlyChanging) {
                selectedScore = undefined;
            } else if (!currentScores["throw1"]) {
                selectedScore = 1
            } else if (!currentScores["throw2"]) {
                selectedScore = 2
            } else if (!currentScores["throw3"]) {
                selectedScore = 3
            } else {
                selectedScore = undefined;
            }

            if ((currentScores.throw1 && currentScores.throw2 && currentScores.throw3) || currentScores.overshoot || currentScores.finished) {
                document.getElementById("confirmTurn").style.display = "block";
                selectedScore = undefined;
            } else {
                document.getElementById("confirmTurn").style.display = "none";
            }

            displayCurrentTurn();

        })
        .catch(error => {
            console.log(error);
        })

}

function changeScore(scoreToChange) {
    selectedScore = scoreToChange;
    currentlyChanging = true;
    document.getElementById("confirmTurn").style.display = "none";
    displayCurrentTurn();
}


function confirmTurn() {
    console.log("confirmTurn")
    transferData("/confirmScore", "get")
        .then((data) => {
            if (data.gameFinished) {
                getAccountData();
                showGameStatistic(data.completeGame);
                currentGame = undefined;


            } else {
                currentScores = {
                    throw1: {},
                    throw2: {},
                    throw3: {}
                }

                document.getElementById("confirmTurn").style.display = "none";
                inputDisabled = false;
                selectedScore = 1;
                clientUpdate();
            }
        })
        .catch((error) => { console.log(error) });
}

function stopGame() {
    currentlyChanging = false;
    selectedScore = 1;
    currentScores = {};
    currentDoubleScores = {};
    inputDisabled = false;
    transferData("/stopGame", "get");
}