// HOW THE GAME WORKS
// 1. Pick how many balls you want at the top using the slider.
// 2. Press Start. A small yellow ball starts bouncing around.
// 3. Move the blue paddle to stop the yellow ball from falling.
// 4. Every ball the yellow ball touches at the top disappears and you get points.
// 5. Clear all the balls to win. Miss the yellow ball 3 times and you lose.
//
// HOW TO READ THIS FILE
// Each part starts with:
//   "What this is"  -> the JavaScript idea used in that part, in plain words
//   "Skip this"     -> what goes wrong if that part was missing
// Try it yourself: delete or comment out a part and refresh the page to see it break.


// ---------- PART 1: Grab things from the page ----------
// What this is: VARIABLES.
//   A variable is a labelled box that holds something so we can use it later.
//   const = the box always holds the same thing.
//   let   = what's inside the box can change (like the score going up).
// Skip this: the code can't find the game area, the score or the button,
//   so nothing shows up and the page shows errors.

// The drawing area where the game happens
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d"); // the "pen" we draw with

// The numbers shown above the game
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const leftEl = document.getElementById("left");

// The slider, its number, the Start button and the message line
const slider = document.getElementById("targetSlider");
const targetCountEl = document.getElementById("targetCount");
const startBtn = document.getElementById("startBtn");
const messageEl = document.getElementById("message");

// Things that change while you play, so they use let
let score = 0;
let lives = 3;
let isPlaying = false;  // true while the game is running, false when stopped
let animationId = null; // lets us stop the game later
// If score was const instead of let, adding points would cause an error.


// ---------- PART 2: Describe each thing in the game ----------
// What this is: OBJECTS.
//   An object groups everything about one thing in one place,
//   like a profile card: name: value, name: value.
//   We read a value with a dot, e.g. ball.x or paddle.width.
// Skip this: the game has no ball and no paddle to move or draw.
// Why not use separate variables? We could write ballX, ballY, ballSize...
//   but with lots of things in a game that gets messy fast. Objects keep it tidy.

// The yellow ball you bounce
const ball = {
  x: canvas.width / 2,      // left-right position
  y: canvas.height - 60,    // up-down position
  radius: 8,                // size
  speedX: 4,                // how fast it moves sideways
  speedY: -4,               // how fast it moves up or down (minus = up)
  color: "#facc15",
};

// The blue paddle at the bottom
const paddle = {
  width: 100,
  height: 12,
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  speed: 8,
  color: "#38bdf8",
};

// Remembers if the left or right arrow key is being held
// Skip this: the paddle would only jump once per key press instead of sliding smoothly.
const keys = {
  left: false,
  right: false,
};


// ---------- PART 3: The list of balls at the top ----------
// What this is: ARRAYS.
//   An array is a list. Each item has a position number, starting at 0.
//   targets[0] is the first ball, targets[1] the second, and so on.
//   targets.length tells us how many are in the list.
// Skip this: there's nowhere to keep the balls at the top,
//   so there is nothing to hit and no way to win.
// Why a list? We don't know how many balls there will be until the
//   player moves the slider. A list can grow or shrink to fit.

// Starts empty. Gets filled when the game sets up.
let targets = [];

// Each row of balls gets one of these colours
const colors = ["#f87171", "#fb923c", "#4ade80", "#a78bfa", "#f472b6"];


// ---------- PART 4: Setting up ----------
// What this is: FUNCTIONS and LOOPS.
//   A function is a named set of steps. Writing it doesn't run it.
//   It only runs when we "call" it by its name, e.g. resetBall().
//   We write steps once and reuse them as many times as we like.
//
//   A loop repeats the same steps many times so we don't have to
//   copy and paste them. 40 balls = 1 loop, not 40 copies of the same code.

// Makes the balls at the top and lines them up in rows.
// "amount" is an input: the number from the slider gets passed in here.
// Skip this: the list stays empty, so no balls appear at the top.
function createTargets(amount) {
  targets = []; // clear out the old ones
  // Skip that line: every new game would pile new balls on top of the old ones.

  const radius = 14;
  const gap = 8;
  const perRow = Math.floor(canvas.width / (radius * 2 + gap)); // how many fit in one row
  // Push the rows in from the edges so they sit in the middle
  const rowWidth = perRow * (radius * 2 + gap) - gap;
  const offsetX = (canvas.width - rowWidth) / 2 + radius;

  // The loop: i starts at 0, goes up by 1 each time,
  // and stops when it reaches the amount.
  // So if amount is 15, this runs 15 times and makes 15 balls.
  for (let i = 0; i < amount; i++) {
    const row = Math.floor(i / perRow); // which row this ball goes in
    const col = i % perRow;             // which spot in that row
    // Skip row/col: every ball would sit on the same spot, looking like just one ball.

    // Each ball is its own object (Part 2 idea)...
    const target = {
      x: offsetX + col * (radius * 2 + gap),
      y: 30 + row * (radius * 2 + gap),
      radius: radius,
      color: colors[row % colors.length],
      points: 10, // what you earn for hitting it
    };

    // ...and gets added to the end of the list (Part 3 idea)
    targets.push(target);
    // Skip push: the ball gets made and then thrown away. The list stays empty.
  }
}

// Puts the yellow ball and paddle back in the middle
// Skip this: after you miss, the ball stays below the screen and you lose all lives at once.
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.speedX = Math.random() > 0.5 ? 4 : -4; // go left or right by chance
  ball.speedY = -4;
  paddle.x = canvas.width / 2 - paddle.width / 2;
}

// Shows the latest score, lives and balls left on the page
// Skip this: the game still keeps score, but the numbers on screen never change.
function updateHud() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  leftEl.textContent = targets.length;
}


// ---------- PART 5: Drawing ----------
// What this is: small FUNCTIONS that each draw one thing.
//   Splitting it up means each function is short and easy to understand,
//   and drawCircle can be reused for both the yellow ball and the targets.
// Skip this: the game runs but you see a blank box.

// Draws one circle. We give it where, how big and what colour.
function drawCircle(x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2); // a full circle
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

// Draws the paddle as a rectangle
function drawPaddle() {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draws every ball still left at the top.
// forEach is another kind of loop: "for each item in the list, do this".
// Balls removed from the list are no longer drawn, which is why they vanish.
function drawTargets() {
  targets.forEach(function (target) {
    drawCircle(target.x, target.y, target.radius, target.color);
  });
}

// Wipes the screen and draws everything again
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Skip clearRect: the old pictures never get wiped, so the ball leaves a long trail.
  drawTargets();
  drawPaddle();
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}


