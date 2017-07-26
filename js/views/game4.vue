<template>
    <div id="game4"></div>
</template>
<script type="text/javascript">
    export default {
        data(){
            return {
                game: null,
                map: null,
                tileset: null,
                layer: null,
                player: null,
                facing: 'left',
                jumpTimer: 9,
                cursors: null,
                jumpButton: null,
                bg: null
            }
        },
        mounted(){
            this.$nextTick(()=>{
                this.game = new Phaser.Game(800,600,Phaser.CANVAS,'game4',{preload:this.preload,create:this.create,update:this.update,render:this.render});
            });
        },
        methods: {
            preload(){
                this.game.load.tilemap('level1','./static/game4/level1.json',null, Phaser.Tilemap.TILED_JSON);
                this.game.load.image('tiles-1','./static/game4/tiles-1.png');
                this.game.load.spritesheet('dude','./static/game4/dude.png',32,48);
                this.game.load.spritesheet('droid','./static/game4/droid.png',32,32);
                this.game.load.image('starSmall','./static/game4/star.png');
                this.game.load.image('starBig','./static/game4/star2.png');
                this.game.load.image('background','./static/game4/background2.png');
            },
            update(){
                this.game.physics.arcade.collide(this.player,this.layer);
                this.player.body.velocity.x = 0;
                if (this.cursors.left.isDown) {
                    this.player.body.velocity.x = -150;

                    if (this.facing != 'left') {
                        this.player.animations.play('left');
                        this.facing = 'left';
                    }
                }else if(this.cursors.right.isDown){
                    this.player.body.velocity.x = 150;
                    if (this.facing != 'right') {
                        this.player.animations.play('right');
                        this.facing = 'right';
                    }
                }else{
                    if (this.facing != 'idle') {
                        this.player.animations.stop();
                        this.player.frame = this.facing == 'left' ? 0 : 5;

                        this.facing = 'idle';
                    }
                }

                if (this.jumpButton.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer) {
                    this.player.body.velocity.y = -250;
                    this.jumpTimer = this.game.time.now + 750;
                }
            },
            create(){
                this.game.physics.startSystem(Phaser.Physics.ARCADE);
                this.game.stage.backgroundColor = "#000000";
                this.bg = this.game.add.tileSprite(0,0,800,600,'background');
                this.bg.fixedToCamera = true;

                this.map = this.game.add.tilemap('level1');
                this.map.addTilesetImage('tiles-1');
                this.map.setCollisionByExclusion([13,14,15,16,46,47,48,49,50,51]);
                
                this.layer = this.map.createLayer('Tile Layer 1');
                this.layer.resizeWorld();

                this.game.physics.arcade.gravity.y = 250;
                this.player = this.game.add.sprite(32,32,'dude');
                this.game.physics.enable(this.player,Phaser.Physics.ARCADE);

                this.player.body.bounce.y = 0.2;
                this.player.body.collideWorldBounds = true;
                this.player.body.setSize(20,32,5,16);

                this.player.animations.add('left',[0,1,2,3],10,true);
                this.player.animations.add('turn',[4],20,true);
                this.player.animations.add('right',[5,6,7,8],10,true);

                this.game.camera.follow(this.player);

                this.cursors = this.game.input.keyboard.createCursorKeys();
                this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            },
            render(){
                // this.game.debug.text(this.game.time.physicsElapsed, 32, 32);
                // this.game.debug.body(this.player);
                // this.game.debug.bodyInfo(this.player, 16, 24);
            }
        }
    }
</script>