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
                border-top: 1px solid var(--border-color);
            }
        `];
    }
    render() {
        return html`
            <div class="title"></div>
            <nav>
                <slot></slot>
            </nav>
        `;
    }
}