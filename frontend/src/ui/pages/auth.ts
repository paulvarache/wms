import { LitElement, html, property } from "lit-element";

export class WMSAuth extends LitElement {

    @property({ type: Boolean })
    disabled = false;

    @property({ type: String })
    error = '';

    render() {
        return html`
            <form action="#" @submit=${this.onSubmit}>
                <label for="email">Email:</label>
                <input name="email" type="email" id="email" ?disabled=${this.disabled} />
                <label for="password">Password:</label>
                <input name="password" type="password" id="password" ?disabled=${this.disabled} />
                <button type="submit" ?disabled=${this.disabled} >Login</button>
            </form>
            <div ?hidden=${!this.error}>${this.error}</div>
        `;
    }
    onSubmit(e : Event) {
        e.preventDefault();
        e.stopPropagation();
        const form = this.renderRoot.querySelector('form') as HTMLFormElement;
        this.dispatchEvent(new CustomEvent('submit', { detail: { email: form.email.value, password: form.password.value } }))
    }
}