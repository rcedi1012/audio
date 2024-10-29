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


function setup() {

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);

    height = window.innerHeight / ratio;
    width = window.innerWidth;

    getAudioContext().suspend();

    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    volSenseSlider = createSlider(0, 200, volSense, sliderStep);
    volSenseSlider.position(10, 10); // Position the slider in the top-left corner
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

        //waveForm();
        wormViz();

    }
    // hero code
    /* if (audioOn) {
        fft.analyze();
        bassEnergy = fft.getEnergy("bass"); // Low frequency energy
        freqThreshold = volSenseSlider.value(); // Set the threshold for bass energy

        // Check for a beat (if bass energy exceeds a threshold)
        if (bassEnergy > freqThreshold && millis() - lastBeatTime > beatInterval * 0.8) {
            lastBeatTime = millis();

            let topPos = 0 + 10;
            let midPos = height / 2 - 40;
            let bottomPos = height - 90;
            let laserPos;
            let newPosition;
                do {
                    newPosition = floor(random(3)); // Randomly choose 0 (top), 1 (middle), or 2 (bottom)
                } while (newPosition === lastPosition); // Ensure it's not the same as the last position
                lastPosition = newPosition;

                laserPos = floor(random(2)); // if player in the middle random choose top/ bottom pos

                // Set the target y-position based on the new position
                if (newPosition === 0) {
                    targetHeroY = topPos; // Top
                    laserTimer = 0;
                    laserY = midPos + 30;
                } else if (newPosition === 1) {
                    targetHeroY = midPos; // Middle (centered vertically)
                    if (laserPos === 0) {
                        laserTimer = 0;
                        laserY = topPos + 30;
                    }
                    else if (laserPos === 1) {
                        laserTimer = 0;
                        laserY = bottomPos + 30;
                        }
                } else if (newPosition === 2) {
                    targetHeroY = bottomPos; // Bottom
                    laserTimer = 0;
                    laserY = midPos + 30;
                }

            // Show the laser rectangle and reset the timer
            laserVisible = true;
            laserTimer = millis();
     }


       stroke(0,0,0);
       strokeWeight(5);

       fill(0, 0, 10);
        rect(0, 0, width / 2, height / 3); // Top-left panel
        rect(width / 2, 0, width / 2, height / 3); // Top-right panel

        fill(0, 0, 20);
        rect(0, height / 3, width / 3, height / 3); // Middle-left panel
        rect(width / 3, height / 3, width / 3, height / 3); // Middle-center panel
        rect(2 * width / 3, height / 3, width / 3, height / 3); // Middle-right panel

        fill(0, 0, 30);
        rect(0, 2 * height / 3, width / 2, height / 3); // Bottom-left panel
        rect(width / 2, 2 * height / 3, width / 2, height / 3); // Bottom-right panel


        // Smoothly interpolate the current y-position towards the target y-position
        currentHeroY = lerp(currentHeroY, targetHeroY, 0.2);

        fill(255); // Set fill color to white for the hero rectangle
        rect(width / 2.2, currentHeroY, 80, 80); // hero rectangle

        if (laserVisible) {
            rect(0, laserY, width, 30); // laser rectangle
        }
        if (millis() - laserTimer > 200) {
            laserVisible = false; // Hide the laser rectangle after
        }
    } */
}

function mousePressed() {

    getAudioContext().resume();

    if (!startAudio) {
        mic = new p5.AudioIn();
        fft = new p5.FFT();
        fft.setInput(mic);

        mic.start();

        startAudio = true;

    audioOn = true;
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
    let wormDiameter = globeScale * 0.2;
    let offsetX = globeScale * 0.1;;
    //let wormY = wormDiameter * 4.4;

    if (startAudio) {
        for (let i = 0; i < spectrum.length; i++) {
            stroke(0);
            strokeWeight(globeScale * 0.006);
            fill(0,0,100);

            let rectX = map(i, 0, spectrum.length, 0, width);
            let rectY = height;
            let rectW = globeScale * 0.05;
            let rectH = map(spectrum[i], 0, 255, 0, height);

            ellipse((width * 0.015) + offsetX, rectH, wormDiameter);
            //currentHeroY = lerp(currentHeroY, targetHeroY, 0.2);
            //ellipse(rectX, rectH, rectW);
            offsetX += globeScale * 0.2;
            let rectH2 = map(spectrum[i], 0, 255, height, 0);
            ellipse((width * 0.015) + offsetX, rectH2, wormDiameter);
        }




    }
}

function spectrumF(){
    if(startAudio){
        for(let i = 0; i < spectrum.length; i++){

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