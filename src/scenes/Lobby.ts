import Phaser from 'phaser';

export default class Lobby extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Phaser.Physics.Arcade.Sprite;
  private player_speed = 100;
  
  constructor() {
    super('Lobby');
  }

  preload() {
    // one way to listen to cursor events
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.load.spritesheet('sprites', 'assets/tilemaps/tilemap_packed.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('tiles', 'assets/tilemaps/tilemap_packed.png');
    this.load.tilemapTiledJSON("background", 'assets/tilemaps/background.json')
  }

  create() {
    // using a manually created tilemap
    const map = this.make.tilemap({ key: "background" });  // NOTE: key is the name of the tilemap in the json file
    const tileset = map.addTilesetImage("background", "tiles");
    
    map.createLayer("Background", tileset)
    const walls = map.createLayer("Walls", tileset)
    
    walls.setCollisionByProperty({ player_collision: true })
    
    // debug collision layer
    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // walls.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243,234,48,255),
    //   faceColor: new Phaser.Display.Color(40,30,37,255),
    // })
    
    // placing a sprite
    this.player = this.physics.add.sprite(140, 140, 'sprites', 85);
    
    // physics collision
    this.physics.add.collider(this.player, walls)
  }
  
  update(t: number) {
    if(!this.cursors || !this.player) return
    
    // basic player movement
    
    if(this.cursors.left?.isDown) {
      this.player.setVelocity(-this.player_speed, 0)
      this.player.scaleX = -1
      this.player.body.offset.x = 16
    }
    else if (this.cursors.right?.isDown) {
      this.player.setVelocity(this.player_speed, 0)
      this.player.scaleX = 1
      this.player.body.offset.x = 0
    }
    else if (this.cursors.up?.isDown) {
      this.player.setVelocity(0, -this.player_speed)
    }
    else if (this.cursors.down?.isDown) {
      this.player.setVelocity(0, this.player_speed)
    }
    else {
      this.player.setVelocity(0, 0)
    }
  }
}
