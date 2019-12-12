import { LitElement, html, css } from "lit-element";

export class WMSNav extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: column;
                background: var(--nav-background);
                width: 256px;
            }
            .title {
                height: 60px;
            }
            nav {
                flex: 1;
                display: flex;
                flex-direction: column;
                border-top: 1px solid var(--border-color);
                padding-top: 8px;
            }
            nav>* {
                font-family: Arial, Helvetica, sans-serif;
                text-decoration: none;
                color: black;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 40px;
                padding-left: 16px;
            }
            nav>*:hover {
                background-color: rgba(0, 0, 0, 0.04);
            }
            nav>*.selected {
                background-color: rgba(161,194,250,.16);
                color: #3367d6;
            }
        `];
    }
    render() {
        return html`
            <div class="title"></div>
            <nav>
                <a href="/">Inventory</a>
                <a href="/warehouses">Warehouses</a>
                <a href="/operations">Operations</a>
            </nav>
        `;
    }
}