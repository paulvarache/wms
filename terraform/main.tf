terraform {
    required_version = ">= 0.12"
    backend "azurerm" {}
}

resource "azurerm_resource_group" "wms" {
  name     = "wms-resources"
  location = var.location
}
