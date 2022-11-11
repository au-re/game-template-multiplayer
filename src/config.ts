import Phaser from "phaser";
import { scaleRatio } from "./constants";

export const phaserConfig = {
  type: Phaser.AUTO,
  parent: "game",
  pixelArt: true,
  scale: {
    width: 320 * scaleRatio,
    height: 320 * scaleRatio,
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
