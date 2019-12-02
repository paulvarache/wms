import { WMSApp } from "../ui/app";
import { Router } from "./router";
import { RouteResolver } from "./route-resolver";
import { Page } from "./page";
import api from "../proto/inventory_grpc_web_pb";

export type PageLoader = (args : any[]) => Promise<Page>;

export class Mediator {
    ui: WMSApp;
    router = new Router();
    routeResolver = new RouteResolver<PageLoader>();
    client = new api.InventoryClient('http://localhost:8080', null, null);
    constructor(ui : WMSApp) {
        this.ui = ui;
        this.router.onDidLocationChange((location) => {
            const resolver = this.routeResolver.resolveRoute(location);
            if (resolver === null) {
                return;
            }
            resolver.data(resolver.args).then(page => {
                const node = page.domNode;
                node.slot = 'content';

                this.ui.innerHTML = '';

                this.ui.appendChild(node);

                const p = page.injected() || Promise.resolve();

                p.then(() => {
                    this.ui.title = page.getTitle();
    
                    this.ui.backButton = page.hasBackButton();
                    this.ui.backLink = page.getBackLink();
    
                    const actions = page.getActions();
    
                    actions.forEach((action) => {
                        const node = action.domNode;
                        node.slot = 'actions';
                        this.ui.appendChild(node);
                    });
                });
            });
        });

        this.routeResolver.addRoute(/^\/warehouses$/, () => import('./pages/warehouses').then(m => new m.WarehousePages(this)));
        this.routeResolver.addRoute(/^\/create-warehouse$/, () => import('./pages/create-warehouse').then(m => new m.CreateWarehousePage(this)));
        this.routeResolver.addRoute(/^\/warehouse\/(\d+)$/, (args) => import('./pages/warehouse').then(m => new m.WarehousePage(this, parseInt(args[0], 10))));

        this.router.install();
    }
}