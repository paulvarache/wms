package main

import (
	"fmt"
	"log"
	"net"

	"./api"
	"google.golang.org/grpc"
)

func main() {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", 7777))
	if err != nil {
		log.Fatalf("Failed to create TCP server: %s", err)
	}

	s := api.Server{}

	grpcServer := grpc.NewServer()

	api.RegisterInventoryServer(grpcServer, &s)

	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to start server: %s", err)
	}
}
