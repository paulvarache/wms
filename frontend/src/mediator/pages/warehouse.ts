import { Page } from "../page";
import { WMSWarehouse } from "../../ui/pages/warehouse";
import { WarehouseManager } from "../../model/warehouse";
import { Mediator } from "../mediator";
import api from '../../proto/inventory_grpc_web_pb';
import { TableProvider } from "../table/table-provider";
import { html } from "lit-html";
import { LocationsManager } from "../../model/locations";

export class LocationsTableProvider extends TableProvider<api.Location> {
    locations : api.Location[] = [];
    setLocations(locations : api.Location[]) {
        this.locations = locations;
        this._onDidRefresh.fire();
    }
    getCellText(index : number, loc : api.Location) {
        switch (index) {
            case 0: {
                return html`<a href="/location/${loc.getId()}" >${loc.getName()}</a>`;
            }
        }
        return html``;
    }
    getHeadRows() {
        return ['Name'];
    }
    getRows() {
        return this.locations;
    }
}

customElements.define('wms-warehouse', WMSWarehouse);

export class WarehousePage extends Page<WMSWarehouse> {
    locationsManager: LocationsManager;
    warehouseManager : WarehouseManager;
    warehouseId : number;
    warehouse? : api.Warehouse;
    locationTableProvider = new LocationsTableProvider();
    constructor(mediator : Mediator, warehouseId : number) {
        super(mediator);
        this.warehouseId = warehouseId;
        this.warehouseManager = new WarehouseManager(this.mediator.client);
        this.locationsManager = new LocationsManager(this.mediator.client);
    }
    getTitle() {
        if (!this.warehouse) {
            return 'Warehouse detail';
        }
        return this.warehouse.getName();
    }
    getTagName() {
        return 'wms-warehouse';
    }
    hasBackButton() {
        return true;
    }
    getBackLink() {
        return '/warehouses';
    }
    created() {
        this.domNode.provider = this.locationTableProvider;
        this.warehouseManager.lookup(this.warehouseId)
            .then(w => {
                this.warehouse = w;
                this.domNode.name = this.warehouse.getName();
                this.locationsManager.setWarehouseId(this.warehouse.getId());
                return this.locationsManager.retrieve();
            })
            .then((locations) => {
                this.locationTableProvider.setLocations(locations);
            });
    }
}