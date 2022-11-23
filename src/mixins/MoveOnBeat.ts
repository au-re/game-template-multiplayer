import { GameEvents } from "../constants";
import { Actor } from "../game-objects/Actor";
import { Constructor } from "./types";

export function MoveOnBeat<TBase extends Constructor<Actor>>(Base: TBase) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.scene.events.on(GameEvents.BEAT_START_EVENT, this.setCanMove, this);
      this.scene.events.on(GameEvents.BEAT_END_EVENT, this.setCannotMove, this);
    }

    setCanMove() {
      this.canMove = true;
      this.tint = 0xffffff;
    }

    setCannotMove() {
      this.canMove = false;
      this.tint = 0xff0000;
    }

    destroy() {
      this.scene.events.off(GameEvents.BEAT_START_EVENT, this.setCanMove);
      this.scene.events.off(GameEvents.BEAT_END_EVENT, this.setCannotMove);
      super.destroy();
    }
  };
}
