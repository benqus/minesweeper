import { LitElement, html, css, customElement, internalProperty } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat';
import axios from 'axios';
import { GamePayload, GameState, Cell } from './types';

import './cell-button';

let wsConnection: WebSocket;

@customElement('imgarena-minesweeper')
export default class IMGArenaMinesweeper extends LitElement {

  static get styles() {
    return css`
      .row {
        white-space: nowrap;
      }
    `;
  }

  @internalProperty()
  player: number = null;

  @internalProperty()
  status: GamePayload = null;

  async connectedCallback() {
    super.connectedCallback();
    const { data } = await axios.get<GamePayload>('http://localhost:4000/game');
    this.status = data;
  }

  disconnectedCallback() {
    if (wsConnection) wsConnection.close();
    super.disconnectedCallback();
  }

  joinGame(player: number): void {
    this.player = player;
    // keeping things simple here now but I'd prefer connection management to be in a separate module
    const connection: WebSocket = new WebSocket(`ws://localhost:4000/minesweeper?player=${player}`);
    connection.onopen = () => wsConnection = connection;
    connection.onmessage = ({ data }: MessageEvent) => this.status = JSON.parse(data);
    connection.onclose = () => {
      // unless manually closed, reconnect timeout can be implemented here
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
    if (this.player != null) return html`<p>You are Player ${this.player}</p>`;
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
    const { state } = this.status.game;
    const myTurn: boolean = (this.player === this.status.game.currentPlayer);
    let message: string = 'ready';
    if (state === GameState.READY || state === GameState.PLAYING) message = myTurn ? 'Your turn' : 'Waiting for other player';
    if (state === GameState.SUCCESS) message = `You ${myTurn ? 'win' : 'lose'}!`;
    if (state === GameState.FAIL) message = `You ${!myTurn ? 'win' : 'lose'}!`;
    return html`
      <p>${message}</p>
      ${this.player != null ? html`<button @click=${e => this.resetGame()}>reset</button>` : null}
    `;
  }

  get renderGrid() {
    if (!this.status) return null;
    return html`
      <div class="grid">
        ${repeat(this.status.game.grid, ((_, i) => i), (row: Array<Cell>, i: number) =>
          html`
            <div class="row">
              ${repeat(row, ({ hasMine, value, revealed }: Cell, c: number) =>
                html`<cell-button @click=${e => this.revealCell(i, c)} .value=${value} .has-mine=${hasMine} .revealed=${revealed}></cell-button>`
              )}
            </div>
          `)}
      </div>
    `;
  }

}
