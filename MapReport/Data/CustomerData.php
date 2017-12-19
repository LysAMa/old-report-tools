<?php

include 'Database.php';

$kiosks = isset($_GET["kiosks"]) ? $_GET["kiosks"] : '';
$showTop = isset($_GET["showTop"]) ? $_GET["showTop"] : '';
$startDatePeriod = isset($_GET["startP"]) ? $_GET["startP"] : '';
$endDatePeriod = isset($_GET["endP"]) ? $_GET["endP"] : '';

if(empty($startDatePeriod) || empty($endDatePeriod) || empty($kiosks)) {
	echo json_encode([]);
	exit();
}

$query = "SELECT
			contact_name as customerName,
			GetAverageGallonsTmp(customer_account.id, ". toDate($startDatePeriod) .", ". toDate($endDatePeriod) .") AS Gallons,
			CASE
				WHEN gps_coordinates like '% %' AND length(gps_coordinates) > 1
					Then LEFT(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) - 1)
				WHEN gps_coordinates like '%,%' AND length(gps_coordinates) > 1
					Then LEFT(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) - 1)
			END AS Lat,
			CASE
				WHEN gps_coordinates like '% %' AND length(gps_coordinates) > 1
					Then TRIM(SUBSTRING(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) + 1))
				WHEN gps_coordinates like '%,%' AND length(gps_coordinates) > 1
					Then TRIM(SUBSTRING(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) + 1))
			END AS Lng,
			`what3words`,
			FROM customer_account 
			WHERE gps_coordinates != ''
			ORDER BY Gallons DESC,
			LIMIT ". $showTop ."";

$result = executeStmt($query);

echo $result;

?>
