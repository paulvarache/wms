import { WMSApp } from "./ui/app";
import { Mediator } from "./mediator/mediator";

customElements.define('wms-app', WMSApp);

const UI = new WMSApp();

const mediator = new Mediator(UI);

// @ts-ignore
window.mediator = mediator;

document.body.appendChild(UI);
