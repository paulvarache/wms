package main

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"wms/database"
)

func main() {
	database.InitDB(fmt.Sprintf(
		"postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		"john",
		"pwd0123456789",
		"localhost",
		"5432",
		"mydb",
	))

	log.Println("Opened connection to DB")

	db := database.GetDB()

	file, err := os.Open("data.csv")
	if err != nil {
		log.Panic(err)
	}
	reader := csv.NewReader(bufio.NewReader(file))

	txn, err := db.Begin()
	if err != nil {
		log.Panic(err)
	}
	stmt, err := txn.Prepare("SELECT wms.load($1, $2, $3, $4, $5, $6, $7, $8);")
	if err != nil {
		txn.Rollback()
		log.Panic(err)
	}

	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		} else if err != nil {
			txn.Rollback()
			log.Panic(err)
		}
		log.Println(line[5])
		_, err = stmt.Exec(1, 1, line[3], line[0], line[0], "", line[5], 10)
		if err != nil {
			txn.Rollback()
			log.Panic(err)
		}
	}
	err = stmt.Close()
	if err != nil {
		txn.Rollback()
		log.Panic(err)
	}
	txn.Commit()
	if err != nil {
		log.Panic(err)
	}
}
