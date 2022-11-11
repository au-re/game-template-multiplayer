export enum PlayerDirection {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface LocalState {
  isAuthenticated: boolean;
  gameId: string;
  uid: string;
}

export interface GameState {
  host: string;
  players: {
    [key: string]: PlayerState;
  };
  timer: number;
  status: GameStatus;
}

export interface PlayerState {
  xPos: number;
  yPos: number;
  direction: PlayerDirection;
}

export enum GameStatus {
  LOBBY,
  IN_GAME,
}
