package main

import (
	"log"
	"net/http"
	"wms/inventory/api"
	"wms/util"

	"fmt"

	"google.golang.org/grpc"
)

var client api.InventoryClient

// GetClient will return the client to the inventory API
func GetClient() api.InventoryClient {
	return client
}

func main() {
	port, err := util.GetenvInt("INVENTORY_PORT")
	if err != nil {
		log.Fatalf("Missing INVENTORY_PORT env")
	}
	conn, err := grpc.Dial(fmt.Sprintf(":%d", port), grpc.WithInsecure())
	if err != nil {
		log.Fatalf("did not connect: %s", err)
	}
	defer conn.Close()
	client = api.NewInventoryClient(conn)

	http.HandleFunc("/shopify/product_updated", ProductUpdatedCallback)
	http.HandleFunc("/shopify/order_created", OrderCreatedCallback)
	http.HandleFunc("/shopify/callback", AuthCallbackHandler)
	http.HandleFunc("/shopify", AuthHandler)
	log.Println("Server listening")
	err = http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Panic(err)
	}

}
