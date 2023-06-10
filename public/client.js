


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

            document.getElementById("loginError").style.display = "none";

        }
    });
}