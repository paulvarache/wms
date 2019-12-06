import { EventEmitter } from "@kano/common";

export class CSVLoader {
    buffer = '';
    pointer = 0;
    size : number;
    lines : string[] = [];
    _onDidParseNewLines: EventEmitter<string[]>;
    constructor(size : number) {
        this.size = size;

        this._onDidParseNewLines = new EventEmitter<string[]>();
    }
    addChunk(chunk : string) {
        this.buffer += chunk;
        const chunkLines = this.buffer.split('\n');
        const remains = chunkLines.pop();
        if (remains) {
            this.buffer = remains;
        }
        this.lines = this.lines.concat(chunkLines);
        // Fire events for new lines
    }
}