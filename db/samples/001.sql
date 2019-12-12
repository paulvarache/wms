INSERT INTO wms.accounts(name) VALUES('NGO'); -- 1

INSERT INTO wms.warehouses(account_id, name) VALUES (1, 'Clipper Wholesale'), (1, 'Clipper ECom'); -- 1, 2

INSERT INTO wms.locations(warehouse_id, location) VALUES(2, 'INBOUND');

SELECT wms.load(1, 2, 'NGO-0432-010', 'Nothing to wear', '', '', '01-A-1', 9);
SELECT wms.load(1, 2, 'NGO-0443-006', 'Manga newspaper', '', '', '01-A-2', 30);

INSERT INTO wms.operations(account_id, reference) VALUES (1, '27-02-20 inbound');
INSERT INTO wms.operation_items(operation_id, sku, quantity_requested, source_location, target_location) VALUES (1, 'NGO-0432-010', 150, NULL, 'INBOUND');