import {Actor} from "../game-objects/Actor"
import {ContinuousMovement} from "../mixins/ContinuousMovement"

export class Test extends Phaser.Scene {
    player!: Actor;
    
  constructor() {
    super("Test");
  }

  preload() {
      this.load.spritesheet("sprites", "assets/tilemaps/tilemap_packed.png", { frameWidth: 16, frameHeight: 16 });
      this.load.bitmapFont("pixeled", "assets/fonts/Pixeled.png", "assets/fonts/Pixeled.xml");
  }
  
  init() {
      
  }

  create() {
      const Player = ContinuousMovement(Actor)
      this.player = new Player(this,"foo","foo",250,250, "sprites", 85)
      this.player.scale = 4;
  }
  
  update(t: number, dt: number) {
      this.player.update(t, dt);
  }
}
