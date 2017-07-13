<template>
    <div id="game2"></div>
</template>
<script>
    var game;
    game = new Phaser.Game(458,488,Phaser.AUTO,'game2');

    game.state.add("PlayGame",playGame);
    game.state.start("PlayGame");

    class playGame {
        wheel;
        // canSpin
        //slices = 8;
        //slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
        // prize
        // prizeText

        preload(){
            game.load.image("wheel","./images/game2/wheel.png");
            game.load.image("pin","./images/game2/pin.png");
        }
        create(){
            game.stage.backgroundColor = "#880044";
            // game.world.width ?
            this.wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
            this.wheel.anchor.set(0.5);


        }
    }





</script>