const playerCreationForm = document.getElementById("createPlayerForm");


function resetPlayerCreationForm(){
    playerCreationForm.reset();
    document.getElementById("showImageDiv").innerHTML = "";
}
resetPlayerCreationForm();


playerCreationForm.addEventListener("input", (change)=>{
    if(change.target.name == "name"){
        document.getElementById("createPlayerName").style.backgroundColor = "";
    } else if(change.target.name == "image"){
        if(change.target.value.toLowerCase().endsWith(".jpg") || 
        change.target.value.endsWith(".jpeg") || 
        change.target.value.endsWith(".jpe") || 
        change.target.value.endsWith(".png") ||
        change.target.value.endsWith(".gif")){
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


function newPerson(event){
    event.preventDefault();
    const formData = new FormData(playerCreationForm);
    console.log(formData);
    if(accountData.people.find(thisPlayer=>{return thisPlayer.name == document.getElementById("createPlayerName").value}) || document.getElementById("createPlayerName").value.length < 3){
        document.getElementById("createPlayerName").focus();
        document.getElementById("createPlayerName").style.backgroundColor = "var(--color_error)";
    } else {
        fetch("/newPerson", {
            method: "post",
            body: formData
        })
        .then((data)=>{
            resetPlayerCreationForm();
            getAccountData();
            clientUpdate();
    
        })
        .catch(error=>{console.log(error);});
        resetPlayerCreationForm();
    }
}