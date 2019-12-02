import { installRouter } from 'pwa-helpers/router.js';
import { EventEmitter } from '@kano/common';

let singleton : Router|null = null;

export class Router {
    _onDidLocationChange = new EventEmitter<Location>();
    get onDidLocationChange() { return this._onDidLocationChange.event; }
    constructor() {
        if (singleton) {
            return singleton;
        }
        singleton = this;
    }
    install() {
        installRouter((location) => this.onNav(location));
    }
    onNav(location: Location) {
        this._onDidLocationChange.fire(location);
    }
    redirect(newRoute : string) {
        window.history.pushState({}, '', newRoute);
        this.onNav(window.location);
    }
}
