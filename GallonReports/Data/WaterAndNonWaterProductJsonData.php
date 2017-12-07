<?php include 'Database.php';?>
<?php
$stmt = "Select year(receipt.Created_date) As Yr, month(receipt.Created_date) As Mo,
				Sum(If(product.category_id = 60,receipt_line_item.price,0)) AS SumOfWaterProduct,
				Sum(If((product.category_id != 60 OR product.category_id != 61 OR product.category_id != 62 OR product.category_id != 68),receipt_line_item.price,0)) AS SumOfNoneWaterProduct,
				CONCAT(Convert(Year(created_date), CHAR(4)) , LPAD(Convert(Month(created_date), CHAR(2)), 2, '0')) AS YrMo
				From receipt_line_item
				INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id
				INNER JOIN product ON receipt_line_item.sku = product.sku
				GROUP BY year(receipt.Created_date), month(receipt.Created_date)
				ORDER BY year(receipt.Created_date) DESC, month(receipt.Created_date) DESC";
echo json_encode(executeStmt($stmt));
?>