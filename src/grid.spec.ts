import { expect } from 'chai';
import { genereateCoord, generateMines, createGrid } from './grid';

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
    
    it('creates a grid of required dimensions', () => {
      const grid1 = createGrid(10, 1);
      expect(grid1).to.have.lengthOf(1);
      expect(grid1[0]).to.have.lengthOf(10);
    });

  });

});