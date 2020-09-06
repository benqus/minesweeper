import { expect } from 'chai';
import { Cell, Row, Grid } from './MineSweeper';

describe('Cell', () => {

  it('create empty cell', () => {
    const cell = new Cell();
    expect(cell.value).to.equal(0);
    expect(cell.hasMine).to.equal(false);
    expect(cell.revealed).to.equal(false);
  });

  it('create mine cell', () => {
    const cell = new Cell(9);
    expect(cell.value).to.equal(9);
    expect(cell.hasMine).to.equal(true);
  });

  it('create neighbour cell', () => {
    const cell = new Cell(3);
    expect(cell.value).to.equal(3);
    expect(cell.hasMine).to.equal(false);
  });

  it('reveal mine cell', () => {
    const cell = new Cell(9);
    const blewUp = cell.reveal();
    expect(cell.revealed).to.equal(true);
    expect(blewUp).to.equal(true);
  });

  it('reveal non-mine cell', () => {
    const cell = new Cell(3);
    cell.reveal();
    expect(cell.revealed).to.equal(true);
  });

});


describe('Row', () => {

  it('create row', () => {
    const row = Row.create([0, 1, 9, 2, 9]);
    expect(row.toJSON()).to.eql([
      { value: 0, hasMine: false, revealed: false },
      { value: 1, hasMine: false, revealed: false },
      { value: 9, hasMine: true, revealed: false },
      { value: 2, hasMine: false, revealed: false },
      { value: 9, hasMine: true, revealed: false },
    ]);
  });

  it('reveal non-min cell', () => {
    const row = Row.create([0, 1, 9, 2, 9]);
    const blewUp = row.revealCell(3);
    expect(blewUp).to.equal(false);
    expect(row.toJSON()).to.eql([
      { value: 0, hasMine: false, revealed: false },
      { value: 1, hasMine: false, revealed: false },
      { value: 9, hasMine: true, revealed: false },
      { value: 2, hasMine: false, revealed: true },
      { value: 9, hasMine: true, revealed: false },
    ]);
  });

  it('reveal mine cell', () => {
    const row = Row.create([0, 1, 9, 2, 9]);
    const blewUp = row.revealCell(2);
    expect(blewUp).to.equal(true);
    expect(row.toJSON()).to.eql([
      { value: 0, hasMine: false, revealed: false },
      { value: 1, hasMine: false, revealed: false },
      { value: 9, hasMine: true, revealed: true },
      { value: 2, hasMine: false, revealed: false },
      { value: 9, hasMine: true, revealed: false },
    ]);
  });

  it('cellsLeft', () => {
    const row = Row.create([0, 1, 9, 2, 9]);
    expect(row.cellsLeft).to.equal(5);
    row.revealCell(0);
    row.revealCell(1);
    expect(row.cellsLeft).to.equal(3);
  });

});


describe('Grid', () => {

  it('create grid', () => {
    const template = [
      [0, 2, 9, 2],
      [0, 2, 9, 2],
      [0, 1, 1, 1]
    ]
    const grid = Grid.create(template);
    expect(grid.toJSON()).to.eql([
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: false },
        { value: 9, hasMine: true, revealed: false },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: false },
        { value: 9, hasMine: true, revealed: false },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
      ],
    ]);
  });

  it('reveal empty cell', () => {
    const template = [
      [0, 2, 9, 2],
      [0, 2, 9, 2],
      [0, 1, 1, 1]
    ]
    const grid = Grid.create(template);
    const blewUp = grid.revealCell(1, 1);
    expect(blewUp).to.equal(false);
    expect(grid.toJSON()).to.eql([
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: false },
        { value: 9, hasMine: true, revealed: false },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: true },
        { value: 9, hasMine: true, revealed: false },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
      ],
    ]);
  });

  it('reveal mine cell', () => {
    const template = [
      [0, 2, 9, 2],
      [0, 2, 9, 2],
      [0, 1, 1, 1]
    ]
    const grid = Grid.create(template);
    const blewUp = grid.revealCell(1, 2);
    expect(blewUp).to.equal(true);
    expect(grid.toJSON()).to.eql([
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: false },
        { value: 9, hasMine: true, revealed: false },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 2, hasMine: false, revealed: false },
        { value: 9, hasMine: true, revealed: true },
        { value: 2, hasMine: false, revealed: false },
      ],
      [
        { value: 0, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
        { value: 1, hasMine: false, revealed: false },
      ],
    ]);
  });

});

