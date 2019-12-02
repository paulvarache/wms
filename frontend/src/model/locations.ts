import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class LocationsManager extends ResourcesManager<number, api.Location> {
    client : api.InventoryClient;
    warehouseId: number|null = null;
    constructor(client : api.InventoryClient) {
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
        return new Promise<api.Location[]>((resolve, reject) => {
            this.client.listLocations(request, {}, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.getItemsList());
            });
        });
    }
}
