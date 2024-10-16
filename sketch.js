let ratio = 1.3333; // 4:3 aspect ratio
let globeScale; // scale factor

let mic;
let volSense = 200;
let volSenseSlider;
let vol = 1;
let normVol = 1;

let startAudio = false;

function setup() {

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);

    getAudioContext().suspend();

    volSenseSlider = createSlider(0, 200, 100);

}

function draw() {
    if (startAudio) {
        vol = mic.getLevel();
        normVol = vol * volSense;
        console.log(vol);
    }

    background(200, 100, 100);
    smileyFace();
}

function mousePressed() {
    
    getAudioContext().resume();

    if (!startAudio) {
        mic = new p5.AudioIn();
        mic.start();
        startAudio = true;
    }

}