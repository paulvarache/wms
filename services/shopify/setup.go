package main

import (
	"net/http"

	"log"

	goshopify "github.com/bold-commerce/go-shopify"
)

// AuthHandler will create a Oauth url to authenticate the app against the requested shop
func AuthHandler(w http.ResponseWriter, r *http.Request) {
	app := GetApp()
	shopName := r.URL.Query().Get("shop")
	authURL := app.AuthorizeUrl(shopName, "")
	log.Println(authURL)
	http.Redirect(w, r, authURL, http.StatusFound)
}

// CreateHook creates a hook for a topic. Will do nothing if the hook already exists
func CreateHook(client *goshopify.Client, topic string, address string) error {
	_, err := client.Webhook.Create(goshopify.Webhook{Topic: topic, Address: address, Format: "json"})
	if err != nil {
		switch e := err.(type) {
		case goshopify.ResponseError:
			if e.Status == 422 {
				return nil
			}
		}
		return err
	}
	return nil
}

// AuthCallbackHandler will be called once the app was authenticated through the store
// This will be used to setup webhooks and store the permanent auth token for future calls
func AuthCallbackHandler(w http.ResponseWriter, r *http.Request) {
	app := GetApp()
	// Check that the callback signature is valid
	if ok, _ := app.VerifyAuthorizationURL(r.URL); !ok {
		http.Error(w, "Invalid Signature", http.StatusUnauthorized)
		return
	}

	query := r.URL.Query()
	shopName := query.Get("shop")
	code := query.Get("code")
	token, err := app.GetAccessToken(shopName, code)
	if err != nil {
		log.Panic(err)
	}
	log.Println(token)
	client := goshopify.NewClient(*app, shopName, token)

	err = CreateHook(client, "orders/create", "https://2a486abf.ngrok.io/shopify/order_created")
	if err != nil {
		log.Panic(err)
	}
	err = CreateHook(client, "products/update", "https://2a486abf.ngrok.io/shopify/product_updated")
	if err != nil {
		log.Panic(err)
	}
}
