import { Actor } from "../game-objects/Actor";
import { Constructor } from "./types";

export function ContinuousMovement<TBase extends Constructor<Actor>>(Base: TBase) {
  return class ContinuousMovement extends Base {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(...args: any[]) {
      super(...args);

      // KEYS
      this.keyW = this.scene.input.keyboard.addKey("W");
      this.keyA = this.scene.input.keyboard.addKey("A");
      this.keyS = this.scene.input.keyboard.addKey("S");
      this.keyD = this.scene.input.keyboard.addKey("D");
    }

    update(t: number, dt: number) {
      super.update(t, dt);

      this.getBody()?.setVelocity(0);

      if (this.keyW?.isDown) {
        this.body.velocity.y = -this.movementSpeed;
      }

      if (this.keyA?.isDown) {
        this.body.velocity.x = -this.movementSpeed;
        this.checkFlip();
      }

      if (this.keyS?.isDown) {
        this.body.velocity.y = this.movementSpeed;
      }

      if (this.keyD?.isDown) {
        this.body.velocity.x = this.movementSpeed;
        this.checkFlip();
      }
    }
  };
}
