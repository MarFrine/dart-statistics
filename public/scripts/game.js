class Game{
    constructor(type, playerList, specifications){
        this.id = 1;
        this.playerList = playerList;
        this.playerCount = this.playerList.length;
        this.date = Date();
        console.log(this.playerCount, this.playerList)

        this.type = type || "test";
        console.log(this.type);

        this.specifications = {
            doubleIn: false,
            doubleOut: false,
            teams: 1
        }
        for(let i = 0; i < specifications.length; i++){
            if(specifications[i] != "teams"){
                this.specifications[specifications[i]] = true
            }
        }
        console.log(this.specifications);

        this.active = true;
    }

}