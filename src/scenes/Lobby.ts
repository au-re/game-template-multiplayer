import { getAuth } from "firebase/auth";
import { Actor } from "../game-objects/Actor";
import Background from "../game-objects/Background";
import { ContinuousMovement } from "../mixins/ContinuousMovement";
import { SyncPosition } from "../mixins/SyncPosition";
import { SyncState } from "../mixins/SyncState";
import { UploadPosition } from "../mixins/UploadPosition";
import { GameState, GameStatus, SceneData } from "../typings";

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
  }

  onGameJoined = (gameId: string, playerId: string) => {
    this.spawnPlayer(140, 140, gameId, playerId);
  };

  onGameLeft = () => {
    Object.values(this.players).forEach((player) => {
      player.removeActor();
    });
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
