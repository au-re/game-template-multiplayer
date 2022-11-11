import { listenToGameStateUpdates, updateTimerState } from "../actions";
import { GameState, GameStatus, LocalState } from "../typings";

export default class CountDown extends Phaser.GameObjects.Container {
  countdownTimerDT = 0;
  gameId? = "";
  playerId? = "";
  gameState?: GameState;

  constructor(scene: Phaser.Scene) {
    super(scene);
  }

  sync(gameId: string, playerId: string) {
    this.gameId = gameId;
    this.playerId = playerId;
    listenToGameStateUpdates(gameId, this.onGameStateUpdates);
  }

  onGameStateUpdates = (gameState: GameState) => {
    this.gameState = gameState;
  };

  update(dt: number) {
    const isHost = this.gameState?.host && this.playerId === this.gameState?.host;
    const isGameStarted = this.gameId && this.gameState?.status === GameStatus.IN_GAME;

    if (isHost && isGameStarted && this.gameState?.timer) {
      this.countdownTimerDT += dt;
      if (this.countdownTimerDT > 1000) {
        this.countdownTimerDT = 0;
        const newTime = this.gameState?.timer - 1000;

        // TODO: when reaching 0 do something

        updateTimerState(this.gameId as string, newTime);
      }
    }
  }
}
