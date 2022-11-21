import { syncPlayerState } from "../actions";
import { tickDuration } from "../constants";
import { Actor } from "../game-objects/Actor";
import { Constructor } from "./types";

/**
 * Update the position of the player in the cloud
 */
export function UploadPosition<TBase extends Constructor<Actor>>(Base: TBase, gameId: string) {
  return class UploadPosition extends Base {
    updateTimer = 0;

    constructor(...args: any[]) {
      super(...args);
    }

    update(t: number, dt: number) {
      super.update(t, dt);

      this.updateTimer += dt;

      if (this.updateTimer > tickDuration) {
        this.updateTimer = 0;
        syncPlayerState(gameId, {
          xPos: Math.round(this.x),
          yPos: Math.round(this.y),
          direction: this.direction,
        });
      }
    }
  };
}
