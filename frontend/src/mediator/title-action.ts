import { EventEmitter, subscribeDOM } from "@kano/common";

export class TitleAction<T extends HTMLElement = HTMLElement> {
    event = new EventEmitter();
    set disabled(v : boolean) {
        if (v) {
            this.domNode.setAttribute('disabled', '');
        } else {
            this.domNode.removeAttribute('disabled');
        }
    }
    get onDidActivate() { return this.event.event; }
    getName() {
        return '';
    }
    _domNode? : T;
    protected _createDomNode() {
        const node = document.createElement('button') as unknown as T;

        node.textContent = this.getName();
        subscribeDOM(node, 'click', () => this.event.fire());

        return node;
    }
    get domNode() {
        if (!this._domNode) {
            this._domNode = this._createDomNode();
        }
        return this._domNode;
    }
}

export class LinkTitleAction extends TitleAction<HTMLLinkElement> {
    _createDomNode() {
        const node = document.createElement('a') as unknown as HTMLLinkElement;

        node.textContent = this.getName();
        node.href = this.getHref();

        return node;
    }
    getHref() {
        return '';
    }
}