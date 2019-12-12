import { LitElement, html, property, css } from "lit-element";
import '../table';
import { OperationItemsTableProvider } from "../../mediator/pages/operation";

export class WMSOperation extends LitElement {

    @property({ type: String })
    name = '';

    @property({ type: Object })
    provider? : OperationItemsTableProvider;

    static get styles() {
        return [css`
            :host {
                display: flex;
                flex-direction: column;
            }
        `];
    }

    render() {
        return html`
            <h3>${this.name}</h3>
            <wms-table .provider=${this.provider}></wms-table>
        `;
    }
}
