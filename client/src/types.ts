
export enum GameState {
  READY,
  PLAYING,
  SUCCESS,
  FAIL,
}

export interface Cell {
  hasMine: boolean;
  value: number;
  revealed: true;
}

export interface GamePayload {
  game: {
    mines: number;
    cellsLeft: number;
    rows: number;
    columns: number;
    currentPlayer: number;
    state: GameState;
    grid: Array<Array<Cell>>
  };
  players: Array<number>;
}
