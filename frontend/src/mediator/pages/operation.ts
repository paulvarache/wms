import { Page } from "../page";
import { WMSOperation } from "../../ui/pages/operation";
import { Mediator } from "../mediator";
import api from '../../proto/inventory_grpc_web_pb';
import { TableProvider } from "../table/table-provider";
import { html } from "lit-html";
import { OperationItemsManager } from "../../model/operation-items";
import { OperationManager } from "../../model/operations";

export class OperationItemsTableProvider extends TableProvider<api.OperationItem> {
    operationItems : api.OperationItem[] = [];
    setOperationItems(operationItems : api.OperationItem[]) {
        this.operationItems = operationItems;
        this._onDidRefresh.fire();
    }
    getCellText(index : number, op : api.OperationItem) {
        switch (index) {
            case 0: {
                return html`${op.getSku()}`;
            }
            case 1: {
                return html`${op.getQuantityrequested()}`;
            }
            case 2: {
                return html`${op.getQuantityprocessed()}`;
            }
            case 3: {
                return html`${op.getSourcelocation()}`;
            }
            case 4: {
                return html`<a href="/location/${op.getTargetlocation()}">${op.getTargetlocation()}</a>`;
            }
        }
        return html``;
    }
    getHeadRows() {
        return ['SKU', 'Requested', 'Processed', 'From', 'To'];
    }
    getRows() {
        return this.operationItems;
    }
}

customElements.define('wms-operation', WMSOperation);

export class OperationPage extends Page<WMSOperation> {
    operationItemsManager: OperationItemsManager;
    operationsManager : OperationManager;
    operationId : number;
    operation? : api.Operation;
    locationTableProvider = new OperationItemsTableProvider();
    constructor(mediator : Mediator, operationId : number) {
        super(mediator);
        this.operationId = operationId;
        this.operationsManager = new OperationManager(this.mediator.client);
        this.operationItemsManager = new OperationItemsManager(this.mediator.client);
    }
    getTitle() {
        if (!this.operation) {
            return 'Operation detail';
        }
        return this.operation.getReference();
    }
    getTagName() {
        return 'wms-operation';
    }
    hasBackButton() {
        return true;
    }
    getBackLink() {
        return '/operations';
    }
    created() {
        this.domNode.provider = this.locationTableProvider;
        this.operationsManager.lookup(this.operationId)
            .then(op => {
                this.operation = op;
                this.domNode.name = this.operation.getReference();
                this.operationItemsManager.setOperationId(this.operation.getId());
                return this.operationItemsManager.retrieve();
            })
            .then((operationItems) => {
                this.locationTableProvider.setOperationItems(operationItems);
            });
    }
}