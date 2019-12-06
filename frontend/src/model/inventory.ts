import api from '../proto/inventory_grpc_web_pb';
import { ResourcesManager } from './resources-manager';

export class InventoryManager extends ResourcesManager<string, api.InventoryItem> {
    client : api.InventoryPromiseClient;
    constructor(client : api.InventoryPromiseClient) {
        super();
        this.client = client;
    }
    getKeyForItem(item: api.InventoryItem): string {
        return item.getLocation()!.getId();
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
