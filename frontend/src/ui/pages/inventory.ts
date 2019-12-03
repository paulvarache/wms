import { LitElement, html, property, css } from "lit-element";
import '../table';
import { TableProvider } from "../../mediator/table/table-provider";
import { InventoryItem } from "../../proto/inventory_grpc_web_pb";

export class WMSInventory extends LitElement {

    @property({ type: Object })
    provider? : TableProvider<InventoryItem>;

    @property({ type: Boolean })
    disabled = false;

    static get styles() {
        return [css`
            :host {
                display: block;
            }
            wms-table[disabled] {
                opacity: 0.6;
                pointer-events: none;
            }
        `];
    }

    render() {
        return html`
            <input type="text" @input=${this.onTypeIn} />
            <wms-table ?disabled=${this.disabled} .provider=${this.provider}></wms-table>
        `;
    }

    onTypeIn() {
        const el = this.renderRoot.querySelector('input') as HTMLInputElement;
        this.dispatchEvent(new CustomEvent('filter', { detail: el.value }));
    }
}
