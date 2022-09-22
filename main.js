const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");

document.addEventListener("keydown", function(event) {
    skok();
});

function skok () {
    if (dino.classList != "skok") {
        dino.classList.add("skok")
    }
    setTimeout (function() {
        dino.classList.remove("skok")
    }, 300)
}

let isAlive = setInterval (function() {
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    if (cactusLeft < 90 && cactusLeft > 0 && dinoTop >= 140) {
        alert("GAME OVER")
    }
}, 10)