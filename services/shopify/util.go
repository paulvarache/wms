package main

import (
	"io/ioutil"
	"log"
	"net/http"
)

// PrintBody will print the contents of a request body to the console
func PrintBody(r *http.Request) error {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return err
	}
	log.Println(string(body))
	return nil
}
