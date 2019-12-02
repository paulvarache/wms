resource "google_service_account" "service_account" {
  project = var.project
  account_id   = "wms-gke-service-account"
  display_name = "Service account for the WMS GKE cluster"
}

resource "google_project_iam_custom_role" "gke_wms_gcr_access" {
  role_id     = "gke_wms_gcr_access"
  title       = "Access to storage bucket for image pulling"
  description = "Allows a GKE instance's pods to pull images from the storage"
  permissions = [
    "storage.objects.get",
    "storage.objects.list"
  ]
}

resource "google_project_iam_binding" "gke_iam_binding" {
  project = var.project
  role    = "projects/${google_project_iam_custom_role.gke_wms_gcr_access.project}/roles/${google_project_iam_custom_role.gke_wms_gcr_access.role_id}"

  members = [
    "serviceAccount:${google_service_account.service_account.email}",
  ]
}
