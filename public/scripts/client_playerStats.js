

function showPlayerStatistics(playerName) {
    document.getElementById("allPlayersListSearch").value = "";
    playerListSearchString = "";
    changeMenuPoint("playerStats");
    console.log(playerName)

    drawHeatMap(createFieldCountArray(accountData.people.find((thisPerson) => { return thisPerson.name == playerName; })));
}












let currentFieldCounts = undefined;
function drawHeatMap(fieldCounts) {
    if (currentFieldCounts) {
        let minValue = 0;
        let maxValue = 0;
        currentFieldCounts.forEach(thisFielCountObject => {
            if (thisFielCountObject.count > maxValue) {
                maxValue = thisFielCountObject.count;
            }
        });
        const oldColorRange = d3.scaleSequential(d3.interpolatePlasma)
            .domain([Math.floor(minValue), Math.ceil(maxValue)])

        minValue = 0;
        maxValue = 0;
        fieldCounts.forEach(thisFielCountObject => {
            if (thisFielCountObject.count > maxValue) {
                maxValue = thisFielCountObject.count;
            }
        });
        const newColorRange = d3.scaleSequential(d3.interpolatePlasma)
            .domain([Math.floor(minValue), Math.ceil(maxValue)])

        fieldCounts.forEach((thisFielCountObject, index) => {
            if (thisFielCountObject.field != "miss") {
                document.getElementById("heatMapField_" + thisFielCountObject.field).innerHTML = document.getElementById("heatMapField_" + thisFielCountObject.field).innerHTML.replace("fill: " + oldColorRange(currentFieldCounts[index].count), "fill: " + newColorRange(thisFielCountObject.count));
            }
        })
    } else {
        let minValue = 0;
        let maxValue = 0;
        fieldCounts.forEach(thisFielCountObject => {
            if (thisFielCountObject.count > maxValue) {
                maxValue = thisFielCountObject.count;
            }
        });
        const colorRange = d3.scaleSequential(d3.interpolatePlasma)
            .domain([Math.floor(minValue), Math.ceil(maxValue)])

        fieldCounts.forEach((thisFielCountObject) => {
            if (thisFielCountObject.field != "miss") {
                document.getElementById("heatMapField_" + thisFielCountObject.field).innerHTML = document.getElementById("heatMapField_" + thisFielCountObject.field).innerHTML.replace("fill: #000000", "fill: " + colorRange(thisFielCountObject.count));
            }
        })
    }
    currentFieldCounts = fieldCounts;
}

function createFieldCountArray(player) {
    let fieldCountArray = createEmptyFieldCountArray();
    player.games.forEach((gameID) => {
        let game = accountData.games.find((thisGame) => { return thisGame.id == gameID })
        let rounds = 1;
        while (true) {
            rounds++;
            if (!game.scores[player.name]["round" + rounds]) {
                rounds -= 1;
                break;
            }
        }
        for (let i = 1; i <= rounds; i++) {
            let thisRound = game.scores[player.name]["round" + i];
            if (thisRound.throw1) {
                let fieldCountArrayIndex = fieldCountArray.findIndex((thisFielCountObject) => { return thisFielCountObject.field == thisRound.throw1.field });
                fieldCountArray[fieldCountArrayIndex].count += 1;
            }
            if (thisRound.throw2) {
                let fieldCountArrayIndex = fieldCountArray.findIndex((thisFielCountObject) => { return thisFielCountObject.field == thisRound.throw2.field });
                fieldCountArray[fieldCountArrayIndex].count += 1;
            }
            if (thisRound.throw3) {
                let fieldCountArrayIndex = fieldCountArray.findIndex((thisFielCountObject) => { return thisFielCountObject.field == thisRound.throw3.field });
                fieldCountArray[fieldCountArrayIndex].count += 1;
            }
        }

    })
    console.log(fieldCountArray);
    return fieldCountArray;
}



