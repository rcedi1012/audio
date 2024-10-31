let ratio = 1.6; // 4:3 aspect ratio
let globeScale; // scale factor

let mic;
let volSense = 100;
let volSenseSlider;
let sliderStep = 10;
let vol = 1;
let normVol = 1;

let startAudio = false;

let fft;
let spectrum;
let waveform;

//let worm = new Worm(offset, normVol);
//let offset = globeScale * 0.1;

// Initialize arrays to store previous positions
let prevX = [];
let prevY = [];

// BPM variables
let bassEnergy;
let lastBeatTime = 0;
let bpm = 120; // Set the BPM of the song (can be detected dynamically)
let beatInterval = (60 / bpm) * 1000; // Calculate time between beats in milliseconds
let audioOn = false;
let freqThreshold = 100; // Set the threshold for bass energy 0 is high 200 is low

// Hero variables
let currentHeroY = 0; // Variable to store the current y-position of the hero rectangle
let laserY = 0;
let targetHeroY = 0; // Variable to store the target y-position of the hero rectangle
let lastPosition = -1; // Variable to store the last position (0: top, 1: middle, 2: bottom)
let laserVisible = false; // Variable to track the visibility of the laser rectangle
let laserTimer = 0; // Timer to hide the laser rectangle
let prevHeights = [];
// Initialize colors
let colors = [];
let colorOrder = [];

// Time Scenes
let startTime = 0; // Variable to store the start time of the sketch
let showWormViz = true;

//Images
let tempMouseImage;
let antenna, f1, f2, f3, f4, f5, head;

function preload() {
  tempMouseImage = loadImage("TempMouse.png");
  antenna = loadImage("Antenna.png");
  f1 = loadImage("F1.png");
  f2 = loadImage("F2.png");
  f3 = loadImage("F3.png");
  f4 = loadImage("F4.png");
  f5 = loadImage("F5.png");
  head = loadImage("Head.png");

}

function setup() {
  createCanvas(window.innerWidth, window.innerWidth / ratio);
  globeScale = min(width, height);
  colorMode(HSB);

  height = window.innerHeight;
  width = window.innerWidth;

  getAudioContext().suspend();

  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(mic);

  volSenseSlider = createSlider(0, 200, volSense, sliderStep);
  volSenseSlider.position(10, 10); // Position the slider in the top-left corner

  // Initialize prevHeights array with zeros
  for (let i = 0; i < 10; i++) {
    prevHeights[i] = 0;
  }
  // Initialize colors
  colors = [
    //color(13, 92, 95),   // red
    color(52, 73, 88), // yellow
    color(172, 83, 44), // green
    //color(152, 100, 6),  // black
    color(260, 48, 36), // purple
  ];

  // Initialize color order
  for (let i = 0; i < 10; i++) {
    colorOrder.push(colors[i % colors.length]);
  }
}

function draw() {
  background(152, 100, 6);
  if (startAudio) {
    vol = mic.getLevel();
    spectrum = fft.analyze();
    waveform = fft.waveform();
    volSense = volSenseSlider.value();
    normVol = vol * volSense;
    console.log(vol);

    // Check if 30 seconds have passed
    if (millis() - startTime >= 30000) {
      console.log("30 seconds have passed");
      showWormViz = !showWormViz;
      // Reset the start time
      startTime = millis();
    }

    //mouseHero();
    //waveForm();
    if (showWormViz) {
      wormViz();
    } else {
      mouseHero();
    }
  }
}

function mousePressed() {
  getAudioContext().resume();

  if (!startAudio) {
    mic = new p5.AudioIn();
    fft = new p5.FFT(); // 1, 64
    fft.setInput(mic);

    mic.start();

    startAudio = true;
  }
}

/* function waveForm() {
    if (startAudio) {
        noFill();
        beginShape();
        //stroke(0, 0, 0);
        stroke(20);
        for (let i = 0; i < waveform.length; i++){
          let x = map(i, 0, waveform.length, 0, width);
          let y = map( waveform[i], -1, 1, 0, height);
          vertex(x, y);
        }
        endShape();
    }
} */

function wormViz() {
  if (startAudio) {
    let h = [172, 13, 260];
    let s = [83, 92, 48];
    let b = [44, 95, 36];
    noStroke();

    for (let i = 0; i < waveform.length; i++) {
      // Cycle through the h, s, and b arrays using i % 3
      let index = i % 3;
      fill(h[index], s[index], b[index]);

      // Calculate the target positions
      let targetX = map(i, 0, waveform.length, globeScale * 0.15, width * 1.5);
      let targetY = map(waveform[i], -1, 1, 0, globeScale);

      // Interpolate the positions
      let x = lerp(prevX[i] || targetX, targetX, 0.1);
      let y = lerp(prevY[i] || targetY, targetY, 0.1);

      // Store the current positions for the next frame
      prevX[i] = x;
      prevY[i] = y;
      ellipse(x, y, globeScale * 0.1);
    }
// Define the initial position of the head image
let headX = globeScale * 0.05;
let baseHeadY = globeScale * 0.425; // baseline position for head image

// Calculate the new headY position based on the beat
let beatOffset = map(waveform[0], -1, 1, -globeScale * 0.1, globeScale * 0.1); // scale the offset based on the beat
let headY = baseHeadY + beatOffset;

// Draw the head image with the updated Y position
image(head, headX, headY, globeScale * 0.15, globeScale * 0.15);

    //image();
  }
}

