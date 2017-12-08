<?php
    $myRoot = $_SERVER["DOCUMENT_ROOT"] . '/MapReport';
    include $myRoot . '/Data/ServiceDataFromDb.php';
?>

<?php
//Get Parameters
$startDatePeriod1 = isset($_GET["startP1"]) ? $_GET["startP1"] : '';
$endDatePeriod1 = isset($_GET["endP1"]) ? $_GET["endP1"] : '';
$startDatePeriod2 = isset($_GET["startP2"]) ? $_GET["startP2"] : '';
$endDatePeriod2 = isset($_GET["endP2"]) ? $_GET["endP2"] : '';
$kiosks = isset($_GET["kiosks"]) ? rtrim($_GET["kiosks"], ',') : '';
$channels = isset($_GET["channels"]) ? rtrim($_GET["channels"], ',') : '';
$showTop = isset($_GET["showTop"]) ? rtrim($_GET["showTop"], ',') : '';

// If required parameters has no values, then return blank
if(!(empty($startDatePeriod1) || empty($endDatePeriod1) ||
    empty($startDatePeriod2) || empty($endDatePeriod2) ||
    count($kiosks) == 0))
{

    $workingDaysInPeriod1 = getNoOfWorkingDays($startDatePeriod1, $endDatePeriod1);
    $workingDaysInPeriod2 = getNoOfWorkingDays($startDatePeriod2, $endDatePeriod2);

    /* Query with all columns */
    /*
    $query = "SELECT
		customer_account.id AS AccountNo,
		customer_account.Name AS Name,
        customer_account.kiosk_id AS KioskId,
        customer_account.gps_coordinates AS GPS,
        CASE WHEN gps_coordinates like '%,%'
			Then LEFT(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) -1)  END AS Lat,
		CASE WHEN gps_coordinates like '%,%'
			Then TRIM(SUBSTRING(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) + 1))  END AS Lng,
		Sum(receipt.total_gallons) as Total,
		" . $workingDaysInPeriod1 . " AS WorkingDaysInPeriod1,
        " . $workingDaysInPeriod2 . " AS WorkingDaysInPeriod2,
        SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0)) AS Period_1_Total,
		SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0)) AS Period_2_Total,
        ROUND(SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod1 . ", 2) AS Period_1_GPD,
		ROUND(SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod2 . ", 2) AS Period_2_GPD,
        ROUND(((SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod2 . ")/
			(SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod1 . ")-1) * 100, 2) AS PeriodToPeriodChange
	FROM customer_account
		INNER JOIN receipt ON receipt.customer_account_id = customer_account.id
    WHERE ((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . ") OR (created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "))
        AND customer_account.kiosk_id IN (" . $kiosks . ")
        AND receipt.sales_channel_id IN (" . $channels . ")
	GROUP BY receipt.customer_account_id
	ORDER BY Period_2_GPD DESC
    LIMIT " . $showTop . ";";
    */

    $query = "SELECT
        customer_account.contact_name AS Name,
	    CASE 
		    WHEN gps_coordinates LIKE '%,%' THEN LEFT(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) -1)  
		    WHEN gps_coordinates LIKE '% %' THEN LEFT(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) -1)
            ELSE NULL
            END AS Lat,
	    CASE 
		    WHEN gps_coordinates LIKE '%,%' THEN TRIM(SUBSTRING(customer_account.gps_coordinates, locate(',',customer_account.gps_coordinates) + 1))  
            WHEN gps_coordinates LIKE '% %' THEN TRIM(SUBSTRING(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) + 1))
            ELSE NULL
            END AS Lng,
        SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0)) AS Total1,
        SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0)) AS Total2,
        ROUND(SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod1 . ", 2) AS GPD1,
        ROUND(SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod2 . ", 2) AS GPD2,
        ROUND(((SUM(IF((created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod2 . ")/
            (SUM(IF((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . "), receipt.total_gallons, 0))/" . $workingDaysInPeriod1 . ")-1) * 100, 2) AS P2PChange
    FROM customer_account
        INNER JOIN receipt ON receipt.customer_account_id = customer_account.id
    WHERE ((created_date BETWEEN " . toDate($startDatePeriod1) . " AND " . toDate($endDatePeriod1) . ") OR (created_date BETWEEN " . toDate($startDatePeriod2) . " AND " . toDate($endDatePeriod2) . "))
        AND customer_account.kiosk_id IN (" . $kiosks . ")
        AND receipt.sales_channel_id IN (" . $channels . ")
    GROUP BY receipt.customer_account_id
    ORDER BY GPD2 DESC
    LIMIT " . $showTop . ";";

    //echo $query;

   echo getJsonFromQuery($query);
}

?>