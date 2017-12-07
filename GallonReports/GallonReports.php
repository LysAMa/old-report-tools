<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
   
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
    <script src="Scripts/bootstrap.min.js"></script>
    <script src="Scripts/bootstrap-multiselect.js"></script>
    
    <script src="Scripts/moment.min.js"></script>
    <script src="Scripts/daterangepicker-2.1.25.js"></script>
    <script src="Scripts/highcharts.js"></script>
    <script src="Scripts/highcharts-more.js"></script>
    <script src="Scripts/exporting.js"></script>
   

    <script src="Scripts/GallonsReports.js"></script>
    <script src="Scripts/GallonsAverage.js"></script>
    <script src="Scripts/VolumeReport.js"></script>
    <script src="Scripts/WaterAndNonWaterProducts.js"></script>
    <script src="Scripts/ProductionCapacityScript.js" > </script>
    <link href="Styles/bootstrap-multiselect.css" rel="stylesheet" />
    <link href="Styles/bootstrap.min.css" rel="stylesheet" /> 
    <link href="Styles/daterangepicker-2.1.25.css" rel="stylesheet" /> 
    <title>DloHaiti: Gallons</title>

</head>
<body>
    <div>
        <?php
        $myRoot = $_SERVER["DOCUMENT_ROOT"] . '/GallonReports';
        include $myRoot . '/Data/options.php';
        include $myRoot . '/Data/Database.php';
       // include $myRoot . '/Data/Data1.php';
        $url = $_SERVER['REQUEST_URI'];
        $parts = explode('/',$url);
        $dir =  'http://' . ($_SERVER['SERVER_NAME'] == 'localhost' ? 'localhost:81' : $_SERVER['SERVER_NAME']) ;
        for ($i = 0; $i < count($parts) - 1; $i++) {
            $dir .= $parts[$i] . "/";
        }
        ?>
        <div >
            <div class="row" style="margin:5px;">
                <div class='col-sm-3'>
                    <b>Kiosk :</b>&nbsp;&nbsp;
                    <?php echo generateSelect('kiosklist', true, getKioskOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <b>Year :</b>&nbsp;&nbsp;<?php echo generateSelect('Yearlist', true, getYearOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <b>Month :</b>&nbsp;&nbsp;<?php echo generateSelect('Monthlist', true,getMonthOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <input type='button' id='btnFilter' value='Show' class='btn btn-primary' />
                </div>
            </div>
            <div id="Gallonscontainer"></div>
            <br />
            <hr />
            <br />
            <div id="GallonsAveragecontainer"></div>
            <br />
            <hr />
            <div class="row" style="margin:5px;">
                <div class='col-sm-3'>
                    <b>SKU :</b>&nbsp;&nbsp;
                    <?php echo generateSelect('SKUlist', true, getSkuListOptionsGenerate()); ?>
                
                </div>
                <div class='col-sm-3'>
                    <b>Year :</b>&nbsp;&nbsp;<?php echo generateSelect('SKUYearlist', true, getYearOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <b>Month :</b>&nbsp;&nbsp;<?php echo generateSelect('SKUMonthlist', true,getMonthOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <input type='button' id='SKUbtnFilter' value='Show' class='btn btn-primary' />
                </div>
            </div>
            
            <div id="VolumeReportcontainer"></div>
            <br />
            <hr />
            <div class="row" style="margin:5px;">
                
                <div class='col-sm-3'>
                    <b>Year :</b>&nbsp;&nbsp;<?php echo generateSelect('Yrlist', true, getYearOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <b>Month :</b>&nbsp;&nbsp;<?php echo generateSelect('Molist', true,getMonthOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <input type='button' id='btnFilterWaterAndNonWaterProd' value='Show' class='btn btn-primary' />
                </div>
            </div>
           
            <div id="WaterAndNonWaterProductcontainer" ></div>
             <br />
            <hr />
            
          </div>

           <div>
            <div class="row" style="margin:5px;"  >
                
                <div class='col-sm-1' align="right" style = "margin-top: 7px;">
                    <b >Date :</b>
                    </div>
                     <div class='col-sm-4'>
                    <div id="datePeriod1" class="selectbox pull-left">
                        <i class="glyphicon glyphicon-calendar"></i>
                        <span></span>
                        <b class="caret"></b>
                    </div>
                </div>
                <div class='col-sm-3'>
                    <b>Kiosk :</b>&nbsp;&nbsp;
                <?php echo generateSelect('kiosklistProductionCapacity', false, getKioskOptions()); ?>
                </div>
                <div class='col-sm-3'>
                    <input type='button' id='btnFilterProductionCapacity' value='Show' class='btn btn-primary' />
                    <input id="myRoot" type="hidden" value="<?php echo $dir; ?>" />
                </div>

            </div>
            <div class="row" >
                <div class='col-sm-12'>
                    <div id="ProductionCapacityContainer"  ></div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>