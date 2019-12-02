package models

// Account is a representation of an account in the DB
type Account struct {
	ID   int64
	Name string
}

// CreateAccount will add a new account in the DB
func CreateAccount(name string) (*Account, error) {
	row := db.QueryRow("INSERT INTO wms.accounts (name) VALUES($1) RETURNING account_id, name", name)
	var account Account
	err := row.Scan(&account.ID, &account.Name)
	if err != nil {
		return nil, err
	}
	return &account, nil
}
