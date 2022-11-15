import { scaleRatio } from "../constants";
import { Grid } from "../game-objects/Grid";
import { PlayerDirection } from "../typings";
import { Constructor } from "./types";

export function GridMovement<TBase extends Constructor<Phaser.GameObjects.Sprite>>(Base: TBase, grid: Grid) {
  return class GridMovement extends Base {
    gridX = 0;
    gridY = 0;
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
      const newY = this.gridY - 1;
      if (grid.moveFromTo(this.gridX, this.gridY, this.gridX, newY)) {
        this.gridY = newY;
      }
    };

    moveDown = () => {
      const newY = this.gridY + 1;
      if (grid.moveFromTo(this.gridX, this.gridY, this.gridX, newY)) {
        this.gridY = newY;
      }
    };

    moveLeft = () => {
      const newX = this.gridX - 1;
      if (grid.moveFromTo(this.gridX, this.gridY, newX, this.gridY)) {
        this.gridX = newX;
        this.setDirection(PlayerDirection.LEFT);
      }
    };

    moveRight = () => {
      const newX = this.gridX + 1;
      if (grid.moveFromTo(this.gridX, this.gridY, newX, this.gridY)) {
        this.gridX = newX;
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
