import { Page } from "../page";
import { Mediator } from "../mediator";
import { WMSImport } from "../../ui/pages/import";

customElements.define('wms-import', WMSImport)

export class ImportPage extends Page<WMSImport> {
    constructor(mediator : Mediator) {
        super(mediator);
    }
    getTitle() {
        return 'Import';
    }
    getTagName() {
        return 'wms-import';
    }
    created() {
        
    }
}