import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

import './accounts'

export class WarehouseManager extends ResourcesManager<number, api.Warehouse> {
    client : api.InventoryClient;
    constructor(client : api.InventoryClient) {
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
        return new Promise<api.Warehouse[]>((resolve, reject) => {
            this.client.listWarehouses(request, {}, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.getItemsList());
            });
        });
    }
    createWarehouse(name : string) {
        const { CreateWarehouseMessage } = api;
        const request = new CreateWarehouseMessage();
        request.setAccountid(1);
        request.setName(name);
        return new Promise((resolve, reject) => {
            this.client.createWarehouse(request, {}, (err, result) => {
                if (err) {
                    return reject(err);
                }
                this.invalidate();
                resolve(result.getItem());
            });
        });
    }
}
