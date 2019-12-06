import api from './proto/import_grpc_web_pb';
import { WMSApp } from "./ui/app";
import { Mediator } from "./mediator/mediator";

customElements.define('wms-app', WMSApp);

const UI = new WMSApp();

const mediator = new Mediator(UI);

// @ts-ignore
window.mediator = mediator;

document.body.appendChild(UI);

const client = new api.ImportPromiseClient('http://localhost:8082', null, null);

window.client = client;
window.api = api;