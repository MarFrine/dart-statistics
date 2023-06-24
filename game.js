module.exports = class ServerSideGame{
    constructor(currentAccount, type, subtype, playerList, specifications){
        this.id = currentAccount.data.totalGames + 1;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        this.date = Date();
        console.log(this.playerCount, this.playerList)

        this.type = type;
        this.subtype = subtype;
        console.log(this.type, subtype);

        this.specifications = {
            doubleIn: false,
            doubleOut: false,
            double: false
        }
        for(let i = 0; i < specifications.length; i++){
            this.specifications[specifications[i]] = true
        }
        console.log(this.specifications);

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
        }
        //runde 1
        for(let i = 0; i < this.playerCount; i++){
            let round = "round" + this.currentRound;
            this.scores[this.playerList[i]][round] = {}
        }
        console.log(this.scores);
    }


    setScore(scoreToSet, field, value){
        this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet] = {}
        this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet].field = field;
        this.scores[this.currentTurn][this.roundString]["throw" + scoreToSet].value = value;

        console.log(this.scores);
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
