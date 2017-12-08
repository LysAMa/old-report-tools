<?php include 'Database.php';

function getNoOfWorkingDays($startDate, $endDate) {
    $result = executeStmt("SELECT NoOfWorkingDays(STR_TO_DATE('" . $startDate . "', '%d-%m-%Y'), STR_TO_DATE('" . $endDate . "', '%d-%m-%Y')) AS WorkingDays");

    return count($result) > 0 ? $result[0]["WorkingDays"] : 0;
}

function getSchoolJsonData() {
    $query = "SELECT
	        contact_name as SchoolName,
            GetAverageGallonsTmp(customer_account.id, STR_TO_DATE('01-09-2017', '%d-%m-%Y'), NOW()) AS Gallons,
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
	        serviceable_customer_base as NoOfStudents
	        FROM customer_account where serviceable_customer_base IS NOT NULL and customer_type_id = 120 and active = 1 and gps_coordinates != ''";

    $result = executeStmt($query);

    return json_encode($result);
}

?>
