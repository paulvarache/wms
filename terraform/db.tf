resource "azurerm_postgresql_server" "main" {
  name                = "wms-postgresql"
  location            = azurerm_resource_group.wms.location
  resource_group_name = azurerm_resource_group.wms.name

  sku {
    name     = "GP_Gen5_2"
    capacity = 2
    tier     = "GeneralPurpose"
    family   = "Gen5"
  }

  storage_profile {
    storage_mb            = 5120
    backup_retention_days = 7
    geo_redundant_backup  = "Disabled"
    auto_grow             = "Enabled"
  }

  administrator_login          = "john"
  administrator_login_password = "zIkE4$wZ7V7^@4"
  version                      = "9.6"
  ssl_enforcement              = "Enabled"
}

resource "azurerm_postgresql_database" "main" {
  name                = "wms"
  resource_group_name = azurerm_postgresql_server.main.resource_group_name
  server_name         = azurerm_postgresql_server.main.name
  charset             = "UTF8"
  collation           = "en-US"
}

resource "azurerm_postgresql_virtual_network_rule" "postgres" {
  name                                 = "postgresql-vnet-rule"
  resource_group_name                  = azurerm_resource_group.wms.name
  server_name                          = azurerm_postgresql_server.main.name
  subnet_id                            = azurerm_subnet.databases.id
  ignore_missing_vnet_service_endpoint = true
}

resource "azurerm_postgresql_firewall_rule" "office" {
  name                = "office"
  resource_group_name = azurerm_resource_group.wms.name
  server_name         = azurerm_postgresql_server.main.name
  start_ip_address    = "195.167.132.74"
  end_ip_address      = "195.167.132.74"
}