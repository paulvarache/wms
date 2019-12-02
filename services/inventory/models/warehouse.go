package models

import "wms/database"

// Warehouse is a representation of a warehouse in the DB
type Warehouse struct {
	ID        int64
	AccountID int64
	Name      string
}

// CreateWarehouse will add a new warehouse in the DB
func CreateWarehouse(name string, accountID int64) (*Warehouse, error) {
	row := database.GetDB().QueryRow("INSERT INTO wms.warehouses (name, account_id) VALUES($1, $2) RETURNING warehouse_id, account_id, name", name, accountID)
	var warehouse Warehouse
	err := row.Scan(&warehouse.ID, &warehouse.AccountID, &warehouse.Name)
	if err != nil {
		return nil, err
	}
	return &warehouse, nil
}

// ListWarehouses will return a list of arehouses for a given account id
func ListWarehouses(accountID int64) ([]*Warehouse, error) {
	rows, err := database.GetDB().Query("SELECT warehouse_id, account_id, name FROM wms.warehouses WHERE account_id=$1;", accountID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	results := make([]*Warehouse, 0)
	for rows.Next() {
		item := new(Warehouse)
		rows.Scan(&item.ID, &item.AccountID, &item.Name)
		results = append(results, item)
	}
	return results, nil
}
