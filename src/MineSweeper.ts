export class Cell {

  private _revealed: boolean = false;

  constructor(
    public readonly value: number = 0,
  ) {}

  public get isEmpty(): boolean {
    return this.value === 0;
  }

  public get hasMine(): boolean {
    return this.value === 9;
  }

  public get revealed(): boolean {
    return this._revealed;
  }

  public reveal(): boolean {
    this._revealed = true;
    return this.hasMine;
  }

  toJSON() {
    const { hasMine, value, revealed } = this;
    return { hasMine, value, revealed };
  }

}

export class Row {

  public static create(cells: Array<number>): Row {
    return (new Row()).populate(cells);
  }

  private _cells: Array<Cell> = [];

  public get cellsLeft(): number {
    return this._cells.reduce((n: number, c: Cell): number => n + (c.revealed ? 0 : 1), 0);
  }

  public populate(cells: Array<number>): Row {
    cells.forEach((value: number) => this._cells.push(new Cell(value)));
    return this;
  }

  public getCell(index: number): Cell {
    return this._cells[index] || null;
  }

  public revealCell(index: number): boolean {
    const cell = this._cells[index];
    return cell.reveal(); // cell doesn't have mine
  }

  public reveal(): boolean {
    this._cells.forEach((c: Cell) => c.reveal());
    return true;
  }

  public toJSON() {
    return this._cells.map(c => c.toJSON());
  }

}

export class Grid {

  public static create(template: number[][]): Grid {
    return (new Grid()).populate(template);
  }
  
  private _rows: Array<Row> = [];

  public get rows(): Grid["_rows"] {
    return this._rows;
  }

  public get cellsLeft(): number {
    return this._rows.reduce((n: number, r: Row): number => n + r.cellsLeft, 0);
  }

  public populate(template: number[][]): Grid {
    this._rows = template.map(Row.create);
    return this;
  }

  public getCell(r: number, c: number): Cell {
    if (!this.rows[r]) return null;
    return this.rows[r].getCell(c);
  }

  public isMineCell(r: number, c: number): boolean {
    if (!this.rows[r]) return true;
    const cell: Cell = this.rows[r].getCell(c);
    return cell ? cell.hasMine : true;
  }

  public revealCell(r: number, c: number): boolean {
    const row: Row = this.rows[r];
    return row.revealCell(c);
  }

  public reveal(): boolean {
    this.rows.forEach((r: Row) => r.reveal());
    return true;
  }

  public toJSON() {
    return this.rows.map((row: Row) => row.toJSON());
  }
  
}

