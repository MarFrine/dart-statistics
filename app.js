const express = require("express");
const fs = require("fs");

const ServerSideGame = require("./game.js");

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

app.post("/login", (req, res)=>{
    let account = completeData.find((thisAccount)=>{return thisAccount.username == req.body.username});
    if(!account){
        res.status(401).json({"success": false, "error":"username", "reason": "account doesn't exist"});
    } else if(account.password == req.body.password){
        res.status(200).json({"success": true, "data": account.data, "idValuePairs": idValuePairs});
        currentAccount = account;
        currentAccountData = account.data;
    } else {
        res.status(401).send({"success": false, "error":"password", "reason": "wrong password"});
    }
});


let currentGames = {};



app.get("/clientUpdate", (req, res)=>{
    console.log("updateRequest");
    if(currentGames[currentAccount.username]){
        res.status(200).send({"activeGame": true, "game": currentGames[currentAccount.username]});
    } else {
        res.status(200).send({"activeGame": false});
    }
    
});

app.post("/createGame", (req, res)=>{
    currentGames[currentAccount.username] = new ServerSideGame(currentAccount, req.body.type, req.body.subtype, req.body.players, req.body.specifications);
    res.status(200).send(JSON.stringify(currentGames[currentAccount.username]));
    //setTimeout(()=>{currentGames[currentAccount.username].endGame(completeData);}, 1000);
});


app.post("/setScore", (req, res)=>{
    console.log(req.body);
    currentGames[currentAccount.username].setScore(req.body.scoreToSet, req.body.field, req.body.score);
    res.status(200).send({"ok": true});
    console.log("test");
});

app.get("/confirmScore", (req,res)=>{
    console.log("confirmScore");
    nextTurnEvent = currentGames[currentAccount.username].nextTurn(currentAccount);

    if(nextTurnEvent == "endGame"){
        currentGames[currentAccount.username].endGame(fs, currentAccount, currentGames);
        res.status(200).send({"gameFinished": true});
    } else {
        res.status(200).send({"currentTurn": currentGames[currentAccount.username].currentTurn});
    }
});


