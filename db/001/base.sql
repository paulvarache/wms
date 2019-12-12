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

CREATE TYPE wms.operation_state AS ENUM ('awaiting', 'ready', 'processed');

CREATE TABLE IF NOT EXISTS wms.operations (
    account_id INTEGER REFERENCES wms.accounts(account_id),
    operation_id SERIAL PRIMARY KEY,
    reference TEXT NOT NULL,
    state wms.operation_state NOT NULL DEFAULT 'awaiting'
);

CREATE TABLE IF NOT EXISTS wms.operation_items (
    operation_item_id SERIAL PRIMARY KEY,
    operation_id INTEGER REFERENCES wms.operations(operation_id),
    sku TEXT REFERENCES wms.skus(sku),
    quantity_requested INTEGER NOT NULL,
    quantity_processed INTEGER,
    source_location TEXT REFERENCES wms.locations(location),
    target_location TEXT REFERENCES wms.locations(location)
);

-- Updates the status of an operation based on the info in all of its operation items
CREATE OR REPLACE FUNCTION wms.update_operation_status()
    RETURNS TRIGGER AS
$$
DECLARE
    _has_quantity BIGINT;
BEGIN
    SELECT SUM(CASE WHEN target_location IS NULL THEN 1 END), SUM(CASE WHEN quantity_processed IS NULL THEN 1 END) INTO _has_quantity FROM wms.operation_items WHERE operation_id=NEW.operation_id;
    IF _has_quantity IS NULL THEN
        UPDATE wms.operations SET state='ready' WHERE operation_id=NEW.operation_id;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE PLPGSQL;

-- Calls the function to update the operation status when one of its operation item changes
CREATE TRIGGER post_operation_item_update_trigger
    AFTER UPDATE
    ON wms.operation_items
    FOR EACH ROW
    EXECUTE PROCEDURE wms.update_operation_status();

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

-- Creates or updates a sku information
CREATE OR REPLACE FUNCTION wms.load_sku(INOUT Paccount_id integer, INOUT Psku text, INOUT Pname text, INOUT Pdescription text, INOUT Pbarcode text) AS $$
BEGIN
    INSERT INTO wms.skus(account_id, sku, name, description, barcode) VALUES(Paccount_id, Psku, Pname, Pdescription, Pbarcode)
    ON CONFLICT (account_id, sku) DO UPDATE SET name=Pname, description=Pdescription, barcode=Pbarcode
    RETURNING account_id, sku, name, description, barcode INTO Paccount_id, Psku, Pname, Pdescription, Pbarcode;
END; $$
LANGUAGE PLPGSQL;

-- For a given operation item, apply the quantioty changes to the source and target locations. If one of the location doesn't exists, ignore
CREATE OR REPLACE FUNCTION wms.apply_operation_item(Poperation_item_id INTEGER) RETURNS VOID AS $$
DECLARE
    VSku TEXT;
    Vquantity INTEGER; 
    Vlocation TEXT; 
BEGIN
    SELECT sku, quantity_processed, target_location INTO VSku, Vquantity, Vlocation FROM wms.operation_items WHERE operation_item_id=Poperation_item_id;
    CASE
        WHEN Vquantity IS NULL THEN RAISE null_value_not_allowed USING MESSAGE = 'Missing quantity_processed';
    ELSE 
        INSERT INTO wms.inventory(sku, location, quantity) VALUES(VSku, Vlocation, Vquantity)
        ON CONFLICT (sku, location) DO UPDATE SET quantity=EXCLUDED.quantity + Vquantity;
    END CASE;
END; $$
LANGUAGE PLPGSQL;

-- For a given operation, find all items and modify the inventory to reflect the changes 
CREATE OR REPLACE FUNCTION wms.apply_operation(Poperation_id INTEGER) RETURNS VOID AS $$
DECLARE
    _operation_state wms.operation_state;
BEGIN
    SELECT state INTO _operation_state FROM wms.operations WHERE operation_id=Poperation_id;
    CASE
        WHEN _operation_state IS NULL THEN RAISE null_value_not_allowed USING MESSAGE = 'operation not found';
        WHEN _operation_state != 'ready' THEN RAISE null_value_not_allowed USING MESSAGE = 'operation not in ready state';
    ELSE
        SELECT wms.apply_operation_item(operation_item_id) FROM wms.operation_items WHERE operation_id=Poperation_id;
        UPDATE wms.operations SET state='processed' WHERE operation_id=Poperation_id;
    END CASE;
END; $$
LANGUAGE PLPGSQL;
