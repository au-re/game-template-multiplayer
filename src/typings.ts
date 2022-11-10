export interface PlayerState {
  xPos: number;
  yPos: number;
  isInverted: boolean;
}

export interface GameState {
  host: string;
  players: {
    [key: string]: PlayerState;
  };
  timer: number;
  status: GameStatus;
}

export enum GameStatus {
  LOBBY,
  IN_GAME,
}
