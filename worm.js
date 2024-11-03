// Declare antennaAngle globally to persist across frames
let antennaAngle = 0;

function wormViz() {
  if (startAudio) {
    let h = [172, 13, 260];
    let s = [83, 92, 48];
    let b = [44, 95, 36];
    noStroke();

    // Define the initial position of the head image
    let headX = globeScale * 0.05;
    let baseHeadY = globeScale * 0.425; // baseline position for head image

    // Calculate the new headY position based on the beat
    let beatOffset = map(
        waveform[0],
        -1,
        1,
        -globeScale * 0.2,
        globeScale * 0.2
    );
    let targetHeadY = baseHeadY + beatOffset;
    let headY = lerp(baseHeadY, targetHeadY, 0.1);

    for (let i = 0; i < waveform.length; i++) {
      let index = i % 3;
      fill(h[index], s[index], b[index]);

      let targetX = map(i, 0, waveform.length, globeScale * 0.15, width * 1.5);
      let targetY = map(waveform[i], -1, 1, 0, globeScale);
      let x = lerp(prevX[i] || targetX, targetX, 0.1);
      let y = lerp(prevY[i] || targetY, targetY, 0.1);

      prevX[i] = x;
      prevY[i] = y;
      ellipse(x, y, globeScale * 0.1);
    }

    antennaMove();

    image(head, headX, headY, globeScale * 0.15, globeScale * 0.15);

    if (millis() - startTime >= 6000) {
        console.log("6 seconds have passed");
        let randFace = floor(random(1, 6));
        sf1 = randFace === 1;
        sf2 = randFace === 2;
        sf3 = randFace === 3;
        sf4 = randFace === 4;
        sf5 = randFace === 5;
        startTime = millis();
    }
    if (sf1) image(f1, headX + globeScale * 0.01, headY + globeScale * 0.01, globeScale * 0.12, globeScale * 0.12);
    else if (sf2) image(f2, headX + globeScale * 0.01, headY + globeScale * 0.01, globeScale * 0.12, globeScale * 0.12);
    else if (sf3) image(f3, headX + globeScale * 0.01, headY + globeScale * 0.01, globeScale * 0.12, globeScale * 0.12);
    else if (sf4) image(f4, headX + globeScale * 0.01, headY + globeScale * 0.01, globeScale * 0.12, globeScale * 0.12);
    else if (sf5) image(f5, headX + globeScale * 0.02, headY + globeScale * 0.03, globeScale * 0.10, globeScale * 0.10);
  }
}

function antennaMove() {
    push();
    translate(globeScale * 0.12, globeScale * 0.44); // Center rotation on antenna position
    
    // Map the waveform to an angle range
    let beatOffset = map(waveform[0], -1, 1, -radians(180), radians(180));
    let targetAntennaAngle = beatOffset;
    //let baseAntennaAngle = radians(90);
    
    // LERP to smoothly update antenna angle
    antennaAngle = lerp(antennaAngle, targetAntennaAngle, 0.1);
    
    rotate(antennaAngle);
    image(antenna, 0 - globeScale * 0.07, 0 - globeScale * 0.08, globeScale * 0.10, globeScale * 0.10);
    ellipse(0,0,5);
    pop();
}

