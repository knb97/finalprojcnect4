var pixels; //name of font
var stage = 0;

const cols = 7;
const rows = 6;
const w = 100;
const dw = 80;
let board = Array(6)
  .fill()
  .map(() => Array(7).fill(0));
let player = 1;
let playerPos;
let win = 0;

let winSound;

function setup() {
  createCanvas(cols * w, rows * w + w);
  frameRate(10); // framerate for confetti
} // close function setup

function preload() {
  pixels = loadFont("Pixels.ttf");
  // soundFormats("mp3");
  winSound = loadSound("./audio/winner.mp3");
}

function hasWon() {
  // Horizontal entry
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i <= cols - 4; i++) {
      const test = board[j][i];
      if (test != 0) {
        let temp = true;
        for (let k = 0; k < 4; k++) {
          if (board[j][i + k] !== test) {
            temp = false;
          }
        }
        if (temp == true) {
          return true;
        }
      }
    }
  } // close horizontal

  // Vertical entry
  for (let j = 0; j <= rows - 4; j++) {
    for (let i = 0; i < cols; i++) {
      const test = board[j][i];
      if (test != 0) {
        let temp = true;
        for (let k = 0; k < 4; k++) {
          if (board[j + k][i] !== test) {
            temp = false;
          }
        }
        if (temp == true) {
          return true;
        }
      }
    }
  } // close vertical

  // Diagonal entry
  for (let j = 0; j <= rows - 4; j++) {
    for (let i = 0; i <= cols - 4; i++) {
      const test = board[j][i];
      if (test != 0) {
        let temp = true;
        for (let k = 0; k < 4; k++) {
          if (board[j + k][i + k] !== test) {
            temp = false;
          }
        }
        if (temp == true) {
          return true;
        }
      }
    }
  } //close diagonal

  // Other way diagonal entry
  for (let j = 0; j <= rows - 4; j++) {
    for (let i = 4; i < cols; i++) {
      const test = board[j][i];
      if (test != 0) {
        let temp = true;
        for (let k = 0; k < 4; k++) {
          if (board[j + k][i - k] !== test) {
            temp = false;
          }
        }
        if (temp == true) {
          return true;
        }
      }
    }
  }

  return false;
} // close other way diagonal

function draw() {
  //color of connect 4 frames
  background(132, 177, 12);

  playerPos = floor(mouseX / w);
  stroke(0);
  //color of background1
  fill(250, 249, 235);
  rect(-1, -1, width + 2, w);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      //color of background2
      fill(250, 249, 235);
      if (board[j][i] == 1) {
        //color when player 1 drops chip - orange
        fill(238, 82, 0);
      } else if (board[j][i] == 2) {
        //color when player 2 drops chip - magenta
        fill(220, 14, 169);
      }
      ellipse(i * w + w / 2, j * w + (3 * w) / 2, dw);
    }
  }
  stroke(102, 102, 0);
  for (let x = w; x < width; x += w) {
    line(x, w, x, height);
  }
  stroke(0);
  if (player == 1) {
    //color for player 1 chip - orange
    fill(238, 82, 0);
  } else if (player == 2) {
    //color for player 2 chip - magenta
    fill(220, 14, 169);
  }
  ellipse((playerPos + 0.5) * w, w / 2, dw);

  if (win != 0) {
    noStroke();
    fill(0);
    if (win == 1) {
      //color if player 1 wins
      fill(238, 82, 0); //orange
    } else if (win == 2) {
      //color if player 2 wins
      fill(220, 14, 169); //magenta
    }
    textAlign(CENTER, CENTER);
    textSize(100);
    if (win == 4) {
      text("Game Over!", width / 2, w / 2);
    } else if (win == 3) {
      text("I's a tie!", width / 2, w / 2);
    } else {
      text(`${win > 1 ? "Magenta" : "Orange"} won!`, width / 2, w / 2);
      if (win == 1) {
        stage = 4; //magenta wins
      } else {
        stage = 5;
        //orange wins
      }
    }
    // noLoop();
  }

  if (stage == 0) {
    splash();
  }

  if (stage == 1) {
    game();
  }

  if (stage == 4) {
    //magenta wins
    winScreenM();
  }

  if (stage == 5) {
    //orange wins
    winScreenO();
  }
} //  close draw

