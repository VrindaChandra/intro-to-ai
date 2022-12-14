//selects canvas element
const canvas = document.getElementById("pong");

//getContext method to use its graphics functions 
const ctx = canvas.getContext('2d');

//ball
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"}

//user paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"}

//ai paddle 
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"}

//function for drawing paddles 
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);}

//arc for ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();}

//eventlistener to control user paddle with mouse
canvas.addEventListener("mousemove", getMousePos);
function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;}

//when ai or user scores the ball is reset
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;}

//draw score
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);}

//collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;  

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;}

//calculation for ball movement and scores 
function update(){

    //if the ball goes to the left aka ball.x < 0 ai wins
    //else if ball goes to the right "ball.x > canvas.width" the user wins
    if( ball.x - ball.radius < 0 ){
        com.score++;  //left edge of ball crosses 0px
        resetBall();}

    else if( ball.x + ball.radius > canvas.width){ 
        user.score++;    //right edge of ball crosses 600px
        resetBall();}

    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI
    com.y += ((ball.y - (com.y + com.height/2))*0.6);
    /*the AI is virtually unbeatable right now because it is following the 
    centre of the ball with the centre of its own paddle with great precision.*/

    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }
    // we check if the paddle hit the user or the com paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;

    // if the ball hits a paddle
    if(collision(ball,player)){

        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));

        // normalize the value of collidePoint, we need to get numbers between -1 and 1.
        // we will use trigonometry to bounce the ball off in different directions
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);

        // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
        // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
        // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
        // Math.PI/4 = 45degrees
        let angleRad = (Math.PI/4) * collidePoint;

        // change the X and Y velocity direction
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.1;
    }
}

// render function to keep drawing all the graphic elements 
function render(){
    //clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

//uses grid system on the canvas, 4 columns and 5 rows 
    //draw the user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5);

    //draw the ai score to the right
    drawText(com.score,3*canvas.width/4,canvas.height/5);

    //draw the user's paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    //draw the ai's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
}

// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);