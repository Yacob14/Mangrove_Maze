/**
 * Created by Alex on 4/19/2015.
 */
function Lightsource(game, bitmap, map){
    this.game = game;
    this.bitmap = bitmap;
    this.map = map;
    this.overlayIndex = 0;
    this.cycleObject = {};

    this.rVal = 255;
    this.gVal = 255;
    this.bVal = 255;

    this.bitmap = this.game.add.bitmapData(this.map.widthInPixels, this.map.heightInPixels);

    var shadowboxImage = this.game.add.image(0,0,this.bitmap);
    shadowboxImage.blendMode = Phaser.blendModes.MULTIPLY;

}

Lightsource.colorSequence = [ [255,255,255], [242,193,15],[242, 102, 255],[143,36,189], [4, 6, 43] ];

Lightsource.prototype.update = function(ringX, ringY){
    if(this.cycleObject && this.cycleObject.numCycles !== 0){
        this.rVal += this.cycleObject.r;
        this.bVal += this.cycleObject.b;
        this.gVal += this.cycleObject.g;

        this.cycleObject.numCycles--;
    }
    this.bitmap.context.fillStyle = 'rgb(' + this.rVal + ', ' + this.gVal + ', ' + this.bVal + ')';
    //this.bitmap.context.fillRect(this.game.camera.x, this.game.camera.y, this.game.camera.width, this.game.camera.height);
    this.bitmap.context.fillRect(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    /*this.bitmap.context.beginPath();
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.arc(ringX, ringY, 50, 0, Math.PI*2);
    this.bitmap.context.fill();*/
    this.bitmap.dirty = true;
}

Lightsource.prototype.createLightingCycle = function(rPlus, gPlus, bPlus, cycles){
    this.cycleObject = {r: rPlus, g: gPlus, b: bPlus, numCycles: cycles};
}

Lightsource.prototype.createCycleFromNewColor = function(rNew, gNew, bNew, rPlus, gPlus, bPlus, cycles){
    this.rVal = rNew;
    this.gVal = gNew;
    this.bVal = bNew;
    this.cycleObject = {r: rPlus, g: gPlus, b: bPlus, numCycles: cycles};
}
