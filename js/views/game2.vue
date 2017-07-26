<template>
    <div id="game2"></div>
</template>
<script>

    var game;
    class playGame {
        wheel;
        canSpin;
        slices = 8;
        slicePrizes = ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"];
        prize;
        prizeText;
 
        preload(){
            game.load.image("wheel","./static/game2/wheel.png");
            game.load.image("pin","./static/game2/pin.png");
        }
        create(){
            game.stage.backgroundColor = "#880044";
            // game.world.width ?
            this.wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
            this.wheel.anchor.set(0.5);
            let pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
            pin.anchor.set(0.5);
            this.prizeText = game.add.text(game.world.centerX, 480, "");
            this.prizeText.anchor.set(0.5);
            this.prizeText.align = "center";
            this.canSpin = true;
            game.input.onDown.add(this.spin,this);
        }
        spin(){
            if (this.canSpin) {
                this.prizeText.text = "";
                var rounds = game.rnd.between(2, 4);
                var degrees = game.rnd.between(0, 360);
                this.prize = (this.slices - 1 - degrees / (360 / this.slices) ) | 0;
                this.canSpin = false;

                var spinTween = game.add.tween(this.wheel).to({
                    angle: 360 * rounds + degrees
                }, 3000, Phaser.Easing.Quadratic.Out, true);

                spinTween.onComplete.add(this.winPrize, this);
            }
        }
        winPrize(){
            this.canSpin = true;
            this.prizeText.text = this.slicePrizes[this.prize];
        }
    }

    export default {
        mounted(){
            this.$nextTick(()=>{
                game = new Phaser.Game(458,488,Phaser.AUTO,'game2');
                game.state.add("PlayGame",playGame);
                game.state.start("PlayGame");
            })
        }
    }

</script>