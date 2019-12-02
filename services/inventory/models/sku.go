package models

import (
	"database/sql"
	"wms/database"
)

// SKU represents a sku in the DB
type SKU struct {
	ID          int64
	Sku         string
	Name        string
	Description string
	Barcode     string
}

// SkuFromRow will return a SKUobject for a given SQL row
func SkuFromRow(row *sql.Row) (*SKU, error) {
	var skuRes SKU
	err := row.Scan(&skuRes.ID, &skuRes.Sku, &skuRes.Name, &skuRes.Description, &skuRes.Barcode)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &skuRes, nil
}

// CreateSku will add a sku in the DB for a given account
func CreateSku(accountID int64, sku string, name string, description string, barcode string) (*SKU, error) {
	row := database.GetDB().QueryRow("INSERT INTO wms.skus (account_id, sku, name, description, barcode) VALUES($1, $2, $3, $4, $5) RETURNING account_id, sku, name, description, barcode", accountID, sku, name, description, barcode)
	return SkuFromRow(row)
}

// FindSku will lokkup a sku by name
func FindSku(sku string) (*SKU, error) {
	row := database.GetDB().QueryRow("SELECT account_id, sku, name, description, barcode FROM wms.skus WHERE sku = '$1'", sku)
	return SkuFromRow(row)
}
