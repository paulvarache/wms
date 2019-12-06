module wms/shopify

go 1.13

require (
	github.com/bold-commerce/go-shopify v2.3.0+incompatible
	github.com/google/go-querystring v1.0.0 // indirect
	github.com/shopspring/decimal v0.0.0-20191130220710-360f2bc03045 // indirect
	google.golang.org/grpc v1.25.1
	wms/inventory v0.0.0-00010101000000-000000000000
	wms/util v0.0.0-00010101000000-000000000000
)

replace wms/util => ../util

replace wms/database => ../database

replace wms/inventory => ../inventory
