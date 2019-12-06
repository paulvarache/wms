import { Page } from '../page';
import { Mediator } from '../mediator';
import { InventoryManager } from '../../model/inventory';
import { WMSInventory } from '../../ui/pages/inventory';
import { TableProvider } from '../table/table-provider';
import { InventoryItem } from '../../proto/inventory_pb';
import { html } from 'lit-html';
import { subscribeDOM } from '@kano/common';
import { RefreshAction } from '../title-action';

class InventoryTableProvider extends TableProvider<InventoryItem> {
    items : InventoryItem[] = [];
    setItems(items : InventoryItem[]) {
        this.items = items;
        this._onDidRefresh.fire();
    }
    getHeadRows() {
        return [
            'SKU',
            'Name',
            'Description',
            'Barcode',
            'Location',
            'Warehouse',
            'Quantity'
        ];
    }
    getRows(): InventoryItem[] {
        return this.items;
    }
    getCellText(index: number, data: InventoryItem) {
        switch(index) {
            case 0: {
                return html`${data.getSku()!.getSku()}`;
            }
            case 1: {
                return html`${data.getSku()!.getName()}`;
            }
            case 2: {
                return html`${data.getSku()!.getDescription()}`;
            }
            case 3: {
                return html`${data.getSku()!.getBarcode()}`;
            }
            case 4: {
                const location = data.getLocation();
                if (!location) {
                    return html``;
                }
                return html`<a href="/location/${location.getId()}">${location.getId()}</a>`;
            }
            case 5: {
                const warehouse = data.getWarehouse();
                if (!warehouse) {
                    return html``;
                }
                return html`<a href="/warehouse/${warehouse.getId()}">${warehouse.getName()}</a>`;
            }
            case 6: {
                return html`${data.getQuantity()}`;
            }
        }
        return html``;
    }
}

customElements.define('wms-home', WMSInventory);

export class HomePage extends Page<WMSInventory> {
    inventoryManager : InventoryManager;
    tableProvider = new InventoryTableProvider();
    refreshAction: RefreshAction;
    constructor(mediator : Mediator) {
        super(mediator);
        this.inventoryManager = new InventoryManager(this.mediator.client);
        this.refreshAction = new RefreshAction();

        this.refreshAction.onDidActivate(() => {
            this.inventoryManager.invalidate();
            this.updateList();
        });

        this.actions.push(this.refreshAction);
    }
    getTagName() {
        return 'wms-home';
    }
    getTitle() {
        return 'Home';
    }
    created() {
        subscribeDOM(this.domNode, 'filter', (e : CustomEvent) => {
            this.domNode.disabled = true;
            this.inventoryManager.search(e.detail)
                .then((items) => {
                    this.tableProvider.setItems(items);
                    this.domNode.disabled = false;
                });
        });
        this.domNode.provider = this.tableProvider;
        this.updateList();
    }
    updateList() {
        this.refreshAction.disabled = true;
        this.domNode.disabled = true;
        this.inventoryManager.retrieve()
            .then((items) => {
                this.tableProvider.setItems(items);
                this.domNode.disabled = false;
                this.refreshAction.disabled = false;
            });
    }
}