export class Cell {

  private _revealed: boolean = false;

  constructor(
    public readonly value: number = 0,
  ) {}

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

  public populate(cells: Array<number>): Row {
    cells.forEach((value: number) => this._cells.push(new Cell(value)));
    return this;
  }

  public getCell(index: number): Cell {
    return this._cells[index];
  }

  public revealCell(index: number): boolean {
    const cell = this._cells[index];
    return cell.reveal(); // cell doesn't have mine
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

  public populate(template: number[][]): Grid {
    this._rows = template.map(Row.create);
    return this;
  }

  public getCell(r: number, c: number): Cell {
    return this.rows[r].getCell(c);
  }

  public revealCell(r: number, c: number): boolean {
    const row: Row = this.rows[r];
    return row.revealCell(c);
  }

  public toJSON() {
    return this.rows.map((row: Row) => row.toJSON());
  }
  
}

