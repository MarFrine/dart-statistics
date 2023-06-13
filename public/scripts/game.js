class Game{
    constructor(type, subtype, playerList, specifications){
        this.id = accountData.totalGames + 1;
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

        this.createEmptyScores();
        
        this.active = true;
        this.currentRound = 1;
        this.currentTurn = playerList[0];

        this.displayTurnOrder();
    }

    createEmptyScores(){
        this.scores = {};
        for(let i = 0; i < this.playerCount; i++){
            this.scores[this.playerList[i]] = {};
        }
        console.log(this.scores);
    }

    displayTurnOrder(){
        let turnOrderString = "";
        for(let i = 0; i < this.playerCount; i++){
            if(this.currentTurn != this.playerList[i]){
                console.log()
                turnOrderString = turnOrderString + this.playerList[i] + "<br>";
            } else {
                turnOrderString = turnOrderString + "<font size='+3' color='gold'>" + this.playerList[i] + "</font><br>";
            }
            
        }
        document.getElementById("inputTurnOrder").innerHTML = turnOrderString;
    }

}