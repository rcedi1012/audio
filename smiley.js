function smileyFace() {
    let faceDiameter = globeScale * 0.8;
    let eyeDiameter = faceDiameter * 0.1;
    let eyeOffsetX = faceDiameter * 0.2;
    let eyeOffsetY = faceDiameter * 0.15;
    let mouthWidth = faceDiameter * 0.5;
    let mouthHeight = faceDiameter * 0.08;
    let mouthY = height / 2.1 + eyeOffsetY;
    let mouthX = width / 2;

    stroke(0);
    strokeWeight(globeScale * 0.02);

    // Draw face
    fill(60, 100, 100);
    ellipse(width / 2, height / 2, faceDiameter);

    // Draw eyes
    fill(0, 0, 0);
    ellipse(width / 2 - eyeOffsetX, height / 2 - eyeOffsetY, eyeDiameter);
    ellipse(width / 2 + eyeOffsetX, height / 2 - eyeOffsetY, eyeDiameter);

    // Draw mouth
    stroke(0, 0, 0);
    strokeWeight(4);
    arc(mouthX, mouthY, mouthWidth, mouthHeight * normVol, 0, PI, CHORD);
}