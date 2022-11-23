import { getAuth } from "firebase/auth";
import { listenToGameStateUpdates, updatePlayerGridPos } from "../actions";
import { Actor } from "../game-objects/Actor";
import { Grid } from "../game-objects/Grid";
import { GameState } from "../typings";
import { Constructor } from "./types";

/**
 * Update the grid state in the cloud
 */
export function SyncGrid<TBase extends Constructor<Grid>>(Base: TBase, gameId: string) {
  return class SyncGrid extends Base {
    unsubFromGameStateUpdates!: () => void;

    constructor(...args: any[]) {
      super(...args);
      this.unsubFromGameStateUpdates = listenToGameStateUpdates(gameId, this.onGameStateUpdates);
    }

    moveByItemId(id: string, xTo: number, yTo: number) {
      super.moveByItemId(id, xTo, yTo);
      const isLocalPlayer = id === getAuth().currentUser?.uid;
      if (isLocalPlayer) {
        updatePlayerGridPos(gameId, id, xTo, yTo);
      }
    }

    placeItem(item: Actor, xPos: number, yPos: number) {
      super.placeItem(item, xPos, yPos);
      const isLocalPlayer = item.id === getAuth().currentUser?.uid;
      if (isLocalPlayer) {
        updatePlayerGridPos(gameId, item.id, xPos, yPos);
      }
    }

    onGameStateUpdates = (gameState: GameState) => {
      const { grid } = gameState;
      Object.keys(grid.players).forEach((playerId) => {
        const isLocalPlayer = playerId === getAuth().currentUser?.uid;
        if (!isLocalPlayer) {
          this.moveByItemId(playerId, grid.players[playerId].xPos, grid.players[playerId].yPos);
        }
      });

      this.grid = grid;
    };

    destroy(...arg: any[]) {
      this.unsubFromGameStateUpdates();
      super.destroy(...arg);
    }
  };
}
