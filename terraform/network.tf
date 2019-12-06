resource "azurerm_virtual_network" "wms" {
  name                = "wms-network"
  address_space       = ["10.1.2.0/24"]
  resource_group_name = azurerm_resource_group.wms.name
  location            = azurerm_resource_group.wms.location
}

resource "azurerm_subnet" "databases" {
  name                 = "databases"
  resource_group_name  = azurerm_resource_group.wms.name
  virtual_network_name = azurerm_virtual_network.wms.name
  address_prefix       = "10.1.2.0/24"
  service_endpoints    = ["Microsoft.Sql"]
}