function createEmptyFieldCountArray() {
    return [{ "field": "2x1", "count": 0 },
    { "field": "1x1_outer", "count": 0 },
    { "field": "3x1", "count": 0 },
    { "field": "1x1_inner", "count": 0 },
    { "field": "2x2", "count": 0 },
    { "field": "1x2_outer", "count": 0 },
    { "field": "3x2", "count": 0 },
    { "field": "1x2_inner", "count": 0 },
    { "field": "2x3", "count": 0 },
    { "field": "1x3_outer", "count": 0 },
    { "field": "3x3", "count": 0 },
    { "field": "1x3_inner", "count": 0 },
    { "field": "2x4", "count": 0 },
    { "field": "1x4_outer", "count": 0 },
    { "field": "3x4", "count": 0 },
    { "field": "1x4_inner", "count": 0 },
    { "field": "2x5", "count": 0 },
    { "field": "1x5_outer", "count": 0 },
    { "field": "3x5", "count": 0 },
    { "field": "1x5_inner", "count": 0 },
    { "field": "2x6", "count": 0 },
    { "field": "1x6_outer", "count": 0 },
    { "field": "3x6", "count": 0 },
    { "field": "1x6_inner", "count": 0 },
    { "field": "2x7", "count": 0 },
    { "field": "1x7_outer", "count": 0 },
    { "field": "3x7", "count": 0 },
    { "field": "1x7_inner", "count": 0 },
    { "field": "2x8", "count": 0 },
    { "field": "1x8_outer", "count": 0 },
    { "field": "3x8", "count": 0 },
    { "field": "1x8_inner", "count": 0 },
    { "field": "2x9", "count": 0 },
    { "field": "1x9_outer", "count": 0 },
    { "field": "3x9", "count": 0 },
    { "field": "1x9_inner", "count": 0 },
    { "field": "2x10", "count": 0 },
    { "field": "1x10_outer", "count": 0 },
    { "field": "3x10", "count": 0 },
    { "field": "1x10_inner", "count": 0 },
    { "field": "2x11", "count": 0 },
    { "field": "1x11_outer", "count": 0 },
    { "field": "3x11", "count": 0 },
    { "field": "1x11_inner", "count": 0 },
    { "field": "2x12", "count": 0 },
    { "field": "1x12_outer", "count": 0 },
    { "field": "3x12", "count": 0 },
    { "field": "1x12_inner", "count": 0 },
    { "field": "2x13", "count": 0 },
    { "field": "1x13_outer", "count": 0 },
    { "field": "3x13", "count": 0 },
    { "field": "1x13_inner", "count": 0 },
    { "field": "2x14", "count": 0 },
    { "field": "1x14_outer", "count": 0 },
    { "field": "3x14", "count": 0 },
    { "field": "1x14_inner", "count": 0 },
    { "field": "2x15", "count": 0 },
    { "field": "1x15_outer", "count": 0 },
    { "field": "3x15", "count": 0 },
    { "field": "1x15_inner", "count": 0 },
    { "field": "2x16", "count": 0 },
    { "field": "1x16_outer", "count": 0 },
    { "field": "3x16", "count": 0 },
    { "field": "1x16_inner", "count": 0 },
    { "field": "2x17", "count": 0 },
    { "field": "1x17_outer", "count": 0 },
    { "field": "3x17", "count": 0 },
    { "field": "1x17_inner", "count": 0 },
    { "field": "2x18", "count": 0 },
    { "field": "1x18_outer", "count": 0 },
    { "field": "3x18", "count": 0 },
    { "field": "1x18_inner", "count": 0 },
    { "field": "2x19", "count": 0 },
    { "field": "1x19_outer", "count": 0 },
    { "field": "3x19", "count": 0 },
    { "field": "1x19_inner", "count": 0 },
    { "field": "2x20", "count": 0 },
    { "field": "1x20_outer", "count": 0 },
    { "field": "3x20", "count": 0 },
    { "field": "1x20_inner", "count": 0 },
    { "field": "25", "count": 0 },
    { "field": "50", "count": 0 },
    { "field": "miss", "count": 0 }];
}