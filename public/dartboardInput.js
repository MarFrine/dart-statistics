// Dartboard

let dartboardButtons = document.getElementsByClassName("dartboardButton")
for(let i = 0; i < dartboardButtons.length; i++){
    dartboardButtons[i].addEventListener("click", ()=>{
        clickField(dartboardButtons[i].id);
    })

    dartboardButtons[i].addEventListener("mousemove", ()=>{
        highlightDartField(dartboardButtons[i].id);
    })
    dartboardButtons[i].addEventListener("mouseleave", ()=>{
        unhighlightDartField(dartboardButtons[i].id);
    })
}

let dartColors = [
    "#9E170D",
    "#000000",
    "#1D7502",
    "#f5deb3"
]

let highlightedDartColors = [
    "#E82113",
    "#424242",
    "#1DA81D",
    "#fff0d5"
]

function highlightDartField(fieldID){
    let currentColor
    if(fieldID != "field_25" && fieldID != "field_50"){
        currentColor = document.getElementById(fieldID).innerHTML.toString().slice(-17,-10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().slice(-19,-12);
    }
    let colorIndex = dartColors.findIndex((thisColor)=>{return thisColor == currentColor});
    if(colorIndex >= 0){
        document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + highlightedDartColors[colorIndex]);
    }
}

function unhighlightDartField(fieldID){
    let currentColor
    if(fieldID != "field_25" && fieldID != "field_50"){
        currentColor = document.getElementById(fieldID).innerHTML.toString().slice(-17,-10);
    } else {
        currentColor = document.getElementById(fieldID).innerHTML.toString().slice(-19,-12);
    }
    
    let colorIndex = highlightedDartColors.findIndex((thisColor)=>{return thisColor == currentColor});
    if(colorIndex >= 0){
        document.getElementById(fieldID).innerHTML = document.getElementById(fieldID).innerHTML.replace("fill: " + currentColor, "fill: " + dartColors[colorIndex]);
    }
}

function clickField(fieldID){
    console.log("geklickt!");
    switchTheme();
}




// Table


