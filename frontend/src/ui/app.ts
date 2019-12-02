import { LitElement, html, css, property } from "lit-element";
import { WMSLayout } from "./layout";
import { WMSNav } from "./nav";
import { WMSTitle } from "./title";

customElements.define('wms-layout', WMSLayout);
customElements.define('wms-nav', WMSNav);
customElements.define('wms-title', WMSTitle);

export class WMSApp extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: block;
                height: 100%;
            }
            wms-layout {
                height: 100%;
            }
            wms-nav {
                border-right: 1px solid var(--border-color);
            }
            wms-title {
                height: 60px;
                border-bottom: 1px solid var(--border-color);
            }
            .content {
                display: flex;
                flex-direction: column;
            }
            [name="content"]::slotted(*) {
                padding: 24px;
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
            <wms-layout>
                <wms-nav slot="sidebar"></wms-nav>
                <div slot="content">
                    <wms-title .title=${this.title} .backButton=${this.backButton} .backLink=${this.backLink}>
                        <slot name="actions"></slot>
                    </wms-title>
                    <slot name="content"></slot>
                </div>
            </wms-layout>
        `;
    }
}
