class Person{
    constructor(name){
        this.name = name;

        this.gamesPlayed = {
            totalCount: 0,
            totalAvgPlace: undefined,
            totalWins: 0,

            tenThrows: {
                count: 0,
                avgPlace: undefined,
                wins: 0,
                avgScore: undefined
            },
            FirstTo300: {
                count: 0,
                avgPlace: undefined,
                wins: 0,
                avgScore: undefined
            }
        };

    }
}

function newPlayer(){
    
}