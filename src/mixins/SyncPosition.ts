import { listenToGameStateUpdates, syncPlayerState } from "../actions";
import { Actor } from "../game-objects/Actor";
import { tickDuration } from "../constants";
import { GameState, PlayerDirection } from "../typings";
import { Constructor } from "./types";
import { getAuth } from "firebase/auth";

export function SyncPosition<TBase extends Constructor<Actor>>(Base: TBase, gameId: string) {
  return class SyncPosition extends Base {
    public direction = PlayerDirection.RIGHT;
    public movementSpeed = 400;
    public targetPos = { x: 0, y: 0 }; // used for smoothing network latency

    updateTimer = 0;

    unsubFromGameStateUpdates!: () => void;

    constructor(...args: any[]) {
      super(...args);
      this.unsubFromGameStateUpdates = listenToGameStateUpdates(gameId, this.onGameStateUpdates);
    }

    onGameStateUpdates = (gameState: GameState) => {
      // if this player or the local player is gone, unsubscribe from updates
      const uid = getAuth().currentUser?.uid;
      if (!uid || !gameState.players[uid] || !gameState.players[this.id]) {
        this.unsubFromGameStateUpdates();
        return;
      }

      if (!this.isLocalPlayer) {
        this.targetPos = {
          x: gameState.players[this.id].xPos,
          y: gameState.players[this.id].yPos,
        };
        this.moveToPos();
        this.setDirection(gameState.players[this.id].direction);
      }
    };

    moveToPos() {
      this.scene.physics.moveTo(this, this.targetPos.x, this.targetPos.y, this.movementSpeed, tickDuration - 10);
    }

    hasArrivedToPos() {
      return Math.abs(this.x - this.targetPos.x) < 4 && Math.abs(this.y - this.targetPos.y) < 4;
    }

    update(t: number, dt: number) {
      super.update(t, dt);

      if (this.isLocalPlayer) {
        this.updateTimer += dt;
        if (this.updateTimer > tickDuration) {
          this.updateTimer = 0;
          syncPlayerState(gameId, {
            xPos: Math.round(this.x),
            yPos: Math.round(this.y),
            direction: this.direction,
            gridCell: { x: 0, y: 0 },
          });
        }
      }

      if (this.hasArrivedToPos()) {
        this.body.reset(this.targetPos.x, this.targetPos.y);
      }
    }
  };
}
