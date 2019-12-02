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