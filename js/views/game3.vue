<template>
    <div id="game3"></div>
</template>

<script type="text/javascript">
    export default {
        data(){
            return {
                game: null,
                ball: null,
                paddle: null,
                bricks: null,
                ballOnPaddle: true,
                lives: 3,
                score: 0,
                scoreText: null,
                livesText: null,
                introText: null,
                s: null
            }
        },
        methods: {
            preload(){
                this.game.load.atlas('breakout', './static/game3/breakout.png', './static/game3/breakout.json');
                this.game.load.image('starfield', './static/game3/starfield.jpg');
            },
            create(){
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.physics.arcade.checkCollision.down = false;
                this.s = this.game.add.tileSprite(0,0,800,600,'starfield');
                this.bricks = this.game.add.group();
                this.bricks.enableBody = true;
                this.bricks.physicsBodyType = Phaser.Physics.ARCADE;
                for (var j = 0; j < 4; j++) {
                    for (var i = 0; i < 15; i++) {
                        let x = 120 + (i * 36);
                        let y = 100 + (j * 52);
                        let brick = this.bricks.create(x, y, 'breakout', `brick_${j+1}_1.png`);
                        brick.body.bounce.set(1);
                        brick.body.immovable = true;
                    }
                }
                this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout', 'paddle_big.png');
                this.paddle.anchor.setTo(0.5,0.5);
                
                this.game.physics.enable(this.paddle,Phaser.Physics.ARCADE);

                this.paddle.body.collideWorldBounds = true;
                this.paddle.body.bounce.set(1);
                this.paddle.body.immovable = true;

                this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 'breakout', 'ball_1.png');
                this.ball.anchor.set(0.5);
                this.ball.checkWorldBounds = true;

                this.game.physics.enable(this.ball,Phaser.Physics.ARCADE);
                this.ball.body.collideWorldBounds = true;
                this.ball.body.bounce.set(1);

                this.ball.animations.add('spin', ['ball_1.png','ball_2.png','ball_3.png','ball_4.png','ball_5.png'],50,true,false);
                this.ball.events.onOutOfBounds.add(this.ballLost, this);

                this.scoreText = this.game.add.text(32, 550, 'score: 0',{font:"20px",fill:"#ffffff",align:"left"});
                this.livesText = this.game.add.text(680, 550, 'lives: 3',{font:"20px",fill:"#ffffff",align:"left"});
                this.introText = this.game.add.text(this.game.world.centerX, 400, '- click to start -',{font:"40px", fill:"#ffffff",align:"center"});
                this.introText.anchor.setTo(0.5,0.5);

                this.game.input.onDown.add(this.releaseBall, this);
            },
            update(){
                this.s.tilePosition.x += (this.game.input.speed.x / 2);

                this.paddle.x = this.game.input.x;

                if (this.paddle.x < 24) {
                    this.paddle.x = 24;
                }else if(this.paddle.x > this.game.width - 24){
                    this.paddle.x = this.game.width - 24;
                }

                if (this.ballOnPaddle) {
                    this.ball.body.x = this.paddle.x;
                }else{
                    this.game.physics.arcade.collide(this.ball,this.paddle,this.ballHitPaddle,null,this);
                    this.game.physics.arcade.collide(this.ball,this.bricks,this.ballHitBrick,null,this);
                }

            },
            releaseBall(){
                if (this.ballOnPaddle) {
                    this.ballOnPaddle = false;
                    this.ball.body.velocity.y = -300;
                    this.ball.body.velocity.x = -75;
                    this.ball.animations.play('spin');
                    this.introText.visible = false;
                }
            },
            ballLost(){
                this.lives--;
                this.livesText.text = 'lives: ' + this.lives;
                if (this.lives === 0) {
                    this.gameOver();
                }else{
                    this.ballOnPaddle = true;
                    this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
                    this.ball.animations.stop();
                }
            },
            gameOver(){
                this.ball.body.velocity.setTo(0,0);
                this.introText.text = 'Game Over!';
                this.introText.visible = true;
            },
            ballHitBrick(_ball,_brick){
                _brick.kill();
                this.score += 10;
                this.scoreText.text = 'score: ' + this.score;
                if (this.bricks.countLiving() == 0) {
                    this.score += 1000;
                    this.scoreText.text = 'score: ' + this.score;
                    this.introText.text = '- Next Level -';

                    this.ballOnPaddle = true;
                    this.ball.body.velocity.set(0);
                    this.ball.x = this.paddle.x + 16;
                    this.ball.y = this.paddle.y - 16;
                    this.ball.animations.stop();

                    this.bricks.callAll('revive');

                }
            },
            ballHitPaddle(_ball,_paddle){
                let diff = _ball.x - _paddle.x;
                if (diff != 0) {
                    _ball.body.velocity.x = (10 * diff);
                }else{
                    _ball.body.velocity.x = 2 + (Math.random()*8|0);
                }
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.game = new Phaser.Game(800,600,Phaser.AUTO,'game3',{preload:this.preload,create:this.create,update:this.update});
            });
        }
    }
</script>
