package util

import (
	"errors"
	"log"
	"os"
	"strconv"
)

// ErrEnvVarEmpty is used to raise errors
var ErrEnvVarEmpty = errors.New("getenv: environment variable empty")

func GetenvStr(key string) (string, error) {
	v := os.Getenv(key)
	if v == "" {
		return v, ErrEnvVarEmpty
	}
	return v, nil
}

func GetenvInt(key string) (int, error) {
	s, err := GetenvStr(key)
	if err != nil {
		return 0, err
	}
	v, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	return v, nil
}

var jwtKey []byte = nil

// GetJWTKey reads the JWT_KEY env var and caches the value
func GetJWTKey() []byte {
	if jwtKey == nil {
		keyString, err := GetenvStr("JWT_KEY")
		if err != nil {
			log.Panic(err)
		}
		jwtKey = []byte(keyString)
	}
	return jwtKey
}
