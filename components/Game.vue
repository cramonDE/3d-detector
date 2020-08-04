<template>
  <div>
    <div class="game-wrap" v-if="!isEnd">
      <div id="game"></div>
      <div id="loader" ontouchmove="return !1" class="loader">
        <div class="loader-graph"></div>
        <div id="progress" class="loader-progress">0%</div>
        <div class="loader-text">LOADING...</div>
      </div>
    </div>
    <End v-else />
  </div>
</template>

<script>
import End from './End.vue';

export default {
  name: 'Game',

  components: {
    End,
  },

  data(){
    return {
      isEnd: false
    }
  },

  props: [
    'scanner' 
  ],

  mounted() {
    window.QGame = new Phaser.Game(750, 750 / window.innerWidth * window.innerHeight, Phaser.CANVAS, 'game', {
      init: this.init,
      preload: this.preload,
      create: this.create,
      update: this.update,
      render: this.render
    });

    // 测试随便设定 10s游戏结束
    setTimeout(() => {
      this.isEnd = true
    }, 10000)
  },

  methods: {
    preload() {
      QGame.load.crossOrigin = 'anonymous';
      QGame.load.onFileComplete.add(this.fileComplete, this);
      QGame.load.onLoadComplete.addOnce(this.loadComplete, this);
      this.loadResources();
    },

    loadResources() {
      QGame.load.image('land1', '../assets/images/game/land_01.jpg');
      QGame.load.image('land2', '../assets/images/game/land_02.jpg');
      QGame.load.image('land3', '../assets/images/game/land_03.jpg');
      QGame.load.image('land4', '../assets/images/game/land_04.jpg');
      QGame.load.image('scanner', `../assets/images/game/scanner${this.scanner}.png`);
      QGame.load.image('toolbar', '../assets/images/game/toolbar.png');
      QGame.load.image('alert', '../assets/images/game/alert.png');
      QGame.load.image('transparent', '../assets/images/game/transparent.png');
      QGame.load.atlas('arcade', '../assets/images/game/arcade-joystick.png', '../utils/arcade-joystick.json');

      QGame.load.start();
    },

    fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
      document.querySelector('#progress').innerHTML = progress + '%';
    },

    loadComplete() {  
      const $loader = document.getElementById('loader');
      setTimeout(() => {
          $loader.classList.add('scaleOut');
      }, 200);
      setTimeout(() => {
          $loader.remove();
      }, 1000);
    },

    init () {
      QGame.stage.backgroundColor = '#000';
      QGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      QGame.world.setBounds(0, 0, 6420, 6642);
      QGame.winH = QGame.camera.height;
      QGame.centerX = QGame.world.centerX;
      QGame.centerY = QGame.world.centerY;

      QGame.renderer.renderSession.roundPixels = true;
      QGame.physics.startSystem(Phaser.Physics.ARCADE);
    },

    create() {
      QGame.bg = QGame.add.group();
      QGame.bg.create(0, 0, 'land1');
      QGame.bg.create(0, 830, 'land2');
      QGame.bg.create(0, 1661, 'land3');
      QGame.bg.create(0, 2491, 'land4');
      QGame.bg.scale.set(2);

      QGame.scannerWrap = QGame.add.tileSprite(QGame.centerX, QGame.centerY, 286, QGame.winH, 'transparent');
      QGame.scannerWrap.anchor.set(0.5);
      QGame.scanner = QGame.add.sprite(0, QGame.winH / 2, 'scanner');
      QGame.scanner.anchor.set(0.5, 1);
      QGame.scannerWrap.addChild(QGame.scanner);

      QGame.forceSingleUpdate = true;
      
      QGame.physics.enable(QGame.scannerWrap, Phaser.Physics.ARCADE);
      QGame.scannerWrap.body.collideWorldBounds = true;
      QGame.camera.follow(QGame.scannerWrap);

      QGame.cursors = QGame.input.keyboard.createCursorKeys();
      QGame.controlGroup = QGame.add.group();
      QGame.controlGroup.fixedToCamera = true;
      QGame.toolbar = QGame.controlGroup.create(0, QGame.winH, 'toolbar');
      QGame.toolbar.anchor.set(0, 1);

      QGame.alert = QGame.controlGroup.create(QGame.centerX, QGame.winH - 71, 'alert');
      QGame.alert.anchor.set(0.5);

      QGame.pad = QGame.plugins.add(Phaser.VirtualJoystick);
      QGame.stick = QGame.pad.addStick(0, 0, 200, 'arcade');
      QGame.stick.alignBottomLeft();

      QGame.buttonA = QGame.pad.addButton(620, QGame.winH - 120, 'arcade', 'button1-up', 'button1-down');
      QGame.buttonA.onDown.add(this.pressDownButtonA, this);
      QGame.buttonA.onUp.add(this.pressUpButtonA, this);
    },

    update() {
      const maxSpeed = 400;
      if (QGame.stick.isDown) {
        QGame.physics.arcade.velocityFromRotation(QGame.stick.rotation, QGame.stick.force * maxSpeed, QGame.scannerWrap.body.velocity);
      } else {
        QGame.scannerWrap.body.velocity.set(0);
      }
    },

    render() {
      // QGame.debug.spriteBounds(QGame.scannerWrap);
    },

    pressDownButtonA () {
      QGame.scannerTn = QGame.add.tween(QGame.scanner).to({
        rotation: [Math.PI / 6, 0, -Math.PI / 6, 0]
      }, 2000, "Linear", true, 0, -1);
    },

    pressUpButtonA () {
      QGame.scannerTn.stop();
      QGame.scannerTn = null;

      QGame.scannerStopTn = QGame.add.tween(QGame.scanner).to({
        rotation: 0
      }, 300, "Linear", true);
      QGame.scannerStopTn.onComplete.add(() => {
        QGame.scannerStopTn.stop();
        QGame.scannerStopTn = null;
      }, this);
    },
  }
}
</script>

<style>
@keyframes rotate {
  0% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.loader {
  position: absolute;
  z-index: 200;
  overflow: hidden;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: #210f7c;
}

.loader-graph {
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 50%;
  width: 50px;
  height: 50px;
  margin: -25px 0 0 -25px;
  color: transparent;
  text-align: center;
  border-top: 5px solid rgba(255, 255, 255, .2);
  border-right: 5px solid rgba(255, 255, 255, .2);
  border-bottom: 5px solid rgba(255, 255, 255, .2);
  border-left: 5px solid #fff;
  border-radius: 30px;
  animation: rotate .72s linear infinite
}

.loader-progress {
  width: 60px;
  height: 60px;
  line-height: 60px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -25px 0 0 -25px;
}

.loader-text {
  position: absolute;
  left: 0;
  top: 50%;
  margin: 40px 0 0 8px;
  width: 100%;
  line-height: 24px;
  font-size: 16px;
  text-align: center;
}

.scaleOut {
  opacity: 0;
  transform: scale(1.25);
  transition: all 0.8s;
}
</style>
