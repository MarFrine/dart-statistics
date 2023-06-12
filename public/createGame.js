const creationForm = document.getElementById("createGameForm");
creationForm.reset();

let newGameRules = {
    type: "xThrows",
    specifications: [],
    players: []
}

creationForm.onchange = (change)=>{

    console.log(change);
    if(change.target.name == "gameType"){
        newGameRules.type = change.target.value;
    } else if(change.target.name == "gameRules"){
        if(change.target.checked){
            newGameRules.specifications.push(change.target.value);
        } else {
            const index = newGameRules.specifications.indexOf(change.target.value)
            if(index > -1){
                newGameRules.specifications.splice(index, 1);
            }
        }
    }
    console.log(newGameRules);

}

function openPlayerList(){

}

function addPlayer(){

}

function createNewGame(event, formElement){
    event.preventDefault();

    newGame = new Game(newGameRules.type, newGameRules.players, newGameRules.specifications);
}