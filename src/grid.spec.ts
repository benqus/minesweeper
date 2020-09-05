import { expect } from 'chai';
import { genereateCoord, updateCellsAroundMine, generateMines, createGrid } from './grid';

describe('Grid', () => {

  describe('generateCoords', () => {
    
    it('returns an array', () => {
      const coords = genereateCoord(10, 10);
      expect(coords).to.be.a('array');
      expect(coords.length).to.equal(2);  
    });

    it('coords', () => {
      const [ x, y ] = genereateCoord(10, 10);
      expect(x).to.be.a('number');
      expect(x).to.be.within(0, 10);
      expect(y).to.be.within(0, 10);
    });
    
  });

  describe('createGrid', () => {
    
    it('creates a grid of required dimensions filled with zeros', () => {
      const grid = createGrid(5, 5);
      expect(grid).to.eql([
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
      ]);
    });

  });

  describe('updateCellsAroundMine', () => {
    
    it('updates cells around a mine', () => {
      const grid = createGrid(5, 5);
      grid[2][2] = 9;

      console.log(grid);
      updateCellsAroundMine(grid, 2, 2);
      console.log(grid);

      expect(grid).to.eql([
        [0,0,0,0,0],
        [0,1,1,1,0],
        [0,1,9,1,0],
        [0,1,1,1,0],
        [0,0,0,0,0],
      ]);
    });

    it('updates cells around two mines', () => {
      const grid = createGrid(5, 5);
      grid[1][1] = 9;
      grid[3][3] = 9;

      console.log(grid);
      updateCellsAroundMine(grid, 1, 1);
      updateCellsAroundMine(grid, 3, 3);
      console.log(grid);

      expect(grid).to.eql([
        [1,1,1,0,0],
        [1,9,1,0,0],
        [1,1,2,1,1],
        [0,0,1,9,1],
        [0,0,1,1,1],
      ]);
    });

    it('updates cells around four mines', () => {
      const grid = createGrid(5, 5);
      grid[1][1] = 9;
      grid[1][3] = 9;
      grid[3][1] = 9;
      grid[3][3] = 9;

      console.log(grid);
      updateCellsAroundMine(grid, 1, 1);
      updateCellsAroundMine(grid, 1, 3);
      updateCellsAroundMine(grid, 3, 1);
      updateCellsAroundMine(grid, 3, 3);
      console.log(grid);

      expect(grid).to.eql([
        [1,1,2,1,1],
        [1,9,2,9,1],
        [2,2,4,2,2],
        [1,9,2,9,1],
        [1,1,2,1,1],
      ]);
    });

    it('handles corner cells', () => {
      const grid = createGrid(5, 5);
      grid[0][0] = 9;
      grid[0][4] = 9;
      grid[4][0] = 9;
      grid[4][4] = 9;

      console.log(grid);
      updateCellsAroundMine(grid, 0, 0);
      updateCellsAroundMine(grid, 0, 4);
      updateCellsAroundMine(grid, 4, 0);
      updateCellsAroundMine(grid, 4, 4);
      console.log(grid);

      expect(grid).to.eql([
        [9,1,0,1,9],
        [1,1,0,1,1],
        [0,0,0,0,0],
        [1,1,0,1,1],
        [9,1,0,1,9],
      ]);
    });

  });

  describe('generateMines', () => {
    it('generates mines', () => {
      const grid = createGrid(5, 5);
      const mineCoords = generateMines(grid, 2, 5, 5);
      
      expect(mineCoords).to.have.lengthOf(2);
  
      const [ [y1, x1], [y2, x2] ] = mineCoords;
      console.log(grid);
      expect(grid[y1][x1], `[${y1}][${x1}]`).to.equal(9);
      expect(grid[y2][x2], `[${y2}][${x2}]`).to.equal(9);
    });
  });

});