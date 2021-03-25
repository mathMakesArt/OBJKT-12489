// GLOBAL VARIABLES
// Manual Input
var inputString = "tz1gsrd3CfZv4BfPnYKq5pKpHGFVdtGCgd71"

//Hard Coded
var backgroundColor = 255;
var totalWidth = 960;
var totalHeight = 960;
var numRows = 16;
var numCols = 16;
var grid = [];

// Computed
var cellWidth = Math.floor(totalWidth / numCols);
var cellHeight = Math.floor(totalHeight / numRows);



// Returns true for valid characters and false for invalid characters
// In this program, a "valid" character exists in the standard base64 digits
function isValidChar(charIn) {
  var charCodeIn = charIn.charCodeAt();
  if (((charCodeIn >= 65) && (charCodeIn <= 90)) ||  // 'A'-'Z'
      ((charCodeIn >= 97) && (charCodeIn <= 122)) || // 'a'-'z'
      ((charCodeIn >= 48) && (charCodeIn <= 57)) ||  // '0'-'9'
      (charCodeIn == 43) ||                          // '+'
      (charCodeIn == 47)) {                          // '/'
    return true;
  }
  return false;
}


function sanitizeString(stringIn) {
  // Performs replacements for characters with defined 1:1 pairs
  let stringOut = stringIn;
  stringOut = stringOut.replace(".", "/+");
  stringOut = stringOut.replace(" ", "+");
  stringOut = stringOut.replace("\n", "/n");

  // Removes unrecognized characters by replacing with "//"
  let inputLength = stringOut.length;
  let arrayOut = []
  for (var i = 0; i < inputLength; i++) {
    let currentInt = charToInt(stringOut[i]);
    if (currentInt == -1) {
      arrayOut.push(63)
      arrayOut.push(63)
    }
    else {
      arrayOut.push(currentInt)
    }
  }

  // Returns the sanitized string as an array of base64 values
  return arrayOut;
}


// Essentially an extended version of isValidChar() which:
//  - Returns "-1" for non-base64 characters (instead of false)
//  - Returns the [0, 63] base64 value for valid characters (instead of true)
function charToInt(charIn) {
  var charCodeIn = charIn.charCodeAt();

  // 'A' through 'Z'
  if ((charCodeIn >= 65) && (charCodeIn <= 90)) {
    return charCodeIn - 65;
  }
  // 'a' through 'z'
  else if ((charCodeIn >= 97) && (charCodeIn <= 122)) {
    return charCodeIn - 71;
  }
  // '0' through '9'
  else if ((charCodeIn >= 48) && (charCodeIn <= 57)) {
    return charCodeIn + 4;
  }
  // '+'
  else if (charCodeIn == 43) {
    return 62
  }
  // '/'
  else if (charCodeIn == 47) {
    return 63
  }
  else {
    return -1
  }
}


// Converts a base64 integer into an RGB color where:
//  - The two most significant bits (32 and 16) determine the R intensity
//  - The next two bits (8 and 4) determine the G intensity
//  - The two least significant bits (2 and 1) determine the B intensity
//  - Final [0, 3] values are multipled by 85.0 to achieve [0, 255] scaling
// Will fail if given an integer with a value outside of [0, 63] inclusive
function intToColorArr(intIn) {
  if ((intIn < 0) || (intIn > 63)) {
    error("function intoToColorArr(intIn) called with invalid integer");
  }
  let rVal = floor(intIn / 16);
  let gVal = floor((intIn % 16) / 4);
  let bVal = intIn % 4;
  return [rVal * 85, gVal * 85, bVal * 85];
}


function setup() {
  // put setup code here
  colorMode(RGB, 255); // Sets the color interpretation mode
  rectMode(CORNER); // Sets the rectangle interpretation mode
  createCanvas(960, 960);
  textAlign(CENTER, CENTER);

  // Computes sanitized version of the input string
  var stringArr = sanitizeString(inputString);
  var stringArrLength = stringArr.length;

  // Initializes the count as 0
  var currentCount = 0;

  // Construct the grid and fill with colors pertaining to each integer in stringArr
  for (var y = 0; y < numRows; y++) {
    // Push a new empty (row) array into the grid
    grid.push([]);

    // loop through all cells of the current row
    for (var x = 0; x < numCols; x++) {
      // Push a new empty (cell) array into the current row of the grid
      grid[y].push([]);
      // Get the integer associated with the character at currentCount, and convert it to a color
      grid[y][x] = intToColorArr(stringArr[currentCount % stringArrLength]);
      // Increment currentCount
      currentCount++;
    }
  }
}


function draw() {
  // put drawing code here
  background(backgroundColor);

  // Initializes the count as 0
  var currentCount = 0;

  // loop through all rows in the grid
  for (var y = 0; y < numRows; y++) {

    // loop through all cells of the current row
    for (var x = 0; x < numCols; x++) {
      // Get the color associated with the current grid position
      currentColor = color(Math.floor(grid[y][x][0]), Math.floor(grid[y][x][1]), Math.floor(grid[y][x][2]));

      // Determine proper drawing position and draw a rectangle
      currentScreenX = x * cellWidth;
      currentScreenY = y * cellHeight;
      fill(currentColor);
      noStroke();
      rect(currentScreenX, currentScreenY, cellWidth, cellHeight);

      // Increment currentCount
      currentCount++;
    }
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}