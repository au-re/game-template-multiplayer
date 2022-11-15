export class Init extends Phaser.Scene {
  constructor() {
    super("Init");
  }

  preload() {
    this.load.bitmapFont("pixeled", "assets/fonts/Pixeled.png", "assets/fonts/Pixeled.xml");
    this.load.spritesheet("sprites", "assets/tilemaps/tilemap_packed.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("background", "assets/tilemaps/background.json");
  }

  create() {
    this.scene.start("Lobby");
  }
}
