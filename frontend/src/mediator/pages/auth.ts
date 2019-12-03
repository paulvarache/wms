import { Page } from "../page";
import { Mediator } from "../mediator";
import { WMSAuth } from "../../ui/pages/auth";
import { subscribeDOM } from "@kano/common";

customElements.define('wms-auth', WMSAuth)

export class AuthPage extends Page<WMSAuth> {
    constructor(mediator : Mediator) {
        super(mediator);
    }
    getTitle() {
        return 'Login';
    }
    getTagName() {
        return 'wms-auth';
    }
    created() {
        subscribeDOM(this.domNode, 'submit', (e : CustomEvent) => {
            this.domNode.disabled = true;
            this.mediator.auth.authenticate(e.detail.email, e.detail.password)
                .then(() => {
                    this.mediator.router.redirect('/');
                })
                .catch((e) => {
                    console.error(e);
                    this.domNode.error = e.message;
                })
                .then(() => {
                    this.domNode.disabled = false;
                });
        });
    }
}