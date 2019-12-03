package api

import (
	context "context"
	"database/sql"
	"errors"
	"time"
	"wms/accounts/security"
	"wms/database"
)

// Server is a an empty representation of the server
type Server struct {
}

// ScanUser will return a user from a DB query
func ScanUser(row *sql.Row) (*User, error) {
	var user User
	err := row.Scan(&user.AccountId, &user.Id, &user.Email)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser will register a user
func (s *Server) CreateUser(ctx context.Context, in *CreateUserMessage) (*UserCreatedMessage, error) {
	hash, err := security.HashPassword(in.Password)
	if err != nil {
		return nil, err
	}
	db := database.GetDB()
	row := db.QueryRow("INSERT INTO wms.users (account_id, email, password) VALUES ($1, $2, $3) RETURNING account_id, user_id, email", in.AccountId, in.Email, hash)
	user, err := ScanUser(row)
	if err != nil {
		return nil, err
	}
	return &UserCreatedMessage{User: user}, nil
}

// Authenticate will generate a session for a given username/password
func (s *Server) Authenticate(ctx context.Context, in *AuthMessage) (*AuthResponse, error) {
	db := database.GetDB()
	row := db.QueryRow("SELECT account_id, user_id, email, password FROM wms.users WHERE email=$1", in.Email)
	var user User
	var hash string
	err := row.Scan(&user.AccountId, &user.Id, &user.Email, &hash)
	if err == sql.ErrNoRows {
		return nil, errors.New("User not found for account")
	}
	if err != nil {
		return nil, err
	}
	correctPassword := security.CheckPasswordHash(in.Password, hash)
	if correctPassword == false {
		return nil, errors.New("Username or password incorrect")
	}
	expirationTime := time.Now().Add(5 * time.Minute).Unix()
	token, err := security.CreateJWTForUser(user.Id, expirationTime)
	if err != nil {
		return nil, err
	}
	return &AuthResponse{User: &user, Session: &Session{Token: token, Expires: expirationTime}}, nil
}
