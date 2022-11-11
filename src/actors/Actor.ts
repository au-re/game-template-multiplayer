import { Physics } from "phaser";
import { scaleRatio } from "../constants";
import { PlayerDirection } from "../typings";

export class Actor extends Physics.Arcade.Sprite {
  public direction = PlayerDirection.RIGHT;
  public movementSpeed = 400;
  // used for smoothing network latency
  public targetPos = {
    x: 0,
    y: 0,
  };

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
  }

  checkFlip() {
    if (this.body.velocity.x < 0) {
      this.scaleX = -1 * scaleRatio;
      this.direction = PlayerDirection.LEFT;
      this.body.offset.x = this.body.width / scaleRatio;
    } else {
      this.scaleX = 1 * scaleRatio;
      this.direction = PlayerDirection.RIGHT;
      this.body.offset.x = 0;
    }
  }

  setDirection(direction: PlayerDirection) {
    if (direction == PlayerDirection.LEFT) {
      this.scaleX = -1 * scaleRatio;
      this.direction = PlayerDirection.LEFT;
      this.body.offset.x = this.body.width / scaleRatio;
    } else {
      this.scaleX = 1 * scaleRatio;
      this.direction = PlayerDirection.RIGHT;
      this.body.offset.x = 0;
    }
  }

  moveActorToPos() {
    this.scene.physics.moveTo(this, this.targetPos.x, this.targetPos.y, this.movementSpeed, 200);
  }

  hasArrivedToPos() {
    return Math.abs(this.x - this.targetPos.x) < 10 && Math.abs(this.y - this.targetPos.y) < 10;
  }

  getBody() {
    return this.body as Physics.Arcade.Body;
  }
}
