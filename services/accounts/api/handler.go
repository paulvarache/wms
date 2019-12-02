package api

import (
	context "context"
	"wms/accounts/security"
	"wms/database"
)

// Server is a an empty representation of the server
type Server struct {
}

// CreateUser will register a user
func (s *Server) CreateUser(ctx context.Context, in *CreateUserMessage) (*UserCreatedMessage, error) {
	hash, err := security.HashPassword(in.Password)
	if err != nil {
		return nil, err
	}
	db := database.GetDB()
	row := db.QueryRow("INSERT INTO wms.users (account_id, email, password) VALUES ($1, $2, $3) RETURNING account_id, user_id, email", in.AccountId, in.Email, hash)
	var user User
	err = row.Scan(&user.AccountId, &user.Id, &user.Email)
	if err != nil {
		return nil, err
	}
	return &UserCreatedMessage{User: &user}, nil
}
