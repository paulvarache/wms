import { LitElement, html, property } from "lit-element";

export class WMSImport extends LitElement {

    @property({ type: Boolean })
    disabled = false;

    render() {
        return html`
            <input type="file" @change=${this.onFileChange} />
        `;
    }
    onFileChange() {
        const input = this.renderRoot.querySelector('input') as HTMLInputElement;
        if (!input.files || input.files.length !== 1) {
            return;
        }
        const [file] = input.files;
        const size = 1024;
        let pointer = 0;

        let buffer = '';
        let lines : string[] = [];

        function parseBuffer() {
            const chunkLines = buffer.split('\n');
            const remains = chunkLines.pop();
            if (remains) {
                buffer = remains;
            }
            lines = lines.concat(chunkLines);
        }

        function it() : Promise<string[]> {
            const end = Math.min(file.size, pointer + size);
            return WMSImport.readChunk(file, pointer, end)
                .then((t) => {
                    buffer += t;
                    parseBuffer();
                    pointer += size;
                    if (end === file.size) {
                        return lines;
                    }
                    return it();
                });
        }
        it().then((r) => {
            console.log(r);
        });

    }
    static readChunk(file : File, start : number, end : number) : Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            const blob = file.slice(start, end);
            reader.readAsText(blob);
        });
    }
}