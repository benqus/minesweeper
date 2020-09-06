import { Grid, Cell } from './MineSweeper';
import { generateGrid } from './grid';
import { GameState } from './types';

export default class Game {

  public static create(rows?: number, cols?: number, mines?: number, template?: number[][]): Game {
    const game = new Game(rows, cols, mines);
    game.reset(template);
    return game;
  }

  private _grid: Grid;
  private _state: GameState;
  private _currentPlayer: 0 | 1;

  public onupdate = () => {};

  constructor(
    public rows: number = 10,
    public columns: number = 10,
    public mines: number = 10,
  ) {}

  private _revealNeighbourCell(r: number, c: number): void {
    const cell: Cell = this.grid.getCell(r, c);
    if (!cell || cell.revealed) return;
    this._revealCellNeighbours(r, c); 
  }

  private _revealCellNeighbours(row: number, col: number): void {
    const cell: Cell = this.grid.getCell(row, col);
    if (!cell || this.grid.isMineCell(row, col)) return;

    this.grid.revealCell(row, col);

    if (cell.isEmpty) {
      this._revealNeighbourCell(row+1, col);   // N
      this._revealNeighbourCell(row,   col+1); // E
      this._revealNeighbourCell(row-1, col);   // S
      this._revealNeighbourCell(row,   col-1); // W
    }
  }

  public get grid(): Game["_grid"] {
    return this._grid;
  }

  public get state(): Game["_state"] {
    return this._state;
  }

  public get currentPlayer(): Game["_currentPlayer"] {
    return this._currentPlayer;
  }

  public revealCell(row: number, col: number): void {
    if (!this.grid.getCell(row, col)) return;
    if (this.state === GameState.READY) this._state = GameState.PLAYING;
    
    const blewUp: boolean = this.grid.revealCell(row, col);
    if (blewUp) {
      this._state = GameState.FAIL;
      this.grid.reveal();
    } else {
      this._revealCellNeighbours(row, col);
  
      if (this.mines === this.grid.cellsLeft) {
        this._state = GameState.SUCCESS;
        this.grid.reveal();
      } else {
        this.togglePlayers();
      }  
    }

    this.onupdate();
  }

  public togglePlayers(): void {
    this._currentPlayer = (this._currentPlayer === 0 ? 1 : 0);
  }

  public reset(template?: number[][]): void {
    this._state = GameState.READY;
    this._currentPlayer = 0;

    template = (template || generateGrid(this.rows, this.columns, this.mines));

    this._grid = this._grid || new Grid();
    this._grid.populate(template);

    this.onupdate();
  }

  public toJSON() {
    const grid = this.grid.toJSON();
    const { cellsLeft } = this.grid;
    const { currentPlayer, state, rows, columns, mines } = this;
    return { grid, currentPlayer, state, rows, columns, mines, cellsLeft };
  }

}
