let currentSingleRecordListType = "bestResults";
function createSingleRecordList(allResults) {
    let recordList = []

    if(allResults){
        currentSingleRecordListType = "allResults";
        document.getElementById("singleRecordsListTitle").innerHTML = "alle Ergebnisse";
        for(let i = 0; i < oldRecordList.single.length; i++){
            recordList.push({ "player": oldRecordList.single[i].player, "score": oldRecordList.single[i].score, "oldRecord": true});
        }
        for(let i = 0; i < accountData.games.length; i++){
            let thisGame = accountData.games[i];
            if(thisGame.type == "xThrows" && thisGame.subtype == 10 && !thisGame.specifications.double){
                for(let j = 0; j < thisGame.playerCount; j++){
                    let thisPlayer = thisGame.playerList[j];
                    recordList.push({ "player": thisPlayer, "score": thisGame.scores[thisPlayer].totalScore, "oldRecord": false, "game": thisGame.id});
                }
            }
        }
    } else {
        currentSingleRecordListType = "bestResults";
        document.getElementById("singleRecordsListTitle").innerHTML = "beste Ergebnisse";
        for(let i = 0; i < accountData.people.length; i++){
            let thisPlayer = accountData.people[i]
            let personalRecord = getPersonalRecord(thisPlayer)
            if(!personalRecord.noScore){
                recordList.push({ "player": thisPlayer.name, "score": personalRecord.score, "oldRecord": personalRecord.oldRecord, "game": personalRecord.game});
            }
        }
    }
    

    recordList.sort((record1, record2)=>{return record2.score - record1.score});
    console.log(recordList)
    let recordListNameString = "<u>Spieler</u><br><br>";
    let recordListScoreString = "<u>Punkte</u><br><br>";
    for(let i = 0; i < recordList.length; i++){
        if(recordList[i].oldRecord){
            recordListScoreString = recordListScoreString + "(" + (i+1) + ". " + recordList[i].score + "<br><br>";
            recordListNameString = recordListNameString + recordList[i].player + ")<br><br>";
        } else {
            recordListScoreString = recordListScoreString + (i+1) + ". " + recordList[i].score + "<br><br>";
            recordListNameString = recordListNameString + recordList[i].player + "<br><br>";
        }
        
        
    }

    document.getElementById("singleRecordsScoreDiv").innerHTML = recordListScoreString;
    document.getElementById("singleRecordsNameDiv").innerHTML = recordListNameString;
}



function getPersonalRecord(thisPerson) {

    let personalRecord = -1;
    let thisOldRecords = oldRecordList.single.filter((thisOldRecord) => { return thisOldRecord.player == thisPerson.name })
    let oldRecord = false;
    let game = undefined
    for(let i = 0; i < thisOldRecords.length; i++){
        if (thisOldRecords[i].score > personalRecord) {
            personalRecord = thisOldRecords[i].score;
            oldRecord = true;
        }
    }
    for (let j = 0; j < thisPerson.games.length; j++) {
        let thisGame = accountData.games.find((thisGameData) => { return thisGameData.id == thisPerson.games[j] });
        if (thisGame.type == "xThrows" && thisGame.subtype == 10) {
            if (thisGame.scores[thisPerson.name].totalScore > personalRecord) {
                personalRecord = thisGame.scores[thisPerson.name].totalScore;
                oldRecord = false;
            }
        }
    }
    console.log(personalRecord)
    if(personalRecord < 0){
        return {"noScore": true}
    }
    return {"score": personalRecord, "oldRecord": oldRecord, "game": game}
}


