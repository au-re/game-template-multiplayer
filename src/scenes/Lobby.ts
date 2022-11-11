import { Unsubscribe } from "firebase/firestore";
import { listenToGameStateUpdates } from "../actions";
import { PlayerActor } from "../actors/PlayerActor";
import { GameEvents } from "../constants";
import Background from "../game-objects/Background";
import CountDown from "../game-objects/CountDown";
import { GameState, LocalState } from "../typings";

export class Lobby extends Phaser.Scene {
  localState?: LocalState;
  gameState?: GameState;
  background?: Background;
  countDown?: CountDown;
  unsubFromStateUpdates?: Unsubscribe;
  players: { [uid: string]: PlayerActor } = {};

  constructor() {
    super("Lobby");
  }

  preload() {
    this.load.bitmapFont("pixeled", "assets/fonts/Pixeled.png", "assets/fonts/Pixeled.xml");
    this.load.spritesheet("sprites", "assets/tilemaps/tilemap_packed.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("tiles", "assets/tilemaps/tilemap_packed.png");
    this.load.tilemapTiledJSON("background", "assets/tilemaps/background.json");
  }

  create() {
    // listen to events
    this.events.on(GameEvents.LOCAL_STATE_UPDATE, this.onLocalStateUpdate, this);

    this.background = new Background(this);
    this.countDown = new CountDown(this);
  }

  onLocalStateUpdate = (localState: LocalState) => {
    // game just started
    // start listening to db updates
    if (localState.gameId && !this.localState?.gameId) {
      listenToGameStateUpdates(localState.gameId, this.onGameStateUpdates);
      this.countDown?.sync(localState.gameId, localState.uid);
    }

    this.localState = localState;
  };

  onGameStateUpdates = (gameState: GameState) => {
    const gameId = this.localState?.gameId;
    const uid = this.localState?.uid;

    this.gameState = gameState;

    // current player left the game
    if (!gameId) {
      Object.keys(this.players).forEach((playerId) => {
        this.players[playerId].removePlayer();
        delete this.players[playerId];
      });
      return;
    }

    // other player left the game
    Object.keys(this.players).forEach((playerId) => {
      if (!gameState.players[playerId]) {
        this.players[playerId].removePlayer();
        delete this.players[playerId];
      }
    });

    // for each player in the game state
    Object.keys(gameState.players).forEach((playerId) => {
      // spawn if the player doesn't exist already
      if (!this.players[playerId]) {
        const isSelf = playerId === this.localState?.uid;
        const player = new PlayerActor(
          this,
          gameState.players[playerId].xPos,
          gameState.players[playerId].yPos,
          playerId,
          gameId,
          isSelf
        );

        if (this.background?.walls) {
          this.physics.add.collider(player, this.background.walls);
        }

        this.players[playerId] = player;
      }

      // move other players
      if (playerId != uid) {
        const player = this.players[playerId];

        player.targetPos = {
          x: gameState.players[playerId].xPos,
          y: gameState.players[playerId].yPos,
        };

        player.moveActorToPos();
        player.setDirection(gameState.players[playerId].direction);
      }
    });
  };

  update(t: number, dt: number) {
    this.countDown?.update(dt);
    Object.keys(this.players).forEach((playerId) => this.players[playerId].update(dt));
  }
}
