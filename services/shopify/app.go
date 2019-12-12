package main

import goshopify "github.com/bold-commerce/go-shopify"

// import "wms/util"
// import "log"

// Create an app somewhere.
var app *goshopify.App = nil

// GetApp will return the shopify app representation
func GetApp() *goshopify.App {
	if app == nil {
		// apiKey, err := util.GetenvStr("SHOPIFY_API_KEY")
		// if err != nil {
		// 	log.Panic(err)
		// }
		// apiSecret, err := util.GetenvStr("SHOPIFY_API_SECRET")
		// if err != nil {
		// 	log.Panic(err)
		// }
		// callbackPrefix, err := util.GetenvStr("SHOPIFY_CALLBACK_PREFIX")
		// if err != nil {
		// 	log.Panic(err)
		// }
		app = &goshopify.App{
			ApiKey:      "62dc5bf2568fe7eb723016d07765366c",
			ApiSecret:   "5df2a5abd056b968c008d3d9bf5595b3",
			RedirectUrl: "https://2a486abf.ngrok.io/shopify/callback",
			Scope:       "read_products,read_orders",
		}
	}
	return app
}
