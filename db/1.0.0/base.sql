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

CREATE INDEX users_email_index ON wms.users(email);

CREATE TABLE IF NOT EXISTS wms.skus (
    account_id INTEGER REFERENCES wms.accounts(account_id),
    sku text UNIQUE,
    name text,
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
    location text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS wms.inventory (
    sku TEXT REFERENCES wms.skus(sku),
    location TEXT REFERENCES wms.locations(location),
    quantity INTEGER,
    PRIMARY KEY(sku, location)
);

-- Reads an external inventory record and add/update the matching sku/location/quantity
-- If the sku already exists, the name will be updated
-- If the sku and location pair already exists, the quantity will be updated
CREATE OR REPLACE FUNCTION wms.load(Paccount_id integer, Pwarehouse_id integer, Psku text, Pname text, Pdescription text, Pbarcode text, Plocation text, Pquantity integer) RETURNS VOID AS $$
BEGIN
    PERFORM wms.load_sku(Paccount_id, Psku, Pname, Pdescription, Pbarcode);
    -- Insert locations if not exists
    INSERT INTO wms.locations(warehouse_id, location) VALUES(Pwarehouse_id, Plocation) ON CONFLICT (location) DO NOTHING;
    -- Insert inventory
    INSERT INTO wms.inventory(sku, location, quantity) VALUES(Psku, Plocation, Pquantity) ON CONFLICT (sku, location) DO UPDATE
        SET quantity=Pquantity;
END; $$
LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION wms.load_sku(INOUT Paccount_id integer, INOUT Psku text, INOUT Pname text, INOUT Pdescription text, INOUT Pbarcode text) AS $$
DECLARE
    ret RECORD;
BEGIN
    INSERT INTO wms.skus(account_id, sku, name, description, barcode) VALUES(Paccount_id, Psku, Pname, Pdescription, Pbarcode)
    ON CONFLICT (account_id, sku) DO UPDATE SET name=Pname, description=Pdescription, barcode=Pbarcode
    RETURNING account_id, sku, name, description, barcode INTO Paccount_id, Psku, Pname, Pdescription, Pbarcode;
END; $$
LANGUAGE PLPGSQL;
