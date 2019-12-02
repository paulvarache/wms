package models

import (
	"database/sql"
	"log"

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
