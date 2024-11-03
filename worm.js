function wormViz() {
    if (startAudio) {
      let h = [172, 13, 260];
      let s = [83, 92, 48];
      let b = [44, 95, 36];
      let faces = [f1, f2, f3, f4, f5];
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
  let beatOffset = map(waveform[0], -1, 1, -globeScale * 0.2, globeScale * 0.2); // scale the offset based on the beat
  let targetHeadY = baseHeadY + beatOffset;

  let headY = lerp(baseHeadY, targetHeadY, 0.1);
  
  // Draw the head image with the updated Y position
  image(head, headX, headY, globeScale * 0.15, globeScale * 0.15);
  image(faces[1], headX, headY, globeScale * 0.15, globeScale * 0.15);
  
      //image();
    }
  }