function newPerson(name){
    transferData("/newPerson", "post", { "name": name }).catch(error=>{console.log(error);});
}