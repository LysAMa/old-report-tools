<?php
$myRoot = $_SERVER["DOCUMENT_ROOT"] . '/GallonReports';
include $myRoot . '/Data/ServiceDataFromDb.php';
?>

<?php
//Get Parameters
$startDate = isset($_GET["startDate"]) ? $_GET["startDate"] : '';
$endDate = isset($_GET["endDate"]) ? $_GET["endDate"] : '';
$kiosk = isset($_GET["kiosk"]) ? rtrim($_GET["kiosk"], ',') : '';

// If required parameters has no values, then return blank
if(!(empty($startDate) || empty($endDate)|| count($kiosk) == 0))
{
    $query = "SELECT kiosk.name AS Kiosk, Date(reading.created_date) AS date, parameter.name AS Parameter, sampling_site.name AS Samplingsite,
                measurement.value, value*(60*11) AS EstimatedDailyProduction
                FROM parameter
                INNER JOIN ((kiosk INNER JOIN (measurement INNER JOIN reading ON measurement.reading_id = reading.id)
                ON kiosk.id = reading.kiosk_id)
                INNER JOIN sampling_site ON reading.sampling_site_id = sampling_site.id) ON parameter.id = measurement.parameter_id
                where kiosk.name = '". $kiosk . "' AND DATE(reading.created_date) BETWEEN" . toDate($startDate) . " AND " . toDate($endDate) .
                "GROUP BY kiosk.name, reading.created_date, parameter.name, sampling_site.name, measurement.value, value*(60*11)
                HAVING ((parameter.name)='Product Flow Rate') ";

    // echo $query;
    echo getJsonFromQuery($query);
   




}

?>