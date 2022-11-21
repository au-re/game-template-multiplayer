import { scaleRatio } from "../constants";
import { Actor } from "../game-objects/Actor";
import { Grid } from "../game-objects/Grid";
import { PlayerDirection } from "../typings";
import { Constructor } from "./types";

export function GridMovement<TBase extends Constructor<Actor>>(Base: TBase, grid: Grid) {
  return class GridMovement extends Base {
    direction = PlayerDirection.RIGHT;

    constructor(...args: any[]) {
      super(...args);
      this.scene.add.existing(this);

      // KEYS
      this.scene.input.keyboard.addKey("W").onUp = this.moveUp;
      this.scene.input.keyboard.addKey("A").onUp = this.moveLeft;
      this.scene.input.keyboard.addKey("S").onUp = this.moveDown;
      this.scene.input.keyboard.addKey("D").onUp = this.moveRight;
    }

    moveUp = () => {
      const { xPos, yPos } = grid.grid.players[this.id];
      const newYPos = yPos - 1;
      if (grid.canPlaceAt(xPos, newYPos)) {
        grid.moveByItemId(this.id, xPos, newYPos);
      }
    };

    moveDown = () => {
      const { xPos, yPos } = grid.grid.players[this.id];
      const newYPos = yPos + 1;
      if (grid.canPlaceAt(xPos, newYPos)) {
        grid.moveByItemId(this.id, xPos, newYPos);
      }
    };

    moveLeft = () => {
      const { xPos, yPos } = grid.grid.players[this.id];
      const newXPos = xPos - 1;
      if (grid.canPlaceAt(newXPos, yPos)) {
        grid.moveByItemId(this.id, newXPos, yPos);
        this.setDirection(PlayerDirection.LEFT);
      }
    };

    moveRight = () => {
      const { xPos, yPos } = grid.grid.players[this.id];
      const newXPos = xPos + 1;
      if (grid.canPlaceAt(newXPos, yPos)) {
        grid.moveByItemId(this.id, newXPos, yPos);
        this.setDirection(PlayerDirection.RIGHT);
      }
    };

    setDirection(direction: PlayerDirection) {
      if (direction == PlayerDirection.LEFT) {
        this.scaleX = -1 * scaleRatio;
        this.direction = PlayerDirection.LEFT;
      } else {
        this.scaleX = 1 * scaleRatio;
        this.direction = PlayerDirection.RIGHT;
      }
    }
  };
}
