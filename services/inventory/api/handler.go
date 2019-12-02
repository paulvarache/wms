package api

import (
	"context"
	fmt "fmt"
	"log"
	"os"

	"../models"
)

var dataSourceName string = fmt.Sprintf(
	"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
	os.Getenv("DB_USER"),
	os.Getenv("DB_PWD"),
	os.Getenv("DB_HOST"),
	os.Getenv("DB_PORT"),
	os.Getenv("DB_NAME"),
)

// Server is a an empty representation of the server
type Server struct {
}

// SingleSkuFromSkuObject prepares a SKU to be sent
func SingleSkuFromSkuObject(in *models.SKU) *SingleSku {
	var sku = &Sku{Id: in.ID, Sku: in.Sku, Name: in.Name, Description: in.Description, Barcode: in.Barcode}
	return &SingleSku{Item: sku}
}

// CreateAccount creates an account
func (s *Server) CreateAccount(ctx context.Context, in *CreateAccountMessage) (*SingleAccount, error) {
	models.InitDB(dataSourceName)
	account, err := models.CreateAccount(in.Name)
	log.Println("Created Account")
	if err != nil {
		return nil, err
	}
	var acc = &Account{Id: account.ID, Name: account.Name}
	return &SingleAccount{Item: acc}, nil
}

// CreateWarehouse creates a warehouse
func (s *Server) CreateWarehouse(ctx context.Context, in *CreateWarehouseMessage) (*SingleWarehouse, error) {
	models.InitDB(dataSourceName)
	warehouse, err := models.CreateWarehouse(in.Name, in.AccountID)
	log.Println("Created Warehouse")
	if err != nil {
		return nil, err
	}
	var w = &Warehouse{Id: warehouse.ID, AccountID: warehouse.AccountID, Name: warehouse.Name}
	return &SingleWarehouse{Item: w}, nil
}

// FindSku will find a sku
func (s *Server) FindSku(ctx context.Context, in *FindSkuMessage) (*SingleSku, error) {
	models.InitDB(dataSourceName)
	item, err := models.FindSku(in.Sku)
	if err != nil {
		return nil, err
	}
	if item == nil {
		return &SingleSku{Item: nil}, nil
	}
	return SingleSkuFromSkuObject(item), nil
}

// CreateSku will create a new SKU
func (s *Server) CreateSku(ctx context.Context, in *CreateSkuMessage) (*SingleSku, error) {
	models.InitDB(dataSourceName)
	newSku, err := models.CreateSku(in.AccountID, in.Sku, in.Name, in.Description, in.Barcode)
	log.Println("Created SKU")
	if err != nil {
		return &SingleSku{Item: nil}, err
	}
	return SingleSkuFromSkuObject(newSku), nil
}

// ListWarehouses lists warehouses
func (s *Server) ListWarehouses(ctx context.Context, in *ListWarehousesMessage) (*WarehouseList, error) {
	models.InitDB(dataSourceName)
	items, err := models.ListWarehouses(in.AccountID)
	if err != nil {
		return nil, err
	}
	warehouses := make([]*Warehouse, 0)
	for i := 0; i < len(items); i++ {
		item := items[i]
		warehouses = append(warehouses, &Warehouse{AccountID: item.AccountID, Id: item.ID, Name: item.Name})
	}

	return &WarehouseList{Items: warehouses}, nil
}

// ListLocations lists locations
func (s *Server) ListLocations(ctx context.Context, in *ListLocationsMessage) (*LocationList, error) {
	models.InitDB(dataSourceName)
	items, err := models.ListLocations(in.WarehouseId)
	if err != nil {
		return nil, err
	}
	locations := make([]*Location, 0)
	for i := 0; i < len(items); i++ {
		item := items[i]
		locations = append(locations, &Location{WarehouseId: item.WarehouseID, Id: item.ID, Name: item.Name})
	}

	return &LocationList{Items: locations}, nil
}

// CreateLocation creates a location
func (s *Server) CreateLocation(ctx context.Context, in *CreateLocationMessage) (*SingleLocation, error) {
	models.InitDB(dataSourceName)
	location, err := models.CreateLocation(in.WarehouseId, in.Name)
	log.Println("Created Location")
	if err != nil {
		return nil, err
	}
	var locations = &Location{Id: location.ID, WarehouseId: location.WarehouseID, Name: location.Name}
	return &SingleLocation{Item: locations}, nil
}
