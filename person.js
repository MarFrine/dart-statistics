module.exports = {
  "person": class ServerSidePerson {
    constructor(details, image, fs, currentAccount, completeData) {
      this.name = details.name;
      this.nickname = details.nickname;
      let birthday = details.birthday.split("-");
      this.birth = {
        "day": birthday[2],
        "month": birthday[1],
        "year": birthday[0],
      };
      this.games = [];
      this.gamesPlayed = 0;

      this.image = image
      if (this.image) {
        this.imageFilename = details.filename;
      }

      let accountIndex = completeData.findIndex((thisAccount) => { return thisAccount.username == currentAccount.username });
      completeData[accountIndex].data.people.push(this)
      this.saveInFile(fs, completeData);
      return completeData;
    }

    saveInFile(fs, completeData) {



      fs.writeFile("./data.json", JSON.stringify(completeData), (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("file saved succesfully");
        }
      });

      return completeData;
    }
  },

  "editPerson": (fs, completeData, currentAccount, oldRecordList, changeDetails, image) => {
    let accountIndex = completeData.findIndex((thisAccount) => { return thisAccount.username == currentAccount.username });
    let playerCopy = { ...completeData[accountIndex].data.people.find((thisPerson) => { return thisPerson.name == changeDetails.name }) }
    let oldPlayerName = changeDetails.name;
    let newPlayerName = changeDetails.name;
    if (changeDetails.newName) {
      playerCopy.name = changeDetails.newName;
      newPlayerName = changeDetails.newName;
    }
    if (changeDetails.nickname) { playerCopy.nickname = changeDetails.nickname; }
    if (changeDetails.birthday) {
      let birthday = changeDetails.birthday.split("-");
      playerCopy.birth = {
        "day": birthday[2],
        "month": birthday[1],
        "year": birthday[0],
      };
    }

    if(playerCopy.image && image){
      let playerCopyImageExtension = playerCopy.imageFilename.split(".")[playerCopy.imageFilename.split(".").length-1];
      let newImageExtension = changeDetails.filename.split(".")[changeDetails.filename.split(".").length-1];

      if(playerCopyImageExtension != newImageExtension){
        fs.unlink("./public/playerPictures/" + playerCopy.imageFilename, (error)=>{
          if(!error){
            console.log("old Image deleted")
          } else {
            console.log(error)
          }
        })
      }
    }

    if (image) {
      playerCopy.image = true;
      playerCopy.imageFilename = changeDetails.filename;
    }

    let oldFileName = playerCopy.imageFilename;
    let filenameParts;
    let fileExtension;
    let newFileName = oldFileName;
    if(playerCopy.imageFilename && changeDetails.newName){
      filenameParts = playerCopy.imageFilename.split(".");
      fileExtension = filenameParts[filenameParts.length-1];
      newFileName = changeDetails.newName + "." + fileExtension;
    }
     

    playerCopy.imageFilename = newFileName;
    
    console.log("playerCopy", playerCopy)
    completeData[accountIndex].data.people[completeData[accountIndex].data.people.findIndex((thisPerson) => { return thisPerson.name == changeDetails.name })] = { ...playerCopy }


    if (changeDetails.newName) {

      for (let i = 0; i < playerCopy.games.length; i++) {
        let thisGameIndex = completeData[accountIndex].data.games.findIndex((thisGame) => { return thisGame.id == playerCopy.games[i] });
        let thisGame = { ...completeData[accountIndex].data.games[thisGameIndex] };

        thisGame.playerList[thisGame.playerList.indexOf(oldPlayerName)] = newPlayerName
        if(thisGame.winner == oldPlayerName){
          thisGame.winner = newPlayerName
        }

        let playerScoreCopy = {...thisGame.scores[oldPlayerName]};
        delete thisGame.scores[oldPlayerName];
        thisGame.scores[newPlayerName] = {...playerScoreCopy};

        completeData[accountIndex].data.games[thisGameIndex] = thisGame;
      }

      for(let i = 0; i < oldRecordList.single.length; i++){
        if(oldRecordList.single[i].player == oldPlayerName){
          oldRecordList.single[i].player = newPlayerName;
        }
      }
      for(let i = 0; i < oldRecordList.double.length; i++){
        if(oldRecordList.double[i].player1 == oldPlayerName){
          oldRecordList.double[i].player1 = newPlayerName;
        }
        if(oldRecordList.double[i].player2 == oldPlayerName){
          oldRecordList.double[i].player2 = newPlayerName;
        }
      }
    }

    if(playerCopy.image){
      if(changeDetails.newName){
        fs.rename("./public/playerPictures/" + oldFileName, "./public/playerPictures/" + newFileName, (error)=>{
          if(!error){
            console.log("file renamed");
          } else {console.log(error)};
        })
      }
    }

    fs.writeFile("./data.json", JSON.stringify(completeData), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("file saved succesfully");
      }
    });

    fs.writeFile("./oldRecords.json", JSON.stringify(oldRecordList), (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("file saved succesfully");
      }
    });

    return {"data": completeData, "records": oldRecordList};
  }
}

