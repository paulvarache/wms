SELECT p.name, s.sku, s.barcode
FROM wms.skus as s
JOIN wms.products as p ON s.product_id=p.product_id;
