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

let bprevX = [];
let bprevY = [];

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
let lastImageChangeTimeMouse = 0; // Variable to keep track of the last image change time
let currentImage = 0; // Variable to store the current image index  (0, 1, 2)
let show1;
let show2;
let show3;
let prevHeights = [];
// Initialize colors
let colors = [];
let colorOrder = [];

// Time Scenes
let startTime = 0; // Variable to store the start time of the sketch
let startTimeW = 0; // Variable to store the start time of the sketch
let showWormViz = true;

//Images
let tempMouseImage;
let Mouse1, Mouse2, Mouse3, Laser;
let antenna, f1, f2, f3, f4, f5, head;
let sf1, sf2, sf3, sf4, sf5;
let c1, c2, c3;

let myCloud;
let myCloud2;

function preload() {
  //tempMouseImage = loadImage("TempMouse.png");
  Mouse1 = loadImage("Mouse1.gif");
  Mouse2 = loadImage("Mouse2.gif");
  Mouse3 = loadImage("Mouse3.gif");
  Laser = loadImage("Laser.png");
  antenna = loadImage("Antenna.png");
  f1 = loadImage("F1.png");
  f2 = loadImage("F2.png");
  f3 = loadImage("F3.png");
  f4 = loadImage("F4.png");
  f5 = loadImage("F5.png");
  head = loadImage("Head.png");
  c1 = loadImage("Cloud 1.png");
  c2 = loadImage("Cloud 2.png");
  c3 = loadImage("Cloud 3.png");
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
  volSenseSlider.id('volSenseSlider');

  // Initialize prevHeights array with zeros
  for (let i = 0; i < 10; i++) {
    prevHeights[i] = 0;
  }
  // Initialize colors
  colors = [
    color(13, 45, 95),   // red 92
    color(52, 40, 88), // yellow 73
    color(172, 45, 44), // green 83
    //color(152, 100, 6),  // black
    color(260, 28, 36), // purple 48
  ];

  // Initialize color order
  for (let i = 0; i < 10; i++) {
    colorOrder.push(colors[i % colors.length]);
  }

  sf1 = true;
  sf2 = false;
  sf3 = false;
  sf4= false;
  sf5 = false;

  lastImageChangeTimeMouse = millis(); // Reset the last image change time

  myCloud = new Cloud(random(window.innerWidth * 0.4, window.innerWidth * 0.1), globeScale * 0.1);
  myCloud2 = new Cloud((window.innerWidth * 0), globeScale * 0.0001)
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
    myCloud.moveX();
    myCloud.display();
    
    myCloud2.moveX();
    myCloud2.display();

     if (showWormViz) {
      bodyviz(-globeScale * 2, -globeScale * 3);
      bodyviz(-globeScale * 2, globeScale * 3);
      wormViz();
    } else {
      bodyviz(-globeScale * 2, -globeScale * 3);
      bodyviz(-globeScale * 2, globeScale * 3);
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


function mouseHero() {
  fft.analyze();
  bassEnergy = fft.getEnergy("bass"); // Low frequency energy
  freqThreshold = volSenseSlider.value(); // Set the threshold for bass energy
  let newPosition = 0;
  let topPos = height * 0.01;
  let midPos = height * 0.5;
  let bottomPos = height * 0.9;
  /* image(Laser, 0, bottomPos + 20, width, 50);
  image(Laser, 0, midPos, width, 50);
  image(Laser, 0, topPos - 20, width, 50); */

  // Check for a beat (if bass energy exceeds a threshold)
  if (
    bassEnergy > freqThreshold &&
    millis() - lastBeatTime > beatInterval * 0.8
  ) {
    lastBeatTime = millis();

    let laserPos;
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
        laserY = midPos; // + 30
      }
    } else if (newPosition === 1) {
      targetHeroY = midPos; // Middle (centered vertically)
      if (laserPos === 0) {
        laserTimer = 0;
        laserVisible = true;
        laserY = topPos; //- 20; // + 30
      } else if (laserPos === 1) {
        laserTimer = 0;
        laserVisible = true;
        laserY = bottomPos; //+ 20; // + 30
      }
    } else if (newPosition === 2) {
      targetHeroY = bottomPos; // Bottom
      laserTimer = 0;
      if (prevPos !== 0) {
        laserVisible = true;
        laserY = midPos; // + 30
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

  let numSkyscrapers = 10; // Number of skyscrapers
  let skyscraperWidth = width / numSkyscrapers; // Width of each skyscraper

  for (let i = 0; i < numSkyscrapers; i++) {
    let scaledWaveform = (waveform[i] * volSense); // Scale the waveform data by volSense
    let targetHeight = map(scaledWaveform, -1, 1, 0, height); // Adjust height mapping to ensure skyscrapers reach the bottom
    let prevHeight = prevHeights[i] || targetHeight; // Use previous height or target height if not available
    let skyscraperHeight = lerp(prevHeight, targetHeight, 0.05); // Interpolate the height

    fill(colorOrder[i % colorOrder.length]); // Set the fill color
    rect(
      i * skyscraperWidth,
      height - skyscraperHeight,
      skyscraperWidth,
      skyscraperHeight
    );

    prevHeights[i] = skyscraperHeight; // Store the current height for the next frame
}

  // Smoothly interpolate the current y-position towards the target y-position
  currentHeroY = lerp(currentHeroY, targetHeroY, 0.2);

  strokeWeight(5);
  fill(255); // Set fill color to white for the hero rectangle
  //rect(width / 2.12, currentHeroY, 80, 80); // temp hero rectangle

  if (laserVisible) {
    fill(13, 92, 95);
    image(Laser, 0, laserY, width, 65);
    //rect(0, laserY, width, 30); // laser rectangle
  }
  if (millis() - laserTimer > 50) {
    laserVisible = false; // Hide the laser rectangle after
  }

  // Check if 5 seconds have passed
    if (millis() - lastImageChangeTimeMouse >= 5000) {
        // Change the image to the next one in the sequence
        currentImage = (currentImage + 1) % 3;  // Cycle through 0, 1, 2
        lastImageChangeTimeMouse = millis();  // Reset the timer
      }

      // Display the current image
      if (currentImage == 0) {
        image(Mouse1, width / 3, currentHeroY, 400, 300);
      } else if (currentImage == 1) {
        image(Mouse2, width / 3, currentHeroY, 400, 300);
      } else if (currentImage == 2) {
        image(Mouse3, width / 3, currentHeroY, 400, 300);
      }

  //image(tempMouseImage, width / 2.5, currentHeroY, 250, 100);

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