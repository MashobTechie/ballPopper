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


