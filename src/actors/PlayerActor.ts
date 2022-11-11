import { updatePlayerState } from "../actions";
import { Actor } from "./Actor";

export class PlayerActor extends Actor {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;

  controlled: boolean;
  playerName: Phaser.GameObjects.BitmapText;
  name: string;
  updateTimer: number = 0;
  gameId: string;

  constructor(scene: Phaser.Scene, x: number, y: number, name: string, gameId: string, controlled: boolean) {
    super(scene, x, y, "sprites", 85);

    this.movementSpeed = 400;
    this.setScale(4);
    this.name = name;
    this.controlled = controlled;
    this.playerName = this.scene.add.bitmapText(x, y, "pixeled", "", 8);
    this.playerName.setText(name);
    this.gameId = gameId;

    // KEYS
    this.keyW = this.scene.input.keyboard.addKey("W");
    this.keyA = this.scene.input.keyboard.addKey("A");
    this.keyS = this.scene.input.keyboard.addKey("S");
    this.keyD = this.scene.input.keyboard.addKey("D");
  }

  updatePlayer() {
    this.getBody().setVelocity(0);

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

  updateRemote() {
    if (this.hasArrivedToPos()) {
      this.body.reset(this.targetPos.x, this.targetPos.y);
    }
  }

  update(dt: number) {
    // update the player state every 200ms
    if (this.controlled) {
      this.updateTimer += dt;
      if (this.updateTimer > 200) {
        this.updateTimer = 0;
        updatePlayerState(this.gameId, {
          xPos: this.x,
          yPos: this.y,
          direction: this.direction,
        });
      }
    }

    if (this.controlled) this.updatePlayer();
    else this.updateRemote();

    this.playerName.x = Math.floor(this.x - this.playerName.width / 2);
    this.playerName.y = Math.floor(this.y - this.playerName.height / 2 - 50);
  }

  removePlayer() {
    this.playerName.destroy();
    this.destroy();
  }
}
