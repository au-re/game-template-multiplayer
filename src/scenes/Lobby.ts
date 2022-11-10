import Phaser from "phaser";
import { PlayerActor } from "../actors/PlayerActor";
import { updatePlayerState, updateTimerState } from "../actions";
import { getRandomInt } from "../utils";

// hack to keep font readable
const scaleUp = 4;

interface Player {
  playerSprite: Phaser.Physics.Arcade.Sprite;
  playerName: Phaser.GameObjects.BitmapText;
  isInverted: boolean;
  targetPos: {
    x: number;
    y: number;
  };
}

interface PlayerState {
  [key: string]: Player;
}

export default class Lobby extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player_speed = 100 * scaleUp;
  private update_timer = 0;
  private countdown_timer = 0;
  private countdown_timer_dt = 0;
  private players: PlayerState = {};
  private walls!: any;
  private gameId = "";
  private playerId = "";
  private crates!: any;

  constructor() {
    super("Lobby");
  }

  preload() {
    // one way to listen to cursor events
    this.cursors = this.input.keyboard.createCursorKeys();
    this.load.spritesheet("sprites", "assets/tilemaps/tilemap_packed.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("background", "assets/tilemaps/background.json");
    this.load.bitmapFont("pixeled", "assets/fonts/Pixeled.png", "assets/fonts/Pixeled.xml");
  }

  create() {
    // using a manually created tilemap
    const map = this.make.tilemap({ key: "background" }); // NOTE: key is the name of the tilemap in the json file
    const tileset = map.addTilesetImage("background", "tiles");

    const background = map.createLayer("Background", tileset);
    this.walls = map.createLayer("Walls", tileset);

    this.walls.setCollisionByProperty({ player_collision: true });

    this.walls.setScale(scaleUp);
    background.setScale(scaleUp);

    // listen to events
    this.events.on("game_data", this.onGameDataChange, this);
  }

  update(t: number, dt: number) {
    const currentPlayer = this.players[this.playerId];
    if (!this.cursors || !currentPlayer || !this.gameId) return;

    // update the player state every 200ms
    this.update_timer += dt;
    if (this.update_timer > 200) {
      this.update_timer = 0;
      updatePlayerState(this.gameId, {
        xPos: currentPlayer.playerSprite.x,
        yPos: currentPlayer.playerSprite.y,
        isInverted: currentPlayer.isInverted,
      });
    }

    this.countdown_timer_dt += dt;
    if (this.countdown_timer_dt > 1000) {
      this.countdown_timer_dt = 0;
      this.countdown_timer -= 1000;
      updateTimerState(this.gameId, this.countdown_timer);
    }

    this.movePlayer(currentPlayer);

    // stop the smoothing if players are at the target position
    Object.keys(this.players).forEach((playerId) => {
      if (this.playerId !== playerId) {
        const player = this.players[playerId];
        if (this.hasArrived(player)) {
          player.playerSprite.body.reset(player.targetPos.x, player.targetPos.y);
        }
        // update the player name position
        player.playerName.x = Math.floor(player.playerSprite.x - player.playerName.width / 2);
        player.playerName.y = Math.floor(player.playerSprite.y - player.playerName.height / 2 - 50);
      }
    });
  }

  // update the game based on the data we are getting
  onGameDataChange(gameData: any) {
    this.playerId = gameData.uid;
    this.gameId = gameData.gameId;
    this.countdown_timer = gameData.timer;

    // current player left the game
    if (!gameData.gameId) {
      Object.keys(this.players).forEach((playerId) => {
        this.destroyPlayer(playerId);
      });
      return;
    }

    // other player left the game
    Object.keys(this.players).forEach((playerId) => {
      if (!gameData.players[playerId]) {
        this.destroyPlayer(playerId);
      }
    });

    // for each player in the game state
    Object.keys(gameData.players).forEach((playerId) => {
      // spawn if the player doesn't exist already
      if (!this.players[playerId]) {
        this.spawnPlayer(
          playerId,
          gameData.players[playerId].xPos,
          gameData.players[playerId].yPos,
          gameData.players[playerId].isInverted
        );
      }

      if (playerId != gameData.uid) {
        const player = this.players[playerId];
        // move other players
        // this.movePlayerToPos(this.players[playerId], gameData.players[playerId].xPos, gameData.players[playerId].yPos)
        this.players[playerId].targetPos = {
          x: gameData.players[playerId].xPos,
          y: gameData.players[playerId].yPos,
        };
        this.movePlayerToPosSmooth(player);

        // invert the other players
        player.isInverted = gameData.players[playerId].isInverted;
        this.setPlayerDirection(player, player.isInverted);
      }
    });
  }

  spawnCrate(playerId: string, x: number, y: number) {
    const crate = this.physics.add.sprite(x, y, "sprites", 63);
    crate.setScale(scaleUp);
    this.crates.add(crate);
  }

  spawnPlayer(playerId: string, x: number, y: number, isInverted: boolean) {
    this.players[playerId] = {
      targetPos: { x: 140, y: 140 },
      isInverted,
      playerSprite: this.physics.add.sprite(x, y, "sprites", 85),
      playerName: this.add.bitmapText(x, y, "pixeled", "", 8),
    };

    this.players[playerId].playerSprite.setScale(scaleUp);
    // physics collision
    this.physics.add.collider(this.players[playerId].playerSprite, this.walls);

    // displaying the player name
    this.players[playerId].playerName.setText(playerId);
  }

  destroyPlayer(playerId: string) {
    this.players[playerId].playerSprite.destroy();
    this.players[playerId].playerName.destroy();
    delete this.players[playerId];
  }

  setPlayerDirection(player: Player, inverted: boolean) {
    player.playerSprite.scaleX = scaleUp * (inverted ? -1 : 1);
    player.playerSprite.body.offset.x = inverted ? 16 : 0;
    player.isInverted = inverted;
    if (!inverted) player.playerSprite.scaleX = scaleUp;
  }

  movePlayer(currentPlayer: Player) {
    // basic player movement
    if (this.cursors.left?.isDown) {
      currentPlayer.playerSprite.setVelocity(-this.player_speed, 0);
      this.setPlayerDirection(currentPlayer, true);
    } else if (this.cursors.right?.isDown) {
      currentPlayer.playerSprite.setVelocity(this.player_speed, 0);
      this.setPlayerDirection(currentPlayer, false);
    } else if (this.cursors.up?.isDown) {
      currentPlayer.playerSprite.setVelocity(0, -this.player_speed);
    } else if (this.cursors.down?.isDown) {
      currentPlayer.playerSprite.setVelocity(0, this.player_speed);
    } else {
      currentPlayer.playerSprite.setVelocity(0, 0);
    }

    // move the player name
    currentPlayer.playerName.x = Math.floor(currentPlayer.playerSprite.x - currentPlayer.playerName.width / 2);
    currentPlayer.playerName.y = Math.floor(currentPlayer.playerSprite.y - currentPlayer.playerName.height / 2 - 50);
  }

  // without smoothing
  movePlayerToPos(player: Player, x: number, y: number) {
    player.playerSprite.x = x;
    player.playerSprite.y = y;
    player.playerName.x = Math.floor(player.playerSprite.x - player.playerName.width / 2);
    player.playerName.y = Math.floor(player.playerSprite.y - player.playerName.height / 2 - 50);
  }

  movePlayerToPosSmooth(player: Player) {
    this.physics.moveTo(player.playerSprite, player.targetPos.x, player.targetPos.y, this.player_speed, 200);
  }

  hasArrived(player: Player) {
    return (
      Math.abs(player.playerSprite.x - player.targetPos.x) < 10 &&
      Math.abs(player.playerSprite.y - player.targetPos.y) < 10
    );
  }
}
