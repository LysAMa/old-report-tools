<?php

include 'Database.php';

$kiosks = isset($_GET["kiosks"]) ? $_GET["kiosks"] : '';
$showTop = isset($_GET["showTop"]) ? $_GET["showTop"] : '';
$startDatePeriod = isset($_GET["startP"]) ? $_GET["startP"] : '';
$endDatePeriod = isset($_GET["endP"]) ? $_GET["endP"] : '';

echo json_encode(['lmao']);
exit();

if(empty($startDatePeriod) || empty($endDatePeriod) || empty($kiosks)) {
	echo json_encode([]);
	exit();
}

$query = "SELECT
			contact_name as customerName,
			GetAverageGallonsTmp(customer_account.id, STR_TO_DATE('". $startDatePeriod ."', '%d-%m-%Y'), STR_TO_DATE('". $endDatePeriod ."', '%d-%m-%Y')) AS Gallons,
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
			END AS Lng
			FROM customer_account
			WHERE gps_coordinates != '' AND kiosk_id IN (". $kiosks .")
			ORDER BY Gallons DESC
			LIMIT ". $showTop .";";

$result = executeStmt($query);

echo json_encode($result);

?>
