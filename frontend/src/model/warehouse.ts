import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class WarehouseManager extends ResourcesManager<number, api.Warehouse> {
    client : api.InventoryPromiseClient;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item: api.Warehouse): number {
        return item.getId()
    }
    get() {
        const { ListWarehousesMessage } = api;
        const request = new ListWarehousesMessage();
        request.setAccountid(1);
        return this.client.listWarehouses(request, {}).then(r => r.getItemsList());
    }
    createWarehouse(name : string) {
        const { CreateWarehouseMessage } = api;
        const request = new CreateWarehouseMessage();
        request.setAccountid(1);
        request.setName(name);
        return this.client.createWarehouse(request, {})
            .then((r) => {
                this.invalidate();
                return r.getItem();
            });
    }
}
