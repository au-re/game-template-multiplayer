import { listenToGameStateUpdates } from "../actions";
import { GameEvents } from "../constants";
import { GameState, GameStatus, LocalState } from "../typings";
import { Constructor } from "./types";

export function SyncState<TBase extends Constructor<Phaser.Scene>>(Base: TBase) {
  return class SyncState extends Base {
    localState?: LocalState;
    gameState?: GameState;

    unsubFromGameStateUpdates!: () => void;

    public onGameLeft!: () => void;
    public onGameJoined!: (gameId: string, playerId: string) => void;
    public onPlayerLeft!: (playerId: string, newGameState: GameState) => void;
    public onPlayerJoined!: (playerId: string, newGameState: GameState) => void;

    constructor(...args: any[]) {
      super(...args);
    }

    // listen to events from the UI
    create() {
      this.events.on(GameEvents.LOCAL_STATE_UPDATE, this.onLocalStateUpdate, this);
    }

    onLocalStateUpdate = (localState: LocalState) => {
      const isNowConnectedToGame = localState.gameId && !this.localState?.gameId;
      const hasLeftTheGame = !localState.gameId && this.localState?.gameId;

      if (hasLeftTheGame) {
        this.unsubFromGameStateUpdates?.();
        this.onGameLeft?.();
      }

      if (isNowConnectedToGame) {
        this.unsubFromGameStateUpdates = listenToGameStateUpdates(localState.gameId, this.onGameStateUpdates);
        this.onGameJoined?.(localState.gameId, localState.uid);
      }

      this.localState = localState;
    };

    onGameStateUpdates = (gameState: GameState) => {
      if (!this.localState?.gameId) return;

      // TODO: move navigation elsewhere
      // navigation changes
      if (this.gameState?.status !== GameStatus.IN_GAME && gameState.status === GameStatus.IN_GAME) {
        this.scene.start("GridGame", { localState: this.localState, gameState });
      }
      // ---

      // other player left the game
      Object.keys(this.gameState?.players || {}).forEach((playerId) => {
        const isRemotePlayer = playerId !== this.localState?.uid;
        if (!gameState.players[playerId] && isRemotePlayer) {
          this.onPlayerLeft?.(playerId, gameState);
        }
      });

      // other player joined the game
      Object.keys(gameState.players).forEach((playerId) => {
        const isRemotePlayer = playerId !== this.localState?.uid;
        if (!this.gameState?.players[playerId] && isRemotePlayer) {
          this.onPlayerJoined?.(playerId, gameState);
        }
      });

      this.gameState = gameState;
    };
  };
}
