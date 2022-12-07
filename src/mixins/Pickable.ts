import { Constructor } from "./types";

// makes a game object pickable on collision:
// - emits event when the object is picked
// - removes the object when it is picked
export function Pickable<TBase extends Constructor<Phaser.GameObjects.Sprite>>(Base: TBase, target: Phaser.GameObjects.Sprite, onPick: (picked: Phaser.GameObjects.Sprite) => void) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      this.scene.physics.add.existing(this);
      this.scene.physics.add.collider(this, target, () => {
          this.destroy();
          onPick(this);
      });
    }
  };
}
