module.exports = class ServerSideGame {
    constructor(currentAccount, type, subtype, playerList, specifications, editingClient) {
        this.id = currentAccount.data.totalGames;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        
        this.date = Date();

        this.type = type;
        this.subtype = subtype;

        this.throws = 0;
        if (type == "firstToX") {
            this.finishedPeople = 0;
        } else if(type == "xThrows"){
            this.maxThrows = this.subtype * this.playerCount * 3;
        }

        this.specifications = {
            doubleIn: false,
            doubleOut: false,
            double: false
        }
        for (let i = 0; i < specifications.length; i++) {
            this.specifications[specifications[i]] = true
        }
        console.log(this.playerCount, this.playerList, this.type, this.subtype, this.specifications);

        this.currentRound = 1;
        this.roundString = "round" + this.currentRound;
        this.currentTurn = playerList[0];

        this.createEmptyScores();

        this.active = true;
        this.currentlyEdited = editingClient;
        this.editingTimeout = setTimeout(() => { this.currentlyEdited = 0 }, 5000);
    }

    getEditor(clientID) {
        //console.log(this.currentlyEdited, clientID)
        if (this.currentlyEdited == 0 || this.currentlyEdited == clientID) {
            this.currentlyEdited = clientID;
            clearTimeout(this.editingTimeout);
            this.editingTimeout = setTimeout(() => { this.currentlyEdited = 0 }, 5000);
        }

        return this.currentlyEdited;
    }

    createEmptyScores() {
        this.scores = {};
        for (let i = 0; i < this.playerCount; i++) {
            this.scores[this.playerList[i]] = {};
            this.scores[this.playerList[i]].throws = 0;
            if (this.type == "xThrows") {
                if (this.specifications.double) {
                    if (i % 2 == 0) {
                        this.scores[this.playerList[i]].totalScore = 0;
                        this.scores[this.playerList[i]].double = i / 2;
                        this.scores[this.playerList[i]].leadDouble = true;
                        this.scores[this.playerList[i]].doubleScore = {
                            "totalScore": 0
                        };
                    } else {
                        this.scores[this.playerList[i]].totalScore = 0;
                        this.scores[this.playerList[i]].double = Math.floor(i / 2);
                        this.scores[this.playerList[i]].leadDouble = false;
                    }
                } else {
                    this.scores[this.playerList[i]].totalScore = 0;
                }
            } else if (this.type == "firstToX") {
                this.scores[this.playerList[i]].totalScore = Number(this.subtype);
                this.scores[this.playerList[i]].doubleInLocked = false;
                this.scores[this.playerList[i]].finished = false;
                this.scores[this.playerList[i]].overshoot = false;

                if (this.specifications.doubleIn) {
                    this.scores[this.playerList[i]].doubleInLocked = true;
                }
                if (this.specifications.doubleOut) {
                    this.scores[this.playerList[i]].doubleOutLocked = true;
                }
            }
            this.scores[this.playerList[i]].tempScore = {
                "totalScore": this.scores[this.playerList[i]].totalScore,
                "finished": false,
                "finishRound": undefined,
                "finishThrow": undefined,
                "overshoot": false,
                "doubleScore": {
                    "totalScore": 0
                }
            }
        }
        //runde 1
        for (let i = 0; i < this.playerCount; i++) {
            let round = "round" + this.currentRound;
            this.scores[this.playerList[i]][round] = {}
            if (this.specifications.double) {
                if (this.scores[this.playerList[i]].leadDouble) {
                    this.scores[this.playerList[i]].doubleScore[round] = {};
                }
            }
        }
        console.log(this.scores);
    }

    resetTempScore() {
        if (this.specifications.double) {
            //console.log(this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && thisPlayer != this.currentTurn })]);
            this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && thisPlayer != this.currentTurn })].tempScore = {
                "totalScore": this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && thisPlayer != this.currentTurn })].totalScore,
                "finished": false,
                "finishRound": undefined,
                "finishThrow": undefined,
                "overshoot": false,
                "doubleScore": {
                    "totalScore": this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].doubleScore.totalScore
                }
            }

            this.scores[this.currentTurn].tempScore = {
                "totalScore": this.scores[this.currentTurn].totalScore,
                "finished": false,
                "finishRound": undefined,
                "finishThrow": undefined,
                "overshoot": false,
                "doubleScore": {
                    "totalScore": this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].doubleScore.totalScore
                }
            }
        } else {
            this.scores[this.currentTurn].tempScore = {
                "totalScore": this.scores[this.currentTurn].totalScore,
                "finished": false,
                "finishRound": undefined,
                "finishThrow": undefined,
                "overshoot": false
            }
        }
    }

    getFieldValue(field) {
        let fieldIndex = idValuePairs.id.findIndex((thisID) => { return thisID == field; });
        let fieldValue = idValuePairs.value[fieldIndex];
        return fieldValue;
    }

    setScore(scoreToSet, field, alreadySet) {
        console.log("setScore", scoreToSet, alreadySet);
        let currentThrow = {};

        if (field == "miss") {
            currentThrow.field = "miss";
            currentThrow.value = 0;
        } else {
            currentThrow.field = field;
            currentThrow.value = this.getFieldValue(field);
        }

        if (this.scores[this.currentTurn].tempScore["throw" + scoreToSet]) {

            let tempScores = { ...this.scores[this.currentTurn].tempScore };
            let doubleTempScores;

            if (this.specifications.double) {
                doubleTempScores = { ...this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].tempScore };
            }

            this.resetTempScore();

            if (this.specifications.double) {
                for (let i = 1; i <= 6; i++) {
                    if (doubleTempScores["throw" + i]) {
                        if (!doubleTempScores["throw" + i].locked) {
                            doubleTempScores.doubleScore.totalScore -= doubleTempScores["throw" + i].value;
                        }
                    }
                }
                //console.log(doubleTempScores)
                if (!doubleTempScores.doubleScore.throw4) {
                    delete doubleTempScores.throw1;
                    delete doubleTempScores.throw2;
                    delete doubleTempScores.throw3;

                    delete doubleTempScores.doubleScore.throw1;
                    delete doubleTempScores.doubleScore.throw2;
                    delete doubleTempScores.doubleScore.throw3;

                } else {
                    delete doubleTempScores.throw1;
                    delete doubleTempScores.throw2;
                    delete doubleTempScores.throw3;

                    delete doubleTempScores.doubleScore.throw4;
                    delete doubleTempScores.doubleScore.throw5;
                    delete doubleTempScores.doubleScore.throw6;

                    doubleTempScores.doubleScore.throw1.locked = false;
                    doubleTempScores.doubleScore.totalScore += doubleTempScores.doubleScore.throw1.value;
                    doubleTempScores.doubleScore.throw2.locked = false;
                    doubleTempScores.doubleScore.totalScore += doubleTempScores.doubleScore.throw2.value;
                    doubleTempScores.doubleScore.throw3.locked = false;
                    doubleTempScores.doubleScore.totalScore += doubleTempScores.doubleScore.throw3.value;
                }


                this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].tempScore = doubleTempScores;
            }

            if (this.specifications.doubleIn && !this.scores[this.currentTurn].doubleInLocked && this.scores[this.currentTurn].doubleInUnlockRound == this.currentRound) {
                this.scores[this.currentTurn].doubleInLocked = true;
                this.scores[this.currentTurn].doubleInUnlockRound = undefined;
                this.scores[this.currentTurn].doubleInUnlockThrow = undefined;
            }

            for (let i = 1; i <= 3; i++) {
                if (tempScores["throw" + i]) {
                    if (i == scoreToSet) {
                        this.setScore(i, field, true);
                    } else {
                        this.setScore(i, tempScores["throw" + i].field, true);
                    }
                }
            }

            if (this.specifications.double) {
                return { "turn": this.scores[this.currentTurn].tempScore, "doubleTurn": this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].tempScore.doubleScore };
            } else {
                return { "turn": this.scores[this.currentTurn].tempScore };
            }

        } else { // neuer score
            if(!alreadySet){
                this.throws += 1;
                this.scores[this.currentTurn].throws += 1;
            }
            if (this.type == "xThrows") {
                if (this.specifications.double) {
                    let playerToWriteScore = undefined;
                    if (this.scores[this.currentTurn].leadDouble) {
                        playerToWriteScore = this.currentTurn;
                    } else {
                        playerToWriteScore = this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })
                    }

                    for (let i = 1; i <= 6; i++) {
                        if (!this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i]) {
                            this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i] = {
                                ...currentThrow,
                                thrownBy: this.currentTurn,
                                throw: scoreToSet
                            }
                            break;
                        }
                    }

                    let topThrows = [];
                    for (let i = 1; i <= 6; i++) {
                        if (!this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i]) {
                            break;
                        }
                        topThrows.push({ "throw": i, "value": this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].value });
                    }

                    topThrows.sort((throw1, throw2) => { return throw2.value - throw1.value; });

                    this.scores[playerToWriteScore].tempScore.doubleScore.totalScore = this.scores[playerToWriteScore].doubleScore.totalScore;
                    for (let i = 0; i < topThrows.length; i++) {
                        if (i <= 2) {
                            this.scores[playerToWriteScore].tempScore.doubleScore["throw" + topThrows[i].throw].locked = false;
                            this.scores[playerToWriteScore].tempScore.doubleScore.totalScore += this.scores[playerToWriteScore].tempScore.doubleScore["throw" + topThrows[i].throw].value;
                        } else {
                            this.scores[playerToWriteScore].tempScore.doubleScore["throw" + topThrows[i].throw].locked = true;
                        }
                    }


                } else {
                    this.scores[this.currentTurn].tempScore.totalScore += currentThrow.value;
                    currentThrow.locked = false;
                }
            } else if (this.type == "firstToX") {

                if (this.specifications.doubleIn && this.scores[this.currentTurn].doubleInLocked) {
                    if (currentThrow.field.startsWith("2x")) {
                        this.scores[this.currentTurn].doubleInLocked = false;
                        currentThrow.locked = false;
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        this.scores[this.currentTurn].doubleInUnlockRound = this.currentRound;
                        this.scores[this.currentTurn].doubleInUnlockThrow = scoreToSet;
                    } else {
                        currentThrow.locked = true;
                    }
                } else if (this.specifications.doubleOut && this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value <= 1) {
                    if (this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value == 0 && currentThrow.field.startsWith("2x")) {
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        currentThrow.locked = false;

                        this.scores[this.currentTurn].tempScore.finished = true;
                        this.scores[this.currentTurn].tempScore.finishRound = this.currentRound;
                        this.scores[this.currentTurn].tempScore.finishThrow = scoreToSet;
                    } else {
                        currentThrow.locked = true;

                        this.scores[this.currentTurn].tempScore.overshoot = true;
                        this.scores[this.currentTurn].tempScore.totalScore = this.scores[this.currentTurn].totalScore;
                        for (let i = 1; i <= 3; i++) {
                            if (this.scores[this.currentTurn].tempScore["throw" + i]) {
                                this.scores[this.currentTurn].tempScore["throw" + i].locked = true
                            }
                        }
                    }
                } else if (this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value < 1) {
                    if (this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value == 0) {
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        currentThrow.locked = false;

                        this.scores[this.currentTurn].tempScore.finished = true;
                        this.scores[this.currentTurn].tempScore.finishRound = this.currentRound;
                        this.scores[this.currentTurn].tempScore.finishThrow = scoreToSet;
                    } else {
                        currentThrow.locked = true;

                        this.scores[this.currentTurn].tempScore.overshoot = true;
                        this.scores[this.currentTurn].tempScore.totalScore = this.scores[this.currentTurn].totalScore;
                        for (let i = 1; i <= 3; i++) {
                            if (this.scores[this.currentTurn].tempScore["throw" + i]) {
                                this.scores[this.currentTurn].tempScore["throw" + i].locked = true
                            }
                        }
                    }
                } else {
                    currentThrow.locked = false;
                    this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                }
            }

            this.scores[this.currentTurn].tempScore["throw" + scoreToSet] = currentThrow;


            //console.log(this.scores.person1.tempScore.doubleScore)
            if (!alreadySet) {
                //console.log(this.scores[this.currentTurn]);
                if (this.specifications.double) {
                    return { "turn": this.scores[this.currentTurn].tempScore, "doubleTurn": this.scores[this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })].tempScore.doubleScore };
                } else {
                    return { "turn": this.scores[this.currentTurn].tempScore };
                }
            }
        }
    }


    nextTurn() {
        let nextTurnIndex;
        if (this.specifications.double) {
            let playerToWriteScore = undefined
            if (this.scores[this.currentTurn].leadDouble) {
                playerToWriteScore = this.currentTurn
            } else {
                playerToWriteScore = this.playerList.find((thisPlayer) => { return this.scores[thisPlayer].double == this.scores[this.currentTurn].double && this.scores[thisPlayer].leadDouble })
            }

            if (this.scores[playerToWriteScore].tempScore.doubleScore.throw6) {
                this.scores[playerToWriteScore].doubleScore[this.roundString] = {};
                for (let i = 1; i <= 6; i++) {
                    let scoreRoundObject = this.scores[this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].thrownBy][this.roundString];
                    scoreRoundObject["throw" + this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].throw] = {
                        ...this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i]
                    }
                    if (!this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].locked) {
                        this.scores[this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].thrownBy].totalScore += scoreRoundObject["throw" + this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].throw].value;
                        this.scores[playerToWriteScore].doubleScore.totalScore += scoreRoundObject["throw" + this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i].throw].value;
                    }
                    this.scores[playerToWriteScore].doubleScore[this.roundString]["throw" + i] = {
                        ...this.scores[playerToWriteScore].tempScore.doubleScore["throw" + i]
                    }
                }


                this.resetTempScore();
            }

            let turnIndex = this.playerList.findIndex((thisPlayer) => { return thisPlayer == this.currentTurn });
            nextTurnIndex
            if(this.currentRound % 2 != 0){
                nextTurnIndex = turnIndex + 1;
            } else {
                if(turnIndex % 2 == 0){
                    nextTurnIndex = turnIndex + 3;
                } else {
                    nextTurnIndex = turnIndex - 1;
                }
            }
            

            if (nextTurnIndex >= this.playerCount) {
                return this.nextRound();
            }

            while (this.scores[this.playerList[nextTurnIndex]].finished) {
                nextTurnIndex += 1;
                if (nextTurnIndex == this.playerCount) {
                    return this.nextRound();
                }
            }

        } else {
            this.scores[this.currentTurn][this.roundString] = this.scores[this.currentTurn].tempScore;
            this.scores[this.currentTurn].totalScore = this.scores[this.currentTurn].tempScore.totalScore;

            this.scores[this.currentTurn].finished = this.scores[this.currentTurn].tempScore.finished;
            this.scores[this.currentTurn].finishRound = this.scores[this.currentTurn].tempScore.finishRound;
            this.scores[this.currentTurn].finishThrow = this.scores[this.currentTurn].tempScore.finishThrow;
            if (this.scores[this.currentTurn].finished) {
                this.finishedPeople += 1;
                if (this.finishedPeople == this.playerCount) {
                    return "endGame";
                }
            }

            this.resetTempScore();

            let turnIndex = this.playerList.findIndex((thisPlayer) => { return thisPlayer == this.currentTurn });
            nextTurnIndex = turnIndex + 1;

            if (nextTurnIndex == this.playerCount) {
                return this.nextRound();
            }

            while (this.scores[this.playerList[nextTurnIndex]].finished) {
                nextTurnIndex += 1;
                if (nextTurnIndex == this.playerCount) {
                    return this.nextRound();
                }
            }
        }



        this.currentTurn = this.playerList[nextTurnIndex];
        console.log(this.currentTurn);
        return "nextTurn";
    }


    nextRound() {
        if (this.type == "xThrows" && this.subtype == this.currentRound) {
            return "endGame";
        } else if (this.type == "xThrows") {
            this.currentRound += 1;
            this.roundString = "round" + this.currentRound;
            if(this.specifications.double && this.currentRound%2 == 0){
                this.currentTurn = this.playerList[1];
            } else {
                this.currentTurn = this.playerList[0];
            }
            console.log(this.currentTurn);
            for (let i = 0; i < this.playerCount; i++) {
                this.scores[this.playerList[i]][this.roundString] = {};
            }
            return "nextRound";
        } else {
            this.currentRound += 1;
            this.roundString = "round" + this.currentRound;
            let nextTurnIndex = 0;
            while (this.scores[this.playerList[nextTurnIndex]].finished) {
                nextTurnIndex += 1;
            }
            this.currentTurn = this.playerList[nextTurnIndex];
            for (let i = 0; i < this.playerCount; i++) {
                this.scores[this.playerList[i]][this.roundString] = {};
            }
            return "nextRound";
        }
    }

    finish(fs, currentAccount, currentGames, completeData) {

        if(this.type == "firstToX"){
            this.winner = this.playerList[0];
            for(let i = 1; i < this.playerCount; i++){
                if(this.scores[this.playerList[i]].finishRound < this.scores[this.winner].finishRound){
                    this.winner = this.playerList[i];
                }
            }
            this.winningScore = this.scores[this.winner].finishRound;
        } else if(this.type == "xThrows" && !this.specifications.double){
            this.winner = this.playerList[0];
            for(let i = 1; i < this.playerCount; i++){
                if(this.scores[this.playerList[i]].totalScore > this.scores[this.winner].totalScore){
                    this.winner = this.playerList[i];
                }
            }
            this.winningScore = this.scores[this.winner].totalScore;
        } else if(this.type == "xThrows" && this.specifications.double){
            this.winner = this.playerList[0];
            for(let i = 1; i < this.playerCount/2; i++){
                if(this.scores[this.playerList[2*i]].doubleScore.totalScore > this.scores[this.winner].doubleScore.totalScore){
                    this.winner = this.playerList[2*i];
                }
            }
            this.winningScore = this.scores[this.winner].doubleScore.totalScore;
        }

        delete currentGames[currentAccount.username];
        let newData = this;
        delete newData.currentTurn;
        delete newData.currentRound;
        delete newData.roundString;
        delete newData.active;
        delete newData.currentlyEdited;
        delete newData.editingTimeout;
        newData.playerList.forEach(thisPlayer => {
            delete newData.scores[thisPlayer].tempScore;
        });

        let accountIndex = completeData.findIndex((thisAccount) => { return thisAccount.username == currentAccount.username });
        completeData[accountIndex].data.games.push(newData);
        completeData[accountIndex].data.totalGames = completeData[accountIndex].data.games.length;

        completeData[accountIndex].data.people.forEach((thisPerson) => {
            if(newData.playerList.includes(thisPerson.name)){
                thisPerson.games.push(this.id);
                thisPerson.gamesPlayed += 1;
            }
            
        });

        fs.writeFile("./data.json", JSON.stringify(completeData), (error) => {
            if (error) {
                console.log(error)
            } else {
                console.log("file saved succesfully");
            }
        });

        return completeData;
    }

    stop(currentAccount, currentGames) {
        delete currentGames.currentAccount;
    }
}
