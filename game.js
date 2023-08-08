module.exports = class ServerSideGame {
    constructor(currentAccount, type, subtype, playerList, specifications, editingClient) {
        this.id = currentAccount.data.totalGames;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        if(type == "firstToX"){
            this.finishedPeople = 0;
        }
        this.date = Date();

        this.type = type;
        this.subtype = subtype;

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
        this.editingTimeout = setTimeout(()=>{this.currentlyEdited = 0}, 5000);
    }

    getEditor(clientID){
        console.log(this.currentlyEdited, clientID)
        if(this.currentlyEdited == 0 || this.currentlyEdited == clientID){
            this.currentlyEdited = clientID;
            clearTimeout(this.editingTimeout);
            this.editingTimeout = setTimeout(()=>{this.currentlyEdited = 0}, 5000);
        }

        return this.currentlyEdited;
    }

    createEmptyScores() {
        this.scores = {};
        for (let i = 0; i < this.playerCount; i++) {
            this.scores[this.playerList[i]] = {};
            if (this.type == "xThrows") {
                this.scores[this.playerList[i]].totalScore = 0;
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
                "overshoot": false
            }
        }
        //runde 1
        for (let i = 0; i < this.playerCount; i++) {
            let round = "round" + this.currentRound;
            this.scores[this.playerList[i]][round] = {}
        }
    }

    resetTempScore(){
        this.scores[this.currentTurn].tempScore = {
            "totalScore": this.scores[this.currentTurn].totalScore,
            "finished": false,
            "overshoot": false
        }
    }

    getFieldValue(field) {
        let fieldIndex = idValuePairs.id.findIndex((thisID) => { return thisID == field; });
        let fieldValue = idValuePairs.value[fieldIndex];
        return fieldValue;
    }

    setScore(scoreToSet, field, alreadySet) {
        let currentThrow = {};

        if (field == "miss"){
            currentThrow.field = "miss";
            currentThrow.value = 0;
        } else {
            currentThrow.field = field;
            currentThrow.value = this.getFieldValue(field);
        }
        

        console.log(currentThrow);

        console.log(this.scores[this.currentTurn]);

        if (this.scores[this.currentTurn].tempScore["throw" + scoreToSet]) {
            
            let tempScores = this.scores[this.currentTurn].tempScore;

            this.resetTempScore();

            if(this.specifications.doubleIn && !this.scores[this.currentTurn].doubleInLocked && this.scores[this.currentTurn].doubleInUnlockRound == this.currentRound){
                this.scores[this.currentTurn].doubleInLocked = true;
                this.scores[this.currentTurn].doubleInUnlockRound = undefined;
                this.scores[this.currentTurn].doubleInUnlockThrow = undefined;
            }

            for(let i = 1; i <= 3; i++){
                if(tempScores["throw" + i]){
                    if(i == scoreToSet){
                        this.setScore(i, field, true);
                    } else {
                        this.setScore(i, tempScores["throw" + i].field, true);
                    }
                }
            }

            console.log(this.scores[this.currentTurn]);
            return {"turn": this.scores[this.currentTurn].tempScore}

        } else { // neuer score
            if (this.type == "xThrows") {
                this.scores[this.currentTurn].tempScore.totalScore += currentThrow.value;
                currentThrow.locked = false;
            } else if (this.type == "firstToX") {

                if(this.specifications.doubleIn && this.scores[this.currentTurn].doubleInLocked){
                    if (currentThrow.field.startsWith("2x")) {
                        this.scores[this.currentTurn].doubleInLocked = false;
                        currentThrow.locked = false;
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        this.scores[this.currentTurn].doubleInUnlockRound = this.currentRound;
                        this.scores[this.currentTurn].doubleInUnlockThrow = scoreToSet;
                    } else {
                        currentThrow.locked = true;
                    }
                } else if(this.specifications.doubleOut && this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value <= 1){
                    if(this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value == 0 && currentThrow.field.startsWith("2x")){
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        currentThrow.locked = false;

                        this.scores[this.currentTurn].tempScore.finished = true;
                    } else {
                        currentThrow.locked = true;
                        
                        this.scores[this.currentTurn].tempScore.overshoot = true;
                        this.scores[this.currentTurn].tempScore.totalScore = this.scores[this.currentTurn].totalScore;
                        for(let i = 1; i <= 3; i++){
                            if(this.scores[this.currentTurn].tempScore["throw" + i]){
                                this.scores[this.currentTurn].tempScore["throw" + i].locked = true
                            }
                        }
                    }
                } else if(this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value < 1){
                    if(this.scores[this.currentTurn].tempScore.totalScore - currentThrow.value == 0){
                        this.scores[this.currentTurn].tempScore.totalScore -= currentThrow.value;
                        currentThrow.locked = false;
                        
                        this.scores[this.currentTurn].tempScore.finished = true;
                    } else {
                        currentThrow.locked = true;
                        
                        this.scores[this.currentTurn].tempScore.overshoot = true;
                        this.scores[this.currentTurn].tempScore.totalScore = this.scores[this.currentTurn].totalScore;
                        for(let i = 1; i <= 3; i++){
                            if(this.scores[this.currentTurn].tempScore["throw" + i]){
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

            if(!alreadySet){
                console.log(this.scores[this.currentTurn]);
                return {"turn": this.scores[this.currentTurn].tempScore}
            }
        }
    }


    nextTurn() {

        this.scores[this.currentTurn][this.roundString] = this.scores[this.currentTurn].tempScore;
        this.scores[this.currentTurn].totalScore = this.scores[this.currentTurn].tempScore.totalScore;

        this.scores[this.currentTurn].finished = this.scores[this.currentTurn].tempScore.finished;
        if(this.scores[this.currentTurn].finished){
            this.finishedPeople += 1;
            if(this.finishedPeople == this.playerCount){
                return "endGame";
            }
        }

        this.resetTempScore();

        let turnIndex = this.playerList.findIndex((thisPlayer) => { return thisPlayer == this.currentTurn });
        let nextTurnIndex = turnIndex + 1;
        
        if(nextTurnIndex == this.playerCount){
            return this.nextRound();
        }

        while(this.scores[this.playerList[nextTurnIndex]].finished){
            nextTurnIndex += 1;
            if(nextTurnIndex == this.playerCount){
                return this.nextRound();
            }
        }

        this.currentTurn = this.playerList[nextTurnIndex];
        return "nextTurn";
    }


    nextRound() {
        if (this.type == "xThrows" && this.subtype == this.currentRound) {
            return "endGame";
        } else if(this.type == "xThrows"){
            this.currentRound += 1;
            this.roundString = "round" + this.currentRound;
            this.currentTurn = this.playerList[0];
            for (let i = 0; i < this.playerCount; i++) {
                this.scores[this.playerList[i]][this.roundString] = {};
            }
            return "nextRound";
        } else {
            this.currentRound += 1;
            this.roundString = "round" + this.currentRound;
            let nextTurnIndex = 0;
            while(this.scores[this.playerList[nextTurnIndex]].finished){
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
