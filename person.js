module.exports = {
  "person": class ServerSidePerson {
    constructor(name, fs, currentAccount) {
      this.name = name;
      this.games = [];
      this.gamesPlayed = 0;

      this.saveInFile(fs, currentAccount);
    }

    saveInFile(fs, currentAccount) {

      fs.readFile("./data.json", "utf8", (error, data) => {
        if (error) { console.log(error); }
        else {
          let completeData = JSON.parse(data);
          let accountIndex = completeData.findIndex((thisAccount) => { return thisAccount.username == currentAccount.username });
          completeData[accountIndex].people.push(this);

          fs.writeFile("./data.json", JSON.stringify(completeData), (error) => {
            if (error) {
              console.log(error);
            } else {
              console.log("file saved succesfully");
            }
          });
        }
      });
    }
  }
}

