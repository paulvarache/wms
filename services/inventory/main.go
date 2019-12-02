package main

import (
	"context"
	"encoding/csv"
	"io"
	"log"
	"os"

	"./api"
	"google.golang.org/grpc"
)

func main() {
	var conn *grpc.ClientConn

	conn, err := grpc.Dial(":7777", grpc.WithInsecure())

	if err != nil {
		log.Fatalf("Could not dial: %s", err)
	}

	defer conn.Close()

	c := api.NewInventoryClient(conn)

	f, err := os.Open("./data.csv")
	if err != nil {
		log.Panic(err)
	}

	r := csv.NewReader(f)
	for {
		record, err := r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Panic(err)
		}
		log.Printf("CreatingSKU: %s...", record[1])
		_, err = c.CreateSku(context.Background(), &api.CreateSkuMessage{AccountID: 1, Sku: record[1], Name: record[2], Description: record[2], Barcode: record[4]})
		if err != nil {
			log.Panic(err)
		}
	}
}
