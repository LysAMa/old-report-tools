<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>

    <title>DloHaiti - Customer Report</title>

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
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

    <script src="Scripts/CustomerMapScript.js"></script>
    <script src="Scripts/CustomerPageScript.js"></script>
    <link href="Styles/MapStyles.css" rel="stylesheet" />
    <link href="Styles/PageStyles.css" rel="stylesheet" />

</head>
<body>
    <?php
    $myRoot = getcwd();
    include $myRoot . '/Data/options.php';
    include $myRoot . '/Data/Database.php';
    ?>
    <div class="content">
        <div class="row">
            <div class='col-sm-3'>
				<label for="datePeriod">Period: </label>
                <div id="datePeriod" class="selectbox">
                    <i class="glyphicon glyphicon-calendar"></i>
                    <span></span>
                    <b class="caret"></b>
                </div>
            </div>

            <div class='col-sm-3'>
				<label for="selKiosks">Kiosk:</label>
                <?php echo generateSelect('selKiosks', true, getKioskOptions()); ?>
            </div>

            <div class='col-sm-3'>
				<label for="selShowTop">Show Top:</label>
                <?php echo generateSelect('selShowTop', false, getOptionsFromList(array(5, 10, 15, 20, 25, 30, 35, 40, 45, 50)));?>
            </div>

			<div class='col-sm-offset-2 col-sm-1'>
				<input type='button' id='btnGetData' value='Show' class='btn btn-primary' />
			</div>
        </div>
    </div>

    <div id="map"></div>

    <script>
        google.maps.event.addDomListener(window, "load", initMap);
    </script>
</body>
</html>
