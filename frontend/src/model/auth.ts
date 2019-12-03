import accounts from '../proto/accounts_grpc_web_pb';

const AUTH_KEY = 'wms_session';

export class AuthModel {
    client: accounts.AccountsPromiseClient;
    session?: accounts.Session;
    user?: accounts.User;
    constructor(client : accounts.AccountsPromiseClient) {
        this.client = client;
    }
    init() {
        const item = localStorage.getItem(AUTH_KEY);
        if (!item) {
            // No key found, not logged in
            return Promise.resolve();
        }
        let loadedSession : any;
        try {
            // Parse the stored session and create a session object
            loadedSession = JSON.parse(item);
            this.session = new accounts.Session();
            this.session.setToken(loadedSession.token);
            this.session.setExpires(loadedSession.expires);
        } catch(e) {
            // Parsing or loading failed, remove the incorrect stored session
            localStorage.removeItem(AUTH_KEY);
            return Promise.resolve();
        }
        return this.reloadUser();
    }
    reloadUser() {
        // TODO: replace this with a call to /me
        return Promise.resolve();
    }
    storeSession() {
        if (!this.session) {
            return;
        }
        const sessionData = { token: this.session.getToken(), expires: this.session.getExpires() };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
    }
    isAuthenticated() {
        return !!this.session;
    }
    authenticate(email : string, password : string) {
        const request = new accounts.AuthMessage();
        request.setAccountid(1);
        request.setEmail(email);
        request.setPassword(password);
        return this.client.authenticate(request)
            .then((response) => {
                this.session = response.getSession();
                this.user = response.getUser();
                this.storeSession();
            });
    }
}