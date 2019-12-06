INSERT INTO wms.accounts(name) VALUES('NGO'); -- 1

INSERT INTO wms.warehouses(account_id, name) VALUES (1, 'Clipper Wholesale'), (1, 'Clipper ECom'); -- 1, 2

INSERT INTO wms.locations(warehouse_id, location)
VALUES
    (1, 'WHOLESALE'), -- 1
    (2, '01-A-1'), -- 2
    (2, '01-A-2'), -- 3
    (2, '01-A-3'), -- 4
    (2, '01-A-4'); -- 5

SELECT wms.load(1, 1, 'NGO-0432-010', 'Nothing to wear', '', '', '01-A-1', 9);
SELECT wms.load(1, 1, 'NGO-0443-006', 'Manga newspaper', '', '', '01-A-2', 30);
