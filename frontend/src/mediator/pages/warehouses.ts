import { Page } from "../page";
import { WMSWarehouses } from "../../ui/pages/warehouses";
import { TableProvider } from "../table/table-provider";
import api from '../../proto/api_grpc_web_pb';
import { WarehouseManager } from "../../model/warehouse";
import { Mediator } from "../mediator";
import { LinkTitleAction, TitleAction } from "../title-action";
import { html } from "lit-html";

class WarehouseTableProvider extends TableProvider<api.Warehouse> {
    warehouses : api.Warehouse[] = [];
    setWarehouses(warehouses : api.Warehouse[]) {
        this.warehouses = warehouses;
        this._onDidRefresh.fire();
    }
    getCellText(index : number, wh : api.Warehouse) {
        switch (index) {
            case 0: {
                return html`<a href="/warehouse/${wh.getId()}" >${wh.getName()}</a>`;
            }
        }
        return html``;
    }
    getHeadRows() {
        return ['Name'];
    }
    getRows() {
        return this.warehouses;
    }
}

class CreateWarehouseAction extends LinkTitleAction {
    getName() {
        return 'Create New Warehouse';
    }
    getHref() {
        return '/create-warehouse';
    }
}

class RefreshAction extends TitleAction {
    getName() {
        return 'Refresh';
    }
}

customElements.define('wms-warehouses', WMSWarehouses);

export class WarehousePages extends Page<WMSWarehouses> {
    tableProvider = new WarehouseTableProvider();
    warehouseManager: WarehouseManager;
    refreshAction: RefreshAction;
    constructor(mediator : Mediator) {
        super(mediator);
        this.warehouseManager = new WarehouseManager(this.mediator.client);

        this.actions.push(new CreateWarehouseAction());

        this.refreshAction = new RefreshAction();

        this.refreshAction.onDidActivate(() => {
            this.warehouseManager.invalidate();
            this.updateList();
        });

        this.actions.push(this.refreshAction);
    }
    getTitle() {
        return 'Warehouse';
    }
    getTagName() {
        return 'wms-warehouses';
    }
    created() {
        this.domNode.provider = this.tableProvider;
        this.updateList();
    }
    updateList() {
        this.refreshAction.disabled = true;
        this.warehouseManager.retrieve()
            .then((warehouses) => {
                this.refreshAction.disabled = false;
                this.tableProvider.setWarehouses(warehouses);
            });
    }
}