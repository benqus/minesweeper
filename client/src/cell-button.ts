import { LitElement, html, css, customElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('cell-button')
export default class CellButton extends LitElement {

  static get styles() {
    return css`
      button {
        display: inline-block;
        width: 2em;
        height: 2em;
        line-height: 1em;
        text-align: center;
        background: #C0C0C0;
        border-top: 2px solid #F3F3F3;
        border-left: 2px solid #F3F3F3;
        border-right: 2px solid #818181;
        border-bottom: 2px solid #818181;
        color: #C0C0C0;
        margin-right: 1px;
        margin-bottom: 1px;
        cursor: pointer;
        outline: none;
      }

      button.empty {
        color: #C0C0C0;
      }

      button:disabled {
        border-top: 1px solid #818181;
        border-left: 1px solid #818181;
        border-right: 1px solid #F3F3F3;
        border-bottom: 1px solid #F3F3F3;
      }

      button:disabled:not(.empty) {
        color: #151DE0;
      }
    `;
  }

  @property({ type: Boolean, attribute: 'has-mine' })
  hasMine = false;

  @property({ type: Boolean })
  revealed = false;

  @property({ type: Number })
  value = 0;

  render() {
    const { revealed, value } = this;
    const empty: boolean = (value === 0);
    const label: string = (value === 9) ? 'B' : `${value}`;
    return html`<button class=${classMap({ empty })} ?disabled=${revealed}>${label}</button>`;
  }

}
