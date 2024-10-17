let ratio = 1.3333; // 4:3 aspect ratio
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
function setup() {

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);

    getAudioContext().suspend();

    volSenseSlider = createSlider(0, 200, volSense, sliderStep);

}

function draw() {
    background(200, 100, 100, 0.1);
    if (startAudio) {
        vol = mic.getLevel();
        spectrum = fft.analyze();
        waveform = fft.waveform();
        volSense = volSenseSlider.value();
        normVol = vol * volSense;
        console.log(vol);

        waveForm();
        spectrumViz();

    }
    smileyFace();
}

function mousePressed() {
    
    getAudioContext().resume();

    if (!startAudio) {
        mic = new p5.AudioIn();
        fft = new p5.FFT();
        fft.setInput(mic);

        mic.start();
        
        startAudio = true;
    }

}

function waveForm() {
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
}

function spectrumViz() {
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