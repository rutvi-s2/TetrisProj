// Name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions.
/* global createCanvas, colorMode, HSB, width, append, save, height, random, background, fill, color, random,
          rect, rectCollison, ellipse, stroke, image, textSize, createButton, textAlign, Right, filter, loadImage, row, col, j, rectCollison, i, collideCircleCircle, text, mouseX, mouseY, 
          strokeWeight, int, collideDebug, collidePolyPoly, collideRectRect, translate, line, DOWN_ARROW, WEBGL, keyCode, RIGHT_ARROW, LEFT_ARROW, keyPressed, keyIsDown, DEGREES, angleMode, keyPressed, mouseIsPressed, UP_ARROW, windowWidth, windowHeight, noStroke, rotate, PI, noFill*/
//hoping we can change this to use the rectrect collision library? 
let rectCollision = (firstRect, secondRect) => {
   return collideRectRect(firstRect.x ,firstRect.y,firstRect.boxWidth - .5,firstRect.boxHeight ,secondRect.x,secondRect.y ,secondRect.boxWidth - 0.5,secondRect.boxHeight)
   
}
const canvasWidth = 600;
const canvasHeight = 600;
const backgroundColor = 80
const boxDimension = 30
const timeInterval = 500
const marginPieceBeginning = 2
const startingPoints = 0
const begginingPoint = 0

const blockSquare = [ [1, 1], 
                [1, 1] 
              ]

const blockLine = [ [null, 1, null, null], 
                [null, 1, null, null],
                [null, 1, null, null], 
                [null, 1, null, null]
              ]

const blockBZ= [ [null, null, null], 
                [null, 1, 1],
                [1, 1, null]
              ]

const blockZ = [ [null, null, null], 
                [1, 1, null],
                [null, 1, 1]
              ]

const blockL = [ [1, null, null], 
                [1, null, null],
                [1, 1, null]
              ]

const blockBL = [ [null, null, 1], 
                [null, null, 1],
                [null, 1, 1]
              ]

const blockT = [ [null, null, null], 
                [1, 1, 1],
                [null, 1, null]
              ]


let currentPiece, platform, points, randomNum, blockrn, gameOver, colorn;

function setup(){
createCanvas(canvasWidth, canvasHeight)
generateNewPiece()
platform = new Platform()
setInterval (() => blocksFall(), timeInterval)
points = startingPoints
}
function draw(){
  if(!gameOver){
  background(backgroundColor)
  text(`Points: ${points}`, 500 ,20)
  textSize(20)
  fill(100, 102, 153);
  noStroke();
  platform.show()
  currentPiece.show()
  }
  if(gameOver)
    {
      background (20)
        textSize(95)
      text('GAME OVER', 10, 300);
       textSize(25)
      text('PRESS SPACEBAR TO RESET AND CONTINUE', 20 ,350)
       fill(0, 102, 153);
      text(`Points: ${points}`, 20 ,400)
       fill(0, 102, 153);
    }
}
function keyPressed() {
    if (keyCode === UP_ARROW) 
        currentPiece.rotation()
    if (keyCode === RIGHT_ARROW && !currentPiece.canCollide(box => box.x + boxDimension === width) && !platform.piecesColliding(currentPiece, (rect1, rect2) => rectCollision(rect1, rect2), (box) => box.x += boxDimension)) 
        currentPiece.x += boxDimension
    if (keyCode === LEFT_ARROW && !currentPiece.canCollide(box => box.x === begginingPoint) && !platform.piecesColliding(currentPiece, (rect1, rect2) => rectCollision(rect1, rect2), (box) => box.x -= boxDimension)) 
        currentPiece.x -= boxDimension
    if (keyCode === DOWN_ARROW) 
        blocksFall()
  if (keyCode === 32 && gameOver){
    setup()
    gameOver = false;
  }
}
function randoms() {
  randomNum = random(0, 6);
  if (randomNum == 0) {
    blockrn = blockZ;
    colorn = {r : 220, g : 20, b : 60}
  } else if (randomNum > 0 && randomNum < 1) {
    blockrn = blockBZ;
    colorn = {r : 50, g : 205, b : 50}
  } else if (randomNum > 1 && randomNum < 2) {
    blockrn = blockBL;
    colorn = {r : 255, g : 165, b : 0}
  } else if (randomNum > 2 && randomNum < 3) {
    blockrn = blockL;
    colorn = {r : 0, g : 0, b : 205}
  } else if (randomNum > 3 && randomNum < 4) {
    blockrn = blockLine;
    colorn = {r : 0, g : 255, b : 255}
  } else if (randomNum > 4 && randomNum < 5) {
    blockrn = blockSquare;
    colorn = {r : 255, g : 255, b : 70}
  } else if (randomNum > 5 && randomNum < 6) {
    blockrn = blockT;
    colorn = {r : 138, g : 43, b : 226}
  }
}
function blocksFall(){
  if(!currentPiece.canCollide(box => box.y + boxDimension === height) && !platform.piecesColliding(currentPiece)){
        currentPiece.y += boxDimension
    } else if ( currentPiece.canCollide(box => (box.y == begginingPoint || box.y == begginingPoint + 30)) )
    {
      gameOver = true;
    }
  else {
    platform.placePiece(currentPiece)
        generateNewPiece() 
        platform.cleanFilledRows(); 
  }
}
 function generateNewPiece(){
    randomNum = random(0,6)
    randoms()
    currentPiece = new Blocks(blockrn, width / 2, -boxDimension * marginPieceBeginning, colorn)
}