function switchSingleRecordList(){
    if(currentSingleRecordListType == "bestResults"){
        createSingleRecordList(true);
    } else {
        createSingleRecordList(false);
    }
    
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------

let currentDoubleRecordListType = "bestResults";
function createDoubleRecordList(allResults) {
    let recordList = []

    if(allResults){
        currentDoubleRecordListType = "allResults";
        document.getElementById("doubleRecordsListTitle").innerHTML = "alle Ergebnisse";
        for(let i = 0; i < oldRecordList.double.length; i++){
            recordList.push({ "player1": oldRecordList.double[i].player1, "player2": oldRecordList.double[i].player2, "score": oldRecordList.double[i].score, "oldRecord": true});
        }
        for(let i = 0; i < accountData.games.length; i++){
            let thisGame = accountData.games[i];
            if(thisGame.type == "xThrows" && thisGame.subtype == 10 && thisGame.specifications.double){
                for(let j = 0; j < thisGame.playerCount/2; j++){
                    let thisDoubleLead = thisGame.playerList[j*2];
                    recordList.push({ "player1": thisDoubleLead, "player2": thisGame.playerList[j*2+1], "score": thisGame.scores[thisDoubleLead].doubleScore.totalScore, "oldRecord": false});
                }
            }
        }
    } else {
        currentDoubleRecordListType = "bestResults";
        document.getElementById("doubleRecordsListTitle").innerHTML = "beste Ergebnisse";

        for(let i = 0; i < oldRecordList.double.length; i++){
            recordList.push({ "player1": oldRecordList.double[i].player1, "player2": oldRecordList.double[i].player2, "score": oldRecordList.double[i].score, "oldRecord": true});
        }
        for(let i = 0; i < accountData.games.length; i++){
            let thisGame = accountData.games[i];
            if(thisGame.type == "xThrows" && thisGame.subtype == 10 && thisGame.specifications.double){
                for(let j = 0; j < thisGame.playerCount/2; j++){
                    let thisDoubleLead = thisGame.playerList[j*2];
                    recordList.push({ "player1": thisDoubleLead, "player2": thisGame.playerList[j*2+1], "score": thisGame.scores[thisDoubleLead].doubleScore.totalScore, "oldRecord": false});
                }
            }
        }

        let doubleScoreList = [...recordList];
        recordList = [];
        for(let i = 0; i < doubleScoreList.length; i++){
            if(recordList.find((thisDoubleRecord)=>{
                return ((thisDoubleRecord.player1 == doubleScoreList[i].player1 && thisDoubleRecord.player2 == doubleScoreList[i].player2 && thisDoubleRecord.score > doubleScoreList[i].score)
                        || (thisDoubleRecord.player1 == doubleScoreList[i].player2 && thisDoubleRecord.player2 == doubleScoreList[i].player1 && thisDoubleRecord.score > doubleScoreList[i].score))
            })){
                //Doppel gibt es schon mit höherer Punktzahl
            } else if(recordList.find((thisDoubleRecord)=>{
                return ((thisDoubleRecord.player1 == doubleScoreList[i].player1 && thisDoubleRecord.player2 == doubleScoreList[i].player2)
                        || (thisDoubleRecord.player1 == doubleScoreList[i].player2 && thisDoubleRecord.player2 == doubleScoreList[i].player1))
            })){
                // Doppel gibt es schon mit niedrigerer Punktzahl
                let oldDoubleIndex = recordList.findIndex((thisDoubleRecord)=>{return ((thisDoubleRecord.player1 == doubleScoreList[i].player1 && thisDoubleRecord.player2 == doubleScoreList[i].player2) || (thisDoubleRecord.player1 == doubleScoreList[i].player2 && thisDoubleRecord.player2 == doubleScoreList[i].player1))})
                recordList.splice(oldDoubleIndex, 1);
                recordList.push({ "player1": doubleScoreList[i].player1, "player2": doubleScoreList[i].player2, "score": doubleScoreList[i].score, "oldRecord": doubleScoreList[i].oldRecord});
            } else {
                //Doppel gibt es noch nicht
                recordList.push({ "player1": doubleScoreList[i].player1, "player2": doubleScoreList[i].player2, "score": doubleScoreList[i].score, "oldRecord": doubleScoreList[i].oldRecord});
            }

            
        }

    }
    

    recordList.sort((record1, record2)=>{return record2.score - record1.score});
    console.log(recordList)
    let recordListNameString = "<u>Spieler</u><br><br>";
    let recordListScoreString = "<u>Punkte</u><br><br>";
    for(let i = 0; i < recordList.length; i++){
        if(recordList[i].oldRecord){
            recordListScoreString = recordListScoreString + "(" + (i+1) + ". " + recordList[i].score + "<br><br>";
            recordListNameString = recordListNameString + recordList[i].player1 + " & " + recordList[i].player2 + ")<br><br>";
        } else {
            recordListNameString = recordListNameString + recordList[i].player1 + " & " + recordList[i].player2 + "<br><br>";
            recordListScoreString = recordListScoreString + (i+1) + ". " + recordList[i].score + "<br><br>";
        }
        
        
    }

    document.getElementById("doubleRecordsScoreDiv").innerHTML = recordListScoreString;
    document.getElementById("doubleRecordsNameDiv").innerHTML = recordListNameString;
}


function switchDoubleRecordList(){
    if(currentDoubleRecordListType == "bestResults"){
        createDoubleRecordList(true);
    } else {
        createDoubleRecordList(false);
    }
    
}

function openXThrowsRecordList(){
    createSingleRecordList(true);
    createDoubleRecordList(true);
    document.getElementById("x01RecordsDiv").style.display = "none";
    document.getElementById("singleRecordsDiv").style.display = "block";
    document.getElementById("doubleRecordsDiv").style.display = "block";
}

function openFirstToXRecordList(){
    
    currentFirstToXRecordListTypes = {
        "301": "allResults",
        "501": "allResults",
        "701": "allResults"
    }
    createX01RecordList("allResults", "allResults", "allResults")
    document.getElementById("singleRecordsDiv").style.display = "none";
    document.getElementById("doubleRecordsDiv").style.display = "none";
    document.getElementById("x01RecordsDiv").style.display = "block";
}


//---------------------------------------------------------------------------------------------------------
let currentFirstToXRecordListTypes = {
    "301": "allResults",
    "501": "allResults",
    "701": "allResults"
}
function createX01RecordList(allResults301, allResults501, allResults701){
    createSpecificX01RecordList(allResults301, "301");
    createSpecificX01RecordList(allResults501, "501");
    createSpecificX01RecordList(allResults701, "701");
}

function switchX01RecordListType(subtype){
    if(currentFirstToXRecordListTypes[subtype] == "allResults"){
        currentFirstToXRecordListTypes[subtype] = "bestResults";
    } else {
        currentFirstToXRecordListTypes[subtype] = "allResults";
    }
    createX01RecordList(currentFirstToXRecordListTypes["301"], currentFirstToXRecordListTypes["501"], currentFirstToXRecordListTypes["701"])
}

function createSpecificX01RecordList(allResults, subtype) {
    let recordList = []

    if(allResults == "allResults"){
        document.getElementById(subtype + "RecordsListTitle").innerHTML = "alle Ergebnisse";
        for(let i = 0; i < accountData.games.length; i++){
            let thisGame = accountData.games[i];
            if(thisGame.type == "firstToX" && thisGame.subtype == subtype){
                for(let j = 0; j < thisGame.playerCount; j++){
                    let thisPlayer = thisGame.playerList[j];
                    recordList.push({ "player": thisPlayer, "finishRound": thisGame.scores[thisPlayer].finishRound, "game": thisGame.id});
                }
            }
        }
    } else {
        document.getElementById(subtype + "RecordsListTitle").innerHTML = "beste Ergebnisse";
        for(let i = 0; i < accountData.people.length; i++){
            let thisPlayer = accountData.people[i]
            let personalRecord = getFirstToXPersonalRecord(thisPlayer, subtype)
            if(!personalRecord.noScore){
                recordList.push({ "player": thisPlayer.name, "finishRound": personalRecord.finishRound, "game": personalRecord.game});
            }
        }
    }
    

    recordList.sort((record1, record2)=>{return record1.finishRound - record2.finishRound});
    console.log(recordList)
    let recordListNameString = "<u>Spieler</u><br><br>";
    let recordListScoreString = "<u>Runde</u><br><br>";
    for(let i = 0; i < recordList.length; i++){
        recordListScoreString = recordListScoreString + (i+1) + ". " + recordList[i].finishRound + "<br><br>";
        recordListNameString = recordListNameString + recordList[i].player + "<br><br>";
    }

    document.getElementById("firstTo" + subtype + "RecordsScoreDiv").innerHTML = recordListScoreString;
    document.getElementById("firstTo" + subtype + "RecordsNameDiv").innerHTML = recordListNameString;
}



function getFirstToXPersonalRecord(thisPerson, subtype) {
    let personalRecord = -1;
    let game = undefined
    for (let i = 0; i < thisPerson.games.length; i++) {
        console.log("test")
        let thisGame = accountData.games.find((thisGameData) => { return thisGameData.id == thisPerson.games[i] });
        if (thisGame.type == "firstToX" && thisGame.subtype == subtype) {
            if (thisGame.scores[thisPerson.name].finishRound < personalRecord || personalRecord < 0) {
                personalRecord = thisGame.scores[thisPerson.name].finishRound;
            }
        }
    }
    if(personalRecord < 0){
        return {"noScore": true}
    }
    return {"finishRound": personalRecord, "game": game}
}


function switchSingleRecordList(){
    if(currentSingleRecordListType == "bestResults"){
        createSingleRecordList(true);
    } else {
        createSingleRecordList(false);
    }
    
}