import { GameEvents, scaleRatio } from "../constants";
import { DanceFloorState } from "../typings";
import { getRandomFromArray, hexToRgb, RGBtoHEX } from "../utils";
import { Grid } from "./Grid";

const colors = [0x0000ff, 0xffff00, 0xcc00ff, 0x00a1e4, 0x000000];

export class DanceFloor extends Phaser.GameObjects.GameObject {
  tiles: Phaser.GameObjects.Sprite[][] = [];
  colorMap: DanceFloorState = {}; // simplifies interacting with firebase

  constructor(scene: Phaser.Scene, grid: Grid) {
    super(scene, "dancefloor");

    for (let i = 0; i < grid.xDim; i++) {
      if (!this.tiles[i]) this.tiles[i] = [];
      if (!this.colorMap[i]) this.colorMap[i] = {};
      for (let j = 0; j < grid.yDim; j++) {
        const cellPos = grid.getCellPos(i, j);
        const color = getRandomFromArray(colors);
        this.tiles[i][j] = new Phaser.GameObjects.Sprite(scene, cellPos.x, cellPos.y, "sprites", 48);
        this.tiles[i][j].tint = color;
        this.colorMap[i][j] = hexToRgb(color);
        this.tiles[i][j].scale = scaleRatio;
        scene.add.existing(this.tiles[i][j]);
      }
    }

    this.scene.events.on(GameEvents.BEAT_START_EVENT, this.changeColors, this);
  }

  changeColors() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let j = 0; j < this.tiles[i].length; j++) {
        const color = getRandomFromArray(colors);
        this.tiles[i][j].tint = color;
        this.colorMap[i][j] = hexToRgb(color);
      }
    }
  }

  setColors(colorMap: DanceFloorState) {
    this.colorMap = colorMap;
    for (let i = 0; i < Object.keys(colorMap).length; i++) {
      for (let j = 0; j < Object.keys(colorMap[1]).length; j++) {
        this.tiles[i][j].tint = RGBtoHEX(colorMap[i][j].r, colorMap[i][j].g, colorMap[i][j].b);
      }
    }
  }

  destroy() {
    this.scene.events.off(GameEvents.BEAT_START_EVENT, this.changeColors);
    super.destroy();
  }
}
