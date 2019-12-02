import { LitElement, html, property, customElement, css } from "lit-element";
import { TableProvider } from "../mediator/table/table-provider";

@customElement('wms-table')
export class WMSTable<T> extends LitElement {

    static get styles() {
        return [css`
            :host {
                display: block;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
            }
            table {
                width: 100%;
                border: none;
            }
            th {
                color: black;
            }
            th, td {
                text-align: left;
                border-bottom: 1px solid rgba(0,0,0,.16);
            }
            th.checkbox, td.checkbox {
                padding-bottom: 0;
                padding-right: 8px;
                width: 12px;
            }
            thead tr {
                border: 0;
                font-family: inherit;
                font-size: 100%;
                font-style: inherit;
                font-weight: inherit;
                margin: 0;
                outline: 0;
                padding: 0;
                vertical-align: baseline;
            }
            tbody tr:hover {
                background-color: rgba(0,0,0,.04);
            }
            th {
                font-weight: 500;
                font-size: 11px;
                letter-spacing: normal;
                line-height: 12px;
                color: rgb(0,0,0);
                bottom: auto;
                padding: 6px 0 5px;
                vertical-align: top;
            }
            td:first-child, th:first-child {
                padding-left: 8px;
            }
            td {
                vertical-align: top;
                color: rgba(0,0,0,.654);
                padding: 7px 0 8px 0;
                border-bottom: 1px solid rgba(0,0,0,.08);
            }
            tr .checkbox+td {
                padding-left: 4px;
                color: black;
            }
            td:not(:first-child) {
                padding-left: 24px;
            }
        `];
    }

    @property({ type: Object })
    provider? : TableProvider<T>;

    updated(changed : Map<string, unknown>) {
        if (changed.has('provider') && this.provider) {
            this.provider.onDidRefresh(() => {
                this.requestUpdate();
            });
        }
    }

    mainCheckChanged() {

    }

    render() {
        if (!this.provider) {
            return html``;
        }
        const head = this.provider.getHeadRows();
        return html`
            <table cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th class="checkbox">
                            <input type="checkbox" @input=${this.mainCheckChanged} />
                        </th>
                        ${head.map(title => html`
                            <th>${title}<th>
                        `)}
                    </tr>
                </thead>
                <tbody>
                    ${this.provider.getRows().map(item => html`
                        <tr>
                            <td class="checkbox">
                                <input type="checkbox" />
                            </td>
                            ${head.map((_, index) => html`
                                <td>${this.provider!.getCellText(index, item)}<td>
                            `)}
                        </tr>
                    `)}
                </tbody>
            </table>
        `;
    }
}