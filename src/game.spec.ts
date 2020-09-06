import { expect } from 'chai';
import Game from './Game';
import { GameState } from './types';

describe('Game', () => {

  it('toggles between players', () => {
    const game = Game.create();
    game.reset();
    expect(game.currentPlayer).to.equal(0);
    game.togglePlayers();
    expect(game.currentPlayer).to.equal(1);
  });

  it('with template', () => {
    const game = Game.create();
    game.reset([
      [0, 0, 1, 1, 1],
      [0, 0, 1, 9, 1],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(game.toJSON().state).to.equal(GameState.READY);
    expect(game.toJSON().cellsLeft).to.equal(25);
    expect(game.toJSON().currentPlayer).to.equal(0);
  });

  it('reveal an empty cell and neighbour cells', () => {
    const game = Game.create(5, 5, 1, [
      [0, 0, 1, 1, 1],
      [0, 0, 1, 9, 1],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    game.revealCell(1, 1);
    const { state, currentPlayer, cellsLeft } = game.toJSON();

    expect(state).to.equal(GameState.PLAYING);
    expect(currentPlayer).to.equal(1);
    expect(cellsLeft).to.equal(4);
  });

  it('reveal an empty cell and neighbour cells', () => {
    const game = Game.create(5, 5, 1, [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 9, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
    game.revealCell(0, 0);
    const { state, currentPlayer, cellsLeft } = game.toJSON();

    expect(state).to.equal(GameState.SUCCESS);
    expect(currentPlayer).to.equal(0);
    expect(cellsLeft).to.equal(1);
  });

  it('reveal a non-empty cell only', () => {
    const game = Game.create(5, 5, 1, [
      [0, 0, 1, 1, 1],
      [0, 0, 1, 9, 1],
      [0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    game.revealCell(2, 2);
    const { state, currentPlayer, cellsLeft } = game.toJSON();

    expect(state).to.equal(GameState.PLAYING);
    expect(currentPlayer).to.equal(1);
    expect(cellsLeft).to.equal(24);
  });

});
