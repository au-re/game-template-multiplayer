import Phaser from 'phaser';

// hack to keep font readable
const scaleUp = 4;

interface PlayerState {
  [key:string]: {
    player_sprite: Phaser.Physics.Arcade.Sprite;
    player_name: Phaser.GameObjects.BitmapText;
  }
}

export default class Lobby extends Phaser.Scene {
  
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player_speed = 100 * scaleUp;
  private update_timer = 0;
  private players: PlayerState = {}
  private walls!: any; 
  private gameId = ""
  private playerId = ""
  
  
  constructor() {
    super('Lobby');
  }

  preload() {
    // one way to listen to cursor events
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.load.spritesheet('sprites', 'assets/tilemaps/tilemap_packed.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('tiles', 'assets/tilemaps/tilemap_packed.png');
    this.load.tilemapTiledJSON("background", 'assets/tilemaps/background.json')
    this.load.bitmapFont('pixeled', 'assets/fonts/Pixeled.png', 'assets/fonts/Pixeled.xml')
  }

  create() {
    // using a manually created tilemap
    const map = this.make.tilemap({ key: "background" });  // NOTE: key is the name of the tilemap in the json file
    const tileset = map.addTilesetImage("background", "tiles");
    
    const background = map.createLayer("Background", tileset)
    this.walls = map.createLayer("Walls", tileset)
    
    this.walls.setCollisionByProperty({ player_collision: true })

    this.walls.setScale(scaleUp);
    background.setScale(scaleUp);
    
    // debug collision layer
    // const debugGraphics = this.add.graphics().setAlpha(0.7)
    // walls.renderDebug(debugGraphics, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243,234,48,255),
    //   faceColor: new Phaser.Display.Color(40,30,37,255),
    // })
    
    // listen to events
    this.events.on('game_data', this.onGameDataChange, this);
  }
  
  spawnPlayer(playerId: string) {
    this.players[playerId] = {player_sprite: null, player_name: null }
    // placing a sprite
    this.players[playerId].player_sprite = this.physics.add.sprite(140, 140, 'sprites', 85);
    this.players[playerId].player_sprite.setScale(scaleUp);
    // physics collision
    this.physics.add.collider(this.players[playerId].player_sprite, this.walls)
    
    // displaying the player name
    this.players[playerId].player_name = this.add.bitmapText(140, 140, 'pixeled','', 8);
    this.players[playerId].player_name.setText(playerId);
  }
  
  destroyPlayer(playerId: string) {
    this.players[playerId].player_sprite.destroy();
    this.players[playerId].player_name.destroy();
    delete this.players[playerId]
  }
  
  onGameDataChange(gameData: any) {
    this.playerId = gameData.uid;
    this.gameId = gameData.gameId;
    
    // current player left the game
    if(!gameData.gameId) {  
      Object.keys(this.players).forEach((playerId) => {
        this.destroyPlayer(playerId)
      })
      return;
    }
    
    // other player left the game
    Object.keys(this.players).forEach((playerId) => {
      if(!gameData.players[playerId]) {
        this.destroyPlayer(playerId)
      }
    })
    
    // for each player in the game state
    Object.keys(gameData.players).forEach((playerId) => {
      // spawn if the player doesn't exist already
      if(!this.players[playerId]) {
        this.spawnPlayer(playerId)
      }
      
      // move other players
      if(playerId != gameData.uid) {
        this.movePlayerToPos(this.players[playerId], gameData.players[playerId].xPos || 140, gameData.players[playerId].yPos || 140)
      }
    })
  }
  
  movePlayer(currentPlayer: any) {
    // basic player movement
    if(this.cursors.left?.isDown) {
      currentPlayer.player_sprite.setVelocity(-this.player_speed, 0)
      currentPlayer.player_sprite.scaleX = -scaleUp
      currentPlayer.player_sprite.body.offset.x = 16
    }
    else if (this.cursors.right?.isDown) {
      currentPlayer.player_sprite.setVelocity(this.player_speed, 0)
      currentPlayer.player_sprite.scaleX = scaleUp
      currentPlayer.player_sprite.body.offset.x = 0
    }
    else if (this.cursors.up?.isDown) {
      currentPlayer.player_sprite.setVelocity(0, -this.player_speed)
    }
    else if (this.cursors.down?.isDown) {
      currentPlayer.player_sprite.setVelocity(0, this.player_speed)
    }
    else {
      currentPlayer.player_sprite.setVelocity(0, 0)
    }
    
    // move the player name
    currentPlayer.player_name.x = Math.floor(currentPlayer.player_sprite.x - currentPlayer.player_sprite.width / 2 );
    currentPlayer.player_name.y = Math.floor(currentPlayer.player_sprite.y - currentPlayer.player_sprite.height / 2-50);
  }
  
  movePlayerToPos(player: any, x: number, y: number) {
    player.player_sprite.x = x
    player.player_sprite.y = y
    player.player_name.x = Math.floor(player.player_sprite.x - player.player_sprite.width / 2 );
    player.player_name.y = Math.floor(player.player_sprite.y - player.player_sprite.height / 2-50);
  }
  
  update(t: number, dt: number) {
    const currentPlayer = this.players[this.playerId]
    
    if(!this.cursors || !currentPlayer) return
    
    this.update_timer += dt;
    if (this.update_timer > 200) {
        this.update_timer = 0;
        (this.game as any).onUpdate({
          gameId: this.gameId,
          playerX: currentPlayer.player_sprite.x,
          playerY: currentPlayer.player_sprite.y
        });
    }
    
    this.movePlayer(currentPlayer)
  }
}
