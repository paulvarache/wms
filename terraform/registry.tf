data "google_container_registry_repository" "main" {
}
output "gcr_location" {
  value = data.google_container_registry_repository.main.repository_url
}