import { updateTimerState } from "../actions";

export default class CountDown extends Phaser.GameObjects.Container {
  countdownTimerDT = 0;
  countdownTimer = 0;
  gameId = "";

  constructor(scene: Phaser.Scene, gameId: string) {
    super(scene);
    this.gameId;
  }

  update(dt: number) {
    this.countdownTimerDT += dt;
    if (this.countdownTimerDT > 1000) {
      this.countdownTimerDT = 0;
      this.countdownTimer -= 1000;
      updateTimerState(this.gameId, this.countdownTimer);
    }
  }
}
