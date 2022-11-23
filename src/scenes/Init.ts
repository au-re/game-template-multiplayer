export class Init extends Phaser.Scene {
  constructor() {
    super("Init");
  }

  preload() {
    this.load.bitmapFont("pixeled", "assets/fonts/Pixeled.png", "assets/fonts/Pixeled.xml");
    this.load.spritesheet("sprites", "assets/tilemaps/tilemap_packed.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("background", "assets/tilemaps/background.json");

    this.load.audio("click1", ["assets/sounds/click_001.ogg"]);
    this.load.audio("click2", ["assets/sounds/click_002.ogg"]);
  }

  create() {
    this.scene.start("Lobby");
  }
}
