import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class LocationsManager extends ResourcesManager<string, api.Location> {
    client : api.InventoryPromiseClient;
    warehouseId: number|null = null;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item : api.Location) {
        return item.getId()
    }
    setWarehouseId(id : number) {
        this.warehouseId = id;
        this.invalidate();
    }
    get() {
        if (!this.warehouseId) {
            return Promise.resolve([]);
        }
        const { ListLocationsMessage } = api;
        const request = new ListLocationsMessage();
        request.setWarehouseid(this.warehouseId);
        return this.client.listLocations(request, {}).then(r => r.getItemsList());
    }
}
