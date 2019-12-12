import { LitElement, html, property, css } from "lit-element";
import '../table';
import { TableProvider } from "../../mediator/table/table-provider";
import { Operation } from "../../proto/inventory_grpc_web_pb";

export class WMSOperations extends LitElement {

    @property({ type: Object })
    provider? : TableProvider<Operation>;

    static get styles() {
        return [css`
            :host {
                display: block;
            }
        `];
    }

    render() {
        return html`
            <wms-table .provider=${this.provider}></wms-table>
        `;
    }
}
