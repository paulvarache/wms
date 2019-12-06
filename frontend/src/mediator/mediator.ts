import { WMSApp } from "../ui/app";
import { Router } from "./router";
import { RouteResolver } from "./route-resolver";
import { Page } from "./page";
import api from "../proto/inventory_grpc_web_pb";
import accounts from "../proto/accounts_grpc_web_pb";
import importApi from "../proto/import_grpc_web_pb";
import { AuthModel } from "../model/auth";

export type PageLoader = (args : any[]) => Promise<Page>;

export class Mediator {
    ui: WMSApp;
    router = new Router();
    routeResolver = new RouteResolver<PageLoader>();
    client = new api.InventoryPromiseClient('http://localhost:8080', null, null);
    accountsClient = new accounts.AccountsPromiseClient('http://localhost:8081', null, null);
    importClient = new importApi.ImportPromiseClient('http://localhost:8082', null, null);
    auth: AuthModel;
    constructor(ui : WMSApp) {
        this.ui = ui;
        this.auth = new AuthModel(this.accountsClient);
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

        this.routeResolver.addRoute(/^\/auth$/, () => import('./pages/auth').then(m => new m.AuthPage(this)));
        this.routeResolver.addRoute(/^\/import$/, () => import('./pages/import').then(m => new m.ImportPage(this)));
        this.routeResolver.addRoute(/^\/warehouses$/, () => import('./pages/warehouses').then(m => new m.WarehousePages(this)));
        this.routeResolver.addRoute(/^\/create-warehouse$/, () => import('./pages/create-warehouse').then(m => new m.CreateWarehousePage(this)));
        this.routeResolver.addRoute(/^\/warehouse\/(\d+)$/, (args) => import('./pages/warehouse').then(m => new m.WarehousePage(this, parseInt(args[0], 10))));
        this.routeResolver.addRoute(/^\/$/, () => import('./pages/home').then(m => new m.HomePage(this)));

        this.enforceAuth()
            .then(() => {
                this.router.install();
            });
    }

    enforceAuth() {
        return this.auth.init()
            .then(() => {
                if (!this.auth.isAuthenticated()) {
                    this.router.redirect('/auth');
                }
            });
    }
}