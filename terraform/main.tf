terraform {
    required_version = ">= 0.12"
  # State is saved in a GCloud Storage bucket. This one was created manually. This is the only manual resource required
    backend "gcs" {
      bucket  = "paulvarache-tf-state"
      prefix  = "terraform/wms"
    }
}
