import { LitElement, html, css } from 'lit-element';

export class WMSLayout extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: column;
            }
            header {
                background: var(--accent-color);
                box-shadow: 0 3px 4px 0 rgba(0,0,0,.2), 0 3px 3px -2px rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
                height: 48px;
                min-height: 48px;
                z-index: 0;
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
