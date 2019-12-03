module wms/accounts

go 1.12

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/golang/protobuf v1.3.2
	golang.org/x/crypto v0.0.0-20190308221718-c2843e01d9a2
	google.golang.org/grpc v1.25.1
	wms/database v0.0.0-00010101000000-000000000000
	wms/util v0.0.0-00010101000000-000000000000
)

replace wms/database => ../database

replace wms/util => ../util
