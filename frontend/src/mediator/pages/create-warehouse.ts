import { Page } from "../page";
import { WMSCreateWarehouse } from "../../ui/pages/create-warehouse";
import { WarehouseManager } from "../../model/warehouse";
import { Mediator } from "../mediator";
import { subscribeDOM } from "@kano/common";

customElements.define('wms-create-warehouse', WMSCreateWarehouse);

export class CreateWarehousePage extends Page<WMSCreateWarehouse> {
    warehouseManager: WarehouseManager;
    constructor(mediator : Mediator) {
        super(mediator);
        this.warehouseManager = new WarehouseManager(this.mediator.client);
    }
    getTitle() {
        return 'Create a New Warehouse';
    }
    getTagName() {
        return 'wms-create-warehouse';
    }
    hasBackButton() {
        return true;
    }
    getBackLink() {
        return '/warehouses';
    }
    created() {
        subscribeDOM(this.domNode, 'submit', (e : CustomEvent<string>) => {
            this.domNode.disabled = true;
            this.warehouseManager.createWarehouse(e.detail)
                .then(() => {
                    this.domNode.disabled = false;
                    this.mediator.router.redirect('/warehouses');
                });
        });
    }
}