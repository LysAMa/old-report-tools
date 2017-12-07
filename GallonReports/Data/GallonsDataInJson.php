<?php include 'Database.php';?>
<?php
$stmt = "SELECT	kiosk.name AS Kiosk, Year(created_date) AS Yr, Month(created_date) AS Mo,
	     CONCAT(Convert(Year(created_date), CHAR(4)) , LPAD(Convert(Month(created_date), CHAR(2)), 2, '0')) AS YrMo,
         Sum(receipt_line_item.gallons) AS SumOfgallons
		 FROM (receipt_line_item INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id)
		 INNER JOIN kiosk ON receipt.kiosk_id = kiosk.id
		 WHERE receipt.created_date >= '11/1/2016' GROUP BY kiosk.name,
		 Year(created_date), Month(created_date) ORDER BY kiosk.name,
		 Year(created_date) DESC , Month(created_date) DESC";
echo json_encode(executeStmt($stmt));
?>