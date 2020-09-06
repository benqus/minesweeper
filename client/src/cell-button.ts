import { LitElement, html, css, customElement, property } from 'lit-element';

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

      button:disabled {
        color: #151DE0;
        border: 2px solid #C0C0C0;
      }
    `;
  }

  @property({ type: Boolean, attribute: 'has-mine' })
  hasMine = false;

  @property({ type: Boolean })
  revealed = false;

  @property({ type: String })
  value = '';

  render() {
    const { revealed, value } = this;
    return html`<button ?disabled=${revealed}>${value}</button>`;
  }

}