class Box{
  constructor(x = 0, y = 0, boxWidth = 60, boxHeight = 60, color = {r : 0, g : 0, b : 0}){
        this.x = x
        this.y = y
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.color = color
    }

    show(){
        let actualColor = this.color
        fill(actualColor.r, actualColor.g, actualColor.b)
        rect(this.x, this.y, this.boxWidth, this.boxHeight)
    }
}


class Blocks {
    constructor(originalShape = [[]], x = 0, y = 0, color = {r : 0, g : 0, b : 0}) {
        this.originalShape = originalShape
        this.color = color
        this.x = x
        this.y = y
        this.shape = this.fillPiece(originalShape.length)
    }

    fillPiece(pieceLength) {
        return Array.from(new Array(pieceLength), (x, i) => 
            Array.from(new Array(pieceLength), (x, j) =>  
            this.originalShape[i][j] === 1 ? new Box(this.x + j * boxDimension, this.y + i * boxDimension, boxDimension, boxDimension, this.color) : null)
        )
    }

    show() {
        this.updatePiecePosition()
        this.shape.forEach( x => x.filter( j => j != null).forEach(box => box.show()))
    }

    canCollide(collision) {
        return this.shape.reduce( (z, x) => z.concat(x.filter(col => col != null).filter(box => collision(box))), []).length > 0
    }

    rotation() {
        this.transpose()
        this.rotate90Degrees()
        this.updatePiecePosition()
    }

    transpose() {
        let dimension = this.shape.length
        let aux = Array.from(new Array(dimension), e => Array.from(new Array(dimension), x => null) )        
        this.shape.forEach( (x, i) => x.forEach( (e, j) => aux [j][i] = e))
        this.shape = aux
    }

    rotate90Degrees() {
        this.shape.reverse()[0].map((column, index) => 
            this.shape.map(row => row[index])
          )
    }

    updatePiecePosition() {
        this.shape.forEach( (x, i) => x.forEach( (e, j) => { if(e) { e.x = this.x + j * boxDimension; e.y = this.y + i * boxDimension; }}))
    }
}

class Platform {
    constructor(platform = [[]], x = 0, y = 0, dimension = boxDimension, color = {r : 0, g : 0, b : 255}) {
        this.platform = platform
        this.dimension = dimension
        this.color = color
        this.x = x
        this.y = y
        this.generatePlatform()
    }

    show() {
        this.platform.forEach( (row, i) => row.forEach( (box, j) => box === null ? this.showEmptyBox() : box.show()))
    }

    generatePlatform() {
        let platformLength = canvasWidth / this.dimension
        this.platform = Array.from(new Array(platformLength), row => 
                        Array.from(new Array(platformLength), col => null))
    }

    showEmptyBox() {
        let {r , g , b} = this.color
        stroke(r, g, b)
        fill(backgroundColor)
    }

    placePiece(piece) {
        piece.shape.reduce( (z, x) => z.concat(x.filter(col => col != null)), []).forEach( box => this.platform[box.y / boxDimension][box.x / boxDimension] = box)
    }

    piecesColliding(piece, collision = (rect1, rect2) => rectCollision(rect1, rect2), applyToBoxes = box => box) {
        let boxes = piece.shape.reduce( (z, x) => z.concat(x.filter(col => col != null)), [])
        boxes.forEach(box => applyToBoxes(box))
        let piecesInPlatform = this.platform.reduce( (z, x) => z.concat(x.filter(col => col != null)), [])
        return boxes.reduce( (z, box) => piecesInPlatform.filter( p => collision(box, p)).length > 0 ? true : z , false)
    }

    cleanFilledRows() {
        let preBoxesCount = this.countBoxes()
        this.platform.forEach( (row, i) => { if(row.every( box => box != null)) { row.forEach( (element, j) =>  this.platform[i][j] = null)} })
        let postBoxesCount = this.countBoxes()
        preBoxesCount != postBoxesCount ? points += preBoxesCount - postBoxesCount : points = points
    }

    countBoxes() {
        return this.platform.reduce( (z, row) => z += row.filter( element => element != null).length, 0)
    }
}

