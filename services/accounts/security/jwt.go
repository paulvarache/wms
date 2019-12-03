package security

import (
	"wms/util"

	"github.com/dgrijalva/jwt-go"
)

// Claims define the structure of the JWT body
type Claims struct {
	UserID int64
	jwt.StandardClaims
}

var jwtKey []byte = util.GetJWTKey()

// CreateJWTForUser returns a JWT string token for a user id
func CreateJWTForUser(userID int64, expirationTime int64) (string, error) {
	claims := &Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime,
		},
	}
	var jwtKey = []byte("key")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
