/* class Worm {
    constructor(offset, normVol) {
        this.wormDiameter = globeScale * 0.2;
        this.offsetX = offset;
        this.wormY = wormDiameter * 0.9;
        this.vol = normVol
    }

    show() {
        stroke(0);
        strokeWeight(globeScale * 0.006);
        fill(0,0,0);
        ellipse((width * 0.01) + this.offsetX, this.wormY * this.vol, this.wormDiameter);
    }
} */

function worm() {
    wormDiameter = globeScale * 0.2;
    offsetX = globeScale * 0.1;;
    wormY = wormDiameter * 4.4;

    stroke(0);
    strokeWeight(globeScale * 0.006);
    fill(0,0,100);
    ellipse((width * 0.015) + offsetX, wormY * normVol, wormDiameter);
}