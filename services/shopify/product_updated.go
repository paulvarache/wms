package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	goshopify "github.com/bold-commerce/go-shopify"
	"google.golang.org/grpc"
	"wms/inventory/api"
)

// ProductUpdatedCallback will handle the product_updated webhook
func ProductUpdatedCallback(w http.ResponseWriter, r *http.Request) {
	app := GetApp()
	isVerified := app.VerifyWebhookRequest(r)
	if isVerified == false {
		return
	}
	product := new(goshopify.Product)
	json.NewDecoder(r.Body).Decode(product)
	var conn *grpc.ClientConn
	conn, err := grpc.Dial(":7777", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %s", err)
	}
	defer conn.Close()
	c := api.NewInventoryClient(conn)
	for _, v := range product.Variants {
		res, err := c.UpdateSku(context.Background(), &api.CreateSkuMessage{AccountID: 1, Sku: v.Sku, Name: product.Title, Description: product.Title, Barcode: v.Barcode})
		if err != nil {
			log.Printf("Could not update sku from Shopify product update for variant: %s", v.Sku)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			continue
		}
		log.Printf("Updated %s from Shopify product update", res.GetItem().Sku)
	}
	w.WriteHeader(http.StatusOK)
}
