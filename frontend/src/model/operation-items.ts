import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class OperationItemsManager extends ResourcesManager<number, api.OperationItem> {
    client : api.InventoryPromiseClient;
    operationId: number|null = null;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item : api.OperationItem) {
        return item.getId();
    }
    setOperationId(id : number) {
        this.operationId = id;
        this.invalidate();
    }
    get() {
        if (!this.operationId) {
            return Promise.resolve([]);
        }
        const { SingleOperationMessage } = api;
        const request = new SingleOperationMessage();
        request.setOperationid(this.operationId);
        return this.client.listOperationItems(request, {}).then(r => r.getItemsList());
    }
}
