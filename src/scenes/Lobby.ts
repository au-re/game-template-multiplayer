import { Actor } from "../game-objects/Actor";
import Background from "../game-objects/Background";
import { ContinuousMovement } from "../mixins/ContinuousMovement";
import { SyncPosition } from "../mixins/SyncPosition";
import { SyncState } from "../mixins/SyncState";
import { GameState, SceneData } from "../typings";

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
    const SynchedPlayer = ContinuousMovement(SyncPosition(Actor, gameId));
    const player = new SynchedPlayer(this, playerId, x, y, "sprites", 85);

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
    this.players[playerId].removeActor();
    delete this.players[playerId];
  };

  onPlayerJoined = (playerId: string, gameState: GameState) => {
    const gameId = this.localState?.gameId;
    if (!gameId || !gameState) return;
    this.spawnPlayer(gameState.players[playerId].xPos, gameState.players[playerId].yPos, gameId, playerId);
  };

  update = (t: number, dt: number) => {
    Object.keys(this.players).forEach((playerId) => {
      this.players[playerId].update(t, dt);
    });
  };
}
