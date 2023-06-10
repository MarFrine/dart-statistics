const express = require("express");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 8080;

const server = app.listen(port,(req,res)=>{
    console.log("server on port " + port);
});

app.use(express.static("./public"));
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

fs.readFile("./data.json", "utf8", (error,data)=>{
    if(error){console.log(error);}
    else {
        return completeData = JSON.parse(data);
    }
})

app.post("/login", (req, res)=>{
    console.log(req.body);
    let account = completeData.find((thisAccount)=>{return thisAccount.username == req.body.username});
    if(!account){
        res.status(401).json({"success": false, "error":"username", "reason": "account doesn't exist"});
    } else if(account.password == req.body.password){
        res.status(200).json({"success": true, "data": account.data});
    } else {
        res.status(401).send({"success": false, "error":"password", "reason": "wrong password"});
    }
})
