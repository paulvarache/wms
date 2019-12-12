package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	// Imported as a side effect of openning the SQL connection
	_ "github.com/lib/pq"
)

var db *sql.DB = nil

// InitDB initialises the global connection pool to the database
// Will do nothing if already initialised
func InitDB(dataSourceName string) {
	if db != nil {
		return
	}
	var err error
	db, err = sql.Open("postgres", dataSourceName)
	log.Println("Opened connection to Postgres")
	if err != nil {
		log.Panic(err)
	}

	// Effectively check the connection to the DB
	if err = db.Ping(); err != nil {
		log.Panic(err)
	}
}

// GetDataSourceNameFromEnv will build the connection string for the PG db based on the env variables provided
func GetDataSourceNameFromEnv() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_PORT"),
		os.Getenv("POSTGRES_DB"),
	)
}

// GetDB returns the db
func GetDB() *sql.DB {
	if db == nil {
		log.Panic(errors.New("InitDB was not called"))
	}
	return db
}

// NewNullString will returna sql ready string. It automatically handles null values for strings
func NewNullString(s string) sql.NullString {
	if len(s) == 0 {
		return sql.NullString{}
	}
	return sql.NullString{
		String: s,
		Valid:  true,
	}
}
