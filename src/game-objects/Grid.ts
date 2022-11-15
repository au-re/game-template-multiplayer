export class Grid extends Phaser.GameObjects.GameObject {
  items: { [key: number]: { [key: number]: Phaser.GameObjects.Sprite | null } } = {};
  xDim = 1;
  yDim = 1;
  x = 0;
  y = 0;
  xCenter = 0;
  yCenter = 0;
  cellWidth = 10;

  constructor(scene: Phaser.Scene, x = 0, y = 0, xDim = 1, yDim = 1, cellWidth: number) {
    super(scene, "grid");
    this.xDim = xDim;
    this.yDim = yDim;
    this.x = x;
    this.y = y;
    this.xCenter = x + (xDim * cellWidth) / 2;
    this.yCenter = y + (yDim * cellWidth) / 2;
    this.cellWidth = cellWidth;

    if (xDim < 1 || yDim < 1) {
      throw new Error("incorrect grid dimentions");
    }

    for (let i = 0; i < xDim; i++) {
      for (let j = 0; j < yDim; j++) {
        if (!this.items[i]) this.items[i] = {};
        this.items[i][j] = null;
      }
    }

    // visualize the grid
    scene.add.grid(this.xCenter, this.yCenter, xDim * cellWidth, yDim * cellWidth, cellWidth, cellWidth, 255);
  }

  canPlaceAt(xPos: number, yPos: number) {
    return xPos >= 0 && yPos >= 0 && xPos < this.xDim && yPos < this.yDim && !this.items[xPos][yPos];
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

  moveFromTo(xFrom: number, yFrom: number, xTo: number, yTo: number) {
    const item = this.items[xFrom][yFrom] as Phaser.GameObjects.Sprite;
    if (this.setItemAt(item, xTo, yTo)) {
      this.items[xFrom][yFrom] = null;
      return true;
    }
    return false;
  }

  setItemAt(item: Phaser.GameObjects.Sprite, xPos: number, yPos: number) {
    if (!this.canPlaceAt(xPos, yPos)) return false;
    this.items[xPos][yPos] = item;
    const { x, y } = this.getCellPos(xPos, yPos);
    item.x = x;
    item.y = y;
    return true;
  }

  toString() {
    return JSON.stringify(this.items);
  }
}
