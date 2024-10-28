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

function setup() {

    createCanvas(window.innerWidth, window.innerWidth / ratio);
    globeScale = min(width, height);
    colorMode(HSB);

    getAudioContext().suspend();

    volSenseSlider = createSlider(0, 200, volSense, sliderStep);
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
}

function mousePressed() {
    
    getAudioContext().resume();

    if (!startAudio) {
        mic = new p5.AudioIn();
        fft = new p5.FFT(1, 64);
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
    let wormDiameter = globeScale * 0.01;
    let offsetX = 0;
    //let wormY = wormDiameter * 4.4;

    if (startAudio) {
        for (let i = 0; i < spectrum.length; i++) {
            stroke(0);
            strokeWeight(globeScale * 0.006);
            fill(0,0,100);
            

            let rectX = map(i, 0, spectrum.length, 0, width);
            let rectY = height;
            let rectW = globeScale * 0.5;
            let targetRectH = map(spectrum[i], 0, 255, 0, height);
            let rectH = lerp(targetRectH, globeScale * 0.1, 0.02);

            ellipse((width * 0.015) + offsetX, rectH, wormDiameter);
            //currentHeroY = lerp(currentHeroY, targetHeroY, 0.2);
            //ellipse(rectX, rectH, rectW);
            offsetX += globeScale * 0.002;
            //let rectH2 = map(spectrum[i], 0, 255, height, 0);
            //ellipse((width * 0.015) + offsetX, rectH2, wormDiameter);
        }


        noFill();
        beginShape();
        strokeWeight(globeScale * 0.1);
        let colors = ['172, 83, 44','13, 92, 95','260, 48, 36'];
        for (let i = 0; i < waveform.length; i++) {
          if (i % 2 == 0) {
            stroke(colors[1]); 
          }
          else if(i % 2 == 1) {
            stroke(colors[2]);
          }
          else if (i % 2 == 2) {
            stroke(colors[3]);
          }
            
          let x = map(i, 0, waveform.length, globeScale * 0.04, width);
          let y = map( waveform[i], -1, 1, 0, height);
          vertex(x,y);
        }
        endShape();

    

        
    }
}