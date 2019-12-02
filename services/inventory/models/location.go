package models

// Location represents a location
type Location struct {
	ID          int64
	WarehouseID int64
	Name        string
}

// CreateLocation will create a location for a given warehouse
func CreateLocation(warehouseID int64, name string) (*Location, error) {
	row := db.QueryRow("INSERT INTO wms.locations (warehouse_id, name) VALUES($1, $2) RETURNING location_id, warehouse_id, name", warehouseID, name)
	var location Location
	err := row.Scan(&location.ID, &location.WarehouseID, &location.Name)
	if err != nil {
		return nil, err
	}
	return &location, nil
}

// ListLocations lists locations in a warehouse
func ListLocations(warehouseID int64) ([]*Location, error) {
	rows, err := db.Query("SELECT location_id, warehouse_id, name FROM wms.locations WHERE warehouse_id=$1", warehouseID)
	if err != nil {
		return nil, err
	}
	results := make([]*Location, 0)
	for rows.Next() {
		location := new(Location)
		rows.Scan(&location.ID, &location.WarehouseID, &location.Name)
		results = append(results, location)
	}
	return results, nil
}
