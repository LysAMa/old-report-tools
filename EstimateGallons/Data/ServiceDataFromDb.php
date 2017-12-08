<?php include 'Database.php';?>

<?php

function getNoOfWorkingDays($startDate, $endDate) {
    $result = executeStmt("SELECT NoOfWorkingDays(STR_TO_DATE('" . $startDate . "', '%d-%m-%Y'), STR_TO_DATE('" . $endDate . "', '%d-%m-%Y')) AS WorkingDays");
    return count($result) > 0 ? $result[0]["WorkingDays"] : 0;
}

function getJsonFromQuery($query) {
    $result = executeStmt($query);
    
    return json_encode($result);
}
function toDate($dateString){
    return " STR_TO_DATE('" . $dateString . "', '%d-%m-%Y') ";
}



?>