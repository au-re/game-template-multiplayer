import { GameEvents } from "../constants";

const bpm = 120;
const timerInterval = Math.round(1000 / (bpm / 60));

export default class Jukebox extends Phaser.GameObjects.Container {
  intervalTimerDT = 0;
  beatStartTimerDT = 0;
  beatEndTimerDT = 0;
  beatPlayed = false;
  gameId = "";
  isHost = false;
  inBeat = false;
  click1Sound: Phaser.Sound.BaseSound;
  click2Sound: Phaser.Sound.BaseSound;

  unsubFromGameStateUpdates!: () => void;

  constructor(scene: Phaser.Scene, gameId: string, isHost: boolean) {
    super(scene);
    this.gameId = gameId;
    this.isHost = isHost;

    this.click1Sound = this.scene.sound.add("click1");
    this.click2Sound = this.scene.sound.add("click2");
  }

  sync() {
    // this.unsubFromGameStateUpdates = listenToGameStateUpdates(this.gameId, this.onGameStateUpdates);
  }

  update(t: number, dt: number) {
    this.intervalTimerDT += dt;

    if (!this.inBeat && this.intervalTimerDT >= timerInterval - 280) {
      this.scene.events.emit(GameEvents.BEAT_START_EVENT);
      this.inBeat = true;
      this.beatPlayed = false;
    }

    if (!this.beatPlayed && this.intervalTimerDT >= timerInterval - 200) {
      this.click1Sound.play();
      this.beatPlayed = true;
    }

    if (this.inBeat && this.intervalTimerDT >= timerInterval) {
      this.scene.events.emit(GameEvents.BEAT_END_EVENT);
      this.inBeat = false;
      this.intervalTimerDT = 0;
    }
  }

  destroy() {
    // this.unsubFromGameStateUpdates?.();
    super.destroy();
  }
}
