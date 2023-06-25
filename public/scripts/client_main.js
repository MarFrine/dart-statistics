async function transferData(url, type, bodyData){
    if (type == "get") {
        const response = await fetch(url, {method:type})
        const data = await response.json()
        return data
    } else if (type == "post" || type == "put") {
        const response = await fetch(url, {
            method: type,
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(bodyData)
        })
        const data = await response.json()
        return data
    }
}

let accountData;
let idValuePairs;
function sendLoginData(event, formElement){
    event.preventDefault();
    transferData("/login", "post", {"username": formElement[0].value, "password": formElement[1].value})
    .then((data)=>{
        if(!data.success){
            if(data.error == "username"){
                document.getElementById("loginError").innerHTML = "<h2>" + data.reason + "</h2>";
                document.getElementById("loginError").style.display = "block";
                document.getElementById("loginUsername").focus();
                document.getElementById("loginUsername").select();
            } else if(data.error == "password"){
                document.getElementById("loginError").innerHTML = "<h2>" + data.reason + "</h2>";
                document.getElementById("loginError").style.display = "block";
                document.getElementById("loginPassword").focus();
                document.getElementById("loginPassword").select();
            }
        } else {
            idValuePairs = data.idValuePairs;
            accountData = data.data;
            console.log(accountData);
            document.getElementById("loginError").style.display = "none";
            document.getElementById("loginField").style.display = "none";
            document.getElementById("loginContentBlock").style.display = "none";
            clientUpdate();
        }
    });
}

let periodicClientUpdate
function clientUpdate(){
    transferData("/clientUpdate", "get")
    .then((data)=>{
        currentGame = data.game;
        if(currentMenuPoint == "inputGame"){
            displayTurnOrder();
            displayCurrentTurn();
        }
        console.log("update: ", data);
        //console.log(data);

    })
}


let currentTheme = "dark";
function switchTheme(){
    if(currentTheme == "dark"){
        document.documentElement.style.setProperty("--color_main", "white");
        document.documentElement.style.setProperty("--color_interface", "rgb(130, 130, 130)");
        document.documentElement.style.setProperty("--color_interface_dark", "rgb(100,100,100)");
        document.documentElement.style.setProperty("--color_interface_light", "rgb(180,180,180)");
        document.documentElement.style.setProperty("--color_highlights", "rgb(16, 120, 50)");

        document.getElementById("themeImage").src = "img/light.png"

        currentTheme = "light";
    } else {
        document.documentElement.style.setProperty("--color_main", "black");
        document.documentElement.style.setProperty("--color_interface", "rgb(49, 49, 49)");
        document.documentElement.style.setProperty("--color_interface_dark", "rgb(25,25,25)");
        document.documentElement.style.setProperty("--color_interface_light", "rgb(70,70,70)");
        document.documentElement.style.setProperty("--color_highlights", "rgb(120, 20, 120)");

        document.getElementById("themeImage").src = "img/dark.png"

        currentTheme = "dark"
    }

}

currentMenuPoint = "mainMenu";
function changeMenuPoint(menuPoint){
    currentMenuPoint = menuPoint;
    clearInterval(periodicClientUpdate);
    clientUpdate();
    let menuPointDivs = document.getElementsByClassName("mainMenuPoint")
    for(let i = 0; i < menuPointDivs.length; i++){
        menuPointDivs[i].style.display = "none";
    }
    document.getElementById(menuPoint).style.display = "block";
    if(document.getElementById(menuPoint).classList.contains("gameSubpoint")){
        document.getElementById("game").style.display = "block";
        if(menuPoint == "watchGame"){
            periodicClientUpdate = setInterval("clientUpdate()", 1000);
        } else if(menuPoint == "createGame"){
            if(currentGame){
                changeMenuPoint("watchGame");
            } else {
                updatePlayerList();
            }
        } else if(menuPoint == "inputGame"){
            if(!currentGame){
                changeMenuPoint("createGame");
            } else {
                displayTurnOrder();
            }
        }
    }
}


function switchInputType(){
    tableFieldType = undefined;
    tableFieldNumber = undefined;
    if(document.getElementById("tableInput").style.display != "block"){
        document.getElementById("dartboardInput").style.display = "none";
        document.getElementById("tableInput").style.display = "block";
    } else {
        document.getElementById("dartboardInput").style.display = "block";
        document.getElementById("tableInput").style.display = "none";
    }

}