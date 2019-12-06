resource "azurerm_storage_account" "imports" {
  name                     = "wmsimports"
  resource_group_name      = azurerm_resource_group.wms.name
  location                 = azurerm_resource_group.wms.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "csv" {
  name                  = "csv"
  storage_account_name  = azurerm_storage_account.imports.name
  container_access_type = "private"
}
