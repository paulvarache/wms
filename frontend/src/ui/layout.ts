import { LitElement, html, css } from 'lit-element';

export class WMSLayout extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: column;
            }
            header {
                height: 60px;
                background: var(--accent-color);
            }
            .main {
                flex: 1;
                display: flex;
                flex-direction: row;
            }
            [name="content"]::slotted(*) {
                flex: 1;
            }
        `];
    }
    render() {
        return html`
            <header></header>
            <div class="main">
                <slot name="sidebar"></slot>
                <slot name="content"></slot>
            </div>
        `;
    }
}
