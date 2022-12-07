import { getAuth } from "firebase/auth";
import { Grid } from "../game-objects/Grid";
import { Actor } from "../game-objects/Actor";
import Background from "../game-objects/Background";
import { ContinuousMovement } from "../mixins/ContinuousMovement";
import { SyncPosition } from "../mixins/SyncPosition";
import { SyncState } from "../mixins/SyncState";
import { UploadPosition } from "../mixins/UploadPosition";
import { GameState, GameStatus, SceneData } from "../typings";
import { scaleRatio } from "../constants";
import { DanceFloor } from "../game-objects/DanceFloor";
import { Spawner } from "../game-objects/Spawner"
import {Pickable} from "../mixins/Pickable"

export class Lobby extends SyncState(Phaser.Scene) {
  background?: Background;
  players: { [uid: string]: Actor } = {};

  constructor() {
    super("Lobby");
  }

  init(sceneData: SceneData) {
    const { localState, gameState } = sceneData;
    this.localState = localState;
    this.gameState = gameState;
    this.players = {};
  }

  create() {
    super.create();
    this.background = new Background(this);
    
    const spawner = new Spawner(this, {
      "POTION_RED": {
        texture: "sprites",
        frame: 115
      },
      "POTION_BLUE": {
        texture: "sprites",
        frame: 114
      }
    })
    spawner.xMin = 24*scaleRatio
    spawner.yMin = 24*scaleRatio
    spawner.spawnAt("POTION_RED", 120, 140)
    spawner.spawnRandom(15)
  }

  spawnPlayer(x: number, y: number, gameId: string, playerId: string) {
    const isLocalPlayer = playerId === getAuth().currentUser?.uid;
    // TODO: define those classes outside this function
    const LocalPlayer = UploadPosition(ContinuousMovement(Actor), gameId);
    const RemotePlayer = SyncPosition(Actor, gameId);

    let player = isLocalPlayer
      ? new LocalPlayer(this, playerId, "LOCAL", x, y, "sprites", 85)
      : new RemotePlayer(this, playerId, "REMOTE", x, y, "sprites", 85);

    if (this.background?.walls) {
      this.physics.add.collider(player, this.background.walls);
    }

    this.players[playerId] = player;
    
    // TODO: remove test
    if(isLocalPlayer) {
      const PickableItem = Pickable(Phaser.GameObjects.Sprite, player, () => console.log("PICKED!"))
      const chest = new PickableItem(this, 500, 500, "sprites", 117)
      chest.setScale(scaleRatio)
      this.add.existing(chest);
    }
    // ---
  }

  onGameJoined = (gameId: string, playerId: string) => {
    this.spawnPlayer(140, 140, gameId, playerId);
  };

  onGameLeft = () => {
    Object.values(this.players).forEach((player) => {
      player.removeActor();
    });
    // TODO: create common way to reset the local gamestate
    this.gameState!.players = {};
    this.players = {};
  };

  onPlayerLeft = (playerId: string) => {
    if (!this.players[playerId]) return;
    this.players[playerId].removeActor();
    delete this.players[playerId];
  };

  onPlayerJoined = (playerId: string, gameState: GameState) => {
    const gameId = this.localState?.gameId;
    if (!gameId || !gameState) return;
    this.spawnPlayer(gameState.players[playerId].xPos, gameState.players[playerId].yPos, gameId, playerId);
  };

  onGameStarted = () => {
    this.scene.start("GridGame", { localState: this.localState, gameState: this.gameState });
  };

  update = (t: number, dt: number) => {
    Object.keys(this.players).forEach((playerId) => {
      this.players[playerId].update(t, dt);
    });
  };
}
