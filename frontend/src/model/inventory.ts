import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class InventoryManager extends ResourcesManager<number, api.InventoryItem> {
    client : api.InventoryPromiseClient;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item: api.InventoryItem): number {
        return item.getId()
    }
    get() {
        const { SearchMessage } = api;
        const request = new SearchMessage();
        request.setAccountid(1);
        return this.client.searchInventory(request, {}).then(r => r.getItemsList());
    }
    search(filter : string) {
        const { SearchMessage } = api;
        const request = new SearchMessage();
        request.setAccountid(1);
        request.setSku(filter);
        return this.client.searchInventory(request, {}).then(r => r.getItemsList());
    }
}
