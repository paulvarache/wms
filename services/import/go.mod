module wms/import

go 1.13

require (
	github.com/golang/protobuf v1.3.2
	github.com/lib/pq v1.2.0
	google.golang.org/grpc v1.25.1
	wms/database v0.0.0-00010101000000-000000000000
	wms/util v0.0.0-00010101000000-000000000000
)

replace wms/database => ../database

replace wms/util => ../util
