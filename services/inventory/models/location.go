package models

import "wms/database"

// Location represents a location
type Location struct {
	ID          string
	WarehouseID int64
}

// CreateLocation will create a location for a given warehouse
func CreateLocation(warehouseID int64, name string) (*Location, error) {
	row := database.GetDB().QueryRow("INSERT INTO wms.locations (warehouse_id, location) VALUES($1, $2) RETURNING location, warehouse_id", warehouseID, name)
	var location Location
	err := row.Scan(&location.ID, &location.WarehouseID)
	if err != nil {
		return nil, err
	}
	return &location, nil
}

// ListLocations lists locations in a warehouse
func ListLocations(warehouseID int64) ([]*Location, error) {
	rows, err := database.GetDB().Query("SELECT location, warehouse_id FROM wms.locations WHERE warehouse_id=$1", warehouseID)
	if err != nil {
		return nil, err
	}
	results := make([]*Location, 0)
	for rows.Next() {
		location := new(Location)
		rows.Scan(&location.ID, &location.WarehouseID)
		results = append(results, location)
	}
	return results, nil
}
