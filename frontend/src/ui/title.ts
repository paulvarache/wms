import { LitElement, html, css, property } from "lit-element";

export class WMSTitle extends LitElement {
    static get styles() {
        return [css`
            :host {
                font-family: Arial, Helvetica, sans-serif;
                padding-left: 16px;
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            a {
                margin-right: 16px;
            }
            h2 {
                font-weight: normal;
            }
            ::slotted(*) {
                margin-left: 16px;
                color: #3367d6;
                display: inline-block;
                height: 36px;
                line-height: 36px;
                text-transform: uppercase;
                vertical-align: middle;
                font-weight: bold;
                text-decoration: none;
                background: none;
                user-select: none;
                cursor: pointer;
                outline: none;
                border: none;
                font-size: 13px;
                border-radius: 5px;
                padding: 0 12px;
            }
            ::slotted(*:hover:not([disabled])) {
                background-color: rgba(0,0,0,0.08);
            }
            ::slotted(*[disabled]) {
                color: rgba(0,0,0,.54);
            }
        `]
    }

    @property({ type: String })
    title = '';

    @property({ type: String })
    backLink = '';

    @property({ type: Boolean })
    backButton = false;

    render() {
        return html`
            <a ?hidden=${!this.backButton} href=${this.backLink}>&lt;</a>
            <h2>${this.title}</h2>
            <slot></slot>
        `;
    }
}