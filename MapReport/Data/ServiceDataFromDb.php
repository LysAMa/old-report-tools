<?php include 'Database.php';?>

<?php

function getNoOfWorkingDays($startDate, $endDate) {
    $result = executeStmt("SELECT NoOfWorkingDays(STR_TO_DATE('" . $startDate . "', '%d-%m-%Y'), STR_TO_DATE('" . $endDate . "', '%d-%m-%Y')) AS WorkingDays");
    return count($result) > 0 ? $result[0]["WorkingDays"] : 0;
}

function getJsonFromQuery($query) {
    $result = executeStmt($query);
    //return json_encode($result);
    for ($i = 0; $i < count($result); $i++)
    {
         $result[$i]['Name'] = iconv(mb_detect_encoding($result[$i]['Name'], mb_detect_order(), true), "UTF-8", $result[$i]['Name']);
    }
    return json_encode($result);//json_encode($result, JSON_UNESCAPED_UNICODE);
}

function toDate($dateString){
    return " STR_TO_DATE('" . $dateString . "', '%d-%m-%Y') ";
}

function getSchoolJsonData() {
    $query = "SELECT
	        contact_name as SchoolName,
            GetAverageGallons(customer_account.id, STR_TO_DATE('01-05-2017', '%d-%m-%Y'), STR_TO_DATE('30-05-2017', '%d-%m-%Y')) AS Gallons,
	        CASE WHEN gps_coordinates like '% %' AND length(gps_coordinates) > 1
		        Then LEFT(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) -1)  END AS Lat,
	        CASE WHEN gps_coordinates like '% %' AND length(gps_coordinates) > 1
		        Then TRIM(SUBSTRING(customer_account.gps_coordinates, locate(' ',customer_account.gps_coordinates) + 1))  END AS Lng,
	        serviceable_customer_base as NoOfStudents
	        FROM customer_account where customer_type_id = 120 and active = 1 and gps_coordinates != ''
	        Limit 2000 ";
    $result = executeStmt($query);
    for ($i = 0; $i < count($result); $i++)
    {
         $result[$i]['SchoolName'] = iconv(mb_detect_encoding($result[$i]['SchoolName'], mb_detect_order(), true), "UTF-8", $result[$i]['SchoolName']);
    }
    return json_encode($result, JSON_UNESCAPED_UNICODE);//json_encode($result);
}

?>