


window.addEventListener("load", adaptContentScale);
window.addEventListener("resize", adaptContentScale);

function adaptContentScale(){
    let windowHeight = document.getElementById("contentContainer").offsetHeight;
    let windowWidth = document.getElementById("contentContainer").offsetWidth;

    let scaleX = windowWidth / 1920;
    let scaleY = windowHeight / 1080;
    let scale = scaleX;
    if(scaleY < scale){
        scale = scaleY;
    }

    document.getElementById("content").style.transform = "translateX(-50%) translateY(-50%) scale(" + scale + ")";
}

