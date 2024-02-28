const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const highScoreText = document.querySelector("#highScoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "#add8e6";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function getHighScore() {
    const storedHighScore = localStorage.getItem("highScore");
    return storedHighScore ? parseInt(storedHighScore) : 0;
}

function setHighScore(score) {
    localStorage.setItem("highScore", score.toString());
}

function displayHighScore() {
    const highScore = getHighScore();
    highScoreText.textContent = highScore;
}

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = score;
    displayHighScore();
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    for (let i = 0; i < gameWidth; i += unitSize) {
        for (let j = 0; j < gameHeight; j += unitSize) {
            if ((i / unitSize + j / unitSize) % 2 === 0) {
                ctx.fillStyle = "#90ee90";
            } else {
                ctx.fillStyle = "#98fb98";
            }

            ctx.fillRect(i, j, unitSize, unitSize);
        }
    }
}


function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };
    snake.unshift(head);
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
}

const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;

const W_KEY = 87;
const A_KEY = 65;
const S_KEY = 83;
const D_KEY = 68;

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUP = (yVelocity === -unitSize);
    const goingDOWN = (yVelocity === unitSize);
    const goingRIGHT = (xVelocity === unitSize);
    const goingLEFT = (xVelocity === -unitSize);

    const goingW = (yVelocity === -unitSize);
    const goingS = (yVelocity === unitSize);
    const goingD = (xVelocity === unitSize);
    const goingA = (xVelocity === -unitSize);

    switch (true) {
        case (keyPressed === LEFT_ARROW && !goingRIGHT):
        case (keyPressed === A_KEY && !goingD):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === UP_ARROW && !goingDOWN):
        case (keyPressed === W_KEY && !goingS):
            yVelocity = -unitSize;
            xVelocity = 0;
            break;
        case (keyPressed === RIGHT_ARROW && !goingLEFT):
        case (keyPressed === D_KEY && !goingA):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed === DOWN_ARROW && !goingUP):
        case (keyPressed === S_KEY && !goingW):
            yVelocity = unitSize;
            xVelocity = 0;
            break;
    }
}


function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth
            ):
            running = false;
            break;
            case (snake[0].y < 0):
            case (snake[0].y >= gameHeight):
                running = false;
                break;
        }
        
        for (let i = 1; i < snake.length; i += 1) {
            if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
                running = false;
                break;
            }
        }
    }
    
    function displayGameOver() {
        ctx.font = "50px MV Boli";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
        updateHighScore(); 
    }
    
    function resetGame() {
        score = 0;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            {x: unitSize * 4, y: 0},
            {x: unitSize * 3, y: 0},
            {x: unitSize * 2, y: 0},
            {x: unitSize, y: 0},
            {x: 0, y: 0}
        ];
        gameStart();
    }
    
    function updateHighScore() {
        const currentScore = score;
        const highScore = getHighScore();
    
        if (currentScore > highScore) {
            setHighScore(currentScore);
            displayHighScore();
        }
    }
updateHighScore(); 
