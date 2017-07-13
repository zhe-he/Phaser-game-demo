<template>
    <div id="game1"></div>
</template>
<script>
    var platforms;
    var player;
    var cursors;
    var stars;
    var score = 0;
    var scoreText;
    var lives;
    var bad;
    var game = new Phaser.Game(800,600,Phaser.AUTO,'',{preload,create,update});

    function preload(){
        game.load.image('sky', 'images/game1/sky.png');
        game.load.image('ground', 'images/game1/platform.png');  
        game.load.image('star', 'images/game1/star.png');
        game.load.image('villain', 'images/game1/firstaid.png');
        game.load.spritesheet('dude', 'images/game1/dude.png', 32, 48);
        game.load.spritesheet('baddie', 'images/game1/baddie.png', 32, 32); 
    }
    function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // bg
        game.add.sprite(0,0,'sky');

        // platform
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0,game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        // stars
        stars = game.add.group();
        stars.enableBody = true;
        for (var i = 0; i < 12; ++i) {
            let star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 40;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        // score
        scoreText = game.add.text(16,16,'Score: 0',{fontSize: '32px', fill: '#fff'});

        // lives
        lives = game.add.group();
        game.add.text(game.world.width - 100, 16, '');
        for (i = 0; i < 3; ++i) {
            let villain = lives.create(game.world.width - 100 + i * 32, 16, 'villain');
            villain.alpha = 0.8;
        }

        // bad
        bad = game.add.group();
        bad.enableBody = true;
        bad.physicsBodyType = Phaser.Physics.ARCADE;
        createBaddie();

        // player
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        
        // cursors
        cursors = game.input.keyboard.createCursorKeys();
    }
    function update(){
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(bad, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(player, bad, playerDie, null, this);

        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
            player.animations.play('left');
        }else if(cursors.right.isDown) {
            player.body.velocity.x = 150;
            player.animations.play('right');
        }else{
            player.animations.stop();
            player.frame = 4;
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
        }

        let baddie = bad.getFirstAlive();
        if (baddie.body.touching.down) {
            baddie.body.velocity.x = 150;
            baddie.animations.play('right');
            
        }
        
    }

    function createBaddie(){
        for (var i = 0; i < 2; ++i) {
            let baddie = bad.create(100 + i * 400, 0, 'baddie');
            baddie.body.bounce.y = 0.2;
            baddie.body.gravity.y = 300;
            baddie.body.collideWorldBounds = true;
            baddie.anchor.setTo(0.5, 0.5);
            baddie.animations.add('left', [0, 1], 5, true);
            baddie.animations.add('right', [2, 3], 5, true);
            
        }
    }
    function collectStar(player,star){
        star.kill();
        score += 10;
        scoreText.text = 'Score: ' + score;
    }
    function playerDie(){
        let live = lives.getFirstAlive();
        if (live){
            live.kill();
        }
    }   
</script>