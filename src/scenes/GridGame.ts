import { getAuth } from "firebase/auth";
import { scaleRatio } from "../constants";
import { Actor } from "../game-objects/Actor";
import CountDown from "../game-objects/CountDown";
import { Grid } from "../game-objects/Grid";
import { GridMovement } from "../mixins/GridMovement";
import { SyncGrid } from "../mixins/SyncGrid";
import { SyncState } from "../mixins/SyncState";
import { SceneData } from "../typings";

export class GridGame extends SyncState(Phaser.Scene) {
  countDown?: CountDown;
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

    const GameGrid = SyncGrid(Grid, this.localState!.gameId);
    this.grid = new GameGrid(this, 320, 320, 4, 4, 32 * scaleRatio);
    this.countDown = new CountDown(this);
    this.countDown?.sync(this.localState!.gameId, this.localState!.uid);

    Object.keys(this.gameState?.players || {}).forEach((playerId) => {
      this.spawnPlayer(playerId);
    });
  }

  spawnPlayer(playerId: string) {
    const isLocalPlayer = playerId === getAuth().currentUser?.uid;
    const LocalPlayer = GridMovement(Actor, this.grid);
    const RemotePlayer = Actor;
    let player = isLocalPlayer
      ? new LocalPlayer(this, playerId, "LOCAL", 0, 0, "sprites", 85)
      : new RemotePlayer(this, playerId, "REMOTE", 0, 0, "sprites", 85);
    this.grid.placeItem(player, 0, 0);
  }

  onGameLeft = () => {
    // TODO: add reset grid function
    Object.values(this.grid.itemRef).forEach((player) => {
      player.removeActor();
    });
    this.grid.itemRef = {};
  };

  onPlayerLeft = (playerId: string) => {
    this.grid.itemRef[playerId].removeActor();
    delete this.grid.itemRef[playerId];
  };

  update(t: number, dt: number) {
    this.countDown?.update(dt);

    // TODO: move scene change elsewhere
    if (!this.localState?.gameId) {
      this.grid.destroy();
      this.countDown?.destroy();
      this.scene.start("Lobby", { localState: this.localState, gameState: this.gameState });
    }
  }
}
