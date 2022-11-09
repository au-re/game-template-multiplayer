import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'game',
  pixelArt: true,
  scale: {
    width: 320,
    height: 320,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 0 },
          debug: true
      }
  },
};
