package main

import (
	"fmt"
	"log"
	"net"

	"wms/database"
	"wms/inventory/api"
	"wms/util"

	"google.golang.org/grpc"
)

func main() {
	database.InitDB(database.GetDataSourceNameFromEnv())

	port, err := util.GetenvInt("INVENTORY_PORT")
	if err != nil {
		log.Fatalf("Missing INVENTORY_PORT env")
	}

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("Failed to create TCP server: %s", err)
	}

	s := api.Server{}

	grpcServer := grpc.NewServer()

	api.RegisterInventoryServer(grpcServer, &s)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to start server: %s", err)
	}
	log.Println("Inventory Server listening")
}
