import { listenToGameStateUpdates, setGameOver, updateTimerState } from "../actions";
import { GameState, GameStatus } from "../typings";

export default class CountDown extends Phaser.GameObjects.Container {
  countdownTimerDT = 0;
  gameId = "";
  isHost = false;
  gameState?: GameState;
  unsubFromGameStateUpdates!: () => void;

  constructor(scene: Phaser.Scene, gameId: string, isHost: boolean) {
    super(scene);
    this.gameId = gameId;
    this.isHost = isHost;
  }

  sync() {
    this.unsubFromGameStateUpdates = listenToGameStateUpdates(this.gameId, this.onGameStateUpdates);
  }

  onGameStateUpdates = (gameState: GameState) => {
    this.gameState = gameState;
  };

  update(t: number, dt: number) {
    const isGameStarted = this.gameId && this.gameState?.status === GameStatus.IN_GAME;

    if (this.isHost && isGameStarted && this.gameState?.timer) {
      this.countdownTimerDT += dt;
      if (this.countdownTimerDT > 1000) {
        this.countdownTimerDT = 0;
        const newTime = this.gameState?.timer - 1000;
        updateTimerState(this.gameId, newTime);

        if (newTime === 0) {
          setGameOver(this.gameId);
        }
      }
    }
  }

  destroy() {
    this.unsubFromGameStateUpdates?.();
    super.destroy();
  }
}
