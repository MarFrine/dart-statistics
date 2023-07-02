module.exports = class ServerSideGame{
    constructor(currentAccount, type, subtype, playerList, specifications){
        this.id = currentAccount.data.totalGames + 1;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        this.date = Date();

        this.type = type;
        this.subtype = subtype;

        this.specifications = {
            doubleIn: false,
            doubleOut: false,
            double: false
        }
        for(let i = 0; i < specifications.length; i++){
            this.specifications[specifications[i]] = true
        }
        console.log(this.playerCount, this.playerList, this.type, this.subtype, this.specifications);

        this.currentRound = 1;
        this.roundString = "round" + this.currentRound;
        this.currentTurn = playerList[0];
        
        this.createEmptyScores();
        
        this.active = true;
        
    }

    createEmptyScores(){
        this.scores = {};
        for(let i = 0; i < this.playerCount; i++){
            this.scores[this.playerList[i]] = {};
            if(this.type == "xThrows"){
                this.scores[this.playerList[i]].totalScore = 0;
            } else if(this.type == "firstToX"){
                this.scores[this.playerList[i]].totalScore = Number(this.subtype);
                this.scores[this.playerList[i]].doubleInLocked = false;
                if(this.specifications.doubleIn){
                    this.scores[this.playerList[i]].doubleInLocked = true;
                }
                if(this.specifications.doubleOut){
                    this.scores[this.playerList[i]].doubleOutLocked = true;
                }
            }
            
        }
        //runde 1
        for(let i = 0; i < this.playerCount; i++){
            let round = "round" + this.currentRound;
            this.scores[this.playerList[i]][round] = {}
        }
    }


    setScore(scoreToSet, field, value){
        let alreadySet = false;
        let oldThrow = {};
        if(this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet]){
            alreadySet = true;
            oldThrow = {"field": this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet].field,
                        "value": this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet].value,
                        "locked": this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet].locked}
        }

        let currentThrow = this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet];

        currentThrow = {};
        currentThrow.field = field;
        currentThrow.value = value;

        console.log(currentThrow);
        console.log(this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet]);

        

        if(alreadySet){
            if(this.type == "xThrows"){
                this.scores[this.currentTurn].totalScore -= oldThrow.value;
                this.scores[this.currentTurn].totalScore += currentThrow.value;
                currentThrow.locked = false;
            } else if(this.type == "firstToX"){
                

                //doubleIn
                if(this.specifications.doubleIn){
                    if(this.scores.doubleInUnlockRound != this.currentRound){

                        //doubleOut
                        if(this.specifications.doubleOut){
                            if(this.scores[this.currentTurn].totalScore + oldThrow.value - currentThrow.value <= 1){
                                this.scores[this.currentTurn].totalScore -= currentThrow.value;
                                for(let i = 1; i <= 3; i++){
                                    if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                        this.scores[this.currentTurn][this.roundString]["throw" + i].locked = true;
                                        this.scores[this.currentTurn].totalScore += this.scores[this.currentTurn][this.roundString]["throw" + i].value
                                    }
                                }
                            } else if(this.scores[this.currentTurn].totalScore - oldThrow.value <= 1 && this.scores[this.currentTurn].totalScore + oldThrow.value - currentThrow.value > 1){
                                //----------------------------------------------
                            } else if(){
                                //----------------------------------------------
                            }
                        }
                        

                        this.scores[this.currentTurn].totalScore += oldThrow.value;
                        this.scores[this.currentTurn].totalScore -= currentThrow.value;

                    } else if(this.scores.doubleInLocked && currentThrow.field.startsWith("2x")){
                        currentThrow.locked = false;
                        this.scores.doubleInLocked = false;
                        for(let i = 1; i <= 3; i++){
                            if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                this.scores[this.currentTurn][this.roundString]["throw" + i].locked = false;
                                this.scores[this.currentTurn].totalScore -= this.scores[this.currentTurn][this.roundString]["throw" + i].value;
                            }
                        }

                    } else if(this.scores.doubleInLocked){
                        currentThrow.locked = true;
                    } else if(!this.scores.doubleInLocked && currentThrow.field.startsWith("2x")){
                        if(this.scores.doubleInUnlockThrow > scoreToSet){
                            for(let i = scoreToSet; i <= this.scores.doubleInUnlockThrow; i++){
                                if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                    this.scores[this.currentTurn][this.roundString]["throw" + i].locked = false;
                                    this.scores[this.currentTurn].totalScore -= this.scores[this.currentTurn][this.roundString]["throw" + i].value;
                                }
                            }
                            this.scores.doubleInUnlockThrow = scoreToSet;
                        } else {
                            this.scores[this.currentTurn].totalScore += oldThrow.value;
                            this.scores[this.currentTurn].totalScore -= currentThrow.value;
                        }
                    } else if(!this.scores.doubleInLocked && !currentThrow.field.startsWith("2x")){
                        if(this.scores.doubleInUnlockThrow == scoreToSet){
                            this.scores.doubleInLocked = true;
                            this.scores.doubleInUnlockThrow = undefined;
                            let unlockSpot = undefined;
                            for(let i = scoreToSet; i <= 3; i++){
                                if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                    if(this.scores[this.currentTurn][this.roundString]["throw" + i].field.startsWith("2x")){
                                        if(!unlockSpot){
                                            unlockSpot = i;
                                        }
                                        this.scores[this.currentTurn].totalScore += this.scores[this.currentTurn][this.roundString]["throw" + i].value;
                                        this.scores[this.currentTurn][this.roundString]["throw" + i].locked = true;
                                    }
                                    
                                }
                            }
                            if(unlockSpot){
                                for(let i = unlockSpot; i <= 3; i++){
                                    if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                        this.scores[this.currentTurn].totalScore -= this.scores[this.currentTurn][this.roundString]["throw" + i].value;
                                        this.scores[this.currentTurn][this.roundString]["throw" + i].locked = false;
                                    }
                                }
                            }
                        } else {
                            if(!oldThrow.locked){
                                this.scores[this.currentTurn].totalScore += oldThrow.value;
                                this.scores[this.currentTurn].totalScore -= currentThrow.value;
                            }
                        }
                    }
                }

            }
        } else {
            if(this.type == "xThrows"){
                this.scores[this.currentTurn].totalScore += currentThrow.value;
                currentThrow.locked = false;
            } else if(this.type == "firstToX"){

                //doubleIn
                if(this.specifications.doubleIn && this.scores.doubleInLocked){
                    if(currentThrow.field.startsWith("2x")){
                        this.scores.doubleInLocked = false;
                        currentThrow.locked = false;
                        this.scores[this.currentTurn].totalScore -= currentThrow.value;
                        this.scores.doubleInUnlockRound = this.currentRound;
                        this.scores.doubleInUnlockThrow = scoreToSet;
                    } else {
                        currentThrow.locked = true;
                    }
                } else if(this.specifications.doubleOut){
                    if((this.scores[this.currentTurn].totalScore - currentThrow.value <= 1 && !currentThrow.field.startsWith("2x")) || (this.scores[this.currentTurn].totalScore - currentThrow.value == 1)){
                        this.scores[this.currentTurn].totalScore -= currentThrow.value;
                        for(let i = 1; i <= 3; i++){
                            if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                                this.scores[this.currentTurn][this.roundString]["throw" + i].locked = true;
                                this.scores[this.currentTurn].totalScore += this.scores[this.currentTurn][this.roundString]["throw" + i].value
                            }
                        }
                    } else {
                        currentThrow.locked = false;
                        this.scores[this.currentTurn].totalScore -= currentThrow.value;
                    }
                } else if(this.scores[this.currentTurn].totalScore - currentThrow.value < 0){
                    this.scores[this.currentTurn].totalScore -= currentThrow.value;
                    for(let i = 1; i <= 3; i++){
                        if(this.scores[this.currentTurn][this.roundString]["throw" + i]){
                            this.scores[this.currentTurn][this.roundString]["throw" + i].locked = true;
                            this.scores[this.currentTurn].totalScore += this.scores[this.currentTurn][this.roundString]["throw" + i].value
                        }
                    }
                } else {
                    currentThrow.locked = false;
                    this.scores[this.currentTurn].totalScore -= currentThrow.value;
                }
            }
        }

        console.log(this.scores[this.currentTurn].totalScore);
    }


    nextTurn(){
        let turnIndex = this.playerList.findIndex((thisPlayer)=>{return thisPlayer == this.currentTurn});
        if(turnIndex == this.playerCount-1){
            return this.nextRound();
        } else {
            this.currentTurn = this.playerList[turnIndex + 1];
            return "nextTurn";
        }
    }


    nextRound(){
        if(this.type == "xThrows" && this.subtype == this.currentRound){
            return "endGame";
        } else {
            this.currentRound += 1;
            this.roundString = "round" + this.currentRound;
            this.currentTurn = this.playerList[0];
            for(let i = 0; i < this.playerCount; i++){
                this.scores[this.playerList[i]][this.roundString] = {}
            }
            return "nextRound";
        }
    }

    endGame(fs, currentAccount, currentGames){
        let newData = this;
        delete newData.currentTurn;
        delete newData.currentRound;
        delete newData.roundString;
        delete newData.active;

        fs.readFile("./data.json", "utf8", (error,data)=>{
            if(error){console.log(error);}
            else {
                let completeData = JSON.parse(data);
                let accountIndex = completeData.findIndex((thisAccount)=>{return thisAccount.username == currentAccount.username});
                completeData[accountIndex].data.games.push(newData);

                fs.writeFile("./data.json", JSON.stringify(completeData), (error)=>{
                    if(error){
                        console.log(error)
                    } else {
                        console.log("file saved succesfully");
                        delete currentGames[currentAccount.username];
                        console.log("endGame");
                    }
                });
            }
        })
    }
}
