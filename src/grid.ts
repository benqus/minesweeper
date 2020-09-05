export type Coord = [ number, number ];
export type Grid = Array<Array<number>>;

export function genereateCoord(maxX: number, maxY: number): Coord {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY);
  return [ x, y ];
}

export function updateCellsAroundMine(grid: Grid, mineX: number, mineY: number): Grid {
  let x: number = mineX - 1;
  while (x <= mineX + 1) {
    let y: number = mineY - 1;
    while (y <= mineY + 1) {
      const isMineCell: boolean = (x === mineX && y === mineY);
      if (!isMineCell && grid[x] && !isNaN(grid[x][y])) {
        grid[x][y] += 1;
      }
      y++;
    }
    x++;
  }
  return grid;
}

export function generateMines(grid: Grid, mines: number, maxX: number, maxY: number): Array<Coord> {
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

export function createGrid(rows: number, columns: number): Grid {
  const grid: Grid = [];
  for (let i = 0; i < rows; i++) {
    const row: Array<number> = new Array(columns);
    row.fill(0);
    grid.push(row);
  }
  return grid;
}

export function generateGrid(rows: number, columns: number, mines: number): Grid {
  const grid: Grid = createGrid(rows, columns);
  const mineCoords: Array<Coord> = generateMines(grid, mines, rows, columns);
  mineCoords.forEach(([x, y]: Coord) => updateCellsAroundMine(grid, x, y));
  return grid;
}

// TODO
// 1. calculate how many mines each cell is neighbour with
// 2. API for turn-based minesweeper game
//   - update clients as grid is updated
//   - tests

