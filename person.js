module.exports = {
  "person": class ServerSidePerson {
    constructor(details, fs, currentAccount, completeData) {
      this.name = details.name;
      this.nickname = details.nickname;
      let birthday = details.birthday.split("-");
      this.birth = {
        "day": birthday[0],
        "month": birthday[1],
        "year": birthday[2],
      };
      this.games = [];
      this.gamesPlayed = 0;

      this.ImageFilename = details.filename;

      

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

    saveImage(fs){
      
    }

  }
}

