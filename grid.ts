export type Coord = [ number, number ];
export type Row = Array<number>;
export type Grid = Array<Row>;

export function genereateCoord(maxX: number, maxY: number): Coord {
  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY);
  return [ x, y ];
}

export function generateMines(grid: Grid, mines: number, maxX: number, maxY: number) {
  const mineCoords: Record<string, boolean> = {};
  let i = 0;
  while (i < mines) {
    const [ x, y ] = genereateCoord(maxX, maxY);
    const cell = `${x}:${y}`;
    if (!mineCoords[cell]) {
      mineCoords[cell] = true;
      grid[y][x] = 9;
      i++;
    }
  }
  console.log(mineCoords);
  return grid;
}


export function generateGrid(width: number, height: number, mines: number): Grid {
  // create grid rows
  const grid: Grid = [];
  for (let i = 0; i < height; i++) {
    // create one row
    const row = (new Array(width)).fill(0);
    grid.push(row);
  }

  return generateMines(grid, mines, width, height);
}

const grid = generateGrid(3, 5, 10);
console.log(grid);


// TODO
// 1. calculate how many mines each cell is neighbour with
// 2. API for turn-based minesweeper game
//   - update clients as grid is updated
//   - tests