function mouseHero() {
  fft.analyze();
  bassEnergy = fft.getEnergy("bass"); // Low frequency energy
  freqThreshold = volSenseSlider.value(); // Set the threshold for bass energy

  // Check for a beat (if bass energy exceeds a threshold)
  if (
    bassEnergy > freqThreshold &&
    millis() - lastBeatTime > beatInterval * 0.8
  ) {
    lastBeatTime = millis();

    let topPos = 0 + 40;
    let midPos = height / 2 - 40;
    let bottomPos = height - 140;
    let laserPos;
    let newPosition = 0;
    let prevPos = -1;
    do {
      newPosition = floor(random(3)); // Randomly choose 0 (top), 1 (middle), or 2 (bottom)
    } while (newPosition === lastPosition); // Ensure it's not the same as the last position
    prevPos = lastPosition;
    lastPosition = newPosition;

    laserPos = floor(random(2)); // if player in the middle random choose top/ bottom pos

    if (newPosition === 0) {
      targetHeroY = topPos; // Top
      laserTimer = 0;
      if (prevPos !== 2) {
        laserVisible = true;
        laserY = midPos + 30;
      }
    } else if (newPosition === 1) {
      targetHeroY = midPos; // Middle (centered vertically)
      if (laserPos === 0) {
        laserTimer = 0;
        laserVisible = true;
        laserY = topPos + 30;
      } else if (laserPos === 1) {
        laserTimer = 0;
        laserVisible = true;
        laserY = bottomPos + 30;
      }
    } else if (newPosition === 2) {
      targetHeroY = bottomPos; // Bottom
      laserTimer = 0;
      if (prevPos !== 0) {
        laserVisible = true;
        laserY = midPos + 30;
      }
    }

    // Show the laser rectangle and reset the timer
    laserTimer = millis();
  }

  stroke(0, 0, 0);
  strokeWeight(15);
  red = color(13, 92, 95);
  yellow = color(52, 73, 88);
  green = color(172, 83, 44);
  black = color(152, 100, 6);
  purple = color(260, 48, 36);
  //fill(red)
  //rect(0, 0, width / 6, height)
  //rect(width / 6, 0 , width / 6, height)
  //rect((width / 6) * 2, 0, width / 6, height)
  //rect(width - width / 6, 0, width / 6, height)

  let numSkyscrapers = 10; // Number of skyscrapers
  let skyscraperWidth = width / numSkyscrapers; // Width of each skyscraper

  for (let i = 0; i < numSkyscrapers; i++) {
    let scaledWaveform = (waveform[i] * volSense) / 2; // Scale the waveform data by volSense
    let targetHeight = map(scaledWaveform, -1, 1, height / 4, height); // More varied height based on waveform
    let prevHeight = prevHeights[i] || targetHeight; // Use previous height or target height if not available
    let skyscraperHeight = lerp(prevHeight, targetHeight, 0.05); // Interpolate the height

    fill(colorOrder[i]); // Set the fill color
    rect(
      i * skyscraperWidth,
      height - skyscraperHeight,
      skyscraperWidth,
      skyscraperHeight
    );

    prevHeights[i] = skyscraperHeight; // Store the current height for the next frame
  }

  // Cycle colors
  /*  if (laserVisible) {
        lastBeatTime = millis();
        let firstColor = colorOrder.shift();
        colorOrder.push(firstColor);
    } */

  /* fill(0, 0, 10);
        rect(0, 0, width / 2, height / 3); // Top-left panel
        rect(width / 2, 0, width / 2, height / 3); // Top-right panel

        fill(0, 0, 20);
        rect(0, height / 3, width / 3, height / 3); // Middle-left panel
        rect(width / 3, height / 3, width / 3, height / 3); // Middle-center panel
        rect(2 * width / 3, height / 3, width / 3, height / 3); // Middle-right panel

        fill(0, 0, 30);
        rect(0, 2 * height / 3, width / 2, height / 3); // Bottom-left panel
        rect(width / 2, 2 * height / 3, width / 2, height / 3); // Bottom-right panel
 */

  // Smoothly interpolate the current y-position towards the target y-position
  currentHeroY = lerp(currentHeroY, targetHeroY, 0.15);

  strokeWeight(5);
  fill(255); // Set fill color to white for the hero rectangle
  //rect(width / 2.12, currentHeroY, 80, 80); // temp hero rectangle
  image(tempMouseImage, width / 2.5, currentHeroY, 250, 100);

  if (laserVisible) {
    fill(13, 92, 95);
    rect(0, laserY, width, 30); // laser rectangle
  }
  if (millis() - laserTimer > 50) {
    laserVisible = false; // Hide the laser rectangle after
  }
}

//Chisara spectrum
function spectrumF() {
  if (startAudio) {
    for (let i = 0; i < spectrum.length; i++) {
      let rectX = map(i, 0, spectrum.length, 0, width);
      let rectY = height;
      let rectW = globeScale * 0.05;
      let rectH = -map(spectrum[i], 0, 255, 0, height);

      noStroke();
      fill(spectrum[i], 100, 100, 0.1);
      rect(rectX, rectY, rectW, rectH);

      let rectX2 = width - rectX - rectW;
      rect(rectX2, rectY, rectW, rectH);
    }
  }
}

//lerp color for worm line
// or circles
