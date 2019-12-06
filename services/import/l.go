package main

import (
	"net/http"

	"log"
)

func main() {
	http.HandleFunc("/", MyHandler)
	http.ListenAndServe(":8000", nil)
}

// Create an app somewhere.
app := goshopify.App{
    ApiKey: "abcd",
    ApiSecret: "efgh",
    RedirectUrl: "https://example.com/shopify/callback",
    Scope: "read_products,read_orders",
}

// Create an oauth-authorize url for the app and redirect to it.
// In some request handler, you probably want something like this:
func MyHandler(w http.ResponseWriter, r *http.Request) {
    shopName := r.URL.Query().Get("shop")
    authUrl := app.AuthorizeURL(shopName)
    http.Redirect(w, r, authUrl, http.StatusFound)
}

// Fetch a permanent access token in the callback
func MyCallbackHandler(w http.ResponseWriter, r *http.Request) {
    // Check that the callback signature is valid
    if ok, _ := app.VerifyAuthorizationURL(r.URL); !ok {
        http.Error(w, "Invalid Signature", http.StatusUnauthorized)
        return
    }

    query := r.URL.Query()
    shopName := query.Get("shop")
    code := query.Get("code")
    token, err := app.GetAccessToken(shopName, code)

    // Do something with the token, like store it in a DB.
}