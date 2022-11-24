import { GridState } from "../typings";
import { Actor } from "./Actor";

export class Grid extends Phaser.GameObjects.GameObject {
  grid: GridState = { players: {} };
  itemRef: { [key: string]: Actor } = {};
  xDim = 1;
  yDim = 1;
  x = 0;
  y = 0;
  xCenter = 0;
  yCenter = 0;
  cellWidth = 10;
  debugGrid?: Phaser.GameObjects.Grid;

  constructor(scene: Phaser.Scene, x = 0, y = 0, xDim = 1, yDim = 1, cellWidth: number) {
    super(scene, "grid");

    if (xDim < 1 || yDim < 1) {
      throw new Error("incorrect grid dimentions");
    }

    this.xDim = xDim;
    this.yDim = yDim;
    this.x = x;
    this.y = y;
    this.xCenter = x + (xDim * cellWidth) / 2;
    this.yCenter = y + (yDim * cellWidth) / 2;
    this.cellWidth = cellWidth;

    // visualize the grid
    // scene.add.grid(this.xCenter, this.yCenter, xDim * cellWidth, yDim * cellWidth, cellWidth, cellWidth, 255);
  }

  showDebugGrid(show: boolean) {
    if (show) {
      // visualize the grid
      this.debugGrid = this.scene.add.grid(
        this.xCenter,
        this.yCenter,
        this.xDim * this.cellWidth,
        this.yDim * this.cellWidth,
        this.cellWidth,
        this.cellWidth,
        255
      );
    } else {
      if (this.debugGrid) {
        this.debugGrid.destroy();
      }
    }
  }

  canPlaceAt(xPos: number, yPos: number) {
    const isOccupied = Object.values(this.grid.players).find((pos) => pos.xPos === xPos && pos.yPos === yPos);
    return xPos >= 0 && yPos >= 0 && xPos < this.xDim && yPos < this.yDim && !isOccupied;
  }

  /**
   * return the position of the center of a cell in pixel
   */
  getCellPos(xPos: number, yPos: number) {
    return {
      x: xPos * this.cellWidth + this.x + this.cellWidth / 2,
      y: yPos * this.cellWidth + this.y + this.cellWidth / 2,
    };
  }

  setItemPos(id: string, xPos: number, yPos: number) {
    const { x, y } = this.getCellPos(xPos, yPos);
    this.itemRef[id].x = x;
    this.itemRef[id].y = y;
  }

  moveByItemId(id: string, xTo: number, yTo: number) {
    this.grid.players[id] = { xPos: xTo, yPos: yTo };
    this.setItemPos(id, xTo, yTo);
  }

  placeItem(item: Actor, xPos: number, yPos: number) {
    this.grid.players[item.id] = { xPos, yPos };
    this.itemRef[item.id] = item;
    this.setItemPos(item.id, xPos, yPos);
  }

  removeItem(itemId: string) {
    this.itemRef[itemId].destroy();
    delete this.grid.players[itemId];
    delete this.itemRef[itemId];
  }

  toString() {
    return JSON.stringify(this.grid);
  }
}
