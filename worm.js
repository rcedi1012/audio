// Declare antennaAngle globally to persist across frames
let antennaAngle = 0;

function wormViz() {
  if (startAudio) {
    stroke(0, 0, 0);
    strokeWeight(15);
    red = color(13, 92, 95, 50);
    yellow = color(52, 73, 88);
    green = color(172, 83, 44);
    black = color(152, 100, 6);
    purple = color(260, 48, 36);
  
    let numSkyscrapers = 10; // Number of skyscrapers
    let skyscraperWidth = width / numSkyscrapers; // Width of each skyscraper
  
    for (let i = 0; i < numSkyscrapers; i++) {
      let scaledWaveform = (waveform[i] * volSense) / 4; // Scale the waveform data by volSense
      let targetHeight = map(scaledWaveform, -1, 1, 0, height); // Adjust height mapping to ensure skyscrapers reach the bottom
      let prevHeight = prevHeights[i] || targetHeight; // Use previous height or target height if not available
      let skyscraperHeight = lerp(prevHeight, targetHeight, 0.1); // Interpolate the height
  
      fill(colorOrder[i % colorOrder.length]); // Set the fill color
      rect(
        i * skyscraperWidth,
        height - skyscraperHeight,
        skyscraperWidth,
        skyscraperHeight
      );
  
      prevHeights[i] = skyscraperHeight; // Store the current height for the next frame
  }
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

    if (millis() - startTimeW >= 6000) {
        console.log("6 seconds have passed");
        let randFace = floor(random(1, 6));
        sf1 = randFace === 1;
        sf2 = randFace === 2;
        sf3 = randFace === 3;
        sf4 = randFace === 4;
        sf5 = randFace === 5;
        startTimeW = millis();
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
    drawingContext.shadowColor = color(13, 92, 95);
    drawingContext.shadowBlur = 12;
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

function bodyviz(xOffset, yOffset) { // Add xOffset and yOffset as parameters
    if (startAudio) {
        let h = [172, 13, 260];
        let s = [83, 92, 48];
        let b = [44, 95, 36];
        noStroke();
    
        for (let i = 0; i < waveform.length; i++) {
            let index = i % 3;
            fill(h[index], s[index], b[index]);
    
            // Map values to create target positions and add xOffset, yOffset for positioning
            let btargetX = map(i, 0, waveform.length, 0, width * 1.5) + xOffset;
            let btargetY = map(waveform[i], -1, 1, 0, globeScale) + yOffset;

            // Interpolate positions
            let bx = lerp(prevX[i] || btargetX, btargetX, 0.1);
            let by = lerp(prevY[i] || btargetY, btargetY, 0.1);
    
            // Store current positions for the next frame
            bprevX[i] = bx;
            bprevY[i] = by;

            // Draw the ellipse
            ellipse(bx, by, globeScale * 0.1);
        }
    }
}
