module.exports = {
  "person": class ServerSidePerson {
    constructor(name, fs, currentAccount, completeData) {
      this.name = name;
      this.games = [];
      this.gamesPlayed = 0;

      return this.saveInFile(fs, currentAccount, completeData);
    }

    saveInFile(fs, currentAccount, completeData) {

      let accountIndex = completeData.findIndex((thisAccount) => { return thisAccount.username == currentAccount.username });
      completeData[accountIndex].data.people.push({"name": this.name, "games": this.games, "gamesPlayed": this.gamesPlayed})

      fs.writeFile("./data.json", JSON.stringify(completeData), (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("file saved succesfully");
        }
      });

      return completeData;
    }
  }
}

