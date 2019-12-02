DO $$
BEGIN
  CREATE ROLE users;
  EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'not creating role users -- it already exists';
END
$$;

DROP SCHEMA IF EXISTS wms CASCADE;

CREATE SCHEMA IF NOT EXISTS wms;
GRANT USAGE ON SCHEMA wms to users;


CREATE TABLE IF NOT EXISTS wms.accounts (
    account_id SERIAL UNIQUE PRIMARY KEY,
    name text
);

CREATE TABLE IF NOT EXISTS wms.users (
    account_id INTEGER REFERENCES wms.accounts(account_id),
    user_id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS wms.skus (
    account_id INTEGER REFERENCES wms.accounts(account_id),
    sku_id SERIAL UNIQUE,
    sku text UNIQUE,
    name text NOT NULL,
    description text,
    barcode text,
    PRIMARY KEY (account_id, sku)
);

CREATE TABLE IF NOT EXISTS wms.warehouses (
    account_id INTEGER REFERENCES wms.accounts(account_id),
    warehouse_id SERIAL PRIMARY KEY,
    name text
);

CREATE TABLE IF NOT EXISTS wms.locations (
    warehouse_id INTEGER REFERENCES wms.warehouses(warehouse_id),
    location_id SERIAL PRIMARY KEY,
    name text UNIQUE
);

CREATE INDEX location_name_idx ON wms.locations(name);

CREATE TABLE IF NOT EXISTS wms.inventory (
    inventory_id SERIAL PRIMARY KEY,
    sku_id INTEGER REFERENCES wms.skus(sku_id),
    location_id INTEGER REFERENCES wms.locations(location_id),
    quantity INTEGER
);
