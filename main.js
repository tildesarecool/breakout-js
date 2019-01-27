var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 5;

// This is 2.19 in series (1/11/2019) 
// this part will be replaced with arrays version later

// 1/18/2019 - made it to 2.26
// 1/18/2019 - made it to 3.28: separated the HTML file from the JS file even though the instructor hadn't suggested it
// some how just makes it feel better this way.
// 1/19/2018 - made it to 3.32



const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;


// replacing this line with a "new Array()" line to auto-generate bricks
//var brickGrid = [ true, true, true, true ];
// shorthand for the varialbes version, can do brickgrid[0] = false

// Also function brickReset is new with this below
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);



///////////////////////////////////////////////////

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DIST_FROM_EDGE = 60;
var paddleX = 400;

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - PADDLE_WIDTH/2;
}

function brickReset() {
    for ( var i = -1; i < BRICK_COLS * BRICK_ROWS; i++) {
            // this is supposed to help later for vertical grid
         
                brickGrid[i] = true;
           
           // brickGrid[i] = true;
    } // end for-loop for bricks
    // just a little confirming
    // brickGrid[16] = false;
}   // end function 


window.onload = function() {
    //var ballX = 0;
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(updateAll, 1000/framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePos);

    brickReset();
    // ballReset(); // good idea? (section 38) - will cause issues with side brick bouncing
}

function updateAll() {
    moveAll();
    drawAll();
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function moveAll() {
   ballX += ballSpeedX;
   ballY += ballSpeedY;

    if (ballX  < 0 ) {  // left
        ballSpeedX *= -1;
    }

    if (ballX > canvas.width) { // right
        ballSpeedX *= -1;
    }


///////////////////////////////////////////////////////////////


    if (ballY < 0 ) {   // top
        ballSpeedY *= -1;
    }

    if (ballY > canvas.height) { // bottom
        ballReset();
    }

    var ballBrickCol = Math.floor(ballX / BRICK_W);
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);
   // colorText(ballBrickCol+","+ballBrickRow+":"+brickIndexUnderBall, mouseX, mouseY, 'yellow');
  
   if (ballBrickCol >= 0 && ballBrickCol < BRICK_COLS &&
       ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            ballSpeedY *= -1;
        }
   }

/*   
    if (brickIndexUnderBall >= 0  && 
        brickIndexUnderBall < BRICK_COLS * BRICK_ROWS) {
        brickGrid[brickIndexUnderBall] = false;
    } 
*/
    var paddleTopEdgeY = canvas.height - PADDLE_DIST_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;

    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

    if ( ballY > paddleTopEdgeY &&  // below the top of paddle
         ballY < paddleBottomEdgeY &&   //  above bottom of paddle
         ballX > paddleLeftEdgeX &&   //  right of the left side of paddle
         ballX < paddleRightEdgeX ) {  //  left of the right side of paddle

         ballSpeedY *= -1;

         var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
         var ballDistFromPaddleCenterX = ballX - centerOfPaddleX;
         ballSpeedX = ballDistFromPaddleCenterX * 0.35;

         }

  // console.log("X is " + ballX);
  // console.log(" while Y is " + ballY);
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COLS * row;
}


function drawBricks() {
    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for ( var eachCol = 0; eachCol < BRICK_COLS; eachCol++ ) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if ( brickGrid[arrayIndex]) { 
                colorRect(BRICK_W * eachCol,BRICK_H*eachRow, BRICK_W-BRICK_GAP,BRICK_H - BRICK_GAP, 'blue');
            }
               
        }
    }
}
/*    for (var i = 0; i < BRICK_COUNT; i++) {
        if ( brickGrid[i]) {
            colorRect(BRICK_W * i,BRICK_H, BRICK_W-BRICK_GAP,BRICK_H - BRICK_GAP, 'blue');
        }
    }*/


function drawAll() {
    
	colorRect(0,0, canvas.width,canvas.height, 'black'); // clear screen

	colorCircle(ballX,ballY, 10, 'white'); // draw ball

	colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE,
                PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
                
    drawBricks();

    // Added at 3.27 - two variables and modifed the colorText call; 
    // apparently this is related to the text that shows next to the mouse cursor
    // 3.32 - added the math.floor to shave off decimal points
    /* var mouseBrickCol = Math.floor(mouseX / BRICK_W);
    var mouseBrickRow = Math.floor(mouseY / BRICK_H);
    var brickIndexUnderMouse = rowColToArrayIndex(mouseBrickCol, mouseBrickRow);
   // colorText(mouseBrickCol+","+mouseBrickRow+":"+brickIndexUnderMouse, mouseX, mouseY, 'yellow');
    
    if (brickIndexUnderMouse >= 0  && 
        brickIndexUnderMouse < BRICK_COLS * BRICK_ROWS) {
        brickGrid[brickIndexUnderMouse] = false;
        } */
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle= fillColor;
    canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX,centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
	canvasContext.fillStyle = fillColor;
	canvasContext.fillText(showWords, textX, textY);
}