import { getAuth } from "firebase/auth";
import { Physics } from "phaser";
import { scaleRatio } from "../constants";
import { PlayerDirection } from "../typings";

export class Actor extends Physics.Arcade.Sprite {
  public direction = PlayerDirection.RIGHT;
  public movementSpeed = 400;
  public id: string;
  public name: string;
  public isLocalPlayer: boolean;
  private label: Phaser.GameObjects.BitmapText;

  constructor(scene: Phaser.Scene, id: string, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(scaleRatio);
    this.id = id;
    this.name = id;
    this.isLocalPlayer = id === getAuth().currentUser?.uid;
    this.label = this.scene.add.bitmapText(x, y, "pixeled", "", 9);
    this.label.setText(this.isLocalPlayer ? "LOCAL" : "REMOTE");
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

  getBody() {
    return this.body as Physics.Arcade.Body;
  }

  removeActor() {
    this.label.destroy();
    this.destroy();
  }

  update(t: number, dt: number) {
    this.label.x = Math.floor(this.x - this.label.width / 2);
    this.label.y = Math.floor(this.y - this.label.height / 2 - 50);
  }
}
