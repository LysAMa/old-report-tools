<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DloHaiti - Map Report</title>
    <script src="Scripts/jquery-3.2.1.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?libraries=geometry,places&ext=.js&key=AIzaSyDDU8G2YqxKA9GByUS0WV406Fw0rwGeOAU"></script>
    <script src="https://cdn.rawgit.com/googlemaps/v3-utility-library/master/infobox/src/infobox.js?key=AIzaSyDDU8G2YqxKA9GByUS0WV406Fw0rwGeOAU"></script>
    
    <script src="Scripts/bootstrap-3.0.3.min.js"></script>
    <link href="Styles/bootstrap-3.0.3.min.css" rel="stylesheet" />

    <!-- Include jQuery UI -->
    <script src="Scripts/jquery-ui-1.12.1.js"></script>
    <link href="Styles/jquery-ui-1.12.1.css" rel="stylesheet" />


    <!-- Include Multi Select Dropdown -->
    <script src="Scripts/bootstrap-multiselect.js"></script>
    <link href="Styles/bootstrap-multiselect.css" rel="stylesheet" />

    <!-- Include Date Range Picker -->
    <script src="Scripts/moment.min.js"></script>
    <script src="Scripts/daterangepicker-2.1.25.js"></script>
    <link href="Styles/daterangepicker-2.1.25.css" rel="stylesheet" />


    <script src="Scripts/MapScript.js"></script>
    <script src="Scripts/PageScript.js"></script>
    <link href="Styles/MapStyles.css" rel="stylesheet" />
    <link href="Styles/PageStyles.css" rel="stylesheet" />
    

</head>
<body>
    <?php
    $myRoot = getcwd();
    include $myRoot . '/Data/options.php';
    include $myRoot . '/Data/Database.php';

    $url = $_SERVER['REQUEST_URI'];
    $parts = explode('/',$url);
    $dir = 'http://' . $_SERVER['SERVER_NAME'];
    for ($i = 0; $i < count($parts) - 1; $i++) {
        $dir .= $parts[$i] . "/";
    }
    ?>
    <div class="content">
        <div class="row">
            <div class='col-sm-1'>Kiosk:</div>
            <div class='col-sm-2'>
                <?php echo generateSelect('selKiosks', true, getKioskOptions()); ?>
            </div>
            <div class='col-sm-1'></div>
            <div class='col-sm-1'>Show Top:</div>
            <div class='col-sm-2'>
                <?php echo generateSelect('selShowTop', false, getOptionsFromList(array(5, 10, 15, 20, 25, 30, 35, 40, 45, 50)));?>
            </div>
        </div>
    </div>
    <input id="myRoot" type="hidden" value="<?php echo $dir; ?>" />
    <div id="map"></div>
    <script>
        google.maps.event.addDomListener(window, "load", initMap);
    </script>
    <div id="mapTabularData"></div>
    <br/> <br/> <br/>

    <!--<div id="exTab2" class="container">
        <ul class="nav nav-tabs">
            <li class="active">
                <a href="#mapView" data-toggle="tab">Map View</a>
            </li>
            <li>
                <a href="#tabularView" data-toggle="tab">Tabular View</a>
            </li>
        </ul>

        <div class="tab-content ">
            <div class="tab-pane active" id="mapView">
                <h1>Map view</h1>

            </div>
            <div class="tab-pane" id="tabularView">
                <h3>Notice the gap between the content and tab after applying a background color</h3>
            </div>
        </div>
    </div>-->




</body>
</html>
