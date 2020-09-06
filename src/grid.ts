export type Coord = [ number, number ];
export type Template = number[][];

export function incrementCell(grid: number[][], x: number, y: number): void {
  if (grid[x] && grid[x][y] != null && grid[x][y] !== 9) {
    grid[x][y] += 1;
  }
}

export function genereateCoord(maxX: number, maxY: number): Coord {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY);
  return [ x, y ];
}

export function updateCellsAroundMine(grid: Template, x: number, y: number): Template {
  // 3 neighbouring cells in the row above
  incrementCell(grid, x-1, y-1);
  incrementCell(grid, x-1, y);
  incrementCell(grid, x-1, y+1);
  // same row
  incrementCell(grid, x, y-1);
  incrementCell(grid, x, y+1);
  // 3 neighbouring cells in the row below
  incrementCell(grid, x+1, y-1);
  incrementCell(grid, x+1, y);
  incrementCell(grid, x+1, y+1);

  return grid;
}

export function generateMines(grid: Template, mines: number, maxX: number, maxY: number): Array<Coord> {
  const mineCoordsIndex: Record<string, boolean> = {};
  const coords: Array<Coord> = [];
  let i: number = 0;
  while (i < mines) {
    const [ x, y ] = genereateCoord(maxX, maxY);
    const cell: string = `${x}:${y}`;
    if (!mineCoordsIndex[cell]) {
      mineCoordsIndex[cell] = true;
      // TODO refactor and flip x,y
      coords.push([y, x]);
      grid[y][x] = 9;
      i++;
    }
  }
  return coords;
}

export function createGrid(rows: number, columns: number): Template {
  const grid: Template = [];
  for (let i = 0; i < rows; i++) {
    const row: Array<number> = new Array(columns);
    row.fill(0);
    grid.push(row);
  }
  return grid;
}

export function generateGrid(rows: number, columns: number, mines: number): Template {
  const grid: Template = createGrid(rows, columns);
  const mineCoords: Array<Coord> = generateMines(grid, mines, rows, columns);
  mineCoords.forEach(([x, y]: Coord) => updateCellsAroundMine(grid, x, y));
  return grid;
}
