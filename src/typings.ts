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

export interface DanceFloorState {
  [key: number]: { [key: number]: { r: number; g: number; b: number } };
}

export interface GameState {
  host: string;
  grid: GridState;
  danceFloor: DanceFloorState;
  gameOver: boolean;
  players: {
    [key: string]: PlayerState;
  };
  timer: number;
  status: GameStatus;
}

export interface GridState {
  players: {
    [key: string]: { xPos: number; yPos: number };
  };
}

export interface PlayerState {
  xPos: number;
  yPos: number;
  direction: PlayerDirection;
}

export enum GameStatus {
  NOT_STARTED,
  LOBBY,
  IN_GAME,
}

export interface SceneData {
  localState: LocalState;
  gameState: GameState;
}
