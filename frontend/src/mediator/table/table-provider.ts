import { EventEmitter } from "@kano/common";
import { TemplateResult } from "lit-html";

export abstract class TableProvider<T> {
    _onDidRefresh = new EventEmitter();
    get onDidRefresh() { return this._onDidRefresh.event; }
    abstract getHeadRows() : string[];
    abstract getRows() : T[];
    abstract getCellText(index : number, data : T) : TemplateResult;
}
