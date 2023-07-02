// Dartboard

let dartboardButtons = document.getElementsByClassName("dartboardButton");
for(let i = 0; i < dartboardButtons.length; i++){
    dartboardButtons[i].addEventListener("click", ()=>{
        if(dartboardButtons[i].classList.contains("tableInputTypeButton")){
            clickTypeField(dartboardButtons[i].id);
        } else {
            clickField(dartboardButtons[i].id);
        }
    })

    dartboardButtons[i].addEventListener("mousemove", ()=>{
        if(!inputDisabled){
            highlightDartField(dartboardButtons[i].id);
        }
    })
    dartboardButtons[i].addEventListener("mouseleave", ()=>{
        unhighlightDartField(dartboardButtons[i].id);
    })
}

let inputTableNumberButtons = document.getElementsByClassName("inputTableNumberButton");
for(let i = 0; i < inputTableNumberButtons.length; i++){
    inputTableNumberButtons[i].addEventListener("click", ()=>{
        clickNumberField(inputTableNumberButtons[i].id);
    })
}


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

function highlightDartField(fieldID){
    let currentColor
    if(fieldID != "field_25" && fieldID != "field_50" && fieldID != "field_ring" && fieldID != "field_dot"){
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-17,-10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-19,-12);
    }
    let colorIndex = dartColors.findIndex((thisColor)=>{return thisColor == currentColor});
    if(colorIndex >= 0){
        if(fieldID != "field_ring"){
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + highlightedDartColors[colorIndex]);
        } else {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("stroke: " + currentColor, "stroke: " + highlightedDartColors[colorIndex]);
        }
        
    }
}

function unhighlightDartField(fieldID){
    if(document.getElementById(fieldID).locked){
        return;
    }
    let currentColor
    if(fieldID != "field_25" && fieldID != "field_50" && fieldID != "field_ring" && fieldID != "field_dot"){
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-17,-10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().trim().slice(-19,-12);
    }
    
    let colorIndex = highlightedDartColors.findIndex((thisColor)=>{return thisColor == currentColor});
    if(colorIndex >= 0){
        if(fieldID != "field_ring"){
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + dartColors[colorIndex]);
        } else {
            document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("stroke: " + currentColor, "stroke: " + dartColors[colorIndex]);
        }
    }
}


function displayTurnOrder(){
    let turnOrderString = "";
    for(let i = 0; i < currentGame.playerCount; i++){
        if(currentGame.currentTurn != currentGame.playerList[i]){
            turnOrderString = turnOrderString + currentGame.playerList[i] + "<br>";
        } else {
            turnOrderString = turnOrderString + "<font size='+3' color='gold'>" + currentGame.playerList[i] + "</font><br>";
        }
        
    }
    console.log(turnOrderString);
    document.getElementById("inputTurnOrderDiv").innerHTML = turnOrderString;
    if(currentGame.type == "xThrows"){
        let turnInfoString = "Round: " + currentGame.currentRound + "/" + currentGame.subtype;
        document.getElementById("inputTurnInfo").innerHTML = turnInfoString;
    } else if(currentGame.type == "firstToX"){
        let turnInfoString = "Round: " + currentGame.currentRound;
        document.getElementById("inputTurnInfo").innerHTML = turnInfoString;
    }
    
}

function displayCurrentTurn(){
    
    document.getElementById("inputCurrentTurnName").innerHTML = "<h1>" + currentGame.currentTurn + "  --  " + currentGame.scores[currentGame.currentTurn].totalScore + "</h1>";

    let currentScore = 0;
    for(let i = 1; i <= 3; i++){
        let color = "white";
        if(i == selectedScore){
            color = "yellow";
        }
        if(currentScores["throw" + i].score){
            document.getElementById("throw" + i + "Text").innerHTML = "<font color='" + color + "' >Throw " + i + ": " + currentScores["throw" + i].score + "</font>";
            document.getElementById("editThrow" + i).style.display = "block";
            currentScore += currentScores["throw" + i].score;
        } else {
            document.getElementById("throw" + i + "Text").innerHTML = "<font color='" + color + "' >Throw " + i + ": </font>";
            document.getElementById("editThrow" + i).style.display = "none";
        }
    }
    document.getElementById("turnTotalScore").innerHTML = "Current score: " + currentScore;
}


