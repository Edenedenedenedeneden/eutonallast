let backgroundImg, img2024;
let otherTextSongs = [];
let currentImgIndex = 0;
let startRectX = 204;
let startRectY = 505;
let startRectW = 47;
let startRectH = 52;
let currentSong;
let allLoaded = false;
let started = false;
let screenFilled = false; // To track if the screen is filled for the first time
let amp;

let rectSizeFill = 45;
let totalRects;
let startTime;
let lastRectTime = 0;
let currentRectIndex = 0;
let rectColors = []; // Array to store colors of the squares

function preload() {
  // Load images
  backgroundImg = loadImage('bakground no grain.png', checkIfAllLoaded);
  img2024 = loadImage('2024.png', checkIfAllLoaded);

  // Load songs with loaded callback
  otherTextSongs.push(loadSound('hot sunny days.mp3', checkIfAllLoaded));
  otherTextSongs.push(loadSound('sunset.mp3', checkIfAllLoaded));
  otherTextSongs.push(loadSound('sunrise.mp3', checkIfAllLoaded));
}

function setup() {
  createCanvas(1920, 1080); // Fixed canvas size
  textAlign(CENTER, CENTER);
  amp = new p5.Amplitude();

  // Calculate the total number of rectangles needed to fill the screen
  totalRects = Math.ceil(width / rectSizeFill) * Math.ceil(height / rectSizeFill);
  
  // Initialize the rectColors array with null values
  for (let i = 0; i < totalRects; i++) {
    rectColors.push(null);
  }
}

function draw() {
  if (allLoaded) {
    // Display background image
    image(backgroundImg, 0, 0);

    // Draw purple rectangles
    drawRectangles('#6B10C5');

    // Display the '2024.png' image
    image(img2024, 50, 440);

    // Display the initial purple rectangle to start actions behind green rectangles
    if (!started) {
      fill('#690AC7');
      noStroke();
      rect(startRectX, startRectY, startRectW, startRectH);
    }

    // Draw green rectangles
    drawRectangles('#2BB516');

    // Check if the screen is filled
    if (currentRectIndex >= totalRects) {
      screenFilled = true; // Set the screen filled status for the first time
      currentRectIndex = 0; // Reset the index to start replacing squares
    }
  } else {
    background(255);
    fill(0);
    textSize(32);
    text('Loading...', width / 2, height / 2);
  }
}

function drawRectangles(colorFilter) {
  if (started) {
    // Calculate the elapsed time since the song started
    let elapsedTime = millis() - startTime;

    // Check if it's time to draw the next rectangle
    if (elapsedTime - lastRectTime > 42) { // Adjusted this value for faster drawing
      lastRectTime = elapsedTime;
      if (currentRectIndex < totalRects) {
        // Analyze the volume to determine color
        let level = amp.getLevel();
        let color;
        if (random() < 0.5) { // 50% chance to be purple regardless of volume
          color = '#6B10C5';
        } else if (random() < 0.3) { // 30% chance to be green regardless of volume
          color = '#2BB516';
        } else {
          color = level > 0.1 ? '#2BB516' : '#6B10C5'; // Adjust the threshold for sensitivity
        }

        // Update the color in the array
        rectColors[currentRectIndex] = color;

        // Move to the next rectangle
        currentRectIndex++;
      }
    }

    // Redraw all rectangles of the specified color
    for (let i = 0; i < totalRects; i++) {
      if (rectColors[i] === colorFilter) {
        let x = (i % Math.ceil(width / rectSizeFill)) * rectSizeFill;
        let y = Math.floor(i / Math.ceil(width / rectSizeFill)) * rectSizeFill;
        fill(rectColors[i]);
        noStroke(); // Remove the stroke to eliminate gaps
        rect(x, y, rectSizeFill, rectSizeFill);
      }
    }
  }
}

function mousePressed() {
  if (allLoaded) {
    // Check if the initial start rectangle is clicked
    if (!started && mouseX > startRectX && mouseX < startRectX + startRectW && mouseY > startRectY && mouseY < startRectY + startRectH) {
      started = true;
      startTime = millis();
      lastRectTime = 0;
      currentRectIndex = 0;
      resetRectColors();
      console.log("Start rectangle clicked! Actions started.");
      changeSong(currentImgIndex); // Start with the current song
    }
  }
}

function keyPressed() {
  if (allLoaded && started) {
    if (keyCode === LEFT_ARROW) {
      // Change to the previous song in the array (cycling backward)
      changeSong((currentImgIndex - 1 + otherTextSongs.length) % otherTextSongs.length);
      console.log("Left arrow pressed! Changed to the previous song.");
    }

    if (keyCode === RIGHT_ARROW) {
      // Change to the next song in the array (cycling forward)
      changeSong((currentImgIndex + 1) % otherTextSongs.length);
      console.log("Right arrow pressed! Changed to the next song.");
    }
  }
}

function changeSong(newIndex) {
  if (currentSong) {
    currentSong.stop();
  }
  currentImgIndex = newIndex;
  resetDrawing();
  currentSong = otherTextSongs[currentImgIndex];
  currentSong.loop();
  // Reset the drawing process when a new song starts
  resetDrawing();
}

function resetDrawing() {
  startTime = millis();
  lastRectTime = 0;
  currentRectIndex = 0;
  resetRectColors();
  screenFilled = false; // Reset the screen filled status
}

function resetRectColors() {
  for (let i = 0; i < totalRects; i++) {
    rectColors[i] = null;
  }
}

let loadCount = 0;
function checkIfAllLoaded() {
  loadCount++;
  if (loadCount === otherTextSongs.length + 2) { // +2 for the background and '2024' images
    allLoaded = true;
  }
}
