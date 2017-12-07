
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="Scripts/jquery.min.js"></script>
    <style>
        body {
            background-color: #E6E6FA !important;
        }

        .hr {
            color: black !important;
            background-color: black !important;
        }

        .tip {
            font-size: 11px;
            padding: 0;
            border: 1px solid #bbbbbb;
        }

            .tip td {
                border: 1px solid #bbbbbb;
            }

        .selectbox {
            background: #fff;
            color: #333;
            padding: 8px;
            line-height: 18px;
            border-radius: 4px;
            border-width: 0 1px 4px;
            cursor: pointer;
        }

        .selectbox, .site {
            border: 1px solid #ddd;
        }
    </style>

    <script src="Scripts/jquery-3.2.1.min.js"></script>
    <script src="Scripts/bootstrap-3.0.3.min.js"></script>
    <script src="Scripts/bootstrap-multiselect.js"></script>
    <script src="Scripts/moment.min.js"></script>
    <script src="Scripts/daterangepicker-2.1.25.js"></script>
    <script src="Scripts/highcharts.js"></script>
    <script src="Scripts/exporting.js"></script>
    <script src="Scripts/EstimateGallonScript.js"></script>
    <link href="Styles/bootstrap-3.0.3.min.css" rel="stylesheet" />
    <link href="Styles/daterangepicker-2.1.25.css" rel="stylesheet" />


    <title>Estimate: Gallons</title>

</head>
<body>
    <div>
        <?php
        $myRoot = $_SERVER["DOCUMENT_ROOT"] . '/EstimateGallons';
        include $myRoot . '/Data/options.php';
        include $myRoot . '/Data/Database.php';
        $url = $_SERVER['REQUEST_URI'];
        $parts = explode('/',$url);
        $dir = 'http://' . ($_SERVER['SERVER_NAME'] == 'localhost' ? 'localhost:81' : $_SERVER['SERVER_NAME']) ;
        for ($i = 0; $i < count($parts) - 1; $i++) {
            $dir .= $parts[$i] . "/";
        }
        ?>
        <div>
            <div class="row" style="margin:10px;">
                
                <div class='col-sm-1'>
                    <b>Date :</b>
                </div>
                <div class='col-sm-4'>
                    <div id="datePeriod1" class="selectbox pull-left">
                        <i class="glyphicon glyphicon-calendar"></i>
                        <span></span>
                        <b class="caret"></b>
                    </div>
                </div>
                <div class='col-sm-1'>
                    <b>Kiosk :</b>
                </div>
                <div class='col-sm-2'><?php echo generateSelect('kiosklist', false, getKioskOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <input type='button' id='btnFilter' value='Show' class='btn btn-primary' />
                    <input id="myRoot" type="hidden" value="<?php echo $dir; ?>" />
                </div>

            </div>
            <div class="row" style="margin:10px;">
                <div class='col-sm-12'>
                    <div id="EsimateGallonsContainer" style="min-width: 310px; height: 550px; margin: 0 auto"></div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>