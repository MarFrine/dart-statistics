let accountData;
let loggedIn = false;
async function sendLoginData(event, formElement){
    event.preventDefault();
    transferData("/login", "post", {"username": formElement[0].value, "password": formElement[1].value})
    .then(async (data)=>{
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
            loggedIn = true;
            await getAccountData();
            await clientUpdate();
            document.getElementById("loginError").style.display = "none";
            document.getElementById("loginContentBlock").style.display = "none";
            return clientID = data.clientID;
        }
    });
}


function skipLogin(){
    console.log("test");
    document.getElementById("loginError").style.display = "none";
    document.getElementById("loginContentBlock").style.display = "none";
    clientUpdate();
    document.getElementById("inputGameNavButton").disabled = true;
    document.getElementById("createGameNavButton").disabled = true;

}