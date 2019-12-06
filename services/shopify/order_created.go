package main

import (
	"encoding/json"
	"log"
	"net/http"

	goshopify "github.com/bold-commerce/go-shopify"
)

// OrderCreatedCallback will handle the order_created webhook
func OrderCreatedCallback(w http.ResponseWriter, r *http.Request) {
	order := new(goshopify.Order)
	json.NewDecoder(r.Body).Decode(order)
	log.Println(order)
	for _, v := range order.LineItems {
		log.Println(v.SKU)
		log.Println(v.Quantity)
	}
}