//confetti effect for winScreen:
function displayConfetti() {
  for (let i = 0; i < 50; i++) {
    let confettiSize = random(10, 20);
    let confettiColor = color(random(255), random(255), random(255));
    let confettiX = random(width);
    let confettiY = random(height);

    fill(confettiColor);
    ellipse(confettiX, confettiY, confettiSize, confettiSize);
  }
}

// start game screen
function splash() {
  console.log("running splash green");

  background(132, 177, 12);

  textFont(pixels);
  fill(49, 24, 19);
  noStroke();
  textSize(120);
  text("Connect 4!", 350, 230);
  textSize(60);
  textAlign(CENTER);
  textSize(40);
  text(" use the mouse to move from left to right", 350, 450);
  text("and click to drop a chip", 350, 470);

  //button
  fill(220, 14, 169);
  rect(170, 330, 360, 30, 20, 20);
  fill(240, 248, 242);
  text("Press space bar to start game", width * 0.5, height * 0.5);
  textSize(30);

  if (keyIsPressed && keyCode == 32) {
    //did i press my space bar?
    stage = 1; //start game
  }
} // close splash

//takes to game screen after splash
function game() {
  if (hasWon()) {
    win = player;
    //code to trigger win magenta or win orange screens
    if (win == 1) {
      stage = 4; //magenta wins
      winSound.play();
    } else {
      stage = 5; //orange wins
      winSound.play();
    }
  }
  let tie = true;
  for (let j = 0; j < rows; j++)
    outer: {
      for (let i = 0; i < cols; i++) {
        if (board[j][i] == 0) {
          tie = false;
        }
      }
    }
  if (tie) {
    win = 3;
  } //close if hasWon
} // game function close

//win screen for Magenta
function winScreenM() {
  background(240, 248, 242);
  textFont(pixels);
  fill(220, 14, 169);
  noStroke();
  textSize(120);
  textAlign(CENTER);
  text("Magenta Won!", width * 0.5, height * 0.5);

  // play again button
  fill(135, 144, 92);
  rect(215, 420, 250, 40, 20, 20);
  textSize(60);
  fill(87, 48, 24);
  text("Play Again", 340, 450);
  textSize(40);
  text("Press enter to", 345, 410);
  // console.log("keypress: ", keyIsPressed, keyCode);

  if (keyIsPressed && keyCode == 13) {
    stage = 1;
  }

  displayConfetti();
} //close Magenta winscreen

//win screen for Orange
function winScreenO() {
  background(240, 248, 242);
  textFont(pixels);
  fill(238, 82, 0);
  noStroke();
  textSize(120);
  textAlign(CENTER);
  text("Orange Won!", width * 0.5, height * 0.5);

  // play again button
  fill(135, 144, 92);
  rect(215, 420, 260, 40, 20, 20);
  textSize(60);
  fill(87, 48, 24);
  text("Play Again", 340, 450);
  textSize(40);
  text("Press enter to", 345, 410);
  if (keyIsPressed && keyCode == ENTER) {
    stage = 1;
  }

  displayConfetti();
} //close Orange  winscreen

function keyPressed() {
  // console.log("key is pressed!");

  // console.log(keyCode);

  // console.log("stage: ", stage);

  if (stage === 4 || stage === 5) {
    if (keyCode == 13) {
      stage = 1;
      win = 0;

      board = Array(6)
        .fill()
        .map(() => Array(7).fill(0));
    }
  }
}

function mousePressed() {
  if (board[0][playerPos] != 0) {
    win = 4;
  }

  board[0][playerPos] = player;
  let i = 0;
  while (true) {
    if (i >= rows - 1) {
      break;
    }
    if (board[i + 1][playerPos] != 0) {
      break;
    }
    [board[i + 1][playerPos], board[i][playerPos]] = [
      board[i][playerPos],
      board[i + 1][playerPos],
    ];
    i++;
  } // close mousePressed

  player = 3 - player;
}
