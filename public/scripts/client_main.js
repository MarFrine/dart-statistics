let currentTheme = "dark";
function switchTheme() {
    if (currentTheme == "dark") {
        document.documentElement.style.setProperty("--color_main", "white");
        document.documentElement.style.setProperty("--color_interface", "rgb(170, 170, 170)");
        document.documentElement.style.setProperty("--color_interface_dark", "rgb(100,100,100)");
        document.documentElement.style.setProperty("--color_interface_light", "rgb(180,180,180)");
        document.documentElement.style.setProperty("--color_highlights", "rgb(16, 120, 50)");
        document.documentElement.style.setProperty("--color_highlights_bright", "rgb(28, 180, 79)");
        document.documentElement.style.setProperty("--color_contrast", "black");

        document.getElementById("themeImage").src = "img/light.png";
        document.getElementById("syncServerImage").src = "img/syncServer_light.png";
        document.getElementById("missImage").src = "img/switchInputType_light.png";

        currentTheme = "light";
    } else {
        document.documentElement.style.setProperty("--color_main", "black");
        document.documentElement.style.setProperty("--color_interface", "rgb(49, 49, 49)");
        document.documentElement.style.setProperty("--color_interface_dark", "rgb(35,35,35)");
        document.documentElement.style.setProperty("--color_interface_light", "rgb(70,70,70)");
        document.documentElement.style.setProperty("--color_highlights", "rgb(120, 20, 120)");
        document.documentElement.style.setProperty("--color_highlights_bright", "rgb(197, 36, 197)");
        document.documentElement.style.setProperty("--color_contrast", "white");

        document.getElementById("themeImage").src = "img/dark.png";
        document.getElementById("syncServerImage").src = "img/syncServer_dark.png";
        document.getElementById("missImage").src = "img/switchInputType_dark.png";

        currentTheme = "dark"
    }

}

function switchInputType() {
    tableFieldType = undefined;
    tableFieldNumber = undefined;
    for (let i = 0; i < inputTableNumberButtons.length; i++) {
        inputTableNumberButtons[i].style.backgroundColor = "var(--color_interface_light)";
    }
    for (let i = 0; i < tableInputTypeButtons.length; i++) {
        document.getElementById(tableInputTypeButtons[i].id).locked = false;
        unhighlightDartField(tableInputTypeButtons[i].id);
    }
    if (document.getElementById("tableInput").style.display != "block") {
        document.getElementById("inputBoard").style.display = "none";
        document.getElementById("inputBoardNumbers").style.display = "none";
        document.getElementById("tableInput").style.display = "block";
    } else {
        document.getElementById("tableInput").style.display = "none";
        document.getElementById("inputBoard").style.display = "block";
        document.getElementById("inputBoardNumbers").style.display = "block";
    }

}

let playerListSearchString = "";
document.getElementById("allPlayersList").value = "";
function refreshMainMenuPlayerList() {
    let playerListString = "<br><br>";
    let playerListCopy = [...accountData.people];
    let filteredPlayerListCopy = playerListCopy.filter((thisPlayer)=>{return thisPlayer.name.includes(playerListSearchString)});
    filteredPlayerListCopy.sort((player1, player2)=>{return player2.gamesPlayed - player1.gamesPlayed});
    for(let i = 0; i < filteredPlayerListCopy.length; i++){
        playerListString = playerListString + "<font size='+3'><a onclick='showPlayerStatistics(";
        playerListString = playerListString + '"' + filteredPlayerListCopy[i].name + '"';
        playerListString = playerListString + ")' class='clickableText'>" + filteredPlayerListCopy[i].name + "</a></font><br><br>";
    }
    for (let i = 0; i < accountData.people.length; i++) {
        
    }
    document.getElementById("allPlayersList").innerHTML = playerListString;
}

document.getElementById("allPlayersListSearch").addEventListener("input", (change)=>{
    playerListSearchString = change.target.value;
    refreshMainMenuPlayerList();
})