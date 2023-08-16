const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path")

const ServerSideGame = require("./game.js");
const ServerSidePerson = require("./person.js");

const app = express();
const port = process.env.PORT || 8080;

const server = app.listen(port, (req, res) => {
    console.log("server on port " + port);
});

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

fs.readFile("./id_value.json", "utf8", (error, data) => {
    if (error) { console.log(error); }
    else {
        return idValuePairs = JSON.parse(data);
    }
});

const accountUsername = "test";

let completeData;
let currentAccount;
let currentAccountData;

function getCompleteData() {
    fs.readFile("./data.json", "utf8", (error, data) => {
        if (error) { console.log(error); }
        else {
            completeData = JSON.parse(data);
            currentAccount = JSON.parse(data).find((thisAccount) => { return thisAccount.username == accountUsername });
            currentAccountData = currentAccount.data
        }
    });
}
getCompleteData();


let clientIDs = [];

app.post("/login", (req, res) => {
    console.log(req.rawHeaders[req.rawHeaders.findIndex((thisElement) => { return thisElement == "User-Agent" }) + 1])
    if (!req.body.username == accountUsername) {
        res.status(401).json({ "success": false, "error": "username", "reason": "account doesn't exist" });
    } else if (req.body.password == currentAccount.password) {
        let newClientID = clientIDs.length + 1;
        clientIDs.push(newClientID);
        res.status(200).json({ "success": true, "clientID": newClientID });
    } else {
        res.status(401).send({ "success": false, "error": "password", "reason": "wrong password" });
    }
});


let currentGames = {};
let lastGameState = undefined;

function gameInfo(currentGame, gameID) {
    if (currentGame) {
        return {
            "id": currentGames[currentAccount.username].id,
            "playerList": currentGames[currentAccount.username].playerList,
            "playerCount": currentGames[currentAccount.username].playerCount,
            "type": currentGames[currentAccount.username].type,
            "subtype": currentGames[currentAccount.username].subtype,
            "specifications": currentGames[currentAccount.username].specifications,
            "currentRound": currentGames[currentAccount.username].currentRound,
            "roundString": currentGames[currentAccount.username].roundString,
            "currentTurn": currentGames[currentAccount.username].currentTurn,
            "scores": currentGames[currentAccount.username].scores,
            "throws": currentGames[currentAccount.username].throws,
            "maxThrows": currentGames[currentAccount.username].maxThrows
        };
    } else {
        return {
            "id": currentAccountData.games[gameID].id,
            "playerList": currentAccountData.games[gameID].playerList,
            "playerCount": currentAccountData.games[gameID].playerCount,
            "type": currentAccountData.games[gameID].type,
            "subtype": currentAccountData.games[gameID].subtype,
            "specifications": currentAccountData.games[gameID].specifications,
            "currentRound": currentAccountData.games[gameID].currentRound,
            "roundString": currentAccountData.games[gameID].roundString,
            "currentTurn": currentAccountData.games[gameID].currentTurn,
            "scores": currentAccountData.games[gameID].scores,
            "throws": currentAccountData.games[gameID].throws,
            "maxThrows": currentAccountData.games[gameID].maxThrows
        };
    }

}

app.get("/clientUpdate", (req, res) => {
    console.log("updateRequest");
    if (currentGames[currentAccount.username]) {
        res.status(200).send({ "activeGame": true, "game": gameInfo(true) });
    } else {
        if (lastGameState == "finished") {
            res.status(200).send({ "activeGame": false, "lastGame": gameInfo(false, currentAccountData.games.length - 1) });
        } else {
            res.status(200).send({ "activeGame": false, "lastGame": false });
        }

    }
});

app.get("/getAccountData", (req, res) => {
    res.status(200).send({ "account": currentAccountData });
})

app.post("/createGame", (req, res) => {
    if (!currentGames[currentAccount.username]) {
        currentGames[currentAccount.username] = new ServerSideGame(currentAccount, req.body.type, req.body.subtype, req.body.players, req.body.specifications, req.body.clientID);
        res.status(200).send(gameInfo(true));
    } else {
        console.log("already in game");
        res.status(409).send({ "error": "already in game" });
    }
});


app.post("/setScore", (req, res) => {
    let turnState = currentGames[currentAccount.username].setScore(req.body.scoreToSet, req.body.field);
    res.status(200).send(turnState);
});

app.get("/confirmScore", (req, res) => {
    console.log("confirmScore");
    nextTurnEvent = currentGames[currentAccount.username].nextTurn(currentAccount);

    if (nextTurnEvent == "endGame") {
        res.status(200).send({ "gameFinished": true, "completeGame": gameInfo(true) });
        completeData = currentGames[currentAccount.username].finish(fs, currentAccount, currentGames, completeData);
        currentAccount = completeData.find((thisAccount) => { return thisAccount.username == accountUsername });
        currentAccountData = currentAccount.data
        lastGameState = "finished"
    } else {
        res.status(200).send({ "currentTurn": currentGames[currentAccount.username].currentTurn });
    }
});

app.get("/stopGame", (req, res) => {
    delete currentGames[currentAccount.username];
    lastGameState = "stopped";
    console.log("game stopped")
    res.sendStatus(200);
});



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/playerPictures'));
    },
    filename: function (req, file, cb) {
        console.log(file, req.body.name);
        req.body.filename = req.body.name + path.extname(file.originalname);
        cb(null, req.body.name + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post("/newPerson", upload.single("image"), (req, res) => {
    console.log("new Person", req.body);
    if (currentAccountData.people.find((thisPerson) => { return thisPerson.name == req.body.name })) {
        res.status(400).send({ "error": "name taken" });
    } else {
        completeData = new ServerSidePerson.person(req.body, fs, currentAccount, completeData);
        currentAccount = completeData.find((thisAccount) => { return thisAccount.username == accountUsername });
        currentAccountData = currentAccount.data;
        //console.log(currentAccountData.people);
        res.status(200).send({ "name": req.body.name, "accountData": currentAccountData });
    }
});





app.post("/currentlyEditing", (req, res) => {
    if (!currentGames[currentAccount.username]) {
        res.status(400).send({ "error": "no current Game" });
    } else {
        let currentEditor = currentGames[currentAccount.username].getEditor(req.body.clientID);
        res.status(200).send({ "currentEditor": currentEditor });
    }

})

