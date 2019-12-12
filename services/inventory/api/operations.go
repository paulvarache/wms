package api

import (
	"context"
	"database/sql"
	"wms/database"
)

// GetOperationStateFromString will parse a string fomr the DB and return a matching OperationState
func GetOperationStateFromString(stateString string) OperationState {
	switch stateString {
	case "awaiting":
		return OperationState_AWAITING
	case "ready":
		return OperationState_READY
	case "processed":
		return OperationState_PROCESSED
	}
	return OperationState_UNKNOWN_OPERATION_STATE
}

// CreateOperation will create an operation and insert all the related items
func (s *Server) CreateOperation(ctx context.Context, in *CreateOperationMessage) (*SingleOperation, error) {
	db := database.GetDB()
	// Prepare a transaction. If anything fails, we'll rollback. If it succeeds we'll commit
	txn, err := db.Begin()
	if err != nil {
		return nil, err
	}
	row := txn.QueryRow("INSERT INTO wms.operations(account_id, reference) VALUES ($1, $2) RETURNING account_id, operation_id, reference, state", in.AccountID, in.Reference)
	var operation Operation
	var state string
	err = row.Scan(&operation.AccountID, &operation.ID, &operation.Reference, &state)
	operation.State = GetOperationStateFromString(state)
	if err != nil {
		return nil, err
	}
	stmt, err := txn.Prepare("INSERT INTO wms.operation_items(operation_id, sku, quantity_requested, quantity_processed, source_location, target_location) VALUES($1, $2, $3, $4, $5, $6)")
	if err != nil {
		txn.Rollback()
		return nil, err
	}

	for _, v := range in.Items {
		_, err = stmt.Exec(operation.ID, v.Sku, v.QuantityRequested, v.QuantityProcessed, database.NewNullString(v.SourceLocation), database.NewNullString(v.TargetLocation))
		if err != nil {
			txn.Rollback()
			return nil, err
		}
	}

	err = stmt.Close()
	if err != nil {
		txn.Rollback()
		return nil, err
	}
	err = txn.Commit()
	if err != nil {
		txn.Rollback()
		return nil, err
	}
	return &SingleOperation{Item: &operation}, nil
}

// ListOperations lists operations
func (s *Server) ListOperations(ctx context.Context, in *ListOperationsMessage) (*OperationList, error) {
	db := database.GetDB()
	query := `
SELECT COUNT(i.operation_item_id), o.operation_id, o.account_id, o.reference
FROM wms.operations as o
	JOIN wms.operation_items as i ON o.operation_id=i.operation_id
WHERE o.account_id=$1
GROUP BY o.operation_id
	`
	rows, err := db.Query(query, in.AccountID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items = make([]*Operation, 0)
	for rows.Next() {
		item := &Operation{}
		err = rows.Scan(&item.ItemCount, &item.ID, &item.AccountID, &item.Reference)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return &OperationList{Items: items}, nil
}

// ListOperationItems lists operation items for a given operation
func (s *Server) ListOperationItems(ctx context.Context, in *SingleOperationMessage) (*OperationItemList, error) {
	db := database.GetDB()
	query := `
SELECT operation_id, operation_item_id, sku, quantity_requested, quantity_processed, source_location, target_location
FROM wms.operation_items
WHERE operation_id=$1
	`
	rows, err := db.Query(query, in.OperationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items = make([]*OperationItem, 0)
	for rows.Next() {
		item := &OperationItem{}
		var processed sql.NullInt64
		var source sql.NullString
		var target sql.NullString
		err = rows.Scan(&item.OperationID, &item.ID, &item.Sku, &item.QuantityRequested, &processed, &source, &target)
		if err != nil {
			return nil, err
		}
		if processed.Valid {
			item.QuantityProcessed = processed.Int64
		}
		if source.Valid {
			item.SourceLocation = source.String
		}
		if target.Valid {
			item.TargetLocation = target.String
		}
		items = append(items, item)
	}
	return &OperationItemList{Items: items}, nil
}

// ListLocationsForOperation does something
func (s *Server) ListLocationsForOperation(ctx context.Context, in *SingleOperationMessage) (*SingleOperation, error) {
	return &SingleOperation{}, nil
}
