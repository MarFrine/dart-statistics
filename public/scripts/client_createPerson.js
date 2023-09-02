const playerCreationForm = document.getElementById("createPlayerForm");


function resetPlayerCreationForm() {
    playerCreationForm.reset();
    document.getElementById("showImageDiv").innerHTML = "";
    document.getElementById("createPlayerButton").style.backgroundColor = "var(--color_interface_dark)";
    document.getElementById("createPlayerButton").innerHTML = "<b>Spieler erstellen</b>";
}
resetPlayerCreationForm();


playerCreationForm.addEventListener("input", (change) => {
    document.getElementById("createPlayerButton").style.backgroundColor = "var(--color_interface_dark)";
    document.getElementById("createPlayerButton").innerHTML = "<b>Spieler erstellen</b>";
    if (change.target.name == "name") {
        document.getElementById("createPlayerName").style.backgroundColor = "";
    } else if (change.target.name == "image") {
        if (change.target.value.toLowerCase().endsWith(".jpg") ||
            change.target.value.endsWith(".jpeg") ||
            change.target.value.endsWith(".jpe") ||
            change.target.value.endsWith(".png") ||
            change.target.value.endsWith(".gif")) {
            document.getElementById("createPlayerImageErrorLabel").style.display = "none";
            let file = document.getElementById("createPlayerImage").files[0];
            console.log(file)
            document.getElementById("showImageDiv").innerHTML = "<img height='100%' style='position:absolute; top:0px; left: 50%; transform: translateX(-50%)' src='" + URL.createObjectURL(file) + "'></img>";
        } else {
            change.target.value = "";
            document.getElementById("createPlayerImageErrorLabel").style.display = "block";
            document.getElementById("showImageDiv").innerHTML = "";
        }
    }
})


function newPerson(event) {
    event.preventDefault();
    const formData = new FormData(playerCreationForm);
    if (accountData.people.find(thisPlayer => { return thisPlayer.name == document.getElementById("createPlayerName").value }) || document.getElementById("createPlayerName").value.length < 3) {
        document.getElementById("createPlayerName").focus();
        document.getElementById("createPlayerName").style.backgroundColor = "var(--color_error)";
    } else {
        console.log(formData)
        if (document.getElementById("createPlayerImage").value) {
            fetch("/newPersonWithImage", {
                method: "post",
                body: formData
            })
                .then(async (data) => {
                    resetPlayerCreationForm();
                    await getAccountData();
                    await clientUpdate();
                    document.getElementById("createPlayerButton").style.backgroundColor = "darkgreen";
                    document.getElementById("createPlayerButton").innerHTML = "<b>Spieler erstellt!</b>";
                })
                .catch(error => { console.log(error); });
            resetPlayerCreationForm();
        } else {
            transferData("/newPersonWithoutImage", "post", { "name": document.getElementById("createPlayerName").value, "nickname": document.getElementById("createPlayerNickname").value, "birthday": document.getElementById("createPlayerBirthday").value })
                .then(async (data) => {
                    resetPlayerCreationForm();
                    await getAccountData();
                    await clientUpdate();
                    document.getElementById("createPlayerButton").style.backgroundColor = "darkgreen";
                    document.getElementById("createPlayerButton").innerHTML = "<b>Spieler erstellt!</b>";
                })
                .catch(error => { console.log(error); });
            resetPlayerCreationForm();
        }
    }
}



//-----------------------------------------------------------------------------------------------------------------------------------



const playerEditForm = document.getElementById("editPlayerForm");

