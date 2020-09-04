export type Coord = [ number, number ];
export type Grid = Array<Array<number>>;

export function genereateCoord(maxX: number, maxY: number): Coord {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY);
  return [ x, y ];
}

export function generateMines(grid: Grid, mines: number, maxX: number, maxY: number): Grid {
  const mineCoords: Record<string, boolean> = {};
  let i: number = 0;
  while (i < mines) {
    const [ x, y ] = genereateCoord(maxX, maxY);
    const cell: string = `${x}:${y}`;
    if (!mineCoords[cell]) {
      mineCoords[cell] = true;
      grid[y][x] = 9;
      i++;
    }
  }
  return grid;
}

export function createGrid(columns: number, rows: number): Grid {
  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: Array<number> = new Array(columns);
    row.fill(0);
    grid.push(row);
  }
  return grid;
}

export function generateGrid(columns: number, rows: number, mines: number): Grid {
  const grid: Grid = createGrid(columns, rows);
  return generateMines(grid, mines, columns, rows);
}

// TODO
// 1. calculate how many mines each cell is neighbour with
// 2. API for turn-based minesweeper game
//   - update clients as grid is updated
//   - tests

