const express = require("express");
const fs = require("fs");

const ServerSideGame = require("./game.js");
const ServerSidePerson = require("./person.js");

const app = express();
const port = process.env.PORT || 8080;

const server = app.listen(port,(req,res)=>{
    console.log("server on port " + port);
});

app.use(express.static("./public"));
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

fs.readFile("./data.json", "utf8", (error,data)=>{
    if(error){console.log(error);}
    else {
        return completeData = JSON.parse(data);
    }
});
fs.readFile("./id_value.json", "utf8", (error,data)=>{
    if(error){console.log(error);}
    else {
        return idValuePairs = JSON.parse(data);
    }
});

let currentAccount;
let currentAccountData;
let clientIDs = [];

app.post("/login", (req, res)=>{
    let account = completeData.find((thisAccount)=>{return thisAccount.username == req.body.username});
    if(!account){
        res.status(401).json({"success": false, "error":"username", "reason": "account doesn't exist"});
    } else if(account.password == req.body.password){
        let newClientID = clientIDs.length + 1;
        clientIDs.push(newClientID);
        res.status(200).json({"success": true, "data": account.data, "clientID": newClientID});
        currentAccount = account;
        currentAccountData = account.data;
    } else {
        res.status(401).send({"success": false, "error":"password", "reason": "wrong password"});
    }
});


let currentGames = {};

function gameInfo(){
    return {
        "playerList": currentGames[currentAccount.username].playerList,
        "playerCount": currentGames[currentAccount.username].playerCount,
        "type": currentGames[currentAccount.username].type,
        "subtype": currentGames[currentAccount.username].subtype,
        "currentRound": currentGames[currentAccount.username].currentRound,
        "roundString": currentGames[currentAccount.username].roundString,
        "currentTurn": currentGames[currentAccount.username].currentTurn,
        "scores": currentGames[currentAccount.username].scores
    };
}

app.get("/clientUpdate", (req, res)=>{
    console.log("updateRequest");
    if(currentGames[currentAccount.username]){
        res.status(200).send({"activeGame": true, "game": gameInfo()});
    } else {
        res.status(200).send({"activeGame": false});
    }
    
});

app.post("/createGame", (req, res)=>{
    if(!currentGames[currentAccount.username]){
        currentGames[currentAccount.username] = new ServerSideGame(currentAccount, req.body.type, req.body.subtype, req.body.players, req.body.specifications, req.body.clientID);
        res.status(200).send(gameInfo());
    } else {
        console.log("already in game");
        res.status(409).send({"error": "already in game"});
    }
});


app.post("/setScore", (req, res)=>{
    let turnState = currentGames[currentAccount.username].setScore(req.body.scoreToSet, req.body.field);
    res.status(200).send(turnState);
});

app.get("/confirmScore", (req,res)=>{
    console.log("confirmScore");
    nextTurnEvent = currentGames[currentAccount.username].nextTurn(currentAccount);

    if(nextTurnEvent == "endGame"){
        currentGames[currentAccount.username].finish(fs, currentAccount, currentGames);
        res.status(200).send({"gameFinished": true});
    } else {
        res.status(200).send({"currentTurn": currentGames[currentAccount.username].currentTurn});
    }
});

app.post("/newPerson", (req, res)=>{
  console.log(req.body);
  if(currentAccountData.people.find((thisPerson)=>{return thisPerson.name == req.body.name})){
    //name already taken
    res.status(400).send({"error": "name taken"});
  } else {
    let newPlayer = new person.ServerSidePerson(req.body.name, fs, currentAccount);
    res.status(200).send({"name": newPlayer.name});
  }
  
});


app.post("/currentlyEditing", (req,res)=>{
    let currentEditor = currentGames[currentAccount.username].getEditor(req.body.clientID);
    res.status(200).send({"currentEditor": currentEditor});
})

