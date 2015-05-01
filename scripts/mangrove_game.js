/**
 * Created by Alex on 4/18/2015.
 */
window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
    var cursors;
    var player;
    var objectsGroup;
    var dockSprite;

    var groveLayer;
    var waterLayer;
    var collectionLayer;
    var startBox;

    var currentSpeed;

    var secondsLeft = 180;
    var secDiff = 160;
    var collectedCount = 0;
    var timeText;
    var timer;

    var bitmap;
    var shadowboxImage;
    var colorChange = false;

    var lighting;

    var map;

    function preload () {

        game.load.image('boat', 'Graphics/New_Kayak.png');
        game.load.image('dock', 'Graphics/dock.png');
        game.load.tilemap('testLevel', 'Mangrove_Map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tilesImage', 'Graphics/Mangrove_bg_2X.png');
        game.load.image('win', 'Graphics/YouWin.png');
        game.load.image('lose', 'Graphics/YouLose.png');

        game.load.spritesheet('boat_anim', 'Graphics/Kayak_Person_Sequence2X.png', 128, 128);

        game.load.image('dock', 'Graphics/dock.png');

    }

    function create () {

        game.world.setBounds(-1000, -1000, 2000, 2000);
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = 0x4488cc;

        //Tilemap stuff
        map = this.game.add.tilemap('testLevel');
        map.addTilesetImage('Mangrove Tiles', 'tilesImage');

        this.waterLayer = map.createLayer('Water Layer');
        groveLayer = map.createLayer('Land Layer');
        collectionLayer = map.createLayer('Collection Layer');

        map.setCollisionBetween(1, 500, true, 'Land Layer');

        this.waterLayer.resizeWorld();

        //find certain things in Meta Layer
        map.objects['Meta Layer'].forEach(function(element){
            if (element.name = "Start")
                startBox = element;
        });

        objectsGroup = game.add.group()

        //object sprites
        dockSprite = game.add.sprite(startBox.x, startBox.y, 'dock', objectsGroup);//(2684 + 175, 288, 'dock');
        dockSprite.rotation = (Math.PI * 3/2);

        //player sprite
        player = game.add.sprite(startBox.x, startBox.y, 'boat_anim'); //(-2000, 288, 'boat_anim');
        player.anchor.setTo(.5,.5);

        //player animation
        player.animations.add('forward', [0, 1, 2, 3, 4, 5], 10, true);
        player.animations.add('right', [0, 1, 2], 10, true);
        player.animations.add('left', [3, 4, 5], 10, true);

        //physics
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        game.physics.arcade.enable(dockSprite);
        dockSprite.body.immovable = true;

        //draw kayak above all of the tiles.
        player.bringToTop();

        //camera stuff
        game.camera.follow(player);
        game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
        game.camera.focusOnXY(0, 0);

        cursors = game.input.keyboard.createCursorKeys();

        //timer stuff
        timer = game.time.create(false);
        timer.loop(1000, function(){if (secondsLeft > 0) secondsLeft--;}, this);
        timer.start();

        //lighting
        lighting = new Lightsource(game, bitmap, map);

        //


    }

    function update(){

        if (secondsLeft <= 0){
            game.add.sprite(game.camera.x, game.camera.y, 'lose');
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            timer.stop();
        }
        else if (collectedCount === 6){
            game.add.sprite(game.camera.x, game.camera.y, 'win');
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            timer.stop();
        }

        else{
            game.physics.arcade.collide(player, groveLayer);
            game.physics.arcade.collide(player, dockSprite);

            player.body.velocity.x = 0;
            player.body.velocity.y = 0;

            var pickedTile = map.removeTileWorldXY(player.x, player.y, 128, 128, 'Collection Layer');
            if (pickedTile && pickedTile.properties.collectable === "egg")
                collectedCount++;

            dayNightCycle();

            //player controls
            if (cursors.left.isDown) {
                player.angle -= 4;
                player.animations.play('left');
            }
            else if (cursors.right.isDown) {
                player.angle += 4;
                player.animations.play('right');
            }

            if (cursors.up.isDown) {
                currentSpeed = 300;
                player.animations.play('forward');
            }
            else {
                currentSpeed = 0;
                if (cursors.left.isUp && cursors.right.isUp)
                    player.animations.stop();
            }

            if (currentSpeed > 0) {
                game.physics.arcade.velocityFromRotation(player.rotation, currentSpeed, player.body.velocity);
            }
        }
    }

    function render(){
        game.debug.text('Time Left: ' + secondsLeft, 32, 32);
        game.debug.text('Items collected: ' + collectedCount + '/6', 32, 64);
        //game.debug.text("" + lighting.rVal + " " + lighting.gVal + " " + lighting.bVal, 32, 96);
        //game.debug.inputInfo(32, 96);

    }

    function dayNightCycle(){
        if (secondsLeft <= 50){
            if (colorChange){
                secDiff = 50;
                lighting.createCycleFromNewColor(242, 102, 245, -20, -5, -15, 15);
                colorChange = false;
            }
            if (secDiff - secondsLeft >= 2){
                lighting.update(0,0);
                secDiff = secondsLeft
            }
        }

        else if (secondsLeft <= 120){
            if (!colorChange){
                lighting.createLightingCycle(-3, -15, -30, 10);
                colorChange = true;
            }
            if (secDiff - secondsLeft >= 2){
                lighting.update(0, 0);
                secDiff = secondsLeft;
            }
        }
    }

}