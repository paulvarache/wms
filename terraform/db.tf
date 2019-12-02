# resource "google_sql_database" "database" {
#   name     = "my-database"
#   instance = google_sql_database_instance.master.name
# }

# resource "google_sql_database_instance" "master" {
#   name   = "my-database-instance"
#   region = "us-central"
#   database_version = "POSTGRES_9_6"
#   settings {
#     tier = "db-f1-micro"
#   }
# }