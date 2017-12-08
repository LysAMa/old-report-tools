<?php
$myRoot = $_SERVER["DOCUMENT_ROOT"] . '/MapReport';
include 'ServiceDataFromDb.php';

$url = $_SERVER['REQUEST_URI'];
$parts = explode('/',$url);
$dir = 'http://' . $_SERVER['SERVER_NAME'];

for ($i = 0; $i < count($parts) - 1; $i++) {
    $dir .= $parts[$i] . "/";
}

echo getSchoolJsonData();

?>

