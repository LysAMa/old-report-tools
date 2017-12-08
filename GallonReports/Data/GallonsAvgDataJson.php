<?php include 'Database.php';?>
<?php
$stmt ="SELECT
				kiosk.name AS Kiosk,
				Month(CURDATE()) AS Month, NoOfWorkingDaysToDate(CURDATE()) AS NoOfWorkingDaysToDate,
				ROUND(Sum(receipt_line_item.gallons)  / NoOfWorkingDaysToDate(CURDATE()), 2) AS DailyAvgOfgallons,
				ROUND(Sum(receipt_line_item.gallons)  / NoOfWorkingDaysToDate(CURDATE()), 0) * NoOfWorkingDaysToDate(LAST_DAY(CURDATE())) AS ExpectedAtMonthEnd
				FROM (receipt_line_item INNER JOIN receipt ON receipt_line_item.receipt_id = receipt.id)
				INNER JOIN kiosk ON receipt.kiosk_id = kiosk.id WHERE Month(created_date) = Month(CURDATE()) and Year(created_date) = Year(CURDATE())
				GROUP BY kiosk.name,
				 Year(created_date),
				 Month(created_date)";
echo json_encode(executeStmt($stmt));
?>