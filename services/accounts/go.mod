module wms/accounts

go 1.12

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	golang.org/x/crypto v0.1.0
	google.golang.org/grpc v1.25.1
	wms/database v0.0.0-00010101000000-000000000000
	wms/util v0.0.0-00010101000000-000000000000
)

replace wms/database => ../database

replace wms/util => ../util
