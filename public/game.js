class Game{
    constructor(type, playerList){
        this.id = 1;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        this.date = Date();


        this.type = type;
        
        this.active = true;
    }

}