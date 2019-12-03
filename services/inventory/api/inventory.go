package api

import (
	"context"
	fmt "fmt"
	"strconv"
	"strings"
	"wms/database"
)

// SearchInventory will return inventory info based on a bunch of filters
func (s *Server) SearchInventory(ctx context.Context, in *SearchMessage) (*SearchResult, error) {
	db := database.GetDB()
	var segments []string
	// TODO: Rebuild this whole section utsing a re-usable query builder
	base := `
		SELECT s.sku_id, s.account_id, s.sku, s.name, s.description, s.barcode, l.location_id, l.warehouse_id, l.name, w.warehouse_id, w.account_id, w.name, i.quantity, i.inventory_id
		FROM wms.skus as s
		JOIN wms.inventory as i ON i.sku_id=s.sku_id
		JOIN wms.locations as l ON i.location_id=l.location_id
		JOIN wms.warehouses as w ON w.warehouse_id=l.warehouse_id
		WHERE w.account_id=$1
	`
	segments = append(segments, base)
	var args []string
	args = append(args, strconv.FormatInt(in.AccountId, 10))
	if in.Sku != "" {
		segments = append(segments, fmt.Sprintf("AND s.sku LIKE $%d\n", len(segments)+1))
		args = append(args, in.Sku+"%")
	}
	segments = append(segments, "LIMIT 50")
	fullQuery := strings.Join(segments, "")
	stmt, err := db.Prepare(fullQuery)
	if err != nil {
		return nil, err
	}
	// Convert the array into an interface slice
	sl := make([]interface{}, len(args))
	for i, v := range args {
		sl[i] = v
	}
	rows, err := stmt.Query(sl...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items = make([]*InventoryItem, 0)
	for rows.Next() {
		sku := new(Sku)
		location := new(Location)
		warehouse := new(Warehouse)
		item := &InventoryItem{Sku: sku, Location: location, Warehouse: warehouse}
		err = rows.Scan(&sku.Id, &sku.AccountID, &sku.Sku, &sku.Name, &sku.Description, &sku.Barcode, &location.Id, &location.WarehouseId, &location.Name, &warehouse.Id, &warehouse.AccountID, &warehouse.Name, &item.Quantity, &item.ID)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return &SearchResult{Items: items}, nil
}
