import { Page } from '../page';
import { WMSOperations } from '../../ui/pages/operations';
import { TableProvider } from '../table/table-provider';
import api from '../../proto/inventory_grpc_web_pb';
import { Mediator } from '../mediator';
import { RefreshAction } from '../title-action';
import { html } from 'lit-html';
import { OperationManager } from '../../model/operations';

class OperationsTableProvider extends TableProvider<api.Operation> {
    operations : api.Operation[] = [];
    setOperations(operations : api.Operation[]) {
        this.operations = operations;
        this._onDidRefresh.fire();
    }
    getCellText(index : number, op : api.Operation) {
        switch (index) {
            case 0: {
                return html`<a href="/operations/${op.getId()}">${op.getReference()}</a>`
            }
            case 1: {
                return html`${op.getItemcount()}`
            }
        }
        return html``;
    }
    getHeadRows() {
        return ['Name', 'Items'];
    }
    getRows() {
        return this.operations;
    }
}

customElements.define('wms-operations', WMSOperations);

export class OperationsPage extends Page<WMSOperations> {
    tableProvider = new OperationsTableProvider();
    operationsManager: OperationManager;
    refreshAction: RefreshAction;
    constructor(mediator : Mediator) {
        super(mediator);
        this.operationsManager = new OperationManager(this.mediator.client);

        this.refreshAction = new RefreshAction();

        this.refreshAction.onDidActivate(() => {
            this.operationsManager.invalidate();
            this.updateList();
        });

        this.actions.push(this.refreshAction);
    }
    getTitle() {
        return 'Operations';
    }
    getTagName() {
        return 'wms-operations';
    }
    created() {
        this.domNode.provider = this.tableProvider;
        this.updateList();
    }
    updateList() {
        this.refreshAction.disabled = true;
        this.operationsManager.retrieve()
            .then((operations) => {
                this.refreshAction.disabled = false;
                this.tableProvider.setOperations(operations);
            });
    }
}