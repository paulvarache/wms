import { LitElement, html, css, property } from "lit-element";

export class WMSCreateWarehouse extends LitElement {

    static get styles() {
        return [css`
            :host {
                display: block;
            }
        `];
    }

    @property({ type: Boolean })
    disabled = false;

    render() {
        return html`
            <input type="text" id="input" ?disabled=${this.disabled} />
            <button type="submit" @click=${this.onSubmit} ?disabled=${this.disabled}>Create</button>
        `;
    }
    onSubmit() {
        const el = this.renderRoot.querySelector('#input') as HTMLInputElement;

        this.dispatchEvent(new CustomEvent('submit', { detail: el.value }));
    }
}
