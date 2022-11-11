import { scaleRatio } from "../constants";

export const wallLayer = "Walls";
export const backgroundLayer = "Background";

export default class Background extends Phaser.GameObjects.Container {
  walls: Phaser.Tilemaps.TilemapLayer;
  background: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.scene = scene;

    const map = this.scene.make.tilemap({ key: "background" }); // NOTE: key is the name of the tilemap in the json file
    const tileset = map.addTilesetImage("background", "tiles");

    this.background = map.createLayer(backgroundLayer, tileset);
    this.background.setScale(scaleRatio);

    this.walls = map.createLayer(wallLayer, tileset);
    this.walls.setCollisionByProperty({ player_collision: true });
    this.walls.setScale(scaleRatio);
  }
}
