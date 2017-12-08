<?php include 'Database.php';?>
<?php
$stmt = "Select year(receipt.Created_date) As Yr, month(receipt.Created_date) As Mo, receipt_line_item.sku As SKU,
        Sum(receipt_line_item.gallons) AS SumOfGallons,
		CONCAT(Convert(Year(created_date), CHAR(4)) , LPAD(Convert(Month(created_date), CHAR(2)), 2, '0')) AS YrMo
        From (receipt_line_item INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id)
		GROUP BY receipt_line_item.sku,year(receipt.Created_date),month(receipt.Created_date)
		Order by year(receipt.Created_date) DESC,month(receipt.Created_date) DESC,receipt_line_item.sku";
echo json_encode(executeStmt($stmt));
?>
