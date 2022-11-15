import { scaleRatio } from "../constants";
import { Actor } from "../game-objects/Actor";
import CountDown from "../game-objects/CountDown";
import { Grid } from "../game-objects/Grid";
import { GridMovement } from "../mixins/GridMovement";
import { SyncState as SyncState } from "../mixins/SyncState";
import { SceneData } from "../typings";

export class GridGame extends SyncState(Phaser.Scene) {
  countDown?: CountDown;
  players: { [uid: string]: Phaser.Physics.Arcade.Sprite } = {};
  grid!: Grid;

  constructor() {
    super("GridGame");
  }

  init(sceneData: SceneData) {
    const { localState, gameState } = sceneData;
    this.localState = localState;
    this.gameState = gameState;
  }

  create() {
    super.create();
    this.grid = new Grid(this, 320, 320, 4, 4, 32 * scaleRatio);
    this.countDown = new CountDown(this);
    this.countDown?.sync(this.localState!.gameId, this.localState!.uid);

    Object.keys(this.gameState?.players || {}).forEach((playerId) => {
      this.spawnPlayer(playerId);
    });
  }

  spawnPlayer(playerId: string) {
    const Player = GridMovement(Phaser.Physics.Arcade.Sprite, this.grid);
    const player = new Player(this, 0, 0, "sprites", 85);
    player.scale = 4;
    this.players[playerId] = player;
    this.grid.setItemAt(player, 0, 0);
  }

  update(t: number, dt: number) {
    this.countDown?.update(dt);

    // TODO: move navigation elsewhere
    if (!this.localState?.gameId) {
      this.scene.start("Lobby", { localState: this.localState, gameState: this.gameState });
    }
  }
}
