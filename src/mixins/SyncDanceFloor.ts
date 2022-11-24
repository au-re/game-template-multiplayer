import { getAuth } from "firebase/auth";
import { listenToGameStateUpdates, setDanceFloor } from "../actions";
import { DanceFloor } from "../game-objects/DanceFloor";
import { GameState } from "../typings";
import { Constructor } from "./types";

/**
 * Update the dance floor state in the cloud
 */
export function SyncDanceFloor<TBase extends Constructor<DanceFloor>>(Base: TBase, gameId: string) {
  return class extends Base {
    unsubFromGameStateUpdates!: () => void;
    isHost: boolean;

    constructor(...args: any[]) {
      super(...args);
      this.unsubFromGameStateUpdates = listenToGameStateUpdates(gameId, this.onGameStateUpdates);
      this.isHost = gameId === getAuth().currentUser?.uid;
    }

    changeColors() {
      if (this.isHost) {
        super.changeColors();
        setDanceFloor(gameId, this.colorMap);
      }
    }

    onGameStateUpdates = (gameState: GameState) => {
      if (!gameState.danceFloor) return;
      if (!this.isHost) {
        this.setColors(gameState.danceFloor);
      }
    };

    destroy(...arg: any[]) {
      this.unsubFromGameStateUpdates();
      super.destroy(...arg);
    }
  };
}
