package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"wms/inventory/api"

	goshopify "github.com/bold-commerce/go-shopify"
)

// OrderCreatedCallback will handle the order_created webhook
func OrderCreatedCallback(w http.ResponseWriter, r *http.Request) {
	order := new(goshopify.Order)
	json.NewDecoder(r.Body).Decode(order)
	c := GetClient()
	operation := &api.CreateOperationMessage{Reference: fmt.Sprintf("Shopify Order %s", order.Name), AccountID: 1}
	items := make([]*api.OperationItem, 0)
	for _, v := range order.LineItems {
		item := &api.OperationItem{Sku: v.SKU, QuantityRequested: -int64(v.Quantity)}
		items = append(items, item)
		log.Println(v.SKU)
		log.Println(v.Quantity)
	}
	operation.Items = items
	res, err := c.CreateOperation(context.Background(), operation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Println(err.Error())
	}
	log.Println(res)
}
