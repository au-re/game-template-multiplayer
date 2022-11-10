import React from "react";
import Phaser from "phaser";

/**
 * extend phaser with a callback for game updates from within phaser
 *
 * TODO: check if there is a better way of doing this
 */
export class Game extends Phaser.Game {
  public onUpdate!: (val: any) => void;

  constructor(config: any, onUpdate: (val: any) => void) {
    super(config);
    this.onUpdate = onUpdate;
  }
}