let playerToChange = undefined
function resetPlayerEditForm(player) {
    playerToChange = player;
    playerEditForm.reset();
    document.getElementById("editShowImageDiv").innerHTML = "";
    document.getElementById("editPlayerButton").style.backgroundColor = "var(--color_interface_dark)";
    document.getElementById("editPlayerButton").innerHTML = "<b>Spieler ändern</b>";
    if (player) {
        let playerData = accountData.people.find((thisPlayer) => { return thisPlayer.name == player });
        console.log(playerData)
        document.getElementById("editPlayerTitle").innerHTML = playerData.name + " bearbeiten";
        document.getElementById("editPlayerNameLabel").innerHTML = playerData.name + " ersetzen durch:";
        if (playerData.nickname) {
            document.getElementById("editPlayerNicknameLabel").innerHTML = playerData.nickname + " ersetzen durch:";
        }
        if (playerData.birth) {
            document.getElementById("editPlayerBirthdayLabel").innerHTML = playerData.birth.day + "." + playerData.birth.month + "." + playerData.birth.year + " ersetzen durch:";
        }
        document.getElementById("profilPictureButtonInnerDiv").innerHTML = "Profilbild ändern zu:";
        if (playerData.image) {
            document.getElementById("editShowImageDiv").innerHTML = "<img height='100%' style='position:absolute; top:0px; left: 50%; transform: translateX(-50%)' src='playerPictures/" + playerData.imageFilename + "'></img>";
        }
    }
}
resetPlayerEditForm();


playerEditForm.addEventListener("input", (change) => {
    document.getElementById("editPlayerButton").style.backgroundColor = "var(--color_interface_dark)";
    document.getElementById("editPlayerButton").innerHTML = "<b>Spieler ändern</b>";
    if (change.target.name == "name") {
        document.getElementById("editPlayerName").style.backgroundColor = "";
    } else if (change.target.name == "image") {
        if (change.target.value.toLowerCase().endsWith(".jpg") ||
            change.target.value.endsWith(".jpeg") ||
            change.target.value.endsWith(".jpe") ||
            change.target.value.endsWith(".png") ||
            change.target.value.endsWith(".gif")) {
            document.getElementById("editPlayerImageErrorLabel").style.display = "none";
            let file = document.getElementById("editPlayerImage").files[0];
            console.log(file)
            document.getElementById("editShowImageDiv").innerHTML = "<img height='100%' style='position:absolute; top:0px; left: 50%; transform: translateX(-50%)' src='" + URL.createObjectURL(file) + "'></img>";
        } else {
            change.target.value = "";
            document.getElementById("editPlayerImageErrorLabel").style.display = "block";
            document.getElementById("editShowImageDiv").innerHTML = "";
        }
    }
})


function editPerson(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", playerToChange);
    formData.append("nickname", document.getElementById("editPlayerNickname").value);
    formData.append("birthday", document.getElementById("editPlayerBirthday").value);
    formData.append("newName", document.getElementById("editPlayerName").value);
    let file = document.getElementById("editPlayerImage").files[0];
    formData.append("image", file);
    
    if (accountData.people.find(thisPlayer => { return thisPlayer.name == document.getElementById("editPlayerName").value })) {
        document.getElementById("editPlayerName").focus();
        document.getElementById("editPlayerName").style.backgroundColor = "var(--color_error)";
    } else {
        if (document.getElementById("editPlayerImage").value) {
            console.log(formData)
            fetch("/editPersonWithImage", {
                method: "post",
                body: formData
            })
                .then(async (data) => {
                    resetPlayerEditForm();
                    await getAccountData();
                    await clientUpdate();
                    document.getElementById("editPlayerButton").style.backgroundColor = "darkgreen";
                    document.getElementById("editPlayerButton").innerHTML = "<b>Spieler geändert!</b>";
                    changeMenuPoint("mainMenu")
                })
                .catch(error => { console.log(error); });
            resetPlayerEditForm();
        } else {
            transferData("/editPersonWithoutImage", "post", { "name": playerToChange, "newName": document.getElementById("editPlayerName").value, "nickname": document.getElementById("editPlayerNickname").value, "birthday": document.getElementById("editPlayerBirthday").value })
                .then(async (data) => {
                    resetPlayerEditForm();
                    await getAccountData();
                    await clientUpdate();
                    document.getElementById("editPlayerButton").style.backgroundColor = "darkgreen";
                    document.getElementById("editPlayerButton").innerHTML = "<b>Spieler geändert!</b>";
                    changeMenuPoint("mainMenu")
                })
                .catch(error => { console.log(error); });
            resetPlayerEditForm();
        }

    }
}