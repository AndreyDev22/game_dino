const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const card = document.getElementById("card");
const cardScore = document.getElementById("card-score");

//Audio

//

//Used for 'setInterval'
let presetTime = 1000;
//Enemy can speed up when player has scored points at intervals of 10
let enemySpeed = 5;
let score = 0;
//Used to see if user has scored another 10 points or not
let scoreIncrement = 0;
//So ball doesn't score more then one point at a time
let canScore = true;

function startGame () {
    player = new Dino(150, 350, 50, "black");
    arrayCactus = [];
    score = 0;
    scoreIncrement = 0;
    enemySpeed = 5;
    canScore = true;
    presetTime = 1000;
}

//Restart game
function restartGame (button) {
    card.style.display = "none";
    button.blur();
    startGame();
    requestAnimationFrame(animate);
}

function drawBackgroundLine() {
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(600, 400);
    ctx.lineWidth = 1.9;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function drawScore () {
    ctx.font = "80px Arial";
    ctx.fillStyle = "black";
    let scoreString = score.toString();
    let xOffset = ((scoreString.length - 1) * 20);
    ctx.fillText(scoreString, 280 - xOffset, 100);
}
//Both Min & Max are included in this random generation function
function getRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNumberInterval (timeInterval) {
    let returnTime = timeInterval;
    if (Math.random() < 0.5) {
        returnTime += getRandomNumber(presetTime / 3, presetTime * 1.5);
    } else {
        returnTime -= getRandomNumber(presetTime / 5, presetTime / 2);
    }
    return returnTime;
}

class Dino {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;

        this.jumpHeight = 12;
        this.shouldJump = false;
        this.jumpCounter = 0;
    }

    jump() {
        if (this.shouldJump) {
            this.jumpCounter++;
            if (this.jumpCounter < 15) {
                //Go up
                this.y -= this.jumpHeight;
            } else if (this.jumpCounter > 14 && this.jumpCounter < 19) {
                this.y += 0;
            }else if (this.jumpCounter < 33) {
                //Come back down
                this.y += this.jumpHeight;
            }

            if (this.jumpCounter >= 32) {
                this.shouldJump = false;
            }
        }
    }

    draw() {
        this.jump();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

let player = new Dino(150, 350, 50, "black");

class Cactus {
    constructor(size, speed) {
        this.x = canvas.width + size;
        this.y = 400 - size;
        this.size = size;
        this.color = "red";
        this.slideSpeed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    slide() {
        this.draw();
        this.x -= this.slideSpeed;
    }
}

let arrayCactus = [];

//Auto generate cactus
function generateCactus () {
    let timeDelay = randomNumberInterval(presetTime);
    arrayCactus.push(new Cactus(50, enemySpeed));

    setTimeout(generateCactus, timeDelay);
}

//Returns true if colliding
function squaresColliding (player, block) {
    let s1 = Object.assign(Object.create(Object.getPrototypeOf(player)), player);
    let s2 = Object.assign(Object.create(Object.getPrototypeOf(block)), block);

    s2.size = s2.size - 10;
    s2.x = s2.x + 10;
    s2.y = s2.y + 10;
    return !(
        s1.x > s2.x + s2.size || //R1 is to the right of R2
        s1.x + s1.size < s2.x || //R1 to the left of R2
        s1.y > s2.y + s2.size || //R1 is below R2
        s1.y + s1.size < s2.y //R1 is above R2
    );
}

//Returns true if player is plast the cactus
function isPastCactus (player, cactus) {
    return (
        player.x + (player.size / 2) > cactus.x + (cactus.size / 4) &&
        player.x + (player.size / 2) < cactus.x + (cactus.size / 4) * 3
    )
}

function shouldIncreaseSpeed () {
    //Check to see if game speed should be increased
    if (scoreIncrement + 10 === score) {
        scoreIncrement = score;
        enemySpeed++;
        presetTime >= 100 ? presetTime -= 100 : presetTime = presetTime / 2;

        //Update speed of existing cactus
        arrayCactus.forEach(cactus => {
            cactus.slideSpeed = enemySpeed;
        })
    }
}

let animationId = null;

function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Canvas Logic
    drawBackgroundLine();
    drawScore();
    //Foreground
    player.draw();

    //Check to see if game speed should be increased
    shouldIncreaseSpeed();

    arrayCactus.forEach((cactus, index) => {
        cactus.slide();
        //End game as player and enemy have collided
        if (squaresColliding(player, cactus)) {
            cardScore.textContent = score;
            card.style.display = "block";
            cancelAnimationFrame(animationId);
        }
        //User should score a point if this is the case
        if (isPastCactus(player, cactus) && canScore) {
            canScore = false;
            score++;
        }
        //Delete block that has left the screen
        if ((cactus.x + cactus.size) <= 0) {
            setTimeout(() => {
                arrayCactus.splice(index, 1);
            }, 0)
        }
    })
}

animate();
setTimeout(() => {
    generateCactus();
}, randomNumberInterval(presetTime))

//Event Listeners
addEventListener("keydown", e => {
    if (e.code === "Space") {
        if (!player.shouldJump) {
            player.jumpCounter = 0;
            player.shouldJump = true;
            canScore = true;
        }
    }
})