import Phaser from "phaser";

export const phaserConfig = {
  type: Phaser.AUTO,
  parent: "game",
  pixelArt: true,
  scale: {
    width: 320 * 4,
    height: 320 * 4,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
};
