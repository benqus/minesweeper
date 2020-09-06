import { LitElement, html, customElement, internalProperty } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import axios from 'axios';
import { GamePayload, GameState, Cell } from './types';

import './cell-button';

let wsConnection: WebSocket;

@customElement('imgarena-minesweeper')
export default class IMGArenaMinesweeper extends LitElement {

  private player: number = null;

  @internalProperty()
  status: GamePayload = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadGame();
  }

  async loadGame(): Promise<void> {
    const { data } = await axios.get<GamePayload>('http://localhost:4000/game');
    this.status = data;
  }

  joinGame(player: number): void {
    this.player = player;
    const connection: WebSocket = new WebSocket(`ws://localhost:4000/minesweeper?player=${player}`);
    connection.onopen = () => wsConnection = connection;
    connection.onmessage = ({ data }: MessageEvent) => this.status = JSON.parse(data);
    connection.onclose = () => {
      // TODO reconnect, unless manually closed
    };
  }

  resetGame(): void {
    axios.post('http://localhost:4000/game');
  }

  revealCell(row: number, col: number): void {
    const { currentPlayer, state } = this.status.game;
    if (state === GameState.SUCCESS || state === GameState.FAIL) return;
    if (currentPlayer !== this.player) return;

    const message: string = JSON.stringify([ row, col ]);
    if (wsConnection) {
      wsConnection.send(message);
    }
  }

  render() {
    return html`
      <h1>Minesweeper</h1>
      ${this.renderPlayers}
      ${this.renderGameState}
      ${this.renderGrid}
    `;
  }

  get renderPlayers() {
    if (!this.status) return html`<p>Loading game...</p>`;
    const parts = [];
    if (this.status.players.indexOf(0) === -1) parts.push(0);
    if (this.status.players.indexOf(1) === -1) parts.push(1);
    if (parts.length === 0) return null;
    return html`
      <nav>
        <p>Join as:</p>
        ${repeat(parts, i => i, (player: number) =>
          html`<button @click=${e => this.joinGame(player)}>Player ${player}</button>`
        )}
      </nav>
    `;
  }

  get renderGameState() {
    if (!this.status) return null;
    let state: string = 'ready';
    switch (this.status.game.state) {
      case GameState.PLAYING: state = 'playing'; break;
      case GameState.SUCCESS: state = 'success'; break;
      case GameState.FAIL: state = 'fail'; break;
      case GameState.READY:
      default:
        break;
    }
    return html`
      <p>${state}</p>
      ${this.player != null ? html`<button @click=${e => this.resetGame()}>reset</button>` : null}
    `;
  }

  get renderGrid() {
    if (!this.status) return null;
    return html`
      <div class="grid">
        ${repeat(this.status.game.grid, ((_, i) => i), (row: Array<Cell>, i: number) =>
          html`
            <div>
              ${repeat(row, ({ hasMine, value, revealed }: Cell, c: number) =>
                html`<cell-button @click=${e => this.revealCell(i, c)} .value=${value} .has-mine=${hasMine} .revealed=${revealed}></cell-button>`
              )}
            </div>
          `)}
      </div>
    `;
  }

}
