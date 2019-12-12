import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class OperationManager extends ResourcesManager<number, api.Operation> {
    client : api.InventoryPromiseClient;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item: api.Operation): number {
        return item.getId();
    }
    get() {
        const { ListOperationsMessage } = api;
        const request = new ListOperationsMessage();
        request.setAccountid(1);
        return this.client.listOperations(request, {}).then(r => r.getItemsList());
    }
}
