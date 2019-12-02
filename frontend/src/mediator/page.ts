import { Mediator } from "./mediator";
import { TitleAction } from "./title-action";

export class Page<T extends HTMLElement = HTMLElement> {
    mediator: Mediator;
    actions : TitleAction[] = [];
    constructor(mediator : Mediator) {
        this.mediator = mediator;
    }
    protected _domNode: T|null = null;
    get domNode() {
        if (!this._domNode) {
            this._domNode = this._createDOM();
            this.created();
        }
        return this._domNode;
    }
    protected getTagName() {
        return 'div';
    }
    private _createDOM() : T {
        return document.createElement(this.getTagName()) as T;
    }
    getTitle() {
        return '';
    }
    getActions() {
        return this.actions;
    }
    hasBackButton() {
        return false;
    }
    getBackLink() {
        return '';
    }
    created() {}
    injected() : Promise<any>|any {}
}