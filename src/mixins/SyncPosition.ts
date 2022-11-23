import { getAuth } from "firebase/auth";
import { listenToGameStateUpdates } from "../actions";
import { tickDuration } from "../constants";
import { Actor } from "../game-objects/Actor";
import { GameState } from "../typings";
import { Constructor } from "./types";

/**
 * Update the local position of an actor when the cloud state changes
 *
 */
export function SyncPosition<TBase extends Constructor<Actor>>(Base: TBase, gameId: string) {
  return class SyncPosition extends Base {
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

      this.targetPos = {
        x: gameState.players[this.id].xPos,
        y: gameState.players[this.id].yPos,
      };
      this.moveToPos();
      this.setDirection(gameState.players[this.id].direction);
    };

    moveToPos() {
      this.scene.physics.moveTo(this, this.targetPos.x, this.targetPos.y, this.movementSpeed, tickDuration - 10);
    }

    hasArrivedToPos() {
      return Math.abs(this.x - this.targetPos.x) < 4 && Math.abs(this.y - this.targetPos.y) < 4;
    }

    destroy(...args: any[]) {
      this.unsubFromGameStateUpdates();
      super.destroy(...args);
    }

    update(t: number, dt: number) {
      super.update(t, dt);

      if (this.hasArrivedToPos()) {
        this.body.reset(this.targetPos.x, this.targetPos.y);
      }
    }
  };
}