// Dartboard

function clickField(fieldID){
    let field = fieldID.slice(6);
    if(!selectedScore){
        return;
    }

    if(!inputDisabled){
        setScore(field);
    }
}




// Table
let tableFieldType = undefined;
let tableFieldNumber = undefined;
function clickTypeField(fieldID){
    if((inputDisabled || !selectedScore) && fieldID){
        return;
    }
    console.log("test");
    let tableInputTypeButtons = document.getElementsByClassName("tableInputTypeButton");
    for(let i = 0; i < tableInputTypeButtons.length; i++){
        tableInputTypeButtons[i].locked = false;
    }
    
    if(fieldID){
        console.log("fieldID")
        tableFieldType = fieldID.slice(6);
        document.getElementById(fieldID).locked = true;
        setTableFieldScore();
    }

    for(let i = 0; i < tableInputTypeButtons.length; i++){
        unhighlightDartField(tableInputTypeButtons[i].id);
    }
}


function clickNumberField(fieldID){
    if((inputDisabled || !selectedScore) && fieldID){
        return;
    }
    

    for(let i = 0; i < inputTableNumberButtons.length; i++){
        inputTableNumberButtons[i].style.backgroundColor = "transparent";
    }
    if(fieldID){
        tableFieldNumber = document.getElementById(fieldID).value;
        document.getElementById(fieldID).style.backgroundColor = "white";
        setTableFieldScore();
    }
}


function setTableFieldScore(){
    console.log(tableFieldNumber, tableFieldType)
    if((!tableFieldNumber || !tableFieldType) && (tableFieldType != "ring" && tableFieldType != "dot")){
        return;
    }
    let field = ""
    if(tableFieldType == "2x" || tableFieldType == "3x"){
        field = tableFieldType + tableFieldNumber;
    } else if(tableFieldType == "inner" || tableFieldType == "outer"){
        field = "1x" + tableFieldNumber + "_" + tableFieldType
    } else if(tableFieldType == "ring"){
        field = "25";
    } else if(tableFieldType == "dot"){
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
let currentScores = {
    throw1: {},
    throw2: {},
    throw3: {}
}
let inputDisabled = false;
function setScore(field){ //------------so ändern, dass gesamte Logik auf Server ist -> nach jeder eingabe an Server schicken und dann antwort nutzen
     
    let fieldIndex = idValuePairs.id.findIndex((thisID)=>{return thisID == field;});
    let fieldValue = idValuePairs.value[fieldIndex];

    currentScores["throw" + selectedScore].field = field;
    currentScores["throw" + selectedScore].score = fieldValue;


    if(currentGame.scores[currentGame.currentTurn].doubleInLocked && !field.startsWith("2x")){
        transferData("/setScore", "post", ({"scoreToSet": selectedScore, "field": field, "score": fieldValue, "locked": true}));
        currentGame.scores[currentGame.currentTurn].doubleInLocked = false;
    } else {
        transferData("/setScore", "post", ({"scoreToSet": selectedScore, "field": field, "score": fieldValue, "locked": false}));
  
    }
    

    if(!currentlyChanging && selectedScore < 3){
        selectedScore++;
    } else if(!currentlyChanging){
        selectedScore = undefined;
    } else if(!currentScores["throw1"].score){
        selectedScore = 1
    } else if(!currentScores["throw2"].score){
        selectedScore = 2
    } else if(!currentScores["throw3"].score){
        selectedScore = 3
    } else {
        selectedScore = undefined;
    }

    if(currentScores["throw1"].score && currentScores["throw2"].score && currentScores["throw3"].score){
        document.getElementById("confirmTurn").style.display = "block";
    }

    displayCurrentTurn();
    
    console.log(currentScores);
    
}

function changeScore(scoreToChange){
    selectedScore = scoreToChange;
    currentlyChanging = true;
    document.getElementById("confirmTurn").style.display = "none";
    displayCurrentTurn();
}


function confirmTurn(){
    console.log("confirmTurn")
    transferData("/confirmScore", "get")
    .then((data)=>{
        if(data.gameFinished){
            endGame();
            clientUpdate();
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
    .catch((error)=>{console.log(error)});
}