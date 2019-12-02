INSERT INTO wms.accounts(name) VALUES('NGO'); -- 1

INSERT INTO wms.warehouses(account_id, name) VALUES (1, 'Clipper Wholesale'), (1, 'Clipper ECom'); -- 1, 2

INSERT INTO wms.skus(account_id, sku, name, description, barcode)
VALUES
    (1, 'NGO-0432-010', 'Nothing to wear', '', ''), -- 1
    (1, 'NGO-0443-006', 'Manga newspaper', '', ''); -- 2

INSERT INTO wms.locations(warehouse_id, name)
VALUES
    (1, 'WHOLESALE'), -- 1
    (2, '01-A-1'), -- 2
    (2, '01-A-2'), -- 3
    (2, '01-A-3'), -- 4
    (2, '01-A-4'); -- 5

INSERT INTO wms.inventory(sku_id, location_id, quantity)
VALUES
    (1, 2, 9),
    (2, 3, 30);